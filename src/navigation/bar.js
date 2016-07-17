/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../class/create', '../titleBar'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../class/create'), require('../titleBar'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../class/create'), require('../titleBar'))
  }
}(this, function (create, TitleBar) {
  return create(TitleBar, {})
}))
