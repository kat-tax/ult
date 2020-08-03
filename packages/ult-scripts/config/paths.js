const fs = require('fs');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json'];

const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);
const resolveModule = (resolve, path) => {
  const extension = moduleFileExtensions.find(ext => fs.existsSync(resolve(`${path}.${ext}`)));
  if (extension) return resolve(`${path}.${extension}`);
  return resolve(`${path}.js`);
};

module.exports = {
  ownPath: resolveOwn('.'),
  appPath: resolveApp('.'),
  appSrc: resolveApp('src'),
  dotenv: resolveApp('.env'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('web'),
  appHtml: resolveApp('web/index.html'),
  yarnLockFile: resolveApp('yarn.lock'),
  appTsConfig: resolveApp('tsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('node_modules'),
  ownTypeDeclarations: resolveOwn('lib/ult-app.d.ts'),
  appTypeDeclarations: resolveApp('src/ult-app-env.d.ts'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  proxySetup: resolveApp('src/setupProxy.js'),
  moduleFileExtensions: moduleFileExtensions,
  publicUrlOrPath: getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    require(resolveApp('package.json')).homepage,
    process.env.PUBLIC_URL
  ),
};
