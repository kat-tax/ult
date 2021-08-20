#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const utils = require('./lib');
const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const name = opts ? opts.trim() : '';
const cwd = path.resolve(process.cwd(), name.toLowerCase());
const tpl = `ult-template-${flag ? flag.substr(2) : 'default'}`;

const REACT_NATIVE_WINDOWS = '0.63.36';
const REACT_NATIVE_MACOS = '0.63.37';

async function init() {
  // Validation
  if (!name)
    return console.log(chalk.red('Project name is missing (e.g. npx ult Demo)'));
  if (name.length > 100) 
    return console.log(chalk.red('Project name cannot exceed 100 characters'));
  if (!name.match(/^[a-zA-Z0-9]+$/))
    return console.log(chalk.red('Project name should be alphanumeric'));
  // Installation
  try {
    console.log('Creating project, please wait...\n');
    await utils.npx(['react-native', 'init', name, '--template', tpl], undefined, true);
    console.log('Initializing Windows project...');
    await utils.npx(['react-native-windows-init', '--overwrite', '--version', REACT_NATIVE_WINDOWS, '--no-telemetry'], cwd);
    console.log('Initializing MacOS project...');
    await utils.npx(['react-native-macos-init', '--overwrite', '--version', REACT_NATIVE_MACOS], cwd);
    console.log('Patching project files...');
    await utils.patch(name);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await utils.pod(name);
    }
    // Information
    console.log(chalk.green(`\nSuccessfully created ${name}!\n`));
    console.log(chalk.bold('1) Navigate to your project:'));
    console.log(`$ ${chalk.yellow(`cd ${name.toLowerCase()}`)}\n`);
    console.log(chalk.bold('2) Choose a command below:'));
    console.log(`$ ${chalk.yellow('npm run web')}`);
    console.log(`$ ${chalk.yellow('npm run ios')}`);
    console.log(`$ ${chalk.yellow('npm run macos')}`);
    console.log(`$ ${chalk.yellow('npm run windows')}`);
    console.log(`$ ${chalk.yellow('npm run android')}`);
    console.log(chalk.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  // Exception
  } catch (e) {
    console.log(chalk.red(`Failed to create project (${e})`));
  }
}

init();
