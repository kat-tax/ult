const fs = require('fs');
const path = require('path');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json'];
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);
const resolveModule = (resolve, path) => {
  const extension = moduleFileExtensions.find(ext => fs.existsSync(resolve(`${path}.${ext}`)));
  if (extension) return resolve(`${path}.${extension}`);
  return resolve(`${path}.js`);
};

// We use `PUBLIC_URL` variable or "homepage" field to infer "public path"
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('web'),
  appHtml: resolveApp('web/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // this is empty on npm 3
  appTypeDeclarations: resolveApp('src/ult-app-env.d.ts'),
  ownTypeDeclarations: resolveOwn('lib/ult-app.d.ts'),
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
