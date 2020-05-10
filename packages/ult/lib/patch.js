const path = require('path');
const replace = require('replace-in-file');

module.exports = async (name, _template) => {
  const root = path.resolve(process.cwd(), name.toLowerCase());
  await replace({
    to: 'MainComponentName(L"RXApp");',
    from: `MainComponentName(L"${name}");`,
    files: [
      `${root}/windows/${name}/App.cpp`,
    ],
  });
  await replace({
    to: 'moduleName:@"RXApp"',
    from: `moduleName:@"${name}"`,
    files: [
      `${root}/macos/${name}-iOS/AppDelegate.m`,
      `${root}/macos/${name}-macOS/ViewController.m`,
    ],
  });
};
