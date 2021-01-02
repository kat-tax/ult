/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'index.js',
    library: 'ReactErrorOverlay',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /iframe-bundle\.js$/,
        use: 'raw-loader',
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    alias: {
      iframeScript$: path.resolve(__dirname, './lib/iframe-bundle.js'),
      // Webpack 5 Change: Do not polyfill node bindings by default.
      // See https://github.com/webpack/webpack/pull/8460
      process: 'process',
    },
  },
  optimization: {
    nodeEnv: false,
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
  ],
};
