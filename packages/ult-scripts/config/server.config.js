// Based on: https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpackDevServer.config.js

'use strict';

const fs = require('fs');
const paths = require('./paths');
const getHttpsConfig = require('../lib/getHttpsConfig');

const ignoredFiles = require('ult-dev-utils/ignoredFiles');
const redirectServedPath = require('ult-dev-utils/redirectServedPathMiddleware');
const evalSourceMapMiddleware = require('ult-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('ult-dev-utils/noopServiceWorkerMiddleware');

const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  const disableFirewall = !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';
  return {
    host,
    proxy,
    compress: true,
    https: getHttpsConfig(),
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      watch: {ignored: ignoredFiles(paths.appSrc)},
    },
    client: {
      overlay: true,
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
    },
    onBeforeSetupMiddleware(app, server) {
      app.use(evalSourceMapMiddleware(server));
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(app);
      }
    },
    onAfterSetupMiddleware(app) {
      app.use(redirectServedPath(paths.publicUrlOrPath));
      app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
