import {build, emptyDir} from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir('./npm');

await build({
  entryPoints: ['mod.ts'],
  outDir: './npm',
  test: false,
  typeCheck: false,
  skipSourceOutput: true,
  packageManager: 'pnpm',
  shims: {
    deno: true,
  },
  package: {
    name: 'ult',
    author: 'KATTAX',
    version: Deno.args[0],
    description: 'The Ultimate App Dev Kit',
    homepage: 'https://ult.dev',
    license: 'MIT',
    keywords: [
      'web',
      'android',
      'windows',
      'macos',
      'ios',
      'react',
      'react-native',
      'cross-platform',
      'dev',
      'kit',
      'stack',
    ],
    bin: {
      ult: './script/bin/ult.js'
    },
    repository: {
      type: 'git',
      url: 'https://github.com/kat-tax/ult.git'
    },
    bugs: {
      url: 'https://github.com/kat-tax/ult/issues'
    }
  },
  postBuild() {
    Deno.copyFileSync('LICENSE', 'npm/LICENSE');
    Deno.copyFileSync('README.md', 'npm/README.md');
  },
});
