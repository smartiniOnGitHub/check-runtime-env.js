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
   * Tell if the given argument is defined and not null.
   *
   * @static
   * @param {object} arg the object to check
   * @return {boolean} true if defined and not null, false otherwise
   */
  static isDefinedAndNotNull (arg) {
    return (arg !== undefined && arg !== null)
  }

  /**
   * Tell if the given argument is defined and not null,
   * is a string and is not empty.
   *
   * See {@link RuntimeEnvChecker.isDefinedAndNotNull}.
   *
   * @static
   * @param {object} arg the object to check
   * @return {boolean} true if it's a not empty string, false otherwise
   */
  static isStringNotEmpty (arg) {
    return (RuntimeEnvChecker.isDefinedAndNotNull(arg) &&
      (typeof arg === 'string') &&
      (arg.length > 0)
    )
  }

  /**
   * Utility method that tell if the given version is compatible
   * with the expected version (using then semver syntax).
   *
   * @static
   * @param {!string} version the version to check (as a string)
   * @param {!string} expectedVersion the expected version for the comparison (as a semver string)
   * @return {boolean} true if version is compatible with the given constraint, otherwise false
   * @throws {Error} if at least an argument is wrong
   */
  static isVersionCompatible (version, expectedVersion) {
    if (RuntimeEnvChecker.isStringNotEmpty(version) && RuntimeEnvChecker.isStringNotEmpty(expectedVersion)) {
      return semver.satisfies(version, expectedVersion)
    }
    return false
  }

  /**
   * Ensure that the given argument ia a not empty string.
   *
   * See {@link RuntimeEnvChecker.isStringNotEmpty}.
   *
   * @static
   * @param {object} arg the object to check
   * @param {string} name the name to use in generated error (if any), empty name as default
   * @return {boolean} true if it's a not empty string
   * @throws {Error} if it's an empty string or it's null or undefined
   */
  static checkStringNotEmpty (arg, name = '') {
    if (RuntimeEnvChecker.isStringNotEmpty(arg) !== true) {
      throw new Error(`RuntimeEnvChecker - the string '${name}' must be not empty`)
    }
    return true
  }

  /**
   * Utility method that check if the given version is compatible
   * with the given expected version (using then semver syntax).
   *
   * @static
   * @param {!string} version the version to check (as a string)
   * @param {!string} expectedVersion the expected version for the comparison (as a semver string)
   * @return {boolean} true if version matches
   * @throws {Error} if at least an argument is wrong
   * @throws {Error} if versions does not matches
   * @see isVersionCompatible
   */
  static checkVersion (version, expectedVersion) {
    RuntimeEnvChecker.checkStringNotEmpty(version, 'version')
    RuntimeEnvChecker.checkStringNotEmpty(expectedVersion, 'expectedVersion')
    const compatible = RuntimeEnvChecker.isVersionCompatible(version, expectedVersion)
    if (compatible !== true) {
      throw new Error(`RuntimeEnvChecker - found version '${version}', but expected version '${expectedVersion}'`)
    }
    return true
  }

  /**
   * Utility method that check if the given Node.js version is compatible
   * with the given expected version (using then semver syntax),
   * usually read from a specific field in 'package.json'.
   *
   * @static
   * @param {string} version the version to check (as a string), by default current Node.js version
   * @param {string} versionExpected the expected version for the comparison (as a semver string), by default current value for 'node', under 'engines' in 'package.json' (if set)
   * @return {boolean} true if version matches, false if one of versions is null
   * @throws {Error} if at least an argument is wrong
   * @throws {Error} if versions are comparable but does not matches
   * @see checkVersion
   */
  static checkVersionOfNode (
    version = process.version,
    versionExpected = engines.node
  ) {
    return RuntimeEnvChecker.checkVersion(version, versionExpected)
  }

  /**
   * Utility method that check if the given NPM version is compatible
   * with the given expected version (using then semver syntax),
   * usually read from a specific field in 'package.json'.
   *
   * @static
   * @param {string} version the version to check (as a string), default null
   * @param {string} versionExpected the expected version for the comparison (as a semver string), by default current value for 'npm', under 'engines' in 'package.json' (if set)
   * @return {boolean} true if version matches, false if one of versions is null
   * @throws {Error} if at least an argument is wrong
   * @throws {Error} if versions are comparable but does not matches
   * @see checkVersion
   */
  static checkVersionOfNpm (
    version = null,
    versionExpected = engines.npm
  ) {
    return RuntimeEnvChecker.checkVersion(version, versionExpected)
  }

  /**
   * Utility method that gets current NPM version.
   * Note that NPM is executed in a child process (but only to get its version),
   * in a synchronous way.
   *
   * @static
   * @return {string} npm version (as a string) if found, otherwise null
   */
  static getVersionOfNpm () {
    const { execSync } = require('child_process')
    let npmVersion = null
    try {
      npmVersion = execSync('npm -version')
      npmVersion = npmVersion.toString().replace(/(\r\n|\n|\r)/gm, '')
    } catch (e) {
      // error running the command, maybe npm not installed or not found
    }
    return npmVersion
  }
}

module.exports = RuntimeEnvChecker
