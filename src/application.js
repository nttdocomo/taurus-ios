/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./app/application'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./app/application'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  }
}(this, function (Application) {
  return function (config) {
    /* eslint-disable no-new */
    new Application(config)
  }
}))
