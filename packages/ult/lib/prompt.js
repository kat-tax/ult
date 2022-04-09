const prompts = require('prompts');
const args = process.argv.slice(2);
const name = args.find(e => e.slice(0,2) !== '--')?.trim();
const flags = args.filter(e => e.slice(0,2) === '--');

async function prompt(steps) {
  prompts.override({
    name,
    ...Object.fromEntries(flags.map(flag => {
      const [key, value] = flag.split('=');
      return [
        key.slice(2),
        key === '--platforms' ? value.split(',') : value
      ];
    }))
  });
  return await prompts(steps, {
    onCancel: () => {
      throw 'Aborted creating project!';
    },
  });
}

module.exports = prompt;
