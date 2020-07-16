const spawn = require('child_process').spawn;

module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', [
      '--ignore-existing',
      'react-native',
      'init',
      name,
      '--template',
      `ult-template-${template}`,
    ]).once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
