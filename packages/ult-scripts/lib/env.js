const fs = require('fs');
const path = require('path');
const paths = require('../config/paths');
delete require.cache[require.resolve('../config/paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV variable is required but was not specified.');
}

const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(require('dotenv').config({path: dotenvFile}));
  }
});

const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

const ULT_APP = /^ULT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => ULT_APP.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {
      PUBLIC_URL: publicUrl,
      NODE_ENV: process.env.NODE_ENV || 'development',
      FAST_REFRESH: process.env.FAST_REFRESH || false,
      WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
      WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
      WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
    });
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
  return {raw, stringified};
}

module.exports = getClientEnvironment;
