const spawn = require('child_process').spawn;

module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    const tpl = `ult-template-${template}`;
    spawn(cmd, ['react-native@0.61.5', 'init', name, '--template', tpl])
      .once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
