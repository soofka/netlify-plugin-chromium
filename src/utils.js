const installChromiumIfNeeded = () => {
  require('child_process').execSync(
    'npm list chromium || npm install chromium',
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );
};

const getChromiumPath = () => {
  const { path } = require('chromium');
  return path;
};

module.exports = {
  installChromiumIfNeeded,
  getChromiumPath,
};
