#!/usr/bin/env node

const spawn = require('react-dev-utils/crossSpawn');
const args = process.argv.slice(2);
const index = args.findIndex(x => x === 'build' || x === 'start');
const script = index === -1 ? args[0] : args[index];

process.on('unhandledRejection', err => {throw err});

if (['build', 'start'].includes(script)) {
  const result = spawn.sync('node', index > 0 ? args.slice(0, index) : []
    .concat(require.resolve('../scripts/' + script))
    .concat(args.slice(index + 1)), {stdio: 'inherit'});
  if (result.signal) {
    if (result.signal === 'SIGKILL' || result.signal === 'SIGTERM')
      console.log('The build failed because the process exited too early.');
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log(`Unknown script "${script}". Perhaps you need to update ULT?`);
  console.log('For more details, visit https://docs.ult.dev');
}
