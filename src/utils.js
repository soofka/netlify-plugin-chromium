export const installChromiumIfNeeded = () => {
  require('child_process').execSync(
    'npm list chromium || npm install chromium',
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );
};

export const getChromiumPath = () => {
  const { path } = require('chromium');
  return path;
};
