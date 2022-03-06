#!/usr/bin/env node

const scripts = [
  'run-web',
  'build-web',
  'test-web',
];

// React Dev Utils
const spawn = require('react-dev-utils/crossSpawn');

// User Input
const args = process.argv.slice(2);
const index = args.findIndex(x => x === scripts[1] || x === scripts[0]);
const script = index === -1 ? args[0] : args[index];

// Run Script
if (scripts.includes(script)) {
  process.on('unhandledRejection', error => {throw error});
  const result = spawn.sync(process.execPath, index > 0 ? args.slice(0, index) : []
    .concat(require.resolve('../scripts/' + script))
    .concat(args.slice(index + 1)), {stdio: 'inherit'});
  if (result.signal) {
    if (result.signal === 'SIGKILL' || result.signal === 'SIGTERM')
      console.log('The script failed because the process exited too early.');
    process.exit(1);
  }
  process.exit(result.status);
} else {
  console.log(`Unknown script "${script}". Perhaps you need to update ULT?`);
  console.log('For more details, visit https://docs.ult.dev');
}
