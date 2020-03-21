#!/usr/bin/env node

const chalk = require('chalk');

const native = require('../lib/native');
const install = require('../lib/install');
const windows = require('../lib/windows');

const args = process.argv.slice(2);
const opts = args.find(e => e.slice(0,2) !== '--');
const flag = args.find(e => e.slice(0,2) === '--');
const name = opts ? opts.trim() : '';
const base = flag ? flag.substr(2) : 'default';

async function main() {
  if (!name)
    return error('Project name is missing. (e.g. npx ult Demo)');
  if (name.match(/^[_\.]/))
    return error('Project name should not start with . or _');
  if (name.match(/[~'!()*]/))
    return error('Project name should not contain: ~ ( ) \' ! *');
  if (name.length > 100) 
    return error('Project name length cannot exceed 100 characters.');

  try {
    console.log('Creating new project, please wait...');
    await native(name, base);
    console.log('Installing dependencies...');
    await install(name, base);
    console.log('Finishing installation...');
    await windows(name, base);
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
