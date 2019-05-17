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
   * Create a new instance of a RuntimeEnvChecker object.
   *
   * Note that instancing is not allowed for this class because all its methods are static.
   *
   * @throws {Error} because instancing not allowed for this class
   */
  constructor () {
    throw new Error(`Instancing not allowed for this class`)
  }

  /**
   * Utility function that get some process-related info and wrap into an object
   * (compatible with the CloudEvent standard), to fill its 'data' attribute.
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

  // TODO: add comments, etc ... wip
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

  // TODO: add comments, etc ... wip
  static checkNodeVersion (
    nodeVersion = process.version,
    nodeVersionExpected = engines.node
  ) {
    return RuntimeEnvChecker.checkVersion(nodeVersion, nodeVersionExpected)
  }
}

module.exports = RuntimeEnvChecker
