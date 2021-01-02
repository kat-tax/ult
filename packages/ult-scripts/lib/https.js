const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('ult-dev-utils/chalk');
const paths = require('../config/paths');

function getHttpsConfig() {
  const {SSL_CRT_FILE, SSL_KEY_FILE, HTTPS} = process.env;
  const isHttps = HTTPS === 'true';
  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile = path.resolve(paths.appPath, SSL_CRT_FILE);
    const keyFile = path.resolve(paths.appPath, SSL_KEY_FILE);
    const cert = readEnvFile(crtFile, 'SSL_CRT_FILE');
    const key = readEnvFile(keyFile, 'SSL_KEY_FILE');
    const config = {cert, key};
    validateKeyAndCerts({...config, keyFile, crtFile});
    return config;
  }
  return isHttps;
}

// Helpers
function validateKeyAndCerts({cert, key, keyFile, crtFile}) {
  let encrypted;
  try {
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error(`The certificate "${chalk.yellow(crtFile)}" is invalid.\n${err.message}`);
  }
  try {
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(`The certificate key "${chalk.yellow(keyFile)}" is invalid.\n${err.message}`);
  }
}

function readEnvFile(file, type) {
  if (!fs.existsSync(file))
    throw new Error(`You specified ${chalk.cyan(type)} in your env, but the file "${chalk.yellow(file)}" can't be found.`);
  return fs.readFileSync(file);
}

module.exports = getHttpsConfig;
