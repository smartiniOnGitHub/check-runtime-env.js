# Change Log

## [0.4.0](https://github.com/smartiniOnGitHub/check-runtime-env.js/releases/tag/0.4.0) (2022-07-22)
Summary Changelog:
- Update requirements to Node.js 14 LTS (14.15.0)
- Ensure all is good as before
- Update errors raised (by checkers) when no variable name is given
- Add some functions to verify and to check/ensure if code is running as an EcmaScript module (ESM) 
  but in a simple way
- Simplify Tap tests execution and small improvements in code coverage

## [0.3.0](https://github.com/smartiniOnGitHub/check-runtime-env.js/releases/tag/0.3.0) (2022-03-26)
Summary Changelog:
- Update requirements to Node.js 10 LTS (10.13.0 or later)
- Use Node.js assertions but in strict mode now
- Add some utility function to check boolean values/conditions, 
  get the total number of CPU, get total and free memory, 
  tell/check if strict mode is enabled, etc
- Update dependencies
- Update dependencies for the development environment and 
  Tap to latest (15.x) for compatibility with required Node.js version
- Generate documentation from sources with JSDoc, no more ESDoc

## [0.2.0](https://github.com/smartiniOnGitHub/check-runtime-env.js/releases/tag/0.2.0) (2019-05-24)
Summary Changelog:
- Add some generic utility methods to verify ('is') and checker ('check') 
  for string not empty, env var defined; even for the NODE_ENV env var, 
  and for verify/check if current env in production
- Breaking change: checkers will always throw error when arguments are null 
  (but with undefined not always because sometimes they have a default value)
- Update Tap to latest (14.x)
- Test coverage now is no more 100% but a little less because of testing 
  new features for env production or not, when running test coverage
- General cleanup and documentation (docs and ESDoc comments in sources) fixes

## [0.1.0](https://github.com/smartiniOnGitHub/check-runtime-env.js/releases/tag/0.1.0) (2019-05-20)
Summary Changelog:
- First release, with some basic checker functions about version:
  generic, for Node.js, for NPM
- Provide a Node.js Example

----
