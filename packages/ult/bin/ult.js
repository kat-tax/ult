#!/usr/bin/env node

const path = require('path');
const color = require('kleur');
const prompt = require('../lib/prompt');
const command = require('../lib/command');

(async function() {
  try {
    const cli = await prompt();
    console.log('Creating project, please wait...\n');
    await command.npx(['react-native', 'init', cli.name, '--template', `ult-template-${cli.base}`], undefined, true);
    console.log('Initializing Windows project...');
    const cwd = path.resolve(process.cwd(), cli.name.toLowerCase());
    await command.npx(['react-native-windows-init', '--overwrite', '--no-telemetry'], cwd);
    if (process.platform === 'darwin') {
      console.log('Installing pods...');
      await command.pod(cli.name);
    }
    console.log(color.green(`\nSuccessfully created ${cli.name}!\n`));
    console.log(color.bold('1) Navigate to your project:'));
    console.log(`$ ${color.yellow(`cd ${cli.name.toLowerCase()}`)}\n`);
    console.log(color.bold('2) Run the app on a platform:'));
    console.log(`$ ${color.yellow('yarn run web')}`);
    console.log(`$ ${color.yellow('yarn run android')}`);
    console.log(`$ ${color.yellow('yarn run windows')}`);
    console.log(`$ ${color.yellow('yarn run macos')}`);
    console.log(`$ ${color.yellow('yarn run ios')}`);
    console.log(color.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  } catch (error) {
    console.error(color.red(error));
  }
})();
