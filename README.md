# check-runtime-env / check-runtime-env.js

  [![NPM Version](https://img.shields.io/npm/v/check-runtime-env.svg?style=flat)](https://npmjs.org/package/check-runtime-env/)
  [![NPM Downloads](https://img.shields.io/npm/dm/check-runtime-env.svg?style=flat)](https://npmjs.org/package/check-runtime-env/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/check-runtime-env.js/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/check-runtime-env.js/?branch=master)
  [![dependencies Status](https://david-dm.org/smartiniOnGitHub/check-runtime-env.js/status.svg)](https://david-dm.org/smartiniOnGitHub/check-runtime-env.js)
  [![devDependencies Status](https://david-dm.org/smartiniOnGitHub/check-runtime-env.js/dev-status.svg)](https://david-dm.org/smartiniOnGitHub/check-runtime-env.js?type=dev)
  [![license - APACHE-2.0](https://img.shields.io/npm/l/check-runtime-env.svg)](http://opensource.org/licenses/APACHE-2.0)

Node.js implementation of a checker for some runtime environment properties.

The purpose of this library is to simplify some check in the environment where 
the code is running (at runtime).


## Usage

Get a reference to the library:

```js
// Node.js example
const assert = require('assert')

// reference the library, not needed if using destructuring assignment, see below
const RuntimeEnvChecker = require('../src/') // from local path
assert(RuntimeEnvChecker !== null)
```

get some runtime data and version constraints, optional:

```js
const nodeVersion = process.version
assert(nodeVersion !== null)
const npmVersion = RuntimeEnvChecker.getVersionOfNpm()
assert(npmVersion !== null)
const engines = require('../package.json').engines
assert(engines !== null)
const expectedNodeVersion = engines.node
assert(expectedNodeVersion !== null)
const expectedNPMVersion = engines.npm
assert(expectedNPMVersion !== null)

console.log(`Node.js current version: ${nodeVersion}`)
console.log(`Node.js version expected in 'package.json': ${engines.node}`)
console.log(`NPM current version: ${npmVersion}`)
console.log(`NPM version expected in 'package.json': ${engines.npm}`)
```

call some static method exposed by the class:

```js
console.log(`Doing some tests; note that a check not satisfied will throw Error ...`)
console.log(`Check version of Node, using defaults, success: ${RuntimeEnvChecker.checkVersionOfNode()}`)
console.log(`Check version of Node, using explicit values, success: ${RuntimeEnvChecker.checkVersionOfNode(nodeVersion, expectedNodeVersion)}`)
console.log(`Check version of NPM, using NPM release found, and NPM expected value implicit, success: ${RuntimeEnvChecker.checkVersionOfNpm(npmVersion)}`)
console.log(`Check version of NPM, using explicit values, success: ${RuntimeEnvChecker.checkVersionOfNpm(npmVersion, expectedNPMVersion)}`)
console.log(`Check version (generic), using explicit values, success: ${RuntimeEnvChecker.checkVersion('10.13.0', '>=8.9.0 <12.0.0')}`)
try {
  console.log(`Sample failure in check version (generic): expected error`)
  console.log(`Check version (generic), using explicit values, success: ${RuntimeEnvChecker.checkVersion('10.13.0', '>=12.0.0')}`)
} catch (e) {
  console.log(e)
}
console.log(`Tell the given version '10.13.0', if it's compatible with the constraint '>=12.0.0': ${RuntimeEnvChecker.isVersionCompatible('10.13.0', '>=12.0.0')}, but anyway no error raised here`)

console.log(`Check that the given string is not empty (generic), success: ${RuntimeEnvChecker.checkStringNotEmpty('10.13.0')}`)
console.log(`Node.js environment is: '${process.env.NODE_ENV}'`)
console.log(`Node.js environment from the library is: '${RuntimeEnvChecker.getNodeEnv()}'`)
console.log(`Node.js environment is defined: ${RuntimeEnvChecker.isEnvVarDefined('NODE_ENV')}`)
console.log(`Node.js environment is production: ${RuntimeEnvChecker.isNodeEnvProduction()}`)
// console.log(`Check that Node.js environment is production: ${RuntimeEnvChecker.checkNodeEnvProduction()}`)

console.log(`No more tests.`)
```

Look into the [example](./example/) folder for more sample scripts that uses the library 
(inline but it's the same using it from npm registry).

A sample usage could be to check if current Node.js release satisfies 
the release wanted, and if not throw an Error (or instead log a Warning).


## Requirements

Node.js 8.9.0 or later; NPM 6.4.1 or later.


## Note

The library exposes some static methods useful at runtime; 
for example to check the given version, 
if it's compatible with an expected version, 
using the semver syntax for constraints.

Current Node.js version if read from the memory as a default value; 
NPM version must be retrieved by executing it, so if needed it has to be done 
by calling related method (could take some time).

The general behavior of check/checker methods here is to throw Error if the check 
does not pass (if it's false); or return true if successful, or even false

You can find Code Documentation for the API of the library [here](https://smartiniongithub.github.io/check-runtime-env.js/).

The package name is simplified into 'check-runtime-env', so it will be easier to get it at npm.

See the Semantic Versioning Specification at [semver](https://semver.org).

More features will be added later to the library.


## Contributing

1. Fork it ( https://github.com/smartiniOnGitHub/check-runtime-env.js/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request


## License

Licensed under [Apache-2.0](./LICENSE).

----
