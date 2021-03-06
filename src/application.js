/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./chaplin/application'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./chaplin/application'))
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
