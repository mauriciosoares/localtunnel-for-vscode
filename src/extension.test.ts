import {activate, NAMESPACE} from './extension';
import {commands} from 'vscode';

jest.mock('vscode', () => ({
  commands: {
    registerCommand: jest.fn(namespace => namespace),
  }
}));

describe('Extension', () => {
	it('should bind the correct commands when activating the extension', () => {
    const push = jest.fn();
    const mockContext = {
      subscriptions: {
        push
      }
    };

    activate(mockContext as any);
    expect(commands.registerCommand).toHaveBeenCalledWith(`${NAMESPACE}.start`, expect.any(Function));
    expect(commands.registerCommand).toHaveBeenCalledWith(`${NAMESPACE}.stop`, expect.any(Function));
    expect(push).toHaveBeenCalledWith(`${NAMESPACE}.start`);
    expect(push).toHaveBeenCalledWith(`${NAMESPACE}.stop`);
	});
});