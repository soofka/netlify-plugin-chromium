import {
  installChromiumIfNeeded,
  getChromiumPath,
} from './utils'

const NetlifyChromiumPlugin = {
  onInstall: ({ inputs, utils }) => {
    console.log(`[NetlifyChromiumPlugin]: Installing Chromium with settings: ${JSON.stringify(inputs)}`);

    try {
      installChromiumIfNeeded();
      const path = getChromiumPath();

      if (inputs.setChromePathInEnv) {
        process.env.CHROME_PATH = path;
      }

      console.log(`[NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS (path: ${path})`);
    } catch(error) {
      console.log('[NetlifyChromiumPlugin]: Chromium installation finished with FAILURE');

      const failFunc = inputs.failBuildOnError ? utils.build.failBuild : utils.build.failPlugin;
      failFunc('Error during Chromium installation', { error });
    }
  },
};

export default NetlifyChromiumPlugin;
