/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './component', 'underscore', './core/factory'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./component'), require('underscore'), require('./core/factory'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./component'), require('underscore'), require('./core/factory'))
  }
}(this, function (define, Component, _, factory) {
  return define(Component, {
    eventedConfig: {
      /**
       * @cfg {Object/String/Number} activeItem The item from the {@link #cfg-items} collection that will be active first. This is
       * usually only meaningful in a {@link Ext.layout.Card card layout}, where only one item can be active at a
       * time. If passes a string, it will be assumed to be a {@link Ext.ComponentQuery} selector.
       * @accessor
       * @evented
       */
      activeItem: 0
    },
    config: {
      /**
       * @cfg {Object} defaults A set of default configurations to apply to all child Components in this Container.
       * It's often useful to specify defaults when creating more than one items with similar configurations. For
       * example here we can specify that each child is a panel and avoid repeating the xtype declaration for each
       * one:
       *
       *     Ext.create('Ext.Container', {
       *         defaults: {
       *             xtype: 'panel'
       *         },
       *         items: [
       *             {
       *                 html: 'Panel 1'
       *             },
       *             {
       *                 html: 'Panel 2'
       *             }
       *         ]
       *     })
       *
       * @accessor
       */
      defaults: null,
      /**
         * @cfg {Array/Object} items The child items to add to this Container. This is usually an array of Component
         * configurations or instances, for example:
         *
         *     Ext.create('Ext.Container', {
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 html: 'This is an item'
         *             }
         *         ]
         *     })
         * @accessor
         */
      items: null
    },
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

    /**
     * @private
     */
    applyActiveItem: function (activeItem, currentActiveItem) {
      var innerItems = this.getInnerItems()

      // Make sure the items are already initialized
      this.getItems()

      // No items left to be active, reset back to 0 on falsy changes
      if (!activeItem && innerItems.length === 0) {
        return 0
      } else if (typeof activeItem === 'number') {
        activeItem = Math.max(0, Math.min(activeItem, innerItems.length - 1))
        activeItem = innerItems[activeItem]

        if (activeItem) {
          return activeItem
        } else if (currentActiveItem) {
          return null
        }
      } else if (activeItem) {
        var item

        // ComponentQuery selector?
        if (typeof activeItem === 'string') {
          item = this.child(activeItem)

          activeItem = {
            xtype: activeItem
          }
        }

        if (!item || !item.isComponent) {
          item = this.factoryItem(activeItem)
        }
        this.pendingActiveItem = item

        // <debug error>
        if (!item.isInnerItem()) {
          // Ext.Logger.error("Setting activeItem to be a non-inner item")
        }
        // </debug>

        if (!this.has(item)) {
          this.add(item)
        }

        return item
      }
    },

    applyItems: function (items, collection) {
      if (items) {
        var me = this

        me.getDefaultType()
        me.getDefaults()

        if (me.initialized && collection.length > 0) {
          me.removeAll()
        }

        me.add(items)

        // Don't need to call setActiveItem when Container is first initialized
        if (me.initialized) {
          var activeItem = me.initialConfig.activeItem || me.config.activeItem || 0

          me.setActiveItem(activeItem)
        }
      }
    },

    factoryItem: function (item) {
      // <debug error>
      if (!item) {
        /* Ext.Logger.error('Invalid item given: ' + item + ', must be either the config object to factory a new item, ' +
          'or an existing component instance')*/
      }
      // </debug>

      return factory(item, this.defaultItemClass)
    },

    getElementConfig: function () {
      return {
        reference: 'element',
        classList: ['x-container', 'x-unsized'],
        children: [{
          reference: 'innerElement',
          classList: ['x-inner']
        }]
      }
    },

    /**
     * Returns all inner {@link #property-items} of this container. `inner` means that the item is not `docked` or
     * `floating`.
     * @return {Array} The inner items of this container.
     */
    getInnerItems: function () {
      return this.innerItems
    }
  })
}))
