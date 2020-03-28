#!/usr/bin/env node

const chalk = require('chalk');
const native = require('../lib/native');
const windows = require('../lib/windows');

const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const name = opts ? opts.trim() : '';
const template = flag ? flag.substr(2) : 'default';

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
    console.log('Creating new project, please wait...');
    await native(name, template);
    // await windows();
    console.log(chalk.green(`Successfully created ${name}!\n`));
    console.log(chalk.bold('1) Navigate to your project:'));
    console.log(`$ ${chalk.yellow(`cd ${name.toLowerCase()}`)}\n`);
    console.log(chalk.bold('2) Choose a command below:'));
    console.log(`$ ${chalk.yellow('npm run web')}`);
    console.log(`$ ${chalk.yellow('npm run android')}`);
    console.log(`$ ${chalk.yellow('npm run ios')}`);
    console.log(`$ ${chalk.yellow('npm run macos')}`);
    console.log(`$ ${chalk.yellow('npm run windows')}`);
    console.log(chalk.blue('\nFor more details, visit https://docs.ult.dev'));
  } catch (e) {
    console.log(chalk.red(`Failed to create project. (code: ${e})>`));
  }
}

main();
