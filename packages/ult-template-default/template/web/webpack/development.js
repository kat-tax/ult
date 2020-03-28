const path = require('path');
const merge = require('webpack-merge');
const {HotModuleReplacementPlugin} = require('webpack');
const {buildConfig, APP_PATH, WEB_PATH} = require('./common');

module.exports = (env, argv) => (
  merge(buildConfig(env, argv), {
    devtool: 'inline-source-map',
    entry: path.join(WEB_PATH, 'index.hmr.js'),
    plugins: [
      new HotModuleReplacementPlugin(),
    ],
    devServer: {
      port: 8888,
      hot: true,
      open: true,
      openPage: '',
      inline: true,
      stats: 'minimal',
      contentBase: APP_PATH,
    },
  })
);
