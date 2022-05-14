const fs = require('fs-extra');
const path = require('path');

// Plugins
const TerserPlugin = require('terser-webpack-plugin');
const BugsnagPlugins = require('webpack-bugsnag-plugins');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

// Helpers
const paths = require('../paths');
const modules = require('../modules');
const isProfiling = process.argv.includes('--profile');
const hasSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const hasBugsnagReporting = !!process.env.BUGSNAG_API_KEY;

// Config
module.exports = {
  mode: 'production',
  devtool: hasSourceMap && 'source-map',
  bail: true,
  output: {
    pathinfo: false,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {ecma: 8},
          mangle: {safari10: true},
          output: {ecma: 5, comments: false, ascii_only: true},
          compress: {ecma: 5, inline: 2, warnings: false, comparisons: false},
          keep_classnames: isProfiling,
          keep_fnames: isProfiling,
        },
      }),
    ],
  },
  resolve: {
    alias: {
      ...(isProfiling && {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      }),
      ...(modules.webpackAliases || {}),
    },
  },
  plugins: [
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW
    fs.existsSync(paths.swSrc) && new WorkboxWebpackPlugin.InjectManifest({
      swSrc: paths.swSrc,
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    }),
    // https://docs.bugsnag.com/build-integrations/webpack/#build-reporter
    hasBugsnagReporting && new BugsnagPlugins.BugsnagBuildReporterPlugin({
      apiKey: process.env.BUGSNAG_API_KEY,
      appVersion: process.env.APP_VERSION,
      releaseStage: process.env.APP_STAGE,
    }),
    // https://docs.bugsnag.com/build-integrations/webpack/#source-map-uploader
    hasBugsnagReporting && hasSourceMap && new BugsnagPlugins.BugsnagSourceMapUploaderPlugin({
      apiKey: process.env.BUGSNAG_API_KEY,
      appVersion: process.env.APP_VERSION,
      publicPath: paths.publicUrlOrPath,
      overwrite: true,
    }),
  ].filter(Boolean),
};
