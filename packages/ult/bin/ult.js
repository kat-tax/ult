#!/usr/bin/env node

const prompt = require('prompt');
const path = require('path');
const cmd = require('../lib/cmd');
const val = require('../lib/val');

// User input
const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const project = opts ? opts.trim() : undefined;
const template = flag ? flag.substr(2) : 'default';

// Constants
const MACOS = '0.63.37';
const WINDOWS = '0.63.36';
const PLATFORMS = [
  'web',
  'ios',
  'macos',
  'android',
  'windows',
];

const TEMPLATES = [
  'default',
  // 'minimal',
  // 'redux-sagas',
  // 'redux-observables',
  // 'redux-observables+rxdb',
];

// Create project
async function main() {
  // Configuration
  const config = await prompts({
    type: 'text',
    name: 'project',
    message: 'What is the project name?',
    validate: val.project(project),
    initial: project,
  }, {
    type: 'select',
    name: 'template',
    message: 'Choose the project template',
    choices: TEMPLATES,
    initial: template ? TEMPLATES.indexOf(template) : 0,
  }, {
    type: 'multiselect',
    name: 'template',
    message: 'Pick which platforms to target',
    choices: PLATFORMS,
  });
  // Installation
  try {
    console.log('Creating project, please wait...\n');
    const tpl = `ult-template-${config.template}`;
    const cwd = path.resolve(process.cwd(), config.project.toLowerCase());
    await cmd.npx(['react-native', 'init', config.project, '--template', tpl], undefined, true);
    console.log('Initializing Windows project...');
    await cmd.npx(['react-native-windows-init', '--overwrite', '--version', WINDOWS, '--no-telemetry'], cwd);
    console.log('Initializing MacOS project...');
    await cmd.npx(['react-native-macos-init', '--overwrite', '--version', MACOS], cwd);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await cmd.pod(project);
    }
    // Information
    console.log(prompt.green(`\nSuccessfully created ${project}!\n`));
    console.log(prompt.bold('1) Navigate to your project:'));
    console.log(`$ ${prompt.yellow(`cd ${project.toLowerCase()}`)}\n`);
    console.log(prompt.bold('2) Choose a command below:'));
    console.log(`$ ${prompt.yellow('npm run web')}`);
    console.log(`$ ${prompt.yellow('npm run ios')}`);
    console.log(`$ ${prompt.yellow('npm run macos')}`);
    console.log(`$ ${prompt.yellow('npm run windows')}`);
    console.log(`$ ${prompt.yellow('npm run android')}`);
    console.log(prompt.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  // Exception
  } catch (e) {
    console.log(prompt.red(`Failed to create project (${e})`));
  }
}

main();
