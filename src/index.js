import {
  log,
  getChromiumPath,
  installChromium,
} from './utils'

const NetlifyChromiumPlugin = {
  onPreBuild: async ({ inputs, utils }) => {
    log(`Installing Chromium with settings: ${JSON.stringify(inputs)}`);

    try {
      let chromiumPath;

      try {
        chromiumPath = getChromiumPath();
      } catch(requireError) {
        log('Chromium is not available, attempting to download');

        await installChromium(utils.run.command, inputs.packageManager);
        chromiumPath = getChromiumPath();
      }

      if (inputs.setChromePathInEnv) {
        log(`Setting environmental variable CHROME_PATH to ${chromiumPath}`);
        process.env.CHROME_PATH = chromiumPath;
      }

      log(`Chromium installation finished with SUCCESS (path: ${chromiumPath})`);
    } catch(error) {
      log('Chromium installation finished with FAILURE', error);

      const failFunc = inputs.failBuildOnError ? utils.build.failBuild : utils.build.failPlugin;
      failFunc('Error during Chromium installation', { error });
    }
  },
};

export default NetlifyChromiumPlugin;
