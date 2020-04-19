const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const chalk = require('react-dev-utils/chalk');
const paths = require('./paths');

function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  // We don't need to do anything if `baseUrl` is set to `node_modules`
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '')
    return null;

  // Allow the user set the `baseUrl` to `appSrc`
  if (path.relative(paths.appSrc, baseUrlResolved) === '')
    return [paths.appSrc];

  // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with an alias.
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return null;

  // Otherwise, throw an error
  throw new Error(chalk.red.bold("Your project's `baseUrl` can only be set to `src` or `node_modules`."));
}

function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;
  if (!baseUrl) return {};
  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);
  if (path.relative(paths.appPath, baseUrlResolved) === '')
    return {src: paths.appSrc};
}

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

module.exports = getModules();