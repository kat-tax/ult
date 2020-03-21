const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(process.cwd(), name.toLowerCase());
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    spawn(cmd, ['install', '--save', 'rnpm-plugin-windows'], {cwd})
      .once('exit', code => (code === 0 ? resolve() : reject(code)));
  });
};
