const path = require('path');

// Plugins
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// Helpers
const modules = require('../modules');

// Config
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  bail: false,
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    devtoolModuleFilenameTemplate: (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
  },
  resolve: {
    alias: {
      ...(modules.webpackAliases || {}),
    },
  },
  plugins: [
    // Experimental hot reloading for React
    // https://github.com/pmmmwh/react-refresh-webpack-plugin#options
    new ReactRefreshWebpackPlugin({overlay: false}),
  ].filter(Boolean),
};
