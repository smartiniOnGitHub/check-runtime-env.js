/*
 * Copyright 2019-2023 the original author or authors.
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

const assert = require('assert').strict
const path = require('path')

const test = require('tap').test

const REC = require('../src/') // reference the library
assert(REC !== null)
assert.strictEqual(typeof REC, 'function')

const nodeVersion = process.version
assert(nodeVersion !== null)
const engines = require('../package.json').engines
assert(engines !== null)

/** @test {RuntimeEnvChecker} */
test('ensure objects exported by index script, exists and are of the right type', (t) => {
  t.comment('testing RuntimeEnvChecker class')

  t.ok(REC)
  t.equal(typeof REC, 'function')
  t.ok(engines)

  t.throws(function () {
    const rec = new REC()
    assert(rec === null) // never executed
  }, Error, 'Expected exception when creating a RuntimeEnvChecker instance')

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure process info returns right values', (t) => {
  t.comment('testing processInfo')
  const procInfo = REC.processInfo()
  t.ok(procInfo)
  t.equal(typeof procInfo, 'object')
  // but do not test too low level details for attributes inside procInfo
  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure version checks are done in the right way', (t) => {
  t.comment('testing version checks')

  {
    const comment = 'testing checkVersion'
    t.comment(comment)
    t.ok(!REC.isVersionCompatible('', ''))
    t.ok(REC.isVersionCompatible('10.13.0', '>=8.9.0'))
    t.ok(REC.isVersionCompatible('10.13.0', '>=8.9.0 <12.0.0'))
    t.strictSame(REC.isVersionCompatible('10.13.0', '>=99.9.9'), false)
    t.throws(function () {
      const check = REC.checkVersion()
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion(null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion(null, null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion('1.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion(1.0, '1.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion('1.0', 1.0)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersion('0.1.0', '1.0.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version that doesn\'t match')
    t.throws(function () {
      const check = REC.checkVersion('3.2.1', '>=1.0.0 <2.0.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version that doesn\'t match')
    t.ok(REC.checkVersion('1.0.0', '1.0.0'))
    t.ok(REC.checkVersion('1.2.3', '1.x'))
    t.ok(REC.checkVersion('1.2.9', '1.2.x'))
    t.ok(REC.checkVersion('1.2.9', '~1.2.5'))
    t.ok(REC.checkVersion('1.3.0', '^1.2.5'))
    t.ok(REC.checkVersion('1.9.9', '^1.2.5'))
    t.ok(REC.checkVersion('8.9.0', '>=8.9.0'))
    t.ok(REC.checkVersion('8.9.1', '>=8.9.0'))
    t.ok(REC.checkVersion('8.16.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0 <12.0.0'))
  }

  {
    const comment = 'testing checkVersionOfNode'
    t.comment(comment)
    t.comment(`Node.js current version: ${nodeVersion}`)
    t.comment(`Node.js version expected in 'package.json': ${engines.node}`)

    t.ok(REC.checkVersionOfNode()) // ok because of default values
    t.ok(REC.checkVersionOfNode('14.15.0')) // ok because of default values
    t.ok(REC.checkVersionOfNode(undefined)) // ok because of default values
    t.ok(REC.checkVersionOfNode(undefined, undefined)) // ok because of default values
    t.throws(function () {
      const check = REC.checkVersionOfNode(null, null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersionOfNode('14.15.0', null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersionOfNode(6.17, '>=8.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersionOfNode('6.17.0', '>=8.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.ok(REC.checkVersionOfNode('8.16.0', '8.16.0'))
    t.ok(REC.checkVersionOfNode('8.16.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0 <12.0.0'))
    t.ok(REC.checkVersion('14.15.0', engines.node))
    t.ok(REC.checkVersion('14.15.0', `${engines.node}`))
    t.equal(REC.checkVersionOfNode('14.15.0', engines.notExisting), true) // ok because of default values with a not existing expected value (undefined)
  }

  {
    const comment = 'testing getVersionOfNpm and checkVersionOfNpm'
    t.comment(comment)
    const npmVersion = REC.getVersionOfNpm()
    assert(npmVersion !== null)
    t.ok(npmVersion)
    t.comment(`NPM current version: ${npmVersion}`)
    t.comment(`NPM version expected in 'package.json': ${engines.npm}`)

    t.throws(function () {
      const check = REC.checkVersionOfNpm()
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm(null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm(undefined)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm(undefined, undefined)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm(null, null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm('6.4.1', null)
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm('6.4.0', '>=6.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm('6.4.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking npm version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionOfNpm('6.4.0', '>=6.4.1')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking npm version with wrong values')
    t.ok(REC.checkVersionOfNpm('6.8.0')) // ok because of default values
    t.ok(REC.checkVersionOfNpm('6.4.1', '>=6.4.1'))
  }

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure generic utility methods works in the right way', (t) => {
  t.comment('testing checkStringNotEmpty and other utility methods')
  t.throws(function () {
    const check = REC.checkStringNotEmpty()
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for not empty string with wrong arguments')
  t.throws(function () {
    const check = REC.checkStringNotEmpty(undefined)
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for not empty string with wrong arguments')
  t.throws(function () {
    const check = REC.checkStringNotEmpty(null)
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for not empty string with wrong arguments')
  t.throws(function () {
    const check = REC.checkStringNotEmpty('')
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for not empty string with wrong arguments')
  t.ok(REC.checkStringNotEmpty('1.0.0'))
  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure utility methods on env vars works in the right way', (t) => {
  t.comment('testing checkEnvVarDefined and related utility methods')
  t.comment(`Node.js environment is: '${process.env.NODE_ENV}'`)
  t.throws(function () {
    const check = REC.checkEnvVarDefined()
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for defined env var with wrong arguments')
  t.throws(function () {
    const check = REC.checkEnvVarDefined(undefined)
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for defined env var with wrong arguments')
  t.throws(function () {
    const check = REC.checkEnvVarDefined(null)
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for defined env var with wrong arguments')
  t.throws(function () {
    const check = REC.checkEnvVarDefined('')
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for defined env var with wrong arguments')
  t.throws(function () {
    const check = REC.checkEnvVarDefined('NOT_EXISTING')
    assert(check === false) // never executed
  }, Error, 'Expected exception when checking for defined env var with wrong arguments')

  // define a sample env var, then verify and check if it's defined
  const sampleEnvVarName = 'SAMPLE_ENV_VAR'
  process.env[sampleEnvVarName] = 'env var value'
  t.ok(REC.isEnvVarDefined(sampleEnvVarName))
  t.ok(REC.checkEnvVarDefined(sampleEnvVarName))
  delete process.env[sampleEnvVarName]
  t.notOk(REC.isEnvVarDefined(sampleEnvVarName))

  // NODE_ENV env var could be undefined, so I do the following test only when it's defined
  const nodeEnv = REC.getNodeEnv()
  const nodeEnvIsProduction = REC.isNodeEnvProduction()
  if (REC.isEnvVarDefined('NODE_ENV')) {
    t.ok(REC.checkEnvVarDefined('NODE_ENV'))
    switch (nodeEnv) {
      case 'production':
        t.ok(nodeEnv)
        t.ok(nodeEnvIsProduction)
        t.ok(REC.checkNodeEnvProduction())
        break
      default:
        t.ok(!nodeEnv)
        t.ok(!nodeEnvIsProduction)
        t.throws(function () {
          const check = REC.checkNodeEnvProduction()
          assert(check === false) // never executed
        }, Error, 'Expected exception when checking for defined env var with wrong arguments')
        break
    }
  } else {
    t.notOk(nodeEnv)
  }
  t.comment('testing checkEnvVarDefined and related utility methods finished\n\n\n') // workaround to have all comments visible
  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure some general check functions works in the right way', (t) => {
  t.comment('testing checkBoolean, for boolean values and conditions')

  t.throws(function () {
    const fu = REC.checkBoolean() // test for undefined
    assert(fu === false) // never executed
  }, Error, 'Expected exception when checking for a false value')
  t.throws(function () {
    const fnull = REC.checkBoolean(null) // test for null
    assert(fnull === false) // never executed
  }, Error, 'Expected exception when checking for a false value')

  const tn = REC.checkBoolean(1 + 1 === 2)
  t.ok(tn)
  t.equal(tn, true)
  t.throws(function () {
    const fn = REC.checkBoolean(1 + 1 === 1)
    assert(fn === false) // never executed
  }, Error, 'Expected exception when checking for a false value')

  const es = 'abc'
  const ts = REC.checkBoolean(es === 'abc')
  t.ok(ts)
  t.equal(ts, true)
  t.throws(function () {
    const fs = REC.checkBoolean(es !== 'abc', 'es')
    assert(fs === false) // never executed
  }, Error, 'Expected exception when checking for a false value')

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure number of cpu available (total) is managed in the right way', (t) => {
  t.comment('testing getAvailableCpu')

  const num = REC.getAvailableCpu()
  t.ok(num)
  t.equal(typeof num, 'number')
  t.ok(num >= 1) // expect at least 1 total cpu

  const tnum = REC.checkBoolean(num >= 1)
  t.ok(tnum)
  t.equal(tnum, true)
  t.throws(function () {
    // real-world example: throw if total number of available cpu is less than x ...
    const fnum = REC.checkBoolean(num < 65535) // where 2**16 = 65536
    assert(fnum === false) // never executed
  }, Error, 'Expected exception when checking for a false value')

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure numbers about memory (total, free) are managed in the right way', (t) => {
  t.comment('testing memoryInfo')

  const mem = REC.memoryInfo()
  t.ok(mem)
  t.equal(typeof mem.total, 'number')
  t.equal(typeof mem.free, 'number')
  t.ok(mem.total > 1048576) // very minimal example: expect at least 1 MB (1024**2) total memory
  // t.ok(mem.total > 1073741824) // example: expect at least 1 GB (1024**3) total memory

  const tmemTot = REC.checkBoolean(mem.total >= 1024 ** 2)
  // const tmemTot = REC.checkBoolean(mem.total >= 1024 ** 3)
  t.ok(tmemTot)
  t.equal(tmemTot, true)
  const tmemFree = REC.checkBoolean(mem.free >= (tmemTot * 0.01)) // very minimal example: expect at least 1% of total memory free
  // const tmemFree = REC.checkBoolean(mem.free >= (tmemTot * 0.1)) // example: expect at least 10% of total memory free
  t.ok(tmemFree)
  t.equal(tmemFree, true)

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure functions/checks on strict mode works in the right way', (t) => {
  t.comment('testing isStrictMode')

  const safe = REC.isStrictMode()
  t.ok(safe)
  t.equal(typeof safe, 'boolean')
  t.equal(safe, true)

  const ensureSafeMode = REC.checkBoolean(safe, 'safe')
  t.ok(ensureSafeMode)

  const checkSafeMode = REC.checkStrictMode()
  t.ok(checkSafeMode)

  t.end()
})

/** @test {RuntimeEnvChecker} */
test('ensure isESModule works in the right way', (t) => {
  t.comment('testing isESModule')

  t.throws(function () {
    const isMod = REC.isESModule()
    assert(isMod === true) // never executed, but false anyway
  }, Error, 'Expected exception when querying for ES Module but without specifying arguments')
  t.throws(function () {
    const ensureIsESMod = REC.checkESModule()
    assert(ensureIsESMod === true) // never executed, but false anyway
  }, Error, 'Expected exception when checking for ES Module but without specifying arguments')

  {
    const isMod = REC.isESModule(__filename)
    t.notOk(isMod)
    t.throws(function () {
      const ensureIsESMod = REC.checkESModule(__filename)
      assert(ensureIsESMod === true) // never executed, but false anyway
    }, Error, 'Expected exception when checking for ES Module on a non-esm source/folder')
  }

  {
    const isMod = REC.isESModule(null, __dirname)
    t.notOk(isMod)
    t.throws(function () {
      const ensureIsESMod = REC.checkESModule(null, __dirname)
      assert(ensureIsESMod === true) // never executed, but false anyway
    }, Error, 'Expected exception when checking for ES Module on a non-esm source/folder')
  }

  {
    const isMod = REC.isESModule(__filename, __dirname)
    t.notOk(isMod)
    t.throws(function () {
      const ensureIsESMod = REC.checkESModule(__filename, __dirname)
      assert(ensureIsESMod === true) // never executed, but false anyway
    }, Error, 'Expected exception when checking for ES Module on a non-esm source/folder')
  }

  {
    // try with a minimal project definition for a fake ES Module
    const moduleFolder = path.join(__dirname, '/fake-module')
    const isMod = REC.isESModule(null, moduleFolder)
    t.ok(isMod)
    const ensureIsESMod = REC.checkESModule(null, moduleFolder)
    t.ok(ensureIsESMod)
  }

  {
    // try with a minimal project definition for a fake Module but with a bad/unknown type specified
    const moduleFolder = path.join(__dirname, '/fake-module-no-type')
    const isMod = REC.isESModule(null, moduleFolder)
    t.notOk(isMod)
    t.throws(function () {
      const ensureIsESMod = REC.checkESModule(null, moduleFolder)
      assert(ensureIsESMod === true) // never executed, but false anyway
    }, Error, 'Expected exception when checking for ES Module on a non-esm source/folder')
  }

  {
    // try with a minimal source in a fake Module
    const moduleFolder = path.join(__dirname, '/fake-module-no-type')
    const sourceFile = path.join(moduleFolder, 'sample.cjs')
    const isMod = REC.isESModule(sourceFile)
    t.notOk(isMod)
  }

  {
    // try with a minimal source in a fake Module
    const moduleFolder = path.join(__dirname, '/fake-module-no-type')
    const sourceFile = path.join(moduleFolder, 'sample.mjs')
    const isMod = REC.isESModule(sourceFile)
    t.ok(isMod)
  }

  {
    // try with a minimal source in a fake Module
    const moduleFolder = path.join(__dirname, '/fake-module-no-type')
    const sourceFile = path.join(moduleFolder, 'sample.ts')
    const isMod = REC.isESModule(sourceFile)
    t.notOk(isMod)
  }

  t.end()
})
