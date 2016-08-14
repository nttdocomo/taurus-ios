/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', 'class', 'underscore', '../underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('class'), require('underscore'), require('../underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('class'), require('underscore'), require('../underscore/deepClone'))
  }
}(this, function (define, Class, _) {
  return define('Tau.mixin.Mixin', Class, {
  })
}))
