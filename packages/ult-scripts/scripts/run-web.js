process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.on('unhandledRejection', err => {throw err});
require('../lib/getClientEnvironment');

// Imports
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// React Dev Utils
const chalk = require('ult-dev-utils/chalk');
const {checkBrowsers} = require('ult-dev-utils/browsersHelper');
const {choosePort, createCompiler, prepareProxy, prepareUrls} = require('ult-dev-utils/WebpackDevServerUtils');
const checkRequiredFiles = require('ult-dev-utils/checkRequiredFiles');
const clearConsole = require('ult-dev-utils/clearConsole');
const openBrowser = require('ult-dev-utils/openBrowser');

// Config
const createDevServerConfig = require('../config/server.config');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');

// Verification
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Setup
const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;
const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;
if (process.env.HOST) {
  console.log(chalk.cyan(`Attempting to bind to env HOST: ${chalk.yellow(chalk.bold(process.env.HOST))}`));
  console.log();
}

// Run
checkBrowsers(paths.appPath, isInteractive)
  .then(() => choosePort(host, port))
  .then(port => {
    if (port == null) return;
    const appName = require(paths.appPackageJson).name;
    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const urls = prepareUrls(protocol, host, port, paths.publicUrlOrPath.slice(0, -1));
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
    });

    const devServer = new WebpackDevServer(compiler, serverConfig);
    devServer.listen(port, host, err => {
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
