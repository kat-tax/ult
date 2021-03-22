const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const pkgUp = require('pkg-up');
const prompts = require('prompts');
const browserslist = require('browserslist');

const defaultBrowsers = {
  production: ['>0.2%', 'not dead', 'not op_mini all'],
  development: [
    'last 1 chrome version',
    'last 1 firefox version',
    'last 1 safari version',
  ],
};

function shouldSetBrowsers(isInteractive) {
  if (!isInteractive)
    return Promise.resolve(true);
  const question = {
    type: 'confirm',
    name: 'shouldSetBrowsers',
    message:
      chalk.yellow("We're unable to detect target browsers.") +
      `\n\nWould you like to add the defaults to your ${chalk.bold(
        'package.json'
      )}?`,
    initial: true,
  };
  return prompts(question).then(answer => answer.shouldSetBrowsers);
}

function checkBrowsers(dir, isInteractive, retry = true) {
  const current = browserslist.loadConfig({ path: dir });
  if (current != null)
    return Promise.resolve(current);
  if (!retry) {
    return Promise.reject(
      new Error(
        `Please add a ${chalk.underline(
          'browserslist'
        )} key to your ${chalk.bold('package.json')}.`
      )
    );
  }
  return shouldSetBrowsers(isInteractive).then(shouldSetBrowsers => {
    if (!shouldSetBrowsers)
      return checkBrowsers(dir, isInteractive, false);
    return (
      pkgUp({ cwd: dir })
        .then(filePath => {
          if (filePath == null)
            return Promise.reject();
          const pkg = JSON.parse(fs.readFileSync(filePath));
          pkg['browserslist'] = defaultBrowsers;
          fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + os.EOL);
          browserslist.clearCaches();
          console.log();
          console.log(
            `${chalk.green('Set target browsers:')} ${chalk.cyan(
              defaultBrowsers.join(', ')
            )}`
          );
          console.log();
        })
        // Swallow any error
        .catch(() => {})
        .then(() => checkBrowsers(dir, isInteractive, false))
    );
  });
}

module.exports = {defaultBrowsers, checkBrowsers};
