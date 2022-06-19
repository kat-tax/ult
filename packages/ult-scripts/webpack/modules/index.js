const resolve = require('resolve');
const fs = require('fs');
const path = require('path');
const chalk = require('react-dev-utils/chalk');
const paths = require('../paths');

const ts = require(resolve.sync('typescript', {basedir: paths.appNodeModules}));
const config = ts.readConfigFile(paths.appTypescriptConfig, ts.sys.readFile).config;
const options = config.compilerOptions || {};

const getAdditionalModulePaths = (options = {}) => {
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

const getJestAliases = (options = {}) => {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {'^src/(.*)$': '<rootDir>/src/$1'};
}

const getWebpackAliases = (options = {}) => {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {src: paths.appSrc};
}

module.exports = {
  hasTsConfig: fs.existsSync(paths.appTypescriptConfig),
  additionalModulePaths: getAdditionalModulePaths(options),
  webpackAliases: getWebpackAliases(options),
  jestAliases: getJestAliases(options),
};
