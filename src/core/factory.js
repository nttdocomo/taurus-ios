/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('underscore'), require('tau'))
  }
}(this, function (_, Tau) {
  return function (config, classReference) {
    if ('xclass' in config) {
      var Cls = config.xclass
      var newInstance = new Cls(config) // manager.instantiate(config.xclass, config)
      if (newInstance) {
        return newInstance
      }
    }
    return new classReference(config);
  }
}))
