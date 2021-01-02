process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.on('unhandledRejection', err => {throw err});
require('../lib/env');

// Imports
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');

// React Dev Utils
const chalk = require('ult-dev-utils/chalk');
const FileSizeReporter = require('ult-dev-utils/FileSizeReporter');
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printHostingInstructions = require('ult-dev-utils/printHostingInstructions');
const formatWebpackMessages = require('ult-dev-utils/formatWebpackMessages');
const checkRequiredFiles = require('ult-dev-utils/checkRequiredFiles');
const printBuildError = require('ult-dev-utils/printBuildError');
const {checkBrowsers} = require('ult-dev-utils/browsersHelper');

// Config
const paths = require('../config/paths');
const argv = process.argv.slice(2);
const isInteractive = process.stdout.isTTY;
const useYarn = fs.existsSync(paths.yarnLockFile);
const writeStats = argv.indexOf('--stats') !== -1;
const configFactory = require('../config/webpack.config');

// Verification
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Setup
const config = configFactory('production');
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// Run
checkBrowsers(paths.appPath, isInteractive)
  .then(() => measureFileSizesBeforeBuild(paths.appBuild))
  .then(previousFileSizes => {
    fs.emptyDirSync(paths.appBuild);
    copyPublicFolder();
    return build(previousFileSizes);
  })
  .then(({stats, previousFileSizes, warnings}) => {
    if (warnings.length) {
      console.log(warnings.join('\n\n'));
      console.log(chalk.yellow('Compiled with warnings.\n'));
    } else {
      console.log(chalk.green('Compiled successfully.\n'));
    }
    console.log('File sizes after gzip:\n');
    printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild, WARN_AFTER_BUNDLE_GZIP_SIZE, WARN_AFTER_CHUNK_GZIP_SIZE);
    console.log();
    const appPackage = require(paths.appPackageJson);
    const publicUrl = paths.publicUrlOrPath;
    const publicPath = config.output.publicPath;
    const buildFolder = path.relative(process.cwd(), paths.appBuild);
    printHostingInstructions(appPackage, publicUrl, publicPath, buildFolder, useYarn);
  },
  err => {
    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    if (tscCompileOnError) {
      console.log(chalk.yellow('Compiled with the following type errors (check before deploying your app):\n'));
      printBuildError(err);
    } else {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  }).catch(err => {
    if (err && err.message) console.log(err.message);
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) return reject(err);
        let errMessage = err.message;
        messages = formatWebpackMessages({errors: [errMessage], warnings: []});
      } else {
        messages = formatWebpackMessages(stats.toJson({all: false, warnings: true, errors: true}));
      }
      if (messages.errors.length) {
        if (messages.errors.length > 1) messages.errors.length = 1;
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (process.env.CI
        && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false')
        && messages.warnings.length) {
        console.log(chalk.yellow('\nTreating warnings as errors because process.env.CI = true.\n'));
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      const resolveArgs = resolve({stats, previousFileSizes, warnings: messages.warnings});
      if (writeStats) {
        return bfj
          .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
