// Based on: https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js

// Imports
const webpack = require('webpack');
const resolve = require('resolve');
const fs = require('fs-extra');
const path = require('path');

// React Dev Utils
const InterpolateHtmlPlugin = require('ult-dev-utils/InterpolateHtmlPlugin');
const ModuleNotFoundPlugin = require('ult-dev-utils/ModuleNotFoundPlugin');
const ModuleScopePlugin = require('ult-dev-utils/ModuleScopePlugin');
const getCacheIdentifier = require('ult-dev-utils/getCacheIdentifier');
const ForkTsCheckerWebpackPlugin = process.env.TSC_COMPILE_ON_ERROR === 'true'
  ? require('ult-dev-utils/ForkTsCheckerWarningWebpackPlugin')
  : require('ult-dev-utils/ForkTsCheckerWebpackPlugin');

// Plugins
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin} = require('webpack-bugsnag-plugins');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Runtime
const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
const reactRefreshWebpackPlugin = require.resolve('@pmmmwh/react-refresh-webpack-plugin');
const babelRuntimeEntryHelpers = require.resolve('@babel/runtime/helpers/esm/assertThisInitialized');
const babelRuntimeRegenerator = require.resolve('@babel/runtime/regenerator');
const babelRuntimeEntry = require.resolve('babel-preset-ult-app');

// Helpers
const createEnvironmentHash = require('../lib/createEnvironmentHash');
const getClientEnvironment = require('../lib/getClientEnvironment');
const modules = require('../lib/modules');
const paths = require('./paths');
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
    entry: paths.appIndexJs,
    target: ['browserslist'],
    performance: false,
    bail: isProd,
    mode: isProd
      ? 'production'
      : isDev && 'development',
    devtool: isProd
      ? hasSourceMap ? 'source-map' : false
      : isDev && 'cheap-module-source-map',
    output: {
      path: paths.appBuild,
      publicPath: paths.publicUrlOrPath,
      pathinfo: isDev,
      filename: isProd
        ? 'static/js/[name].[contenthash:8].js'
        : isDev && 'static/js/bundle.js',
      chunkFilename: isProd
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isDev && 'static/js/[name].chunk.js',
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      devtoolModuleFilenameTemplate: isProd
        ? info => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isDev && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
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
    cache: {
      store: 'pack',
      type: 'filesystem',
      version: createEnvironmentHash(clientEnv.raw),
      cacheDirectory: paths.appWebpackCache,
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [
          paths.appTsConfig,
          paths.appJsConfig,
        ].filter(f => fs.existsSync(f)),
      },
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
        new ModuleScopePlugin(paths.appSrc, [
          paths.appPackageJson,
          reactRefreshRuntimeEntry,
          reactRefreshWebpackPlugin,
          babelRuntimeEntry,
          babelRuntimeEntryHelpers,
          babelRuntimeRegenerator,
        ]),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
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
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // ** STOP ** Are you adding a new loader?
            // Make sure to add the new loader(s) before the above loader.
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
      // https://github.com/pmmmwh/react-refresh-webpack-plugin#options
      isDev && hasFastRefresh && new ReactRefreshWebpackPlugin({overlay: false}),
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
        typescript: {
          context: paths.appPath,
          mode: 'write-references',
          typescriptPath: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          diagnosticOptions: {
            syntactic: true,
          },
          configOverwrite: {
            compilerOptions: {
              tsBuildInfoFile: paths.appTsBuildInfoFile,
              sourceMap: isProd ? shouldUseSourceMap : isDev,
              inlineSourceMap: false,
              declarationMap: false,
              skipLibCheck: true,
              incremental: true,
              noEmit: true,
            },
          },
        },
        issue: {
          include: [
            {file: '../**/src/**/*.{ts,tsx}'},
            {file: '**/src/**/*.{ts,tsx}'},
          ],
          exclude: [
            {file: '**/src/**/__tests__/**'},
            {file: '**/src/**/?(*.){spec|test}.*'},
            {file: '**/src/setupProxy.*'},
            {file: '**/src/setupTests.*'},
          ],
        },
        logger: {
          infrastructure: 'silent',
        },
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
  };
};
