const path = require('path');
const spawn = require('child_process').spawn;

module.exports = name => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const cwd = path.resolve(process.cwd(), name.toLowerCase());
    const npm = spawn(cmd, [
      'npx',
      'react-native',
      'init',
      // '--version',
      // config.deps['react-native'].replace(/\^/, ''),
    ], {cwd});
    npm.once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
}
