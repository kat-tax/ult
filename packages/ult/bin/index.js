#!/usr/bin/env node

const readline = require('readline');
const chalk = require('chalk');
const create = require('./create');
const install = require('./install');
const native = require('./native');

async function main() {
  const args = process.argv.slice(2);
  const opts = args.find(e => e.slice(0,2) !== '--');
  const flag = args.find(e => e.slice(0,2) === '--');
  const name = opts ? opts.trim() : '';
  const template = flag ? flag.substr(2) : 'default';
  const interface = {input: process.stdin, output: process.stdout};

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
    await create(name, template);

    const question = 'Would you like to install the dependencies? (Y/n) ';
    const rl = readline.createInterface(interface);
    rl.question(chalk.bold(question), async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('Installing, this may take awhile...');
        try {
          if (template !== 'web')
            await native(name);
          await install(name);
          complete(name, template, true);
        } catch (e) {
          complete(name, template, false, true);
        } finally {
          rl.close();
        }
      } else {
        complete(name, template, false);
        rl.close();
      }
    });
  } catch (e) {
    error(`Failed to create project. (code: ${e})>`);
  }
}

function complete(name, template, deps, depsFailed) {
  if (depsFailed) {
    console.log(chalk.red('Failed to install dependencies.'));
  } else {
    console.log(chalk.green(`Successfully created ${name}!`));
  }
  console.log();
  console.log(chalk.bold('1) Navigate to your project:'));
  console.log(`$ ${chalk.yellow(`cd ${name.toLowerCase()}`)}`);
  console.log();
  if (deps) {
    console.log(chalk.bold('2) Choose a command below:'));
  } else {
    console.log(chalk.bold('2) Install dependencies:'));
    console.log(`$ ${chalk.yellow('npm install')}`);
    console.log();
    console.log(chalk.bold('3) Choose a command below:'));
  }
  if (template === 'web') {
    console.log(`$ ${chalk.yellow('npm run web')}`);
    console.log(`$ ${chalk.yellow('npm run test')}`);
    console.log(`$ ${chalk.yellow('npm run build')}`);
  } else {
    console.log(`$ ${chalk.yellow('npm run web')}`);
    console.log(`$ ${chalk.yellow('npm run android')}`);
    console.log(`$ ${chalk.yellow('npm run ios')}`);
    console.log(`$ ${chalk.yellow('npm run macos')}`);
    console.log(`$ ${chalk.yellow('npm run windows')}`);
  }
  console.log(chalk.blue('\nFor more details, visit https://docs.ult.dev'));
}

function error(...messages) {
  console.log(chalk.red(...messages));
}

main();
