const path = require('path');
const spawn = require('child_process').spawn;

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

module.exports = {npx, pod, run};
