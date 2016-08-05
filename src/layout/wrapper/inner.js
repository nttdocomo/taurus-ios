/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', 'class'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('class'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('class'))
  }
}(this, function (define, Class) {
  define('Tau.layout.wrapper.Inner', Class, {})
}))
