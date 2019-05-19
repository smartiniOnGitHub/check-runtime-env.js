/*
 * Copyright 2019 the original author or authors.
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

const assert = require('assert')
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
  t.plan(4)

  t.comment('testing RuntimeEnvChecker class')
  t.ok(REC)
  t.strictEqual(typeof REC, 'function')
  t.ok(engines)

  t.throws(function () {
    const rec = new REC()
    assert(rec === null) // never executed
  }, Error, 'Expected exception when creating a RuntimeEnvChecker instance')
})

/** @test {RuntimeEnvChecker} */
test('ensure process info returns right values', (t) => {
  t.plan(2)

  t.comment('testing processInfo')
  const procInfo = REC.processInfo()
  t.ok(procInfo)
  t.strictEqual(typeof procInfo, 'object')
  // but do not test too low level details for attributes inside procInfo
})

/** @test {RuntimeEnvChecker} */
test('ensure version checks are done in the right way', (t) => {
  t.plan(46)

  {
    const comment = 'testing checkVersion'
    t.comment(comment)
    t.throws(function () {
      const check = REC.checkVersion()
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking version with wrong arguments')
    t.ok(!REC.checkVersion(null)) // not ok but does not throw error
    t.ok(!REC.checkVersion(null, null)) // not ok but does not throw error
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
    }, Error, `Expected exception when checking version that doesn't match`)
    t.throws(function () {
      const check = REC.checkVersion('3.2.1', '>=1.0.0 <2.0.0')
      assert(check === false) // never executed
    }, Error, `Expected exception when checking version that doesn't match`)
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
    const comment = 'testing checkVersionNode'
    t.comment(comment)
    t.comment(`Node.js current version: ${nodeVersion}`)
    t.comment(`Node.js version expected in 'package.json': ${engines.node}`)

    t.ok(REC.checkVersionNode()) // ok because of default values
    t.ok(REC.checkVersionNode('10.15.3')) // ok because of default values
    t.ok(REC.checkVersionNode(undefined)) // ok because of default values
    t.ok(REC.checkVersionNode(undefined, undefined)) // ok because of default values
    t.strictEqual(REC.checkVersionNode(null, null), false) // not error, but false result
    t.strictEqual(REC.checkVersionNode('10.15.3', null), false) // not error, but false result
    t.throws(function () {
      const check = REC.checkVersionNode(6.17, '>=8.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong arguments')
    t.throws(function () {
      const check = REC.checkVersionNode('6.17.0', '>=8.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.ok(REC.checkVersionNode('8.16.0', '8.16.0'))
    t.ok(REC.checkVersionNode('8.16.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0'))
    t.ok(REC.checkVersion('10.13.0', '>=8.9.0 <12.0.0'))
    t.ok(REC.checkVersion('10.15.3', engines.node))
    t.ok(REC.checkVersion('10.15.3', `${engines.node}`))
    t.strictEqual(REC.checkVersionNode('10.15.3', engines.notExisting), true) // ok because of default values with a not existing expected value (undefined)
  }

  {
    const comment = 'testing getVersionNpm and checkVersionNpm'
    t.comment(comment)
    const npmVersion = REC.getVersionNpm()
    assert(npmVersion !== null)
    t.ok(npmVersion)
    t.comment(`NPM current version: ${npmVersion}`)
    t.comment(`NPM version expected in 'package.json': ${engines.npm}`)

    t.ok(!REC.checkVersionNpm()) // not ok because of default values
    t.ok(!REC.checkVersionNpm(null)) // not ok because of default values
    t.ok(REC.checkVersionNpm('6.4.1')) // ok because of default values
    t.ok(REC.checkVersionNpm('6.4.1', '>=6.4.1'))
    t.ok(!REC.checkVersionNpm(undefined)) // not ok because of default values
    t.ok(!REC.checkVersionNpm(undefined, undefined)) // not ok because of default values
    t.strictEqual(REC.checkVersionNpm(null, null), false) // not error, but false result
    t.strictEqual(REC.checkVersionNpm('6.4.1', null), false) // not error, but false result
    t.throws(function () {
      const check = REC.checkVersionNode('6.17.0', '>=8.9.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking node version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionNpm('6.4.0')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking npm version with wrong values')
    t.throws(function () {
      const check = REC.checkVersionNpm('6.4.0', '>=6.4.1')
      assert(check === false) // never executed
    }, Error, 'Expected exception when checking npm version with wrong values')
  }
})
