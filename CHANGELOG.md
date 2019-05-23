# Change Log

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
