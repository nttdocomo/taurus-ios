/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './mixin', 'underscore', 'backbone', '../underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./mixin'), require('underscore'), require('backbone'), require('../underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./mixin'), require('underscore'), require('backbone'), require('../underscore/deepClone'))
  }
}(this, function (define, Mixin, _, Backbone) {
  return define(Mixin, {
    // @private
    isObservable: true
  }).extend(Backbone.Events)
}))
