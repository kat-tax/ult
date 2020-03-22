const spawn = require('child_process').spawn;
module.exports = () => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    spawn(cmd, ['react-native', 'windows'])
      .once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
