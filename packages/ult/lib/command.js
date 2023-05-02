const path = require('path');
const {spawn, execSync} = require('child_process');

// Run the "npx" cli tool
function npx(args, cwd, inherit) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return run(cmd, args, cwd, inherit);
};

// Run any command
function run(cmd, args, cwd, inherit) {
  return new Promise((resolve, reject) => {
    const options = {cwd, stdio: inherit ? 'inherit' : undefined};
    spawn(cmd, args, options).once('exit', code =>
      code === 0 ? resolve() : reject(`${cmd} exited with: ${code}`));
  });
}

// Get the preferred packaged manager
function getPackageManager() {
  if (isInstalled('pnpm'))
    return 'pnpm';
  if (isInstalled('yarn'))
    return 'yarn';
  return 'npm';
}

// Check if a program is installed
function isInstalled(program) {
  try {
    execSync(`which ${program}`, {stdio: 'ignore'});
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {npx, run, getPackageManager};
