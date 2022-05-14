const fs = require('fs');
const path = require('path');

// React Dev Utils
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const appDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = [
  'web.ts',
  'web.tsx',
  'web.js',
  'web.jsx',
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
];

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
  appPublic: resolveApp('web'),
  appBuild: resolveApp('build/web'),
  appHtml: resolveApp('web/index.html'),
  appPackageJson: resolveApp('package.json'),
  appWebpackConfig: resolveApp('webpack.config.js'),
  appTypescriptConfig: resolveApp('tsconfig.json'),
  appNodeModules: resolveApp('node_modules'),
  appWebpackCache: resolveApp('node_modules/.cache'),
  appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
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
