const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const path = require('path');

const ROOT_PATH = path.join(__dirname, '..', '..');
const DIST_PATH = path.join(ROOT_PATH, 'dist-web');
const TSC_PATH = path.join(ROOT_PATH, 'tsconfig.json');
const APP_PATH = path.join(ROOT_PATH, 'src');
const WEB_PATH = path.join(ROOT_PATH, 'web');

const buildConfig = (_env, argv) => ({
  entry: ROOT_PATH,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [APP_PATH, 'node_modules'],
  },
  module: {
    rules: [
      {test: /\.tsx?$/, loader: 'babel-loader', include: APP_PATH}
    ],
  },
  plugins: [
    new Webpack.DefinePlugin({__DEV__: argv.mode === 'development'}),
    new HtmlWebpackPlugin({inject: true, template: path.join(WEB_PATH, 'index.html')}),
    new ForkTsCheckerWebpackPlugin({tsconfig: TSC_PATH, async: true}),
  ],
});

module.exports = {
  buildConfig,
  DIST_PATH,
  APP_PATH,
  WEB_PATH,
};
