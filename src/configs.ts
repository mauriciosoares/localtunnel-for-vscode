import { rejects } from 'assert';
import { window } from 'vscode';

export const DEFAULT_PORT = 8000;

export interface Config {
  subdomain: string;
  port: number;
}

export function getPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const input = window.createInputBox();
    input.title = 'Select Port';
    input.placeholder = `${DEFAULT_PORT}`;

    input.onDidAccept(() => {
      let port;
      if (input.value) {
        port = parseInt(input.value, 10);
      } else {
        port = DEFAULT_PORT;
      }

      if (isNaN(port)) {
        port = DEFAULT_PORT;
        window.showErrorMessage(`Port must be a number, ${DEFAULT_PORT} will be used instead`);
      }

      input.hide();
      resolve(port);
    });

    input.show();
  });
}

export function getSubdomain(): Promise<string | undefined> {
  return new Promise(resolve => {
    const input = window.createInputBox();
    input.title = 'Select Subdomain';
    input.placeholder = 'Random';

    input.onDidAccept(() => {
      let subdomain;
      if (input.value.length > 0 && input.value.length < 4) {
        subdomain = undefined;
        window.showErrorMessage('Subdomain must be at least 4 characters long, using random instead');
      } else {
        subdomain = input.value;
      }

      resolve(subdomain);
      input.hide();
    });

    input.show();
  });
}