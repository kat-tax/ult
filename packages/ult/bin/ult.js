#!/usr/bin/env node

const path = require('path');
const color = require('kleur');
const config = require('../config');
const prompt = require('../lib/prompt');
const command = require('../lib/command');
const validate = require('../lib/validate');

(async function() {
  try {
    const input = await prompt([
      {
        name: 'name',
        type: 'text',
        message: 'Enter the project name',
        validate: validate.name,
      },
      {
        name: 'base',
        type: 'select',
        message: 'Choose your base',
        choices: config.bases,
        validate: validate.base,
      },
      {
        name: 'platforms',
        type: 'multiselect',
        message: 'Select target platforms',
        instructions: color.gray('- Space to select. Return to submit'),
        choices: config.platforms,
        validate: validate.platform,
      }
    ]);
    console.log('Creating project, please wait...\n');
    await command.npx(['react-native', 'init', input.name, '--template', `ult-template-${input.base}`], undefined, true);
    console.log('Initializing Windows project...');
    const cwd = path.resolve(process.cwd(), input.name.toLowerCase());
    await command.npx(['react-native-windows-init', '--overwrite', '--no-telemetry'], cwd);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await command.pod(input.name);
    }
    console.log(color.green(`\nSuccessfully created ${input.name}!\n`));
    console.log(color.bold('1) Navigate to your project:'));
    console.log(`$ ${color.yellow(`cd ${input.name.toLowerCase()}`)}\n`);
    console.log(color.bold('2) Run the app on a platform:'));
    console.log(`$ ${color.yellow('yarn web')}`);
    console.log(`$ ${color.yellow('yarn android')}`);
    console.log(`$ ${color.yellow('yarn windows')}`);
    console.log(`$ ${color.yellow('yarn macos')}`);
    console.log(`$ ${color.yellow('yarn ios')}`);
    console.log(color.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  } catch (error) {
    console.error(color.red(error));
  }
})();
