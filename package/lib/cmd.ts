// Run a "npx" command from npm
export async function npx(args: string[], cwd: string, inherit: boolean) {
  const cmd = Deno.build.os === 'windows' ? 'npx.cmd' : 'npx';
  args.unshift('--no-install');
  return await run(cmd, args, cwd, inherit);
}

// Run a "dlx" command with the preferred package manager
export async function dlx(args: string[], cwd?: string, inherit?: boolean) {
  const [program, arg] = getExecCommand().split(' ');
  if (arg) args.unshift(arg);
  const cmd = Deno.build.os === 'windows' ? `${program}.cmd` : program;
  return await run(cmd, args, cwd, inherit);
}

// Run any command
export async function run(cmd: string, args: string[], cwd?: string, inherit?: boolean) {
  const options = {cmd: [cmd, ...args], cwd, stdio: inherit ? 'inherit' : undefined};
  const process = Deno.run(options);
  return await process.status();
}

// Get the execution command based on package manager
export function getExecCommand() {
  switch (getPackageManager()) {
    case 'pnpm':
      return 'pnpm dlx';
    case 'yarn':
      return 'yarn dlx';
    default:
      return 'npx';
  }
}

// Get the run command based on package manager
export function getRunCommand() {
  switch (getPackageManager()) {
    case 'pnpm':
      return 'pnpm';
    case 'yarn':
      return 'yarn';
    default:
      return 'npm run';
  }
}

// Get the preferred packaged manager
export function getPackageManager() {
  //const ua = Deno.env.get('npm_config_user_agent');
  const ua = '';
  if (ua) {
    if (/yarn/i.test(ua)) {
      return 'yarn';
    } else if (/pnpm/i.test(ua)) {
      return 'pnpm';
    } else {
      return 'npm';
    }
  }
  return 'npm';
}
