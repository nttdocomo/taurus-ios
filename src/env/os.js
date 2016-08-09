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
  var OS = define('Tau.env.OS', Class, {
    constructor: function (userAgent, platform, browserScope) {
      var is
      is = this.is = function (name) {
        return is[name] === true
      }
    }
  }, {})
  var osEnv
  return Tau.os = osEnv = new OS(userAgent, navigation.platform);
}))
