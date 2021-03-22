const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const paths = require('../config/paths');
const resolve = require('resolve');

function getModules() {
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const ts = require(resolve.sync('typescript', {basedir: paths.appNodeModules}));
  const config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
  const options = config.compilerOptions || {};
  const additionalModulePaths = getAdditionalModulePaths(options);
  return {
    hasTsConfig,
    jestAliases: getJestAliases(options),
    webpackAliases: getWebpackAliases(options),
    additionalModulePaths: additionalModulePaths,
  };
}

// Helpers
function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '')
    return null;
  if (path.relative(paths.appSrc, baseUrlResolved) === '')
    return [paths.appSrc];
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return null;
  throw new Error(chalk.red.bold("Your project's `baseUrl` can only be set to `src` or `node_modules`."));
}

function getJestAliases(options = {}) {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {'^src/(.*)$': '<rootDir>/src/$1'};
}

function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {src: paths.appSrc};
}

module.exports = getModules();
