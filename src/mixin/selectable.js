/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './mixin', '../util/mixedCollection', 'underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./mixin'), require('../util/mixedCollection'), require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./mixin'), require('../util/mixedCollection'), require('underscore'))
  }
}(this, function (define, Mixin, MixedCollection, _) {
  return define('Tau.mixin.Selectable', Mixin, {
    constructor: function () {
      this.selected = new MixedCollection()
      Mixin.apply(this, arguments)
    }
  })
}))
