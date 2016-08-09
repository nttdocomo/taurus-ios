/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'))
  }
}(this, function (define, Class) {
  var Browser = define('Tau.env.Browser', Class, {
    constructor: function (userAgent) {
      var is
      is = this.is = function (name) {
        return is[name] === true
      }
    }
  }, {})
  return new Browser(navigator.userAgent)
}))
