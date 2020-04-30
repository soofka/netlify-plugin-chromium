const PACKAGE_NAME = 'chromium';
const PACKAGE_MANAGERS = [
  {
    name: 'npm',
    installCommand: 'install',
  },
  {
    name: 'yarn',
    installCommand: 'add',
  },
];

export const log = (message) => console.log(`[NetlifyChromiumPlugin]: ${message}`);

export const getChromiumPath = () => {
  try {
    delete require.cache[require.resolve(PACKAGE_NAME)];
  } catch(error) {}
  
  const { path } = require(PACKAGE_NAME);
  return path;
};

export const installChromium = async (runTask, packageManagerName) => {
  const packageManager = PACKAGE_MANAGERS.find((packageManager) => packageManager.name === packageManagerName);

  if (!packageManager) {
    throw new Error(`Invalid package manager: ${packageManagerName} (available package managers: ${PACKAGE_MANAGERS.map((packageManager) => packageManager.name).join(', ')})`);
  }

  const installCommand = `${packageManager.name} ${packageManager.installCommand} ${PACKAGE_NAME}`;
  await runTask(installCommand);
};
