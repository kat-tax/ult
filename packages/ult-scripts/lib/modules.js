const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const chalk = require('react-dev-utils/chalk');
const paths = require('../config/paths');

function getModules() {
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const ts = require(resolve.sync('typescript', {basedir: paths.appNodeModules}));
  const config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
  const options = config.compilerOptions || {};
  const additionalModulePaths = getAdditionalModulePaths(options);
  return {
    hasTsConfig,
    webpackAliases: getWebpackAliases(options),
    additionalModulePaths: additionalModulePaths,
  };
}

// Helpers
function getAdditionalModulePaths(options = {}) {
  const path = options.baseUrl;
  if (!path)
    return '';
  const pathResolved = path.resolve(paths.appPath, path);
  if (path.relative(paths.appNodeModules, pathResolved) === '')
    return null;
  if (path.relative(paths.appSrc, pathResolved) === '')
    return [paths.appSrc];
  if (path.relative(paths.appPath, pathResolved) === '')
    return null;
  throw new Error(chalk.red.bold("Your project's `baseUrl` can only be set to `src` or `node_modules`."));
}

function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {src: paths.appSrc};
}

module.exports = getModules();
