const path = require('path');
const spawn = require('child_process').spawn;
const exit = (cmd, res, rej) => e => e === 0 ? res() : rej(`${cmd}: code ${e}`);

// Helper to run the "npx" cli tool
function npx(args, cwd, inherit) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return new Promise((res, rej) => {
    spawn(cmd, args, {cwd, stdio: inherit ? 'inherit' : undefined})
      .once('exit', exit(`npx ${args[0]}`, res, rej));
  });
};

// Helper to run the "pod" cli tool
function pod(name) {
  const cwd = path.resolve(process.cwd(), name.toLowerCase(), 'ios');
  return new Promise((res, rej) => {
    spawn('pod', ['install'], {cwd, stdio: 'inherit'})
      .once('exit', exit('pod install', res, rej));
  });
};

module.exports = {npx, pod};
