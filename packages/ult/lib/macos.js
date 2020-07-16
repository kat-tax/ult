const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (name, _template) => {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(process.cwd(), name.toLowerCase());
    spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
      '--overwrite',
      'react-native-macos-init',
    ], {cwd}).once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
