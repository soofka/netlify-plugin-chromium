const {
  installChromiumIfNeeded,
  getChromiumPath,
} = require('../utils');
jest.mock('../utils');

const NetlifyChromiumPlugin = require('../index');
const initialChromePath = process.env.CHROME_PATH;

describe('NetlifyChromiumPlugin', () => {

  beforeAll(() => {
    global.console.log = jest.fn();
  });

  beforeEach(() => {
    global.console.log.mockClear();
  });

  it('exists', () => {
    expect(NetlifyChromiumPlugin).toBeDefined();
  });

  it('hooks into installation stage of build process', () => {
    expect(NetlifyChromiumPlugin.onInstall).toBeDefined();
    expect(typeof NetlifyChromiumPlugin.onInstall).toEqual('function');
  });

  describe('in case of installation success', () => {

    const MOCK_PATH = 'MOCK_PATH';

    beforeAll(() => {
      installChromiumIfNeeded.mockImplementation(() => {});
      getChromiumPath.mockImplementation(() => MOCK_PATH);
    });

    beforeEach(() => {
      process.env.CHROME_PATH = initialChromePath;
      installChromiumIfNeeded.mockClear();
      getChromiumPath.mockClear();
    });

    it('properly logs all messages', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {},
      });

      expect(global.console.log.mock.calls).toEqual([
        [`[NetlifyChromiumPlugin]: Installing Chromium with settings: ${JSON.stringify({})}`],
        [`[NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS (path: ${MOCK_PATH})`],
      ]);
    });

    it('installs Chromium if needed', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {},
      });
      expect(installChromiumIfNeeded).toBeCalledTimes(1);
    });

    it('sets CHROME_PATH in environmental variables if setChromePathInEnv is set to true', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {
          setChromePathInEnv: true,
        },
      });
      expect(process.env.CHROME_PATH).toEqual(MOCK_PATH);
    });

    it('does not set CHROME_PATH in environmental variables if setChromePathInEnv is set to false', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {
          setChromePathInEnv: false,
        },
      });
      expect(process.env.CHROME_PATH).toEqual(`${initialChromePath}`);
    });

  });

  describe('in case of installation failure', () => {

    const MOCK_ERROR = new Error('MOCK_ERROR');
    const MOCK_UTILS = {
      build: {
        failBuild: jest.fn(),
        failPlugin: jest.fn(),
      },
    };

    beforeAll(() => {
      installChromiumIfNeeded.mockImplementation(() => { throw MOCK_ERROR; });
    });

    beforeEach(() => {
      installChromiumIfNeeded.mockClear();
      MOCK_UTILS.build.failBuild.mockClear();
      MOCK_UTILS.build.failPlugin.mockClear();
    });

    it('properly logs all messages', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {},
        utils: MOCK_UTILS,
      });

      expect(global.console.log.mock.calls).toEqual([
        [`[NetlifyChromiumPlugin]: Installing Chromium with settings: ${JSON.stringify({})}`],
        ['[NetlifyChromiumPlugin]: Chromium installation finished with FAILURE'],
      ]);
    });

    it('fails build if failBuildOnError is set to true', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {
          failBuildOnError: true,
        },
        utils: MOCK_UTILS,
      });

      expect(MOCK_UTILS.build.failPlugin).toBeCalledTimes(0);
      expect(MOCK_UTILS.build.failBuild).toBeCalledTimes(1);
      expect(MOCK_UTILS.build.failBuild).toBeCalledWith('Error during Chromium installation', { error: MOCK_ERROR });
    });

    it('fails plugin if failBuildOnError is set to false', () => {
      NetlifyChromiumPlugin.onInstall({
        inputs: {
          failBuildOnError: false,
        },
        utils: MOCK_UTILS,
      });

      expect(MOCK_UTILS.build.failBuild).toBeCalledTimes(0);
      expect(MOCK_UTILS.build.failPlugin).toBeCalledTimes(1);
      expect(MOCK_UTILS.build.failPlugin).toBeCalledWith('Error during Chromium installation', { error: MOCK_ERROR });
    });

  });

});
