#!/usr/bin/env node

const chalk = require('chalk');
const patch = require('../lib/patch');
const native = require('../lib/native');
const windows = require('../lib/windows');
const macos = require('../lib/macos');

const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const template = flag ? flag.substr(2) : 'default';
const name = opts ? opts.trim() : '';

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
    await native(name, template);
    console.log('Initializing Windows project...');
    await windows(name, template);
    console.log('Initializing MacOS project...');
    await macos(name, template);
    console.log('Patching native templates...');
    await patch(name, template);
    // TODO: install pods if on macos
    // console.log('Installing pods...');
    console.log(`✔️ Successfully created ${name}!\n`);
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
    console.log(`❌ Failed to create project. (${e})>`);
  }
}

main();
