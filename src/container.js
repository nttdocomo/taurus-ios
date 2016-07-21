/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./class/create', './component', 'underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./class/create'), require('./component'), require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./class/create'), require('./component'), require('underscore'))
  }
}(this, function (create, Component, _) {
  return create(Component, {
    constructor: function (config) {
      var me = this

      me._items = me.items = []
      me.innerItems = []

      me.onItemAdd = me.onFirstItemAdd

      Component.apply(me, arguments)
    },
    add: function (newItems) {
      var me = this
      var i, ln, item, newActiveItem

      if (_.isArray(newItems)) {
        for (i = 0, ln = newItems.length; i < ln; i++) {
          item = me.factoryItem(newItems[i])
          me.doAdd(item)
          if (!newActiveItem && !this.getActiveItem() && this.innerItems.length > 0 && item.isInnerItem()) {
            newActiveItem = item
          }
        }
      } else {
        item = me.factoryItem(newItems)
        me.doAdd(item)
        if (!newActiveItem && !this.getActiveItem() && this.innerItems.length > 0 && item.isInnerItem()) {
          newActiveItem = item
        }
      }

      if (newActiveItem) {
        this.setActiveItem(newActiveItem)
      }

      return item
    },

    factoryItem: function (item) {
      // <debug error>
      if (!item) {
        /* Ext.Logger.error('Invalid item given: ' + item + ', must be either the config object to factory a new item, ' +
          'or an existing component instance')*/
      }
      // </debug>

      return Ext.factory(item, this.defaultItemClass)
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
