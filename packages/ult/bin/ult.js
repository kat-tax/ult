#!/usr/bin/env node

const prompts = require('prompts');
const color = require('kleur');
const path = require('path');
const cmd = require('../lib/cmd');
const val = require('../lib/val');
const name = process.argv.slice(2).find(e => e.slice(0,2) !== '--');
const prompt = [
  {
    name: 'project',
    type: 'text',
    message: 'Enter the project name',
    initial: val.project(name) === true ? name.trim() : undefined,
    validate: val.project,
  },
  {
    name: 'base',
    type: 'select',
    message: 'Choose your base',
    initial: 'production',
    choices: [
      {value: 'production', title: 'Production', description: 'all the fixins'},
      {value: 'minimal', title: 'Minimal', description: 'the bare minimum'},
    ],
  },
];

(async function() {
  const input = await prompts(prompt);
  if (!input.project || !input.base)
    return console.log(color.red('Project creation aborted!'));
  try {
    const cwd = path.resolve(process.cwd(), input.project.toLowerCase());
    console.log('Creating project, please wait...\n');
    await cmd.npx(['react-native', 'init', input.project, '--template', `ult-template-${input.base}`], undefined, true);
    console.log('Initializing Windows project...');
    await cmd.npx(['react-native-windows-init', '--overwrite', '--no-telemetry'], cwd);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await cmd.pod(input.project);
    }
    console.log(color.green(`\nSuccessfully created ${input.project}!\n`));
    console.log(color.bold('1) Navigate to your project:'));
    console.log(`$ ${color.yellow(`cd ${input.project.toLowerCase()}`)}\n`);
    console.log(color.bold('2) Run the app on a platform:'));
    console.log(`$ ${color.yellow('yarn run web')}`);
    console.log(`$ ${color.yellow('yarn run android')}`);
    console.log(`$ ${color.yellow('yarn run windows')}`);
    console.log(`$ ${color.yellow('yarn run macos')}`);
    console.log(`$ ${color.yellow('yarn run ios')}`);
    console.log(color.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  } catch (e) {
    console.log(color.red(`Failed to create project (${e})`));
  }
})();
