const prompts = require('prompts');
const args = process.argv.slice(2);
const flags = args.filter(e => e.slice(0,2) === '--');

async function prompt(steps) {
  prompts.override({
    name: args.find(e => e.slice(0,2) !== '--')?.trim(),
    ...Object.fromEntries(flags.map(flag => {
      const [k, v] = flag.split('=');
      return [k.slice(2), k === '--platforms' ? v.split(',') : v];
    }))
  });
  return await prompts(steps, {
    onCancel: () => {
      throw 'Aborted creating project!';
    },
  });
}

module.exports = prompt;
