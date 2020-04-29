# Netlify Plugin Chromium
[![Build Status](https://travis-ci.org/soofka/netlify-plugin-chromium.svg?branch=master)](https://travis-ci.org/soofka/netlify-plugin-chromium)
[![Coverage Status](https://coveralls.io/repos/soofka/netlify-plugin-chromium/badge.svg?branch=master)](https://coveralls.io/r/soofka/netlify-plugin-chromium?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/soofka/netlify-plugin-chromium/badge.svg?branch=master)](https://snyk.io/test/github/soofka/netlify-plugin-chromium?branch=master)
[![NPM version](https://img.shields.io/npm/v/netlify-plugin-chromium.svg)](https://www.npmjs.com/package/netlify-plugin-chromium)

🤖 [Netlify Build Plugin](https://docs.netlify.com/configure-builds/build-plugins/) for adding [Chromium](https://github.com/dtolstyi/node-chromium) to [Netlify](https://www.netlify.com) CI/CD pipeline.

## About
This is [Netlify Build Plugin](https://docs.netlify.com/configure-builds/build-plugins/). It is meant to be used in projects connected to [Netlify](https://www.netlify.com) CI/CD pipeline. Netlify Build Plugins are currently opt-in BETA feature. Learn how to enable them for your project [here](https://docs.netlify.com/configure-builds/build-plugins/#enable-build-plugins-beta).

This plugin hooks into installation stage of the build process and extends it with additional step which checks if Chromium is installed and installs Chromium binaries if needed. The latest suitable build of Chromium for your platform will be installed with the help of [chromium npm package](https://www.npmjs.com/package/chromium).

⚠️ **Important**: By default, this plugin will set value of environmental variable `CHROME_PATH` to location of local copy of Chromium binaries. This change is required by many tools relying on Chromium to be able to find it and launch it successfully (such as Lighthouse). However, you can opt out of this change by setting `setChromePathInEnv` parameter to `false`.

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
| Name | Description | Default value |
|-|-|-|
| `setChromePathInEnv` | If true, sets value of environmental variable `CHROME_PATH` to location of local copy of Chromium binaries. This change is required by many tools relying on Chromium to be able to find it and launch it successfully (such as Lighthouse). | `true` |
| `failBuildOnError` | If true and Chromium installation finished with failure, whole build will fail. Otherwise, only this plugin fails and the rest of the build proceeds as usual. | `false` |

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
12:37:27 AM: ┌────────────────────────────────────────────────────┐
12:37:27 AM: │ 1. onPreBuild command from netlify-plugin-chromium │
12:37:27 AM: └────────────────────────────────────────────────────┘
12:37:27 AM: ​
12:37:58 AM: [NetlifyChromiumPlugin]: Installing Chromium with settings { setChromiumPathInEnv: true, failBuildOnError: false }
12:37:58 AM: coronavirus-tracker@1.6.0 /opt/build/repo
12:37:58 AM: └── (empty)
12:37:58 AM: > chromium@2.1.2 postinstall /opt/build/repo/node_modules/chromium
12:37:58 AM: > node install.js
12:37:58 AM: Step 1. Retrieving Chromium latest revision number
12:37:58 AM: Step 2. Downloading Chromium (this might take a while). Revision number: 763582
12:37:58 AM: Step 3. Setting up Chromium binaries
12:37:58 AM: Process is successfully finished
12:37:58 AM: + chromium@2.1.2
12:37:58 AM: added 10 packages from 9 contributors and audited 255723 packages in 24.645s
12:37:58 AM:
12:37:58 AM: 53 packages are looking for funding
12:37:58 AM:   run `npm fund` for details
12:37:58 AM:
12:37:58 AM: found 0 vulnerabilities
12:37:58 AM:
12:37:58 AM: [NetlifyChromiumPlugin]: Chromium installation finished with SUCCESS (path: /opt/build/repo/node_modules/chromium/lib/chromium/chrome-linux/chrome)
12:37:58 AM: ​
12:37:58 AM: (./src/netlify-plugin-chromium onPreBuild completed in 31.8s)
```

### Usage examples
- [coronavirus-tracker](https://github.com/soofka/coronavirus-tracker) uses this plugin to automatically run [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) tests for each build.
