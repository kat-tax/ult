import * as path from "https://deno.land/std@0.194.0/path/mod.ts";
import * as cmd from "../lib/cmd.ts";
import * as cli from "../lib/cli.ts";
import * as gen from "../lib/gen.ts";

new cli.Command()
  .name('ult')
  .version('3.0.0')
  .description('The ULT project creator')
  .arguments('[project:string] [org:string] [database:string]')
  .action(async (_options, ...args) => {
    // State
    let hasError = false;

    // Input
    const prompt = await cli.prompt([
      {
        type: cli.Input,
        name: 'name',
        message: 'Enter your project name',
        default: args[0],
        minLength: 1,
        maxLength: 100,
        before: async (_, next) => {
          if (args?.length === 0) {
            await next();
          } else {
            await next(true);
          }
        },
        validate: (input) => {
          if (!input)
            return 'Project name is required';
          if (!input.match(/^[a-zA-Z0-9]+$/))
            return 'Project name should be alphanumeric and contain no spaces';
          return true;
        },
      },
      {
        type: cli.Input,
        name: 'team',
        message: 'Enter your team name',
        default: args[1],
        minLength: 1,
        maxLength: 100,
        before: async (_, next) => {
          if (args?.length <= 1) {
            await next();
          } else {
            await next(true);
          }
        },
        validate: (input) => {
          if (!input)
            return 'Team name is required';
          if (!input.match(/^[a-zA-Z0-9]+$/))
            return 'Team name should be alphanumeric and contain no spaces';
          return true;
        },
      },
      {
        type: cli.Confirm,
        name: 'databaseConfirm',
        message: 'Setup a database?',
        before: async (_, next) => {
          if (args?.length <= 2) {
            await next();
          } else {
            return;
          }
        },
      },
      {
        type: cli.Select,
        message: 'Choose the database:',
        name: 'database',
        options: [
          /*{
            name: 'Store',
            options: [
              {name: 'Redux' + cli.colors.underline.gray('\t\t[https://redux-toolkit.js.org]'), value: 'redux'},
              {name: 'Zustand' + cli.colors.underline.gray('\t\t[https://docs.pmnd.rs/zustand]'), value: 'zustand'},
            ],
          },*/
          {
            name: 'Real-time',
            options: [
              {name: 'Supabase' + cli.colors.underline.gray('\t\t[https://supabase.com]'), value: 'supabase'},
              {name: 'Firebase' + cli.colors.underline.gray('\t\t[https://firebase.google.com]'), value: 'firebase'},
              {name: 'PocketBase' + cli.colors.underline.gray('\t\t[https://pocketbase.io]'), value: 'pocketbase'},
            ],
          },
          {
            name: 'Local-first',
            options: [
              {name: 'Evolu' + cli.colors.underline.gray('\t\t[https://evolu.dev]'), value: 'evolu'},
              {name: 'TinyBase' + cli.colors.underline.gray('\t\t[https://tinybase.org]'), value: 'tinybase'},
              {name: 'SyncedStore' + cli.colors.underline.gray('\t\t[https://syncedstore.org]'), value: 'syncedstore'},
              {name: 'ElectricSQL' + cli.colors.underline.gray('\t\t[https://electric-sql.com]'), value: 'electricsql'},
              //{name: 'WatermelonDB' + cli.colors.underline.gray('\t\t[https://watermelondb.dev]'), value: 'watermelondb'},
              //{name: 'RxDB' + cli.colors.underline.gray('\t\t\t[https://rxdb.dev]'), value: 'rxdb'},
            ],
          },
          {
            name: 'Custom',
            options: [
              {name: 'CloudFlare D1' + cli.colors.gray('\t[Drizzle + Hono + tRPC + Clerk]'), value: 'dhtc'},
            ],
          },
        ],
        before: async ({databaseConfirm}, next) => {
          if (databaseConfirm === false) {
            await next(true);
          } else {
            await next();
          }
        },
      },
    ]);
 
    // Data
    const name = prompt.name || (args[0] || '');
    const team = prompt.team || (args[1] || '');
    const database = prompt.database || (args[2] || '');

    // Environment
    const pkgManager = cmd.getPackageManager();
    const cmdExec = cmd.getExecCommand();
    const cmdRun = cmd.getRunCommand();
    const cwd = path.resolve(Deno.cwd(), name);

    // Debug
    console.info('ULT', {name, team, database, cwd, cmdRun, cmdExec, pkgManager});

    // Create the project folder
    // TODO: root package.json contents and other files
    console.log('\nCreating Project...');
    try {
      gen.project(cwd, name, team);
    } catch (_e) {
      console.log(cli.colors.red('Project folder already exists!'));
      return;
    }

    gen.database(cwd, name, team, database);
    gen.components(cwd, team);
    gen.utils(cwd, team);

    // Run the RN init tool
    console.log('Initializing React Native...');
    const rnDir = path.resolve(cwd, 'packages', 'app');
    const rnTpl = `ult-template-default`;
    const rnCom = `com.${team.toLowerCase()}.${name.toLowerCase()}`;
    const rnOpt = ['react-native', 'init', name, '--skip-install', '--npm', '--template', rnTpl, '--directory', rnDir, '--package-name', rnCom];
    const rnExe = await cmd.dlx(rnOpt, undefined, true);
    if (!rnExe.success) {
      console.log(cli.colors.red('Failed to init React Native, check error above'));
      return;
    }

    const _rnPkg = `@${team.toLowerCase()}/${name.toLowerCase()}`;
    // TODO: edit packages/app/package.json
    // TODO: remove conditionals based on backend/features
  
    // Install node dependencies
    console.log('Installing Dependencies...');
    const installDeps = await cmd.run(pkgManager, ['install'], rnDir, true);
    if (!installDeps.success) {
      console.log(cli.colors.bold(cli.colors.red('Failed to install dependencies')));
      console.log(cli.colors.yellow(`Run "${pkgManager} install" manually`));
    }

    // Run the RN Windows init tool
    console.log('Initializing Windows...');
    const rnwExe = await cmd.npx(['react-native-windows-init', '--overwrite', '--no-telemetry'], rnDir, true);
    if (!rnwExe.success) {
      console.log(cli.colors.bold(cli.colors.red('Failed to init React Native Windows')))
      console.log(cli.colors.yellow(`Run "${cmdExec} react-native-windows-init" manually`));
      hasError = true;
    }

    // Run the RN MacOS init tool
    console.log('Initializing MacOS...');
    const rnmExe = await cmd.npx(['react-native-macos-init', '--overwrite', '--no-telemetry'], rnDir, true);
    if (!rnmExe.success) {
      console.log(cli.colors.bold(cli.colors.red('Failed to init React Native MacOS')))
      console.log(cli.colors.yellow(`Run "${cmdExec} react-native-macos-init" manually`));
      hasError = true;
    }

    // Run pod install for iOS
    console.log('Installing CocoaPods (iOS)...');
    const installBundle = await cmd.run('bundle', ['install'], path.resolve(rnDir, 'ios'), true);
    const installPods = await cmd.run('bundle', ['exec', 'pod', 'install'], path.resolve(rnDir, 'ios'), true);
    if (!installBundle.success && !installPods.success) {
      console.log(cli.colors.bold(cli.colors.red('Failed to install cocoapods for iOS')));
      console.log(cli.colors.yellow(`Run "bundle install && bundle exec pod install" manually in the ios folder`));
      console.log(cli.colors.yellow(`You may need to run "sudo xcode-select --switch /Applications/Xcode.app"`));
      hasError = true;
    }

    // Success or error message
    if (hasError) {
      console.log(cli.colors.bold.red(`\n${name} created with errors above!\n`));
    } else {
      console.log(cli.colors.bold.green(`\n${name} created successfully!\n`));
    }

    // Instructions
    console.log(cli.colors.bold(`1) Navigate to your app:\n`));
    console.log(cli.colors.yellow(`  $ cd ${name.toLowerCase()}/packages/app\n`));
    console.log(cli.colors.bold(`2) Choose a task to run:`));
    new cli.Table()
      .header([`Task`, `Description`])
      .body([
        [`web`, `Run the Web app`],
        [`ios`, `Run the iOS app`],
        [`macos`, `Run the MacOS app`],
        [`windows`, `Run the Windows app`],
        [`android`, `Run the Android app`],
        [`doc`, `Build documentation`],
        [`lint`, `Lint source code style`],
        [`test`, `Test E2E and unit specs`],
        [`build`, `Build platform bundles`],
        [`start`, `Start dev servers`],
        [`deploy`, `Deploy all platforms`],
        [`generate`, `Generate config and assets`],
        [`translate`, `Extract or compile translations`],
        [`storybook`, `Run storybook in development`],
      ])
      .maxColWidth(80)
      .padding(1)
      .indent(2)
      .border()
      .render();
    console.log(cli.colors.bold.cyan('\nFor more details, visit https://docs.ult.dev\n'));
  })
  .parse(Deno.args);
