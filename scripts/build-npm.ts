import { build, emptyDir } from 'https://deno.land/x/dnt@0.40.0/mod.ts';

const SRC_PATH = './src';
const NPM_BUILD_PATH = './npm';

await emptyDir(NPM_BUILD_PATH);

await build({
  entryPoints: [`${SRC_PATH}/mod.ts`],
  outDir: NPM_BUILD_PATH,
  typeCheck: false,
  compilerOptions: {
    target: 'Latest',
  },
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@infomaniak/api-client",
    version: Deno.args[0],
    description: 'Infomaniak Node and Deno API Library',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/Infomaniak/api-client',
    },
    bugs: {
      url: 'https://github.com/Infomaniak/api-client/issues',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', `${NPM_BUILD_PATH}/LICENSE`);
    Deno.copyFileSync('README.md', `${NPM_BUILD_PATH}/README.md`);
  },
});
