const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (name, _template) => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const cwd = path.resolve(process.cwd(), name.toLowerCase());
    spawn(cmd, ['react-native', 'windows', '--template', 'beta'], {cwd})
      .once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
