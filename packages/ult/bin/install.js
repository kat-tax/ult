const path = require('path');
const spawn = require('child_process').spawn;

module.exports = name => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const cwd = path.resolve(process.cwd(), name.toLowerCase());
    const npm = spawn(cmd, ['install'], {cwd});
    npm.once('exit', code => (code === 0 ? resolve() : reject(code)));
  });
}
