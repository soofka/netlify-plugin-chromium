import {
  log,
  getChromiumPath,
  installChromium,
} from '../utils';
jest.mock('../utils');

import NetlifyChromiumPlugin from '../index';

describe('NetlifyChromiumPlugin', () => {
  const mockError = new Error('MOCK_ERROR');

  const initialChromiumPath = process.env.CHROME_PATH;
  const mockChromiumPath = 'MOCK_CHROMIUM_PATH';

  const mockInputs = {
    mockPackageManager: 'MOCK_PACKAGE_MANAGER',
  };

  const mockUtils = {
    run: {
      command: jest.fn(),
    },
    build: {
      failBuild: jest.fn(),
      failPlugin: jest.fn(),
    }
  }

  beforeEach(() => {
    log.mockClear();
    getChromiumPath.mockClear();
    installChromium.mockClear();

    mockUtils.run.command.mockClear();
    mockUtils.build.failBuild.mockClear();
    mockUtils.build.failPlugin.mockClear();

    process.env.CHROME_PATH = initialChromiumPath;
  });

  it('exists', () => {
    expect(NetlifyChromiumPlugin).toBeDefined();
  });

  it('hooks into installation stage of build process', () => {
    expect(NetlifyChromiumPlugin.onInstall).toBeDefined();
    expect(typeof NetlifyChromiumPlugin.onInstall).toEqual('function');
  });

  describe('if Chromium is initially installed', () => {

    beforeEach(() => {
      getChromiumPath.mockImplementation(() => mockChromiumPath);
    });

    it('does not attempt to install Chromium', async () => {
      await NetlifyChromiumPlugin.onInstall({ inputs: {} });
  
      expect(getChromiumPath).toBeCalledTimes(1);
      expect(installChromium).toBeCalledTimes(0);
    });

    describe('if setChromePathInEnv is true', () => {

      const mockLocalInputs = {
        setChromePathInEnv: true,
        ...mockInputs,
      };
      
      it('sets CHROME_PATH environmental variable to Chromium path', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockLocalInputs,
        });

        expect(process.env.CHROME_PATH).toEqual(mockChromiumPath);
      });

      it('logs all messages', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockLocalInputs,
        });

        expect(log.mock.calls).toEqual([
          [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
          [`Setting environmental variable CHROME_PATH to ${mockChromiumPath}`],
          [`Chromium installation finished with SUCCESS (path: ${mockChromiumPath})`],
        ]);
      });

    });

    describe('if setChromePathInEnv is false', () => {

      const mockLocalInputs = {
        setChromePathInEnv: false,
        ...mockInputs,
      };
      
      it('does not set CHROME_PATH environmental variable', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockLocalInputs,
        });

        expect(process.env.CHROME_PATH).toEqual(`${initialChromiumPath}`);
      });

      it('logs all messages', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockLocalInputs,
        });

        expect(log.mock.calls).toEqual([
          [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
          [`Chromium installation finished with SUCCESS (path: ${mockChromiumPath})`],
        ]);
      });

    });

  });

  describe('if Chromium is initially not installed', () => {

    describe('if Chromium is available for download', () => {

      beforeEach(() => {
        getChromiumPath
          .mockImplementationOnce(() => { throw mockError; })
          .mockImplementationOnce(() => mockChromiumPath);
      });
    
      it('attempts to install Chromium', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockInputs,
          utils: mockUtils,
        });
    
        expect(getChromiumPath).toBeCalledTimes(2);
        expect(installChromium).toBeCalledTimes(1);
        expect(installChromium).toBeCalledWith(mockUtils.run.command, mockInputs.packageManager);
      });

      describe('if setChromePathInEnv is true', () => {

        const mockLocalInputs = {
          setChromePathInEnv: true,
          ...mockInputs,
        };
      
        it('sets CHROME_PATH environmental variable to Chromium path', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(process.env.CHROME_PATH).toEqual(mockChromiumPath);
        });
  
        it('logs all messages', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(log.mock.calls).toEqual([
            [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
            ['Chromium is not available, attempting to download'],
            [`Setting environmental variable CHROME_PATH to ${mockChromiumPath}`],
            [`Chromium installation finished with SUCCESS (path: ${mockChromiumPath})`],
          ]);
        });

      });

      describe('if setChromePathInEnv is false', () => {

        const mockLocalInputs = {
          setChromePathInEnv: false,
          ...mockInputs,
        };
      
        it('does not set CHROME_PATH environmental variable', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(process.env.CHROME_PATH).toEqual(`${initialChromiumPath}`);
        });
  
        it('logs all messages', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(log.mock.calls).toEqual([
            [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
            ['Chromium is not available, attempting to download'],
            [`Chromium installation finished with SUCCESS (path: ${mockChromiumPath})`],
          ]);
        });

      });

    });

    describe('if Chromium is not available for download', () => {

      beforeEach(() => {
        getChromiumPath.mockImplementation(() => { throw mockError; });
      });
    
      it('attempts to install Chromium', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockInputs,
          utils: mockUtils,
        });
    
        expect(getChromiumPath).toBeCalledTimes(2);
        expect(installChromium).toBeCalledTimes(1);
        expect(installChromium).toBeCalledWith(mockUtils.run.command, mockInputs.packageManager);
      });

      it('does not set CHROME_PATH environmental variable', async () => {
        await NetlifyChromiumPlugin.onInstall({
          inputs: mockInputs,
          utils: mockUtils,
        });

        expect(process.env.CHROME_PATH).toEqual(`${initialChromiumPath}`);
      });

      describe('if failBuildOnError is true', () => {

        const mockLocalInputs = {
          failBuildOnError: true,
          ...mockInputs,
        };
      
        it('fails build', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(mockUtils.build.failPlugin).toBeCalledTimes(0);
          expect(mockUtils.build.failBuild).toBeCalledTimes(1);
          expect(mockUtils.build.failBuild).toBeCalledWith('Error during Chromium installation', { error: mockError });
        });
  
        it('logs all messages', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(log.mock.calls).toEqual([
            [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
            ['Chromium is not available, attempting to download'],
            ['Chromium installation finished with FAILURE', mockError],
          ]);
        });

      });

      describe('if failBuildOnError is false', () => {

        const mockLocalInputs = {
          failBuildOnError: false,
          ...mockInputs,
        };
      
        it('does not build', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });

          expect(mockUtils.build.failBuild).toBeCalledTimes(0);
          expect(mockUtils.build.failPlugin).toBeCalledTimes(1);
          expect(mockUtils.build.failPlugin).toBeCalledWith('Error during Chromium installation', { error: mockError });
        });
  
        it('logs all messages', async () => {
          await NetlifyChromiumPlugin.onInstall({
            inputs: mockLocalInputs,
            utils: mockUtils,
          });
          
          expect(log.mock.calls).toEqual([
            [`Installing Chromium with settings: ${JSON.stringify(mockLocalInputs)}`],
            ['Chromium is not available, attempting to download'],
            ['Chromium installation finished with FAILURE', mockError],
          ]);
        });

      });

    });

  });

});
