/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './util/mixedCollection'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./util/mixedCollection'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./util/mixedCollection'))
  }
}(this, function (define, MixedCollection) {
  return define(MixedCollection, {
    getKey: function (item) {
      return item.getItemId()
    },

    has: function (item) {
      return this.map.hasOwnProperty(item.getId())
    }
  })
}))
