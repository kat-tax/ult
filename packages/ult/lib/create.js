const path = require('path');
const spawn = require('child_process').spawn;
const {TEMPLATE_REPOSITORY} = require('../config');

module.exports = (name, template) => {
  return new Promise((resolve, reject) => {
    const base = process.cwd();
    const slug = name.toLowerCase();
    spawn('git', ['init', slug], {cwd: base})
      .once('exit', i => {
        if (i === 0) {
          const root = path.resolve(base, slug);
          spawn('git', ['pull', TEMPLATE_REPOSITORY, template], {cwd: root})
            .once('exit', p => (p === 0 ? resolve() : reject(p)));
        } else {
          reject(i);
        }
      });
  });
}
