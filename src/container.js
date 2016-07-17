/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./class/create', './component'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./class/create'), require('./component'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./class/create'), require('./component'))
  }
}(this, function (create, Component, Bar) {
  return create(Component, {
    constructor: function (config) {
      var me = this

      me._items = me.items = []
      me.innerItems = []

      me.onItemAdd = me.onFirstItemAdd

      Component.apply(me, arguments)
    },

    getElementConfig: function () {
      return {
        reference: 'element',
        classList: ['x-container', 'x-unsized'],
        children: [{
          reference: 'innerElement',
          className: 'x-inner'
        }]
      }
    }
  })
}))
