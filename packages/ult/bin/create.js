const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const base = process.cwd();
    const slug = name.toLowerCase();
    const init = spawn('git', ['init', slug], {cwd: base});
    init.once('exit', i => {
      if (i === 0) {
        const root = path.resolve(base, slug);
        const repo = 'https://github.com/kat-tax/ult-template.git';
        const pull = spawn('git', ['pull', repo, template], {cwd: root});
        pull.once('exit', p => (p === 0 ? resolve() : reject(p)));
      } else {
        reject(i);
      }
    });
  });
}
