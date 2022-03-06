const prompts = require('prompts');
const config = require('../config');
const validate = require('../lib/validate');

const args = process.argv.slice(2);
const flags = args.filter(e => e.slice(0,2) === '--');
const name = args.find(e => e.slice(0,2) !== '--')?.trim();
const base = flags.shift()?.replace('--', '');

async function prompt() {
  const steps = [
    {
      name: 'name',
      type: 'text',
      message: 'Enter the project name',
      initial: validate.name(name) === true ? name : undefined,
      validate: validate.name,
    },
    {
      name: 'base',
      type: 'select',
      message: 'Choose your base',
      choices: config.bases,
      initial: validate.base(base) === true
        ? config.bases.findIndex(e => e.value === base)
        : undefined,
    },
  ];

  // Skip prompt if all steps have input
  let input;
  if (steps.filter(e => e.initial).length === steps.length) {
    input = Object.fromEntries(steps.map(e => [e.name, e.initial]));
  } else {
    input = await prompts(steps);
  }

  // Required input missing, user aborted
  if (!input.name || !input.base) {
    throw 'Aborted creating project!';
  }

  return input;
}

module.exports = prompt;
