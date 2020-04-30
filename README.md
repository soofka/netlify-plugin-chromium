# Netlify Plugin Chromium
[![Build Status](https://travis-ci.org/soofka/netlify-plugin-chromium.svg?branch=master)](https://travis-ci.org/soofka/netlify-plugin-chromium)
[![Coverage Status](https://coveralls.io/repos/soofka/netlify-plugin-chromium/badge.svg?branch=master)](https://coveralls.io/r/soofka/netlify-plugin-chromium?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/soofka/netlify-plugin-chromium/badge.svg?branch=master)](https://snyk.io/test/github/soofka/netlify-plugin-chromium?branch=master)
[![NPM version](https://img.shields.io/npm/v/netlify-plugin-chromium.svg)](https://www.npmjs.com/package/netlify-plugin-chromium)

🤖 [Netlify Build Plugin](https://docs.netlify.com/configure-builds/build-plugins/) for adding [Chromium](https://github.com/dtolstyi/node-chromium) to [Netlify](https://www.netlify.com) CI/CD pipeline.

## About
This is [Netlify Build Plugin](https://docs.netlify.com/configure-builds/build-plugins/). It is meant to be used in projects connected to [Netlify](https://www.netlify.com) CI/CD pipeline. Netlify Build Plugins are currently opt-in BETA feature. Learn how to enable them for your project [here](https://docs.netlify.com/configure-builds/build-plugins/#enable-build-plugins-beta).

This plugin hooks into installation stage of the build process and extends it with additional step which checks if Chromium is installed and installs Chromium binaries if needed. The latest suitable build of Chromium for your platform will be installed with the help of [chromium npm package](https://www.npmjs.com/package/chromium). Installation typically takes around 20-30 seconds.

⚠️ **Important**: By default, this plugin modifies value of environmental variable `CHROME_PATH`. [Read more &raquo;](#modification-of-environmental-variables)

## Usage
### Installation
First, install this [package from NPM](https://www.npmjs.com/package/chromium) as a dependency in your project:

```shell
npm install --save-dev netlify-plugin-chromium
```

*(Alternatively, download its [source code from GitHub](https://github.com/soofka/netlify-plugin-chromium).)*

Then, add it to your [Netlify configuration file](https://docs.netlify.com/configure-builds/file-based-configuration):

```yaml
plugins:
  - package: netlify-plugin-chromium
```

### Configuration
#### Options
| Name | Type | Description | Default value |
|-|-|-|-|
| `packageManager` | `npm` \| `yarn` | Package manager to install Chromium with; `npm` or `yarn`. | `npm` |
| `setChromePathInEnv` | boolean | If true, sets value of environmental variable `CHROME_PATH` to location of local copy of Chromium binaries. This change is required by many tools relying on Chromium to be able to find it and launch it successfully (such as Lighthouse). | `true` |
| `failBuildOnError` | boolean | If true and Chromium installation finished with failure, whole build will fail. Otherwise, only this plugin fails and the rest of the build proceeds as usual. | `false` |

#### Example
```yaml
plugins:
  - package: netlify-plugin-chromium
    inputs:
      setChromePathInEnv: false
      failBuildOnError: true
```

### Output
This plugin will generate output in your build logs similar to this:
```shell
8:47:31 PM: ┌──────────────────────────────────────┐
8:47:31 PM: │ 1. onPreBuild command from ./src/lib │
8:47:31 PM: └──────────────────────────────────────┘
8:47:31 PM: ​
8:47:31 PM: [NetlifyChromiumPlugin]: Installing Chromium with settings: {"packageManager":"npm","setChromePathInEnv":true,"failBuildOnError":false}
8:47:31 PM: [NetlifyChromiumPlugin]: Setting environmental variable CHROME_PATH to /opt/build/repo/node_modules/chromium/lib/chromium/chrome-linux/chrome
8:47:31 PM: [NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS (path: /opt/build/repo/node_modules/chromium/lib/chromium/chrome-linux/chrome)
8:47:31 PM: ​
8:47:31 PM: (./src/lib onPreBuild completed in 23ms)
```

### Modification of environmental variables
By default, this plugin sets value of environmental variable `CHROME_PATH` to location of local copy of Chromium binaries. This change is required by many tools relying on Chromium to be able to find it and launch it successfully (such as Lighthouse). However, you can opt out of this change by setting `setChromePathInEnv` parameter to `false`.

*(In that case it is likely that you'd like to set this variable by yourself. Path to Chromium is exposed in build logs. Chromium is installed separately with each build, but typically it should be at the same location. You can take it from build logs, set it manually, disable `setChromePathInEnv` parameter, re-run the build, and expect it to work properly.)*

### Usage examples
- [coronavirus-tracker](https://github.com/soofka/coronavirus-tracker) uses this plugin to automatically run [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) tests for each build.
