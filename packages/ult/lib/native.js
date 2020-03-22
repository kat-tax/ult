const path = require('path');
const spawn = require('child_process').spawn;
module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const cwd = path.resolve(process.cwd());
    const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    spawn(cmd, [
      'react-native', 
      'init', name,
      '--template', `ult-template-${template}`,
    ], {cwd}).once('exit', e => (e === 0 ? resolve() : reject(e)));
  });
};
