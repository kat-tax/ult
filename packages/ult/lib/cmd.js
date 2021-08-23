const path = require('path');
const spawn = require('child_process').spawn;
const exit = (c,s,f) => e => e === 0 ? s() : f(`${c}: code ${e}`);

// Run the "npx" cli tool
function npx(args, cwd, inherit) {
  const program = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const command = `npx ${args[0]}`;
  return cmd(program, command, cwd, inherit);
};

// Run the "pod" cli tool
function pod(project) {
  const program = 'pod';
  const command = command;
  const cwd = path.resolve(process.cwd(), project.toLowerCase(), 'ios');
  return cmd(program, command, cwd);
};

// Run any command
function cmd(program, command, directory, inherit) {
  return new Promise((res, rej) => {
    spawn(program, ['install'], {
      cwd: directory,
      stdio: inherit ? 'inherit' : undefined,
    }).once('exit', exit(command, res, rej));
  });
}

module.exports = {npx, pod};
