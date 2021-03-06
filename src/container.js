/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './component', './itemCollection', './underscore', './core/factory', './layout/default', './behavior/scrollable', './tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./component'), require('./itemCollection'), require('./underscore'), require('./core/factory'), require('./layout/default'), require('./behavior/scrollable'), require('./tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./component'), require('./itemCollection'), require('./underscore'), require('./core/factory'), require('./layout/default'), require('./behavior/scrollable'), require('./tau'))
  }
}(this, function (define, Component, ItemCollection, _, factory, Default, Scrollable, Tau) {
  var Container = define(Component, {
    eventedConfig: {
      /**
       * @cfg {Object/String/Number} activeItem The item from the {@link #cfg-items} collection that will be active first. This is
       * usually only meaningful in a {@link Ext.layout.Card card layout}, where only one item can be active at a
       * time. If passes a string, it will be assumed to be a {@link Ext.ComponentQuery} selector.
       * @accessor
       * @evented
       */
      activeItem: 0,
      /**
       * @cfg {Boolean/String/Object} scrollable
       * Configuration options to make this Container scrollable. Acceptable values are:
       *
       * - `'horizontal'`, `'vertical'`, `'both'` to enabling scrolling for that direction.
       * - `true`/`false` to explicitly enable/disable scrolling.
       *
       * Alternatively, you can give it an object which is then passed to the scroller instance:
       *
       *     scrollable: {
       *         direction: 'vertical',
       *         directionLock: true
       *     }
       *
       * Please look at the {@link Ext.scroll.Scroller} documentation for more example on how to use this.
       * @return {Ext.scroll.View} The scroll view.
       * @accessor
       * @evented
       */
      scrollable: null
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
      /** @cfg {String} defaultType
       * The default {@link Ext.Component xtype} of child Components to create in this Container when a child item
       * is specified as a raw configuration object, rather than as an instantiated Component.
       * @accessor
       */
      defaultType: null,
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
      items: null,
      /**
       * @cfg {Object/String} layout Configuration for this Container's layout. Example:
       *
       *     Ext.create('Ext.Container', {
       *         layout: {
       *             type: 'hbox',
       *             align: 'middle'
       *         },
       *         items: [
       *             {
       *                 xtype: 'panel',
       *                 flex: 1,
       *                 style: 'background-color: red;'
       *             },
       *             {
       *                 xtype: 'panel',
       *                 flex: 2,
       *                 style: 'background-color: green'
       *             }
       *         ]
       *     })
       *
       * See the [Layouts Guide](../../../core_concepts/layouts.html) for more information.
       *
       * @accessor
       */
      // @private
      useBodyElement: null,
      layout: null
    },
    constructor: function (config) {
      var me = this

      me._items = me.items = new ItemCollection()
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

    /**
     * @private
     */
    applyScrollable: function (config) {
      if (typeof config === 'boolean') {
        // <debug warn>
        if (config === false && !(this.getHeight() !== null || this.heightLayoutSized || (this.getTop() !== null && this.getBottom() !== null))) {
          console.warn('This container is set to scrollable: false but has no specified height. ' +
                'You may need to set the container to scrollable: null or provide a height.', this)
        }
        // </debug>
        this.getScrollableBehavior().setConfig({disabled: !config})
      } else if (config && !config.isObservable) {
        this.getScrollableBehavior().setConfig(config)
      }
      return config
    },

    /**
     * @private
     * @param {Ext.Component} item
     */
    doAdd: function (item) {
      var me = this
      var items = me.getItems()
      var index

      if (!items.has(item)) {
        index = items.length
        items.add(item)

        if (item.isInnerItem()) {
          me.insertInner(item)
        }

        item.setParent(me)

        me.onItemAdd(item, index)
      }
    },

    doItemLayoutAdd: function (item, index) {
      var layout = this.getLayout()

      if (this.isRendered() && item.setRendered(true)) {
        layout['onItemAdd'](item, index)
      // item.trigger('renderedchange', [this, item, true], 'onItemAdd', layout, { args: [item, index] })
      } else {
        layout.onItemAdd(item, index)
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
        classList: [Tau.baseCSSPrefix + 'container', Tau.baseCSSPrefix + 'unsized'],
        children: [{
          reference: 'innerElement',
          classList: [Tau.baseCSSPrefix + 'inner']
        }]
      }
    },

    getInnerAt: function (index) {
      return this.innerItems[index]
    },

    /**
     * Returns all inner {@link #property-items} of this container. `inner` means that the item is not `docked` or
     * `floating`.
     * @return {Array} The inner items of this container.
     */
    getInnerItems: function () {
      return this.innerItems
    },
    getLayout: function () {
      var layout = this.layout
      if (!layout) {
        layout = this.link('_layout', this.link('layout', factory(this._layout || Default, Default, null, 'layout')))
        layout.setContainer(this)
      }

      return layout
    },

    /**
     * Returns an the scrollable instance for this container, which is a {@link Ext.scroll.View} class.
     *
     * Please checkout the documentation for {@link Ext.scroll.View}, {@link Ext.scroll.View#getScroller}
     * and {@link Ext.scroll.Scroller} for more information.
     * @return {Ext.scroll.View} The scroll view.
     */
    getScrollable: function () {
      return this.getScrollableBehavior().getScrollView()
    },

    /**
     * @private
     */
    getScrollableBehavior: function () {
      var behavior = this.scrollableBehavior

      if (!behavior) {
        behavior = this.scrollableBehavior = new Scrollable(this)
      }

      return behavior
    },

    /**
     * @private
     */
    has: function (item) {
      return this.getItems().indexOf(item) !== -1
    },

    /**
     * @private
     */
    indexOf: function (item) {
      return this.getItems().indexOf(item)
    },
    innerIndexOf: function (item) {
      return this.innerItems.indexOf(item)
    },

    /**
     * @private
     */
    insertFirst: function (item) {
      return this.insert(0, item)
    },

    /**
     * @private
     * @param {Ext.Component} item
     * @param {Number} index
     */
    insertInner: function (item, index) {
      var items = this.getItems().items
      var innerItems = this.innerItems
      var currentInnerIndex = innerItems.indexOf(item)
      var newInnerIndex = -1
      var nextSibling

      if (currentInnerIndex !== -1) {
        innerItems.splice(currentInnerIndex, 1)
      }

      if (typeof index === 'number') {
        do {
          nextSibling = items[++index]
        } while (nextSibling && !nextSibling.isInnerItem())

        if (nextSibling) {
          newInnerIndex = innerItems.indexOf(nextSibling)
          innerItems.splice(newInnerIndex, 0, item)
        }
      }

      if (newInnerIndex === -1) {
        innerItems.push(item)
        newInnerIndex = innerItems.length - 1
      }

      if (currentInnerIndex !== -1) {
        this.onInnerItemMove(item, newInnerIndex, currentInnerIndex)
      }

      return this
    },

    /**
     * Initialize layout and event listeners the very first time an item is added
     * @private
     */
    onFirstItemAdd: function () {
      delete this.onItemAdd

      if (this.innerHtmlElement && !this.getHtml()) {
        this.innerHtmlElement.destroy()
        delete this.innerHtmlElement
      }

      this.on('innerstatechange', 'onItemInnerStateChange', this, {
        delegate: '> component'
      })

      return this.onItemAdd.apply(this, arguments)
    },

    /**
     * @private
     */
    onItemAdd: function (item, index) {
      this.doItemLayoutAdd(item, index)

      if (this.initialized) {
        this.trigger('add', this, item, index)
      }
    },

    /**
     * @private
     */
    setRendered: function (rendered) {
      if (this._super.apply(this, arguments)) {
        var items = this.items.items
        var i, ln

        for (i = 0, ln = items.length; i < ln; i++) {
          items[i].setRendered(rendered)
        }

        return true
      }

      return false
    },

    updateBaseCls: function (newBaseCls, oldBaseCls) {
      var me = this
      var ui = me.getUi()

      if (oldBaseCls) {
        this.element.removeCls(oldBaseCls)
        this.innerElement.removeCls(function (index, currentClassName) {
          return [newBaseCls, 'inner'].join('-')
        })

        if (ui) {
          this.element.removeCls(this.currentUi)
        }
      }

      if (newBaseCls) {
        this.element.addCls(newBaseCls)
        this.innerElement.addCls(newBaseCls, null, 'inner')

        if (ui) {
          this.element.addCls(newBaseCls, null, ui)
          this.currentUi = newBaseCls + '-' + ui
        }
      }
    },

    updateUseBodyElement: function (useBodyElement) {
      if (useBodyElement) {
        this.link('bodyElement', this.innerElement.wrap({
          cls: Tau.baseCSSPrefix + 'body'
        }))
      }
    }
  })
  Container.prototype.defaultItemClass = Container
  return Container
}))
