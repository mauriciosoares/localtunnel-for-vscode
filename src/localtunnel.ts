import {ExtensionContext, window, env, Uri} from 'vscode';
import * as localtunnel from 'localtunnel';
import {getPort, getSubdomain} from './configs';

export interface ITunnel {
  close?: () => {},
  url: string
}

export interface ITunnelConfigs {
  port?: number,
  subdomain?: string,
}

export async function start(context: ExtensionContext) {
  const currentTunnel = context.workspaceState.get('currentTunnel') as ITunnel;
  if (currentTunnel) {
    return window.showErrorMessage('Current Tunnel is already running, please stop it before starting another tunnel');
  }

  const port = await getPort();
  const subdomain = await getSubdomain();
  let tunnel;

  try {
    tunnel = await localtunnel({
      port,
      subdomain,
    });
  } catch (e) {
    console.log(e);
    return window.showErrorMessage(
      'Something happened when trying to start LocalTunnel, please check the logs'
    );
  }

  tunnel.close = tunnel.close;

  context.workspaceState.update('currentTunnel', tunnel);

  const action = await window.showInformationMessage(
    `LocalTunnel is exposing port ${port} on ${tunnel.url}.`,
    'Copy to clipboard',
    'Open in browser'
  );

  switch (action) {
    case 'Copy to clipboard':
      await env.clipboard.writeText(tunnel.url);
      window.showInformationMessage(`Copied "${tunnel.url}" to your clipboard.`);
      break;
    case 'Open in browser':
      env.openExternal(Uri.parse(tunnel.url));
      break;
  }
}

export async function stop(context: ExtensionContext) {
  const currentTunnel = context.workspaceState.get('currentTunnel') as ITunnel;

  if (!currentTunnel) {
    return window.showErrorMessage(
      'LocalTunnel is not currently running'
    );
  }

  if (currentTunnel.close) {
    currentTunnel.close();
    window.showInformationMessage(`Tunnel ${currentTunnel.url} Closed`); 
  } else {
    window.showErrorMessage(
      `Could not stop tunnel ${currentTunnel.url}. It seems to be already closed`
    );
  }

  context.workspaceState.update('currentTunnel', null);
}