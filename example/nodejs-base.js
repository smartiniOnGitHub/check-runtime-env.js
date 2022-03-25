/*
 * Copyright 2019-2022 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

/**
 * Sample Node.js script to show usage of CloudEvent library
 */

const assert = require('assert').strict

console.log('Sample script: start execution ...\n')

// reference the library, not needed if using destructuring assignment, see below
const RuntimeEnvChecker = require('../src/') // from local path
assert(RuntimeEnvChecker !== null)

// call some static method exposed by the class ...
console.log('\nCalling some RuntimeEnvChecker static methods, and related diagnostics:')

// get some runtime data and version constraints
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

console.log('Doing some tests; note that a check not satisfied will throw Error ...')
console.log(`Check version of Node, using defaults, success: ${RuntimeEnvChecker.checkVersionOfNode()}`)
console.log(`Check version of Node, using explicit values, success: ${RuntimeEnvChecker.checkVersionOfNode(nodeVersion, expectedNodeVersion)}`)
console.log(`Check version of NPM, using NPM release found, and NPM expected value implicit, success: ${RuntimeEnvChecker.checkVersionOfNpm(npmVersion)}`)
console.log(`Check version of NPM, using explicit values, success: ${RuntimeEnvChecker.checkVersionOfNpm(npmVersion, expectedNPMVersion)}`)
console.log(`Check version (generic), using explicit values, success: ${RuntimeEnvChecker.checkVersion('10.13.0', '>=8.9.0 <12.0.0')}`)
try {
  console.log('Sample failure in check version (generic): expected error')
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

console.log('No more tests.')

console.log('\nSample script: end execution.')
assert(true) // all good here
// end of script
