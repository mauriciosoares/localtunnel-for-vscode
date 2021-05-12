import { createConfig, start, stop } from './localtunnel';
import { commands, ExtensionContext } from 'vscode';

export const NAMESPACE = 'localtunnel-for-vscode'

export function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand(`${NAMESPACE}.create-config`, () => createConfig(context)))
	context.subscriptions.push(commands.registerCommand(`${NAMESPACE}.start`, () => start(context)));
	context.subscriptions.push(commands.registerCommand(`${NAMESPACE}.stop`, () => stop(context)));
}

// this method is called when your extension is deactivated
export function deactivate() { }
