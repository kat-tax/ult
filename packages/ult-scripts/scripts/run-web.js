process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {throw err});
require('../lib/env');

// Imports
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// Dev Utils
const {checkBrowsers} = require('ult-dev-utils/browsersHelper');
const {choosePort, createCompiler, prepareProxy, prepareUrls} = require('ult-dev-utils/WebpackDevServerUtils');
const checkRequiredFiles = require('ult-dev-utils/checkRequiredFiles');
const clearConsole = require('ult-dev-utils/clearConsole');
const openBrowser = require('ult-dev-utils/openBrowser');

// Config
const paths = require('../config/paths');
const isInteractive = process.stdout.isTTY;
const useYarn = fs.existsSync(paths.yarnLockFile);
const createDevServerConfig = require('../config/server.config');
const configFactory = require('../config/webpack.config');

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
    devServer.listen(port, HOST, err => {
      if (err) return console.log(err);
      if (isInteractive) clearConsole();
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
