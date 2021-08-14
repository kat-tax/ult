process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';
process.on('unhandledRejection', err => {throw err});
require('../config/env');

// Imports
const path = require('path');
const jest = require('jest');
const execSync = require('child_process').execSync;
let argv = process.argv.slice(2);

function isRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {stdio: 'ignore'});
    return true;
  } catch (e) {
    try {
      execSync('hg --cwd . root', {stdio: 'ignore'});
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  argv.push(isRepository() ? '--watch' : '--watchAll');
}

const paths = require('../config/paths');
const createJestConfig = require('../lib/jest/createJestConfig');

// Setup
argv.push(
  '--config',
  JSON.stringify(
    createJestConfig(
      relativePath => path.resolve(__dirname, '..', relativePath),
      path.resolve(paths.appSrc, '..'),
      false
    )
  )
);

const resolve = require('resolve');
function resolveJestDefaultEnvironment(name) {
  const jestDir = path.dirname(
    resolve.sync('jest', {
      basedir: __dirname,
    })
  );
  const jestCLIDir = path.dirname(
    resolve.sync('jest-cli', {
      basedir: jestDir,
    })
  );
  const jestConfigDir = path.dirname(
    resolve.sync('jest-config', {
      basedir: jestCLIDir,
    })
  );
  return resolve.sync(name, {
    basedir: jestConfigDir,
  });
}

let cleanArgv = [];
let env = 'jsdom';
let next;

do {
  next = argv.shift();
  if (next === '--env') {
    env = argv.shift();
  } else if (next.indexOf('--env=') === 0) {
    env = next.substring('--env='.length);
  } else {
    cleanArgv.push(next);
  }
} while (argv.length > 0);

argv = cleanArgv;
let resolvedEnv;
try {
  resolvedEnv = resolveJestDefaultEnvironment(`jest-environment-${env}`);
} catch (e) {}
if (!resolvedEnv) {
  try {
    resolvedEnv = resolveJestDefaultEnvironment(env);
  } catch (e) {}
}

const testEnvironment = resolvedEnv || env;
argv.push('--env', testEnvironment);
jest.run(argv);
