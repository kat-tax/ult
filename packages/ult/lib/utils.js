const spawn = require('child_process').spawn;
const path = require('path');
const replace = require('replace-in-file');

function npx(args, cwd) {
  return new Promise((resolve, reject) => {
    spawn(process.platform === 'win32'
      ? 'npx.cmd'
      : 'npx', args, {cwd})
      .once('exit', e => (e === 0
        ? resolve()
        : reject(e))
      );
  });
};

async function patch(name) {
  const base = path.resolve(process.cwd(), name.toLowerCase());
  await replace({
    from: `MainComponentName(L"${name}");`,
    to: 'MainComponentName(L"RXApp");',
    files: [
      `${base}/windows/${name}/App.cpp`,
    ],
  });
  await replace({
    from: `moduleName:@"${name}"`,
    to: 'moduleName:@"RXApp"',
    files: [
      `${base}/macos/${name}-iOS/AppDelegate.m`,
      `${base}/macos/${name}-macOS/ViewController.m`,
    ],
  });
};


module.exports = {npx, patch};
