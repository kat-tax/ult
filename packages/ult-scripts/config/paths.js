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

const getPublicUrlOrPath = require('ult-dev-utils/getPublicUrlOrPath');

const resolveApp = uri => path.resolve(appDirectory, uri);
const resolveModule = (resolve, uri) => {
  const extension = moduleFileExtensions.find(ext =>
    fs.existsSync(resolve(`${uri}.${ext}`)));
  if (extension) return resolve(`${uri}.${extension}`);
  return resolve(`${uri}.js`);
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
  appWebpackCache: resolveApp('node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
  appPkgGestureHandler: resolveApp('node_modules/react-native-gesture-handler'),
  appPkgReanimated: resolveApp('node_modules/react-native-reanimated'),
  appPkgVectorIcons: resolveApp('node_modules/react-native-vector-icons'),
  appTypeDeclarations: resolveApp('src/ult-app-env.d.ts'),
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
