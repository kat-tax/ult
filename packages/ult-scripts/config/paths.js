
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

const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

module.exports = {
  publicUrlOrPath,
  appSrc: resolveApp('src'),
  appHtml: resolveApp('web/index.html'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('web'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appTypeDeclarations: resolveApp('src/ult-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/ult-app.d.ts'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('node_modules'),
  appPackageJson: resolveApp('package.json'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  dotenv: resolveApp('.env'),
  ownPath: resolveOwn('.'),
  appPath: resolveApp('.'),
  moduleFileExtensions: moduleFileExtensions,
};
