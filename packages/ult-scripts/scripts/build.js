process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.on('unhandledRejection', err => {throw err});
require('../config/env');

const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;
const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs]))
  process.exit(1);

const config = configFactory('production');
const {checkBrowsers} = require('react-dev-utils/browsersHelper');
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
      console.log(
        chalk.yellow(
          'Compiled with the following type errors (you may want to check these before deploying your app):\n'
        )
      );
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
      return resolve({stats, previousFileSizes, warnings: messages.warnings});
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
