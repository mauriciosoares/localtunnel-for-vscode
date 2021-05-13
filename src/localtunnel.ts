import { ExtensionContext, window, env, Uri } from 'vscode';
import * as localtunnel from 'localtunnel';
import { Config, getPort, getSubdomain } from './configs';
import * as fs from 'fs';
import * as vscode from 'vscode';

export interface ITunnel {
  close?: () => {},
  url: string
}

export interface ITunnelConfigs {
  port?: number,
  subdomain?: string,
}

export async function getJsonPath(context: ExtensionContext) {
  const workspaces = vscode.workspace.workspaceFolders;
  console.info('workspaces', workspaces);

  if (workspaces == null) return '';

  const workspacePath = workspaces[0].uri.fsPath;
  const jsonPath = workspacePath + '/.vscode/localtunnel.json';
  return jsonPath;
}

export async function start(context: ExtensionContext) {
  const currentTunnel = context.workspaceState.get('currentTunnel') as ITunnel;
  if (currentTunnel) {
    return window.showErrorMessage('Current Tunnel is already running, please stop it before starting another tunnel');
  }

  let subdomain;
  let port;
  const jsonPath = await getJsonPath(context);

  try {
    const json: Config = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    subdomain = json.subdomain;
    port = json.port;
    const a = 'b';
  } catch (ex) {
    console.log(ex);
    port = await getPort();
    subdomain = await getSubdomain();
  }

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

export async function createConfig(context: ExtensionContext) {

  console.log('starting create config file..');
  const workspaces = vscode.workspace.workspaceFolders;
  console.info('workspaces', workspaces);

  if (workspaces == null) {
    window.showInformationMessage('Please open a workspace before trying to create a configuration for LocalTunnel.');
    return;
  }

  const jsonPath = await getJsonPath(context);

  const defaultConfig = {
    subdomain: 'my-cool-app',
    port: 5000
  };

  const jsonConfig = JSON.stringify(defaultConfig, null, 4);
  fs.writeFileSync(jsonPath, jsonConfig);

  window.showInformationMessage('Default LocalTunnel configuration successfully created. You can find and update it on ./vscode/localtunnel.json');
}
