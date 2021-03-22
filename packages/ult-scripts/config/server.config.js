const fs = require('fs');

// Dev Utils
const ignoredFiles = require('ult-dev-utils/ignoredFiles');
const redirectServedPath = require('ult-dev-utils/middleware/RedirectServedPath');
const noopServiceWorker = require('ult-dev-utils/middleware/NoopServiceWorker');
const evalSourceMap = require('ult-dev-utils/middleware/EvalSourceMap');
const errorOverlay = require('ult-dev-utils/middleware/ErrorOverlay');

// Helpers
const getHttpsConfig = require('../lib/https');
const paths = require('./paths');

// Setup
const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH;
const sockPort = process.env.WDS_SOCKET_PORT;

// Config
module.exports = function(proxy, allowedHost) {
  return {
    host,
    proxy,
    sockHost,
    sockPath,
    sockPort,
    public: allowedHost,
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    contentBasePublicPath: paths.publicUrlOrPath,
    publicPath: paths.publicUrlOrPath.slice(0, -1),
    contentBase: paths.appPublic,
    https: getHttpsConfig(),
    clientLogLevel: 'none',
    transportMode: 'ws',
    hot: true,
    quiet: true,
    compress: true,
    watchContentBase: true,
    injectClient: false,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    before(app, server) {
      app.use(evalSourceMap(server));
      app.use(errorOverlay());
      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(app);
      }
    },
    after(app) {
      app.use(redirectServedPath(paths.publicUrlOrPath));
      app.use(noopServiceWorker(paths.publicUrlOrPath));
    },
  };
};
