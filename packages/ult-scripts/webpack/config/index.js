const fs = require('fs-extra');
const path = require('path');
const {merge} = require('webpack-merge');
const webpack = require('webpack');
const resolve = require('resolve');

// React Dev Utils
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ForkTsCheckerWebpackPlugin = process.env.TSC_COMPILE_ON_ERROR === 'true'
  ? require('react-dev-utils/ForkTsCheckerWarningWebpackPlugin')
  : require('react-dev-utils/ForkTsCheckerWebpackPlugin');

// Plugins
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Runtime
const babelRuntimeEntry = require.resolve('babel-preset-react-app');
const babelRuntimeRegenerator = require.resolve('@babel/runtime/regenerator', {paths: [babelRuntimeEntry]});
const babelRuntimeEntryHelpers = require.resolve('@babel/runtime/helpers/esm/assertThisInitialized', {paths: [babelRuntimeEntry]});
const reactRefreshWebpackPlugin = require.resolve('@pmmmwh/react-refresh-webpack-plugin');
const reactRefreshRuntimeEntry = require.resolve('react-refresh/runtime');
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

// Environment
const createEnvironmentHash = require('../../lib/createEnvironmentHash');
const getClientEnvironment = require('../../lib/getClientEnvironment');
const modules = require('../modules');
const paths = require('../paths');

// Config
module.exports = function(env) {
  const isDev = env === 'development';
  const isProd = env === 'production';
  const clientEnv = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));
  const hasSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
  const hasDisabledESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
  const hasDisabledESLintWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';
  const cacheIdentifier = getCacheIdentifier(
    isProd ? 'production' : isDev && 'development', [
      'babel-preset-react-app',
      'react-dev-utils',
      'ult-scripts',
    ]
  );

  const custom = fs.existsSync(paths.appWebpackConfig)
    ? require(paths.appWebpackConfig)
    : {};

  const environment = isDev
    ? require('./development')
    : require('./production');

  const common = {
    entry: [paths.appIndexJs],
    target: ['browserslist'],
    stats: 'errors-warnings',
    output: {
      path: paths.appBuild,
      publicPath: paths.publicUrlOrPath,
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
          paths.appTypescriptConfig,
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
        'react-native-maps': 'react-native-web-maps',
        'react-native-webview': 'react-native-web-webview',
        'lottie-react-native': 'react-native-web-lottie',
        'recyclerlistview': 'recyclerlistview/web',
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
        hasSourceMap && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(ts|tsx|js|jsx|mjs|cjs|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          oneOf: [
            // Support importing SVGs
            // https://react-svgr.com/docs/webpack/
            {
              test: /\.svg$/,
              use: [
                {
                  loader: require.resolve('@svgr/webpack'),
                  options: {
                    ref: true,
                    titleProp: true,
                    prettier: false,
                    svgo: false,
                    svgoConfig: {
                      plugins: [{removeViewBox: false}],
                    },
                  },
                },
                {
                  loader: require.resolve('file-loader'),
                  options: {
                    name: 'static/media/[name].[hash].[ext]',
                  },
                },
              ],
              issuer: {
                and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
            // Support React Native Vector Icons
            // https://github.com/oblador/react-native-vector-icons#web-with-webpack
            {
              test: /\.ttf$/,
              loader: require.resolve('file-loader'),
              include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
            },
            // Support React Native Web Webview
            // https://github.com/react-native-web-community/react-native-web-webview#getting-started
            {
              test: /postMock.html$/,
              use: {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                },
              }
            },
            // Support React Native uncompiled libraries
            // https://github.com/babel/babel/discussions/11694#discussioncomment-84474
            {
              test: /(@?react-(navigation|native)).*\.(ts|js)x?$/,
              exclude: [/react-native-web/, /\.(native|ios|android)\.(ts|js)x?$/],
              loader: require.resolve('babel-loader'),
              options: {
                cacheIdentifier,
                cacheDirectory: true,
                cacheCompression: false,
                sourceMaps: hasSourceMap,
                inputSourceMap: hasSourceMap,
                presets: [
                  [require.resolve('babel-preset-react-app/dependencies'), {helpers: true}],
                  ['babel-preset-react-app'],
                ],
              }
            },
            // Process application JS with Babel
            // The preset includes JSX, Flow, TypeScript, and some ESnext features
            {
              test: /\.(ts|tsx|js|jsx|mjs|cjs)$/,
              include: [
                paths.appSrc,
              ],
              loader: require.resolve('babel-loader'),
              options: {
                cacheIdentifier,
                compact: isProd,
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: false,
                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                presets: [
                  [
                    require.resolve('babel-preset-react-app'), {
                      runtime: hasJsxRuntime ? 'automatic' : 'classic',
                    },
                  ],
                ],
                plugins: [
                  isDev && require.resolve('react-refresh/babel'),
                  'react-native-web',
                ].filter(Boolean),
              },
            },
            // Process outside JS with Babel
            // Unlike the application JS, we only compile the standard ES features
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
            // This loader makes sure static assets get served by WebpackDevServer
            // When you `import` an asset, you get its (virtual) filename
            // In production, they would get copied to the `build` folder
            // This loader doesn't use "test" so it will catch all modules that fall through
            {
              exclude: [/^$/, /\.(ts|tsx|js|jsx|mjs|cjs)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
            // !!!!STOP!!!! Are you adding a new loader?
            // Make sure to add the new loader(s) before the loader above
            // You can also use webpack.config.js in your root to extend the default config
          ],
        },
      ],
    },
    plugins: [
      // Generates an `index.html` file with the <script> injected
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
      // Makes some environment variables available in index.html
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, clientEnv.raw),
      // This gives some necessary context to module not found errors
      new ModuleNotFoundPlugin(paths.appPath),
      // Makes some environment variables available to the JS code
      // It is essential that NODE_ENV is set to production for production builds
      // Otherwise React will be compiled in the very slow development mode
      new webpack.DefinePlugin(clientEnv.stringified),
      // Generate an asset manifest file for caching purposes
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
      // Prevent importing the React Native Reanimated package on web
      // this is due to it's large size and it's usually not needed on web
      new webpack.IgnorePlugin({
        resourceRegExp: /react-native-reanimated$/,
      }),
      // Type checking
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
              sourceMap: isProd ? hasSourceMap : isDev,
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
      // Source linting
      // https://webpack.js.org/plugins/eslint-webpack-plugin/#options
      !hasDisabledESLintPlugin && new ESLintPlugin({
        extensions: ['ts', 'tsx', 'js', 'jsx', 'mjs'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        failOnError: !(isDev && hasDisabledESLintWarnings),
        context: paths.appSrc,
        cwd: paths.appPath,
        cache: true,
        cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
        resolvePluginsRelativeTo: __dirname,
        baseConfig: {
          extends: [require.resolve('eslint-config-react-app/base')],
          rules: {...(!hasJsxRuntime && {'react/react-in-jsx-scope': 'error'})},
        },
      }),
    ].filter(Boolean),
    performance: false,
    infrastructureLogging: {
      level: 'none',
    },
  };

  return merge(common, environment, custom);
};
