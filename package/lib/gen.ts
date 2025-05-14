import CodeBlockWriter from "https://deno.land/x/code_block_writer@12.0.0/mod.ts";
import * as path from "https://deno.land/std@0.194.0/path/mod.ts";

export function project(cwd: string, name: string, team: string) {
  Deno.mkdirSync(cwd);
  Deno.writeTextFileSync(path.resolve(cwd, 'pnpm-workspace.yaml'), `packages:\n  - 'packages/**'`);
  Deno.writeTextFileSync(path.resolve(cwd, 'package.json'), JSON.stringify({
    "private": true,
    "name": `@${team.toLowerCase()}/${name.toLowerCase()}`,
    "scripts": {
      "dev": "turbo dev",
      "lint": "turbo lint",
      "test": "turbo test",
      "build": "turbo build",
      "build:app": "turbo build --filter=\"...{./packages/app}\"",
      "build:api": "turbo build --filter=\"...{./packages/api}\""
    },
    "devDependencies": {
      "turbo": "^1.10.7",
      "typescript": "^4.9.5"
    },
  }, null, 2));
  Deno.writeTextFileSync(path.resolve(cwd, 'turbo.json'), JSON.stringify({
    "$schema": "https://turborepo.org/schema.json",
    "pipeline": {
      "lint": {
        "outputs": []
      },
      "test": {
        "dependsOn": ["build"],
        "inputs": ["**/*.{ts,tsx,js,jsx}"]
      },
      "build": {
        "dependsOn": ["^build"],
        "outputs": [
          ".next/**",
          "build/**",
          "node_modules/.cache/metro/**"
        ]
      },
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }, null, 2));
}

export function database(cwd: string, name: string, team: string, flavor: string) {
  const _ = writer();
  _.write(`class MyClass extends OtherClass`).block(() => {
    _.writeLine(`@MyDecorator(1, 2)`);
    _.write(`myMethod(myParam: any)`).block(() => {
      _.write(`return this.post(`).quote(`myArgument`).write(`);`);
    });
  });
  Deno.writeTextFileSync(path.resolve(cwd, `${name}.ts`), `${_}\n`);
}

export function components(cwd: string, _team: string) {
  Deno.mkdirSync(path.resolve(cwd, 'packages', 'components'), {recursive: true});
}

export function utils(cwd: string, _team: string) {
  Deno.mkdirSync(path.resolve(cwd, 'packages', 'utils'), {recursive: true});
}

function writer() {
  return new CodeBlockWriter({
    indentNumberOfSpaces: 2,
    useSingleQuote: true,
    useTabs: false,
    newLine: '\r\n',
  });
}
