const chromium = require("chromium");

export default {
  async onPreBuild({ inputs }) {
    if (inputs.setChromePathInEnv) {
      const chromiumPath = chromium.path;
      console.log(
        `[NetlifyChromiumPlugin]: Setting environmental variable CHROME_PATH to ${chromiumPath}`
      );
      process.env.CHROME_PATH = chromiumPath;
    }
  },
};
