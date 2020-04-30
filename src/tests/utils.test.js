import {
  log,
  getChromiumPath,
  installChromium,
} from '../utils';

describe('NetlifyChromiumPlugin utils', () => {

  describe('log', () => {

    it('exists and is exported', () => {
      expect(log).toBeDefined();
      expect(typeof log).toEqual('function');
    });

    it('logs message to console', () => {
      const mockMessage = 'MOCK_MESSAGE';
      global.console.log = jest.fn();

      log(mockMessage);

      expect(global.console.log).toBeCalledTimes(1);
      expect(global.console.log).toBeCalledWith(`[NetlifyChromiumPlugin]: ${mockMessage}`);
    })

  });

  describe('getChromiumPath', () => {

    it('exists and is exported', () => {
      expect(getChromiumPath).toBeDefined();
      expect(typeof getChromiumPath).toEqual('function');
    });

  });

  describe('installChromium', () => {

    it('exists and is exported', () => {
      expect(installChromium).toBeDefined();
      expect(typeof installChromium).toEqual('function');
    });

    describe('in case of unsupported package manager', () => {
      const mockPackageManager = 'MOCK_PACKAGE_MANAGER';

      it('throws error', async () => {
        await expect(installChromium(null, mockPackageManager)).rejects.toThrow(
          new Error(`Invalid package manager: ${mockPackageManager} (available package managers: npm, yarn)`),
        );
      });

    });

    describe('in case of supported package manager', () => {
      const mockRunTask = jest.fn();
  
      beforeEach(() => {
        mockRunTask.mockClear();
      });
      
      it('if npm, installs Chromium with npm install', () => {
        expect(async () => await installChromium(mockRunTask, 'npm')).not.toThrow();
        expect(mockRunTask).toBeCalledTimes(1);
        expect(mockRunTask).toBeCalledWith('npm install chromium');
      });
      
      
      it('if yarn, installs Chromium with yarn add', () => {
        expect(async () => await installChromium(mockRunTask, 'yarn')).not.toThrow();
        expect(mockRunTask).toBeCalledTimes(1);
        expect(mockRunTask).toBeCalledWith('yarn add chromium');
      });

    });

  });

});