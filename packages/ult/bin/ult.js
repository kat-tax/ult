#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const utils = require('../lib/utils');

const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const name = opts ? opts.trim() : '';
const cwd = path.resolve(process.cwd(), name.toLowerCase());
const tpl = `ult-template-${flag ? flag.substr(2) : 'default'}`;

async function main() {
  if (!name)
    return console.log(chalk.red('Project name is missing. (e.g. npx ult Demo)'));
  if (name.match(/^[_\.]/))
    return console.log(chalk.red('Project name should not start with . or _'));
  if (name.match(/[~'!()*]/))
    return console.log(chalk.red('Project name should not contain: ~ ( ) \' ! *'));
  if (name.length > 100) 
    return console.log(chalk.red('Project name length cannot exceed 100 characters.'));
  try {
    console.log('Creating project, please wait...');
    await utils.npx(['--ignore-existing', 'react-native', 'init', name, '--template', tpl]);
    console.log('Initializing Windows...');
    await utils.npx(['react-native-windows-init', '--overwrite'], cwd);
    console.log('Initializing MacOS...');
    await utils.npx(['react-native-macos-init'], cwd);
    console.log('Patching files...');
    await utils.patch(name);
    // TODO: install pods if on macos
    console.log(chalk.green(`Successfully created ${name}!\n`));
    console.log(chalk.bold('1) Navigate to your project:'));
    console.log(`$ ${chalk.yellow(`cd ${name.toLowerCase()}`)}\n`);
    console.log(chalk.bold('2) Choose a command below:'));
    console.log(`$ ${chalk.yellow('npm run start:web')}`);
    console.log(`$ ${chalk.yellow('npm run start:ios')}`);
    console.log(`$ ${chalk.yellow('npm run start:macos')}`);
    console.log(`$ ${chalk.yellow('npm run start:windows')}`);
    console.log(`$ ${chalk.yellow('npm run start:android')}`);
    console.log(chalk.blue('\nFor more details, visit https://docs.ult.dev'));
  } catch (e) {
    console.log(chalk.red(`Failed to create project. (${e})`));
  }
}

main();
