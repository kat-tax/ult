const path = require('path');
const replace = require('replace-in-file');
const spawn = require('child_process').spawn;
const event = (a,b) => e => e === 0 ? a() : b(e);

// Helper to run the "npx" cli tool
function npx(args, cwd) {
  const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return new Promise((res, rej) => {
    spawn(cmd, args, {cwd}).once('exit', event(res, rej));
  });
};

// Helper to run the "pod" cli tool
function pod(name) {
  const cwd = path.resolve(process.cwd(), name.toLowerCase(), 'ios');
  return new Promise((res, rej) => {
    spawn('pod', ['install'], {cwd}).once('exit', event(res, rej));
  });
};

// Patches Windows & MacOS main component names
async function patch(name) {
  const cwd = path.resolve(process.cwd(), name.toLowerCase());
  await replace({
    from: `MainComponentName(L"${name}");`,
    to: 'MainComponentName(L"RXApp");',
    files: [
      `${cwd}/windows/${name}/App.cpp`,
    ],
  });
  await replace({
    from: `moduleName:@"${name}"`,
    to: 'moduleName:@"RXApp"',
    files: [
      `${cwd}/macos/${name}-iOS/AppDelegate.m`,
      `${cwd}/macos/${name}-macOS/ViewController.m`,
    ],
  });
};

module.exports = {npx, pod, patch};
