import "babel-polyfill";
import { start, stop, ITunnel} from './localtunnel';
import {window, env, Uri} from 'vscode';
import * as localtunnel from 'localtunnel';
import {getPort, getSubdomain} from './configs';

jest.mock('localtunnel', () => jest.fn());

jest.mock('./configs', () => ({
  getPort: jest.fn(() => 8000),
  getSubdomain: jest.fn(),
}));

jest.mock('vscode', () => ({
  window: {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
  },
  env: {
    clipboard: {
      writeText: jest.fn(),
    },
    openExternal: jest.fn()
  },
  Uri: {
    parse: jest.fn((url: any) => url)
  }
}));

const mockTunnel = localtunnel as any;
const mockWindow = window as any;


describe('LocalTunnel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTunnelResponse: ITunnel = {
    url: 'url',
    close: jest.fn(),
  };

  const workspaceGetWithTunnel = jest.fn(():ITunnel => mockTunnelResponse);
  const workspaceGetEmpty = jest.fn(() => null);

  describe('start', () => {
    it('should return an error if a tunnel is already running', async () => {
      const mockContext = {
        workspaceState: {
          get: workspaceGetWithTunnel,
        }
      };

      await start(mockContext as any);

      expect(window.showErrorMessage).toHaveBeenCalledWith('Current Tunnel is already running, please stop it before starting another tunnel');
    });

    it('should show an error if the tunnel method fails', async () => {
      mockTunnel.mockImplementationOnce(() => {
        throw 'error';
      });

      const mockContext = {
        workspaceState: {
          get: workspaceGetEmpty,
        }
      };

      await start(mockContext as any);

      expect(window.showErrorMessage).toHaveBeenCalledWith('Something happened when trying to start LocalTunnel, please check the logs');
    });

    it('should save the tunnel in the workspaceState', async () => {
      mockTunnel.mockImplementationOnce(() => mockTunnelResponse);
      const update = jest.fn();

      const mockContext = {
        workspaceState: {
          get: workspaceGetEmpty,
          update,
        }
      };

      await start(mockContext as any);

      expect(localtunnel).toHaveBeenCalledWith({
        port: 8000,
      });

      expect(update).toHaveBeenCalledWith('currentTunnel', mockTunnelResponse);
    });

    it('should prompt the user an action after the tunnel was created and handle copying to clipboard', async () => {
      mockTunnel.mockImplementationOnce(() => mockTunnelResponse);
      mockWindow.showInformationMessage.mockImplementationOnce(() => 'Copy to clipboard');
      const update = jest.fn();

      const mockContext = {
        workspaceState: {
          get: workspaceGetEmpty,
          update,
        }
      };


      await start(mockContext as any);
      
      expect(localtunnel).toHaveBeenCalledWith({
        port: 8000,
      });
      
      expect(window.showInformationMessage).toHaveBeenCalled();
      expect(env.clipboard.writeText).toHaveBeenCalledWith(mockTunnelResponse.url);
    });

    it('should prompt the user an action after the tunnel was created and handle opening the browser', async () => {
      mockTunnel.mockImplementationOnce(() => mockTunnelResponse);
      mockWindow.showInformationMessage.mockImplementationOnce(() => 'Open in browser');
      const update = jest.fn();

      const mockContext = {
        workspaceState: {
          get: workspaceGetEmpty,
          update,
        }
      };


      await start(mockContext as any);
      
      expect(localtunnel).toHaveBeenCalledWith({
        port: 8000,
      });
      
      expect(window.showInformationMessage).toHaveBeenCalled();
      expect(Uri.parse).toHaveBeenCalledWith(mockTunnelResponse.url);
      expect(env.openExternal).toHaveBeenCalledWith(mockTunnelResponse.url);
    });
  });

  describe('stop', () => {
    it('should throw an error if there are not tunnels running currently', async () => {
      const mockContext = {
        workspaceState: {
          get: workspaceGetEmpty,
        }
      };

      await stop(mockContext as any);

      expect(window.showErrorMessage).toHaveBeenCalledWith('LocalTunnel is not currently running');
    });

    it('should a message in case the saved tunnel doesnt have a close property set and clean all cached tunnels', async () => {
      const update = jest.fn();
      const mockContext = {
        workspaceState: {
          get: (): ITunnel => ({
            ...mockTunnelResponse,
            close: undefined,
          }),
          update,
        }
      };

      await stop(mockContext as any);

      expect(window.showErrorMessage).toHaveBeenCalledWith(`Could not stop tunnel ${mockTunnelResponse.url}. It seems to be already closed`);
      expect(update).toHaveBeenCalledWith('currentTunnel', null);
    });

    it('should a message in case the saved tunnel doesnt have a close property set and clean all cached tunnels', async () => {
      const update = jest.fn();
      const mockContext = {
        workspaceState: {
          get: workspaceGetWithTunnel,
          update,
        }
      };

      await stop(mockContext as any);

      expect(window.showInformationMessage).toHaveBeenCalledWith(`Tunnel ${mockTunnelResponse.url} Closed`);
      expect(mockTunnelResponse.close).toHaveBeenCalled();
      expect(update).toHaveBeenCalledWith('currentTunnel', null);
    });
  });
});