import {DEFAULT_PORT, getPort, getSubdomain} from './configs';
import {window} from 'vscode';

jest.mock('vscode', () => ({
  window: {
    createInputBox: jest.fn(),
    showErrorMessage: jest.fn()
  },
}));

const createInputBoxMock = window.createInputBox as any;

describe('Configs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const INPUT_BASE = {
    title: null,
    placeholder: null,
    value: undefined,
    onDidAccept: jest.fn((callback: any) => callback()),
    hide: jest.fn(),
    show: jest.fn(),
  };

  describe('getPort', () => {
    it('should show the user an error if the input is not a number', async () => {
      const testInput = {
        ...INPUT_BASE,
        value: 'not a number',
      };
      createInputBoxMock.mockImplementationOnce(() => testInput);

      const port = await getPort();

      expect(port).toEqual(DEFAULT_PORT);
      expect(testInput.show).toHaveBeenCalled();
      expect(testInput.onDidAccept).toHaveBeenCalled();
      expect(window.showErrorMessage).toHaveBeenCalledWith(`Port must be a number, ${DEFAULT_PORT} will be used instead`);
      expect(testInput.hide).toHaveBeenCalled();
    });

    it('should return 8000 if no value was passed', async () => {
      const testInput = {
        ...INPUT_BASE,
      };
      createInputBoxMock.mockImplementationOnce(() => testInput);

      const port = await getPort();

      expect(port).toEqual(DEFAULT_PORT);
      expect(testInput.show).toHaveBeenCalled();
      expect(testInput.onDidAccept).toHaveBeenCalled();
      expect(testInput.hide).toHaveBeenCalled();
    });

    it('should return the user port', async () => {
      const testInput = {
        ...INPUT_BASE,
        value: '1234'
      };
      createInputBoxMock.mockImplementationOnce(() => testInput);

      const port = await getPort();

      expect(port).toEqual(1234);
      expect(testInput.show).toHaveBeenCalled();
      expect(testInput.onDidAccept).toHaveBeenCalled();
      expect(testInput.hide).toHaveBeenCalled();
    });
  });

  describe('getSubdomain', () => {
    it('should show the user an error if the input smaller than 4 characters long', async () => {
      const testInput = {
        ...INPUT_BASE,
        value: '123',
      };
      createInputBoxMock.mockImplementationOnce(() => testInput);

      const subdomain = await getSubdomain();

      expect(subdomain).toEqual(undefined);
      expect(testInput.show).toHaveBeenCalled();
      expect(testInput.onDidAccept).toHaveBeenCalled();
      expect(window.showErrorMessage).toHaveBeenCalledWith('Subdomain must be at least 4 characters long, using random instead');
      expect(testInput.hide).toHaveBeenCalled();
    });

    it('should return the users input', async () => {
      const testInput = {
        ...INPUT_BASE,
        value: 'subdomain',
      };
      createInputBoxMock.mockImplementationOnce(() => testInput);

      const subdomain = await getSubdomain();

      expect(subdomain).toEqual('subdomain');
      expect(testInput.show).toHaveBeenCalled();
      expect(testInput.onDidAccept).toHaveBeenCalled();
      expect(window.showErrorMessage).not.toHaveBeenCalled();
      expect(testInput.hide).toHaveBeenCalled();
    });
  })
});