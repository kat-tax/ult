// Imports
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const resolve = require('resolve');

// React Dev Utils
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const webpackDevClient = require.resolve('react-dev-utils/webpackHotDevClient');

// Plugins
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const {BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin} = require('webpack-bugsnag-plugins');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

// Helpers
const getClientEnvironment = require('../lib/env');
const modules = require('../lib/modules');
const paths = require('./paths');
const app = require(paths.appPackageJson);

// Config
module.exports = function(webpackEnv) {
  const isDev = webpackEnv === 'development';
  const isProd = webpackEnv === 'production';
  const isProdProfile = isProd && process.argv.includes('--profile');
  const clientEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  const hasSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  const hasBugSnag = !!process.env.BUGSNAG_API_KEY;
  const hasRefresh = false; // TOFIX: clientEnv.raw.FAST_REFRESH;
  const cacheIdentifier = getCacheIdentifier(
    isProd ? 'production' : isDev && 'development', [
      'babel-plugin-named-asset-import',
      'babel-preset-react-app',
      'react-dev-utils',
      'ult-scripts',
    ]
  );

  return {
    // https://webpack.js.org/configuration/#options
    mode: isProd ? 'production' : isDev && 'development',
    entry: isDev && !hasRefresh ? [webpackDevClient, paths.appIndexJs] : paths.appIndexJs,
    devtool: isProd ? hasSourceMap ? 'source-map' : false : isDev && 'cheap-module-source-map',
    performance: false,
    bail: isProd,
    output: {
      globalObject: 'this',
      futureEmitAssets: true,
      jsonpFunction: `webpackJsonp${app.name}`,
      publicPath: paths.publicUrlOrPath,
      pathinfo: isDev,
      path: isProd
        ? paths.appBuild
        : undefined,
      filename: isProd
        ? 'static/js/[name].[contenthash:8].js'
        : isDev && 'static/js/bundle.js',
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isDev && 'static/js/[name].chunk.js',
      devtoolModuleFilenameTemplate: isProd
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isDev && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    optimization: {
      splitChunks: {chunks: 'all', name: false},
      runtimeChunk: {name: entrypoint => `runtime-${entrypoint.name}`},
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          sourceMap: hasSourceMap,
          terserOptions: {
            parse: {ecma: 8},
            mangle: {safari10: true},
            output: {ecma: 5, comments: false, ascii_only: true},
            compress: {ecma: 5, inline: 2, warnings: false, comparisons: false},
            keep_classnames: isProdProfile,
            keep_fnames: isProdProfile,
          },
        }),
      ],
    },
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        ...(isProdProfile && {'react-dom$': 'react-dom/profiling', 'scheduler/tracing': 'scheduler/tracing-profiling'}),
        ...(modules.webpackAliases || {}),
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        {parser: {requireEnsure: false}},
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                cacheIdentifier,
                compact: isProd,
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: false,
                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                presets: [require.resolve('babel-preset-react-app')],
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {loaderMap: {svg: {ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]'}}},
                  ],
                  isDev && hasRefresh && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                cacheIdentifier,
                compact: false,
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: false,
                sourceMaps: hasSourceMap,
                inputSourceMap: hasSourceMap,
                presets: [[require.resolve('babel-preset-react-app/dependencies'), {helpers: true}]],
              },
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },
    plugins: [
      // https://github.com/jantimon/html-webpack-plugin#options
      new HtmlWebpackPlugin(Object.assign({}, {inject: true, template: paths.appHtml}, isProd ? {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      } : undefined)),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, clientEnv.raw),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(clientEnv.stringified),
      isDev && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isDev && new webpack.HotModuleReplacementPlugin(),
      // https://github.com/pmmmwh/react-refresh-webpack-plugin#options
      isDev && hasRefresh && new ReactRefreshWebpackPlugin({
        overlay: {
          entry: webpackDevClient,
          module: require.resolve('react-dev-utils/refreshOverlayInterop'),
          sockIntegration: false,
        },
      }),
      // https://github.com/danethurber/webpack-manifest-plugin#api
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          return {
            entrypoints: entrypoints.main.filter(name => !name.endsWith('.map')),
            files: files.reduce((manifest, file) => {
              manifest[file.name] = file.path;
              return manifest;
            }, seed),
          };
        },
      }),
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW
      isProd && fs.existsSync(paths.swSrc) && new WorkboxWebpackPlugin.InjectManifest({
        swSrc: paths.swSrc,
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      }),
      // https://docs.bugsnag.com/build-integrations/webpack/#build-reporter
      isProd && hasBugSnag && new BugsnagBuildReporterPlugin({
        apiKey: process.env.BUGSNAG_API_KEY,
        appVersion: process.env.APP_VERSION,
        releaseStage: process.env.APP_STAGE,
      }),
      // https://docs.bugsnag.com/build-integrations/webpack/#source-map-uploader
      isProd && hasBugSnag && hasSourceMap && new BugsnagSourceMapUploaderPlugin({
        apiKey: process.env.BUGSNAG_API_KEY,
        appVersion: process.env.APP_VERSION,
        publicPath: paths.publicUrlOrPath,
        overwrite: true,
      }),
      // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options
      new ForkTsCheckerWebpackPlugin({
        async: isDev,
        tsconfig: paths.appTsConfig,
        formatter: isProd ? typescriptFormatter : undefined,
        typescript: resolve.sync('typescript', {basedir: paths.appNodeModules}),
        resolveTypeReferenceDirectiveModule: process.versions.pnp ? `${__dirname}/pnp.js` : undefined,
        resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnp.js` : undefined,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        silent: true,
        reportFiles: [
          '../**/src/**/*.{ts,tsx}',
          '**/src/**/*.{ts,tsx}',
          '!**/src/**/__tests__/**',
          '!**/src/**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
        ],
      }),
    ].filter(Boolean),
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
