process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {throw err});
require('../lib/env');

// Imports
const fs = require('fs-extra');
const semver = require('semver');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// React Dev Utils
const chalk = require('react-dev-utils/chalk');
const {checkBrowsers} = require('react-dev-utils/browsersHelper');
const {choosePort, createCompiler, prepareProxy, prepareUrls} = require('react-dev-utils/WebpackDevServerUtils');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');

// Config
const paths = require('../config/paths');
const isInteractive = process.stdout.isTTY;
const useYarn = fs.existsSync(paths.yarnLockFile);
const react = require(require.resolve('react', {paths: [paths.appPath]}));
const createDevServerConfig = require('../config/server.config');
const configFactory = require('../config/webpack.config');
const getClientEnvironment = require('../lib/env');

// Verification
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Setup
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
if (process.env.HOST) {
  console.log(chalk.cyan(`Attempting to bind to env HOST: ${chalk.yellow(chalk.bold(process.env.HOST))}`));
  console.log();
}

// Run
checkBrowsers(paths.appPath, isInteractive)
  .then(() => choosePort(HOST, DEFAULT_PORT))
  .then(port => {
    if (port == null) return;
    const appName = require(paths.appPackageJson).name;
    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const urls = prepareUrls(protocol, HOST, port, paths.publicUrlOrPath.slice(0, -1));
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic, paths.publicUrlOrPath);
    const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
    const compiler = createCompiler({
      urls,
      config,
      appName,
      webpack,
      useYarn,
      useTypeScript: true,
      tscCompileOnError: process.env.TSC_COMPILE_ON_ERROR === 'true',
      devSocket: {
        warnings: warnings => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
        errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
      },
    });

    const devServer = new WebpackDevServer(compiler, serverConfig);
    const clientEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
    devServer.listen(port, HOST, err => {
      if (err) return console.log(err);
      if (isInteractive) clearConsole();
      if (clientEnv.raw.FAST_REFRESH && semver.lt(react.version, '16.10.0'))
        console.log(chalk.yellow(`Fast Refresh requires React 16.10 or higher. You are using React ${react.version}.`));
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      process.stdin.on('end', function() {
        devServer.close();
        process.exit();
      });
    }
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
