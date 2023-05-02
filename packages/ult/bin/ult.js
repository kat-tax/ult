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

    // Get the working directory and package manager
    const cwd = path.resolve(process.cwd(), input.name.toLowerCase());
    const manager = command.getPackageManager();

    // Use the web-only template if the user only selected web platform
    // if (input.platforms.includes('web') && input.platforms.length === 1) {
    //   input.base = 'web-only';
    // }

    // Create the project with the react-native cli tool
    console.log('Creating project, please wait...\n');
    try {
      await command.npx(['react-native', 'init', input.name, '--template', `ult-template-${input.base}`], undefined, true);
    } catch (error) {
      console.log(color.red('Failed to init project'));
      return;
    }

    // Init Windows project if selected
    if (input.platforms.includes('windows')) {
      console.log('Initializing Windows project...');
      try {
        await command.npx(['react-native-windows-init', '--no-telemetry'], cwd);
      } catch (error) {
        console.log(color.red('Failed to init Windows project, please run "npx react-native-windows-init" manually'));
      }
    }

    // Init MacOS project if selected
    if (input.platforms.includes('macos')) {
      console.log('Initializing MacOS project...');
      try {
        await command.npx(['react-native-macos-init', '--no-telemetry'], cwd);
      } catch (error) {
        console.log(color.red('Failed to init MacOS project, please run "npx react-native-macos-init" manually'));
      }
    }

    // Output success message and tips
    console.log(color.green(`\nSuccessfully created ${input.name}!\n`));
    console.log(color.bold('1) Navigate to your project:'));
    console.log(`$ ${color.yellow(`cd ${input.name.toLowerCase()}`)}\n`);
    console.log(color.bold('2) Run the app on a platform:'));
    console.log(`$ ${color.yellow(`${manager} web`)}`);
    console.log(`$ ${color.yellow(`${manager} android`)}`);
    console.log(`$ ${color.yellow(`${manager} windows`)}`);
    console.log(`$ ${color.yellow(`${manager} macos`)}`);
    console.log(`$ ${color.yellow(`${manager} ios`)}`);
    console.log(color.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  } catch (error) {
    console.error(color.red(error));
  }
})();
