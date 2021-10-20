#!/usr/bin/env node

const prompts = require('prompts');
const color = require('kleur');
const path = require('path');
const cmd = require('../lib/cmd');
const val = require('../lib/val');

// User input
const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');

const VERSION_MACOS = '0.63.37';
const VERSION_WINDOWS = '0.63.36';

const EFFECTS = [
  {value: 'thunks', title: 'Thunks', description: 'Procedural side-effects using functions'},
  {value: 'sagas', title: 'Sagas', description: 'Procedural side-effects using generators'},
  {value: 'observables', title: 'Observables', description: 'Reactive side-effects using observables'},
];

async function main() {
  const input = await prompts([{
    type: 'text',
    name: 'name',
    message: 'What is the project name?',
    validate: val.project,
    initial: opts ? opts.trim() : undefined,
  }, {
    type: 'select',
    name: 'effects',
    message: 'Choose the side effects layer',
    choices: EFFECTS,
  },
]);

  if (!input.name || !input.compat) {
    console.log(color.red(`Project creation aborted!`));
    return;
  }

  try {
    const cwd = path.resolve(process.cwd(), input.name.toLowerCase());
    console.log('Creating project, please wait...\n');
    await cmd.npx(['react-native', 'init', input.name, '--template', `ult-template-${input.template}`], undefined, true);
    console.log('Initializing Windows project...');
    await cmd.npx(['react-native-windows-init', '--overwrite', '--version', VERSION_WINDOWS, '--no-telemetry'], cwd);
    console.log('Initializing MacOS project...');
    await cmd.npx(['react-native-macos-init', '--overwrite', '--version', VERSION_MACOS], cwd);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await cmd.pod(input.name);
    }
    console.log(color.green(`\nSuccessfully created ${input.name}!\n`));
    console.log(color.bold('1) Navigate to your project:'));
    console.log(`$ ${color.yellow(`cd ${input.name.toLowerCase()}`)}\n`);
    console.log(color.bold('2) Choose a command below:'));
    console.log(`$ ${color.yellow('npm run web')}`);
    console.log(`$ ${color.yellow('npm run ios')}`);
    console.log(`$ ${color.yellow('npm run macos')}`);
    console.log(`$ ${color.yellow('npm run windows')}`);
    console.log(`$ ${color.yellow('npm run android')}`);
    console.log(color.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  } catch (e) {
    console.log(color.red(`Failed to create project (${e})`));
  }
}

main();
