const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = [
  'js',
  'web.js',
  'jsx',
  'web.jsx',
  'ts',
  'web.ts',
  'tsx',
  'web.tsx',
  'json',
];

const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveModule = (resolve, path) => {
  const extension = moduleFileExtensions.find(ext => fs.existsSync(resolve(`${path}.${ext}`)));
  if (extension) return resolve(`${path}.${extension}`);
  return resolve(`${path}.js`);
};

module.exports = {
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('web'),
  appHtml: resolveApp('web/index.html'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  appPkgVectorIcons: resolveApp('node_modules/react-native-vector-icons'),
  appPkgGestureHandler: resolveApp('node_modules/react-native-gesture-handler'),
  appPkgReanimated: resolveApp('node_modules/react-native-reanimated'),
  appPkgReanimatedArc: resolveApp('node_modules/@callstack/reanimated-arc'),
  appPkgCircularProgress: resolveApp('node_modules/react-native-circular-progress'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  proxySetup: resolveApp('src/setupProxy.js'),
  yarnLockFile: resolveApp('yarn.lock'),
  dotenv: resolveApp('.env'),
  moduleFileExtensions: moduleFileExtensions,
  publicUrlOrPath: getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    require(resolveApp('package.json')).homepage,
    process.env.PUBLIC_URL
  ),
};
