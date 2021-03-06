// Imports
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const resolve = require('resolve');

// React Dev Utils
const getCacheIdentifier = require('ult-dev-utils/getCacheIdentifier');
const typescriptFormatter = require('ult-dev-utils/typescriptFormatter');
const InterpolateHtmlPlugin = require('ult-dev-utils/InterpolateHtmlPlugin');
const ForkTsCheckerWebpackPlugin = require('ult-dev-utils/ForkTsCheckerWebpackPlugin');
const WatchMissingNodeModulesPlugin = require('ult-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleNotFoundPlugin = require('ult-dev-utils/ModuleNotFoundPlugin');
const ModuleScopePlugin = require('ult-dev-utils/ModuleScopePlugin');
const webpackDevClientEntry = require.resolve('ult-dev-utils/webpackHotDevClient');
const reactRefreshOverlayEntry = require.resolve('ult-dev-utils/refreshOverlayInterop');

// Plugins
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const {BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin} = require('webpack-bugsnag-plugins');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Helpers
const getClientEnvironment = require('../lib/env');
const modules = require('../lib/modules');
const paths = require('./paths');
const app = require(paths.appPackageJson);
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true')
    return false;
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// Config
module.exports = function(webpackEnv) {
  const isDev = webpackEnv === 'development';
  const isProd = webpackEnv === 'production';
  const isProdProfile = isProd && process.argv.includes('--profile');
  const clientEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  const hasSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  const hasBugsnagReporting = !!process.env.BUGSNAG_API_KEY;
  const hasFastRefresh = clientEnv.raw.FAST_REFRESH;
  const hasDisabledESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
  const hasDisabledESLintWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

  const cacheIdentifier = getCacheIdentifier(
    isProd ? 'production' : isDev && 'development', [
      'babel-preset-ult-app',
      'ult-dev-utils',
      'ult-scripts',
    ]
  );

  return {
    // https://webpack.js.org/configuration/#options
    mode: isProd ? 'production' : isDev && 'development',
    entry: isDev && !hasFastRefresh
      ? [
        webpackDevClientEntry,
        paths.appIndexJs,
      ]
      : paths.appIndexJs,
    devtool: isProd
      ? hasSourceMap
        ? 'source-map'
        : false
      : isDev && 'cheap-module-source-map',
    performance: false,
    bail: isProd,
    output: {
      globalObject: 'this',
      futureEmitAssets: true,
      jsonpFunction: `webpackJsonp${app.name}`,
      path: isProd ? paths.appBuild : undefined,
      publicPath: paths.publicUrlOrPath,
      pathinfo: isDev,
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
          terserOptions: {
            sourceMap: hasSourceMap,
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
        // React Native Web support
        'react-native$': 'react-native-web',
        // Alias popular RNW packages
        'react-native-svg': 'react-native-svg-web',
        'react-native-maps': 'react-native-web-maps',
        'react-native-webview': 'react-native-web-webview',
        'lottie-react-native': 'react-native-web-lottie',
        'recyclerlistview': 'recyclerlistview/web',
        // WDYR profiling
        'react-redux': isDev ? 'react-redux/lib' : 'react-redux',
        // ReactDevTools profiling
        ...(isProdProfile && {
          'react-dom$': 'react-dom/profiling',
          'scheduler/tracing': 'scheduler/tracing-profiling',
        }),
        ...(modules.webpackAliases || {}),
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          reactRefreshOverlayEntry,
        ]),
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
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: [
                paths.appSrc,
                paths.appPkgVectorIcons,
                paths.appPkgGestureHandler,
                paths.appPkgReanimated,
              ],
              loader: require.resolve('babel-loader'),
              options: {
                cacheIdentifier,
                compact: isProd,
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: false,
                customize: require.resolve('babel-preset-ult-app/webpack-overrides'),
                presets: [
                  [
                    require.resolve('babel-preset-ult-app'), {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],
                plugins: [
                  isDev && hasFastRefresh && require.resolve('react-refresh/babel'),
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
                presets: [[require.resolve('babel-preset-ult-app/dependencies'), {helpers: true}]],
              },
            },
            // https://github.com/oblador/react-native-vector-icons#web-with-webpack
            {
              test: /\.ttf$/,
              loader: require.resolve('file-loader'),
              include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
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
      isDev && hasFastRefresh && new ReactRefreshWebpackPlugin({
        overlay: {
          entry: webpackDevClientEntry,
          module: reactRefreshOverlayEntry,
          sockIntegration: false,
        },
      }),
      // https://github.com/danethurber/webpack-manifest-plugin#api
      new WebpackManifestPlugin({
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
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
      // https://docs.bugsnag.com/build-integrations/webpack/#build-reporter
      isProd && hasBugsnagReporting && new BugsnagBuildReporterPlugin({
        apiKey: process.env.BUGSNAG_API_KEY,
        appVersion: process.env.APP_VERSION,
        releaseStage: process.env.APP_STAGE,
      }),
      // https://docs.bugsnag.com/build-integrations/webpack/#source-map-uploader
      isProd && hasBugsnagReporting && hasSourceMap && new BugsnagSourceMapUploaderPlugin({
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
          '!**/src/setupTests.*',
        ],
      }),
      // https://webpack.js.org/plugins/eslint-webpack-plugin/#options
      !hasDisabledESLintPlugin && new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('ult-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: !(isDev && hasDisabledESLintWarnings),
        context: paths.appSrc,
        cache: true,
        cacheLocation: path.resolve(
          paths.appNodeModules,
          '.cache/.eslintcache'
        ),
        cwd: paths.appPath,
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {
            ...(!hasJsxRuntime && {
              'react/react-in-jsx-scope': 'error',
            }),
          },
        },
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
