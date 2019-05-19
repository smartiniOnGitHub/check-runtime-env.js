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

/**
 * RuntimeEnvChecker:
 * this module exports some useful generic functions
 * for checks of some environment properties as runtime.
 */

const semver = require('semver')

/** Get the host name where this code is runninng */
const hostname = require('os').hostname()

/** Get the process id (pid) where this code is runninng */
const pid = require('process').pid

/** Get the list of engines needed, if specified in 'package.json' */
const engines = require('../package.json').engines

/**
 * Checker for Runtime Environment properties.
 *
 * Note that all methods here are static, so no need to instance this class;
 * see it as an Utility/Companion class.
 */
class RuntimeEnvChecker {
  /**
   * Create a new instance of a RuntimeEnvChecker class.
   *
   * Note that instancing is not allowed for this class because all its methods are static.
   *
   * @throws {Error} because instancing not allowed for this class
   */
  constructor () {
    throw new Error(`Instancing not allowed for this class`)
  }

  /**
   * Utility method that get some process-related info
   * and wraps them into an object.
   *
   * @static
   * @return {object} the object representation of process-related info data
   */
  static processInfo () {
    return {
      hostname,
      pid
    }
  }

  /**
   * Utility method that check if the given version is compatible
   * with the given expected version (using then semver syntax).
   *
   * @static
   * @param {!string} version the version to check (as a string)
   * @param {!string} expectedVersion the expected version for the comparison (as a semver string)
   * @return {boolean} true if version matches, false if one of versions is null
   * @throws {TypeError} if at least an argument is wrong
   * @throws {Error} if versions are comparable but does not matches
   */
  static checkVersion (version, expectedVersion) {
    if (version && typeof version !== 'string') {
      throw new TypeError(`The argument 'version' must be a string, instead got a '${typeof version}'`)
    }
    if (expectedVersion && typeof expectedVersion !== 'string') {
      throw new TypeError(`The argument 'expectedVersion' must be a string, instead got a '${typeof expectedVersion}'`)
    }
    if (version !== null && expectedVersion !== null) {
      if (!semver.satisfies(version, expectedVersion)) {
        throw new Error(`RuntimeEnvChecker - found version, '${version}', but expected version '${expectedVersion}'`)
      } else {
        return true
      }
    }
    return false
  }

  /**
   * Utility method that check if the given Node.js version is compatible
   * with the given expected version (using then semver syntax),
   * usually read from a specific field in 'package.json'.
   *
   * @static
   * @param {string} version the version to check (as a string), by default current Node.js version
   * @param {string} expectedVersion the expected version for the comparison (as a semver string), by default current value for 'node', under 'engines' in 'package.json'
   * @return {boolean} true if version matches, false if one of versions is null
   * @throws {TypeError} if at least an argument is wrong
   * @throws {Error} if versions are comparable but does not matches
   */
  static checkNodeVersion (
    nodeVersion = process.version,
    nodeVersionExpected = engines.node
  ) {
    return RuntimeEnvChecker.checkVersion(nodeVersion, nodeVersionExpected)
  }
}

module.exports = RuntimeEnvChecker
