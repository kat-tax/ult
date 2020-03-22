const spawn = require('child_process').spawn;
module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    spawn(cmd, ['react-native', 'init', name, '--template', `ult-template-${template}`])
      .once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
