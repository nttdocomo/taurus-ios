/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', './component/dataItem', '../mixin/selectable', './element/container', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('../mixin/selectable'), require('./element/container'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('../mixin/selectable'), require('./element/container'), require('underscore'), require('tau'))
  }
}(this, function (define, Container, DataItem, Selectable, ElementContainer, _, Tau) {
  return define('Tau.dataview.DataView', Container, {
    config: {
      /**
       * @cfg baseCls
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'dataview',
      /**
       * @cfg {Boolean} deferEmptyText `true` to defer `emptyText` being applied until the store's first load.
       */
      deferEmptyText: true,

      /**
       * @cfg {String} emptyText
       * The text to display in the view when there is no data to display
       */
      emptyText: null,
      /**
       * @cfg {String} itemCls
       * An additional CSS class to apply to items within the DataView.
       * @accessor
       */
      itemCls: null,

      /**
       * @cfg {Object} itemConfig
       * A configuration object that is passed to every item created by a component based DataView. Because each
       * item that a DataView renders is a Component, we can pass configuration options to each component to
       * easily customize how each child component behaves.
       *
       * __Note:__ this is only used when `{@link #useComponents}` is `true`.
       * @accessor
       */
      itemConfig: {},

      /**
       * @cfg {Boolean} scrollToTopOnRefresh
       * Scroll the DataView to the top when the DataView is refreshed.
       * @accessor
       */
      scrollToTopOnRefresh: true,
      /**
       * @cfg {String} selectedCls
       * The CSS class to apply to an item on the view while it is selected.
       * @accessor
       */
      selectedCls: Tau.baseCSSPrefix + 'x-item-selected',

      /**
       * @cfg {Ext.data.Store/Object} store
       * Can be either a Store instance or a configuration object that will be turned into a Store. The Store is used
       * to populate the set of items that will be rendered in the DataView. See the DataView intro documentation for
       * more information about the relationship between Store and DataView.
       * @accessor
       */
      store: null,
      /**
       * @cfg {String} triggerEvent
       * Determines what type of touch event causes an item to be selected.
       * Valid options are: 'itemtap', 'itemsingletap', 'itemdoubletap', 'itemswipe', 'itemtaphold'.
       * @accessor
       */
      triggerEvent: 'itemtap',

      /**
       * @cfg {String} triggerCtEvent
       * Determines what type of touch event is recognized as a touch on the container.
       * Valid options are 'tap' and 'singletap'.
       * @accessor
       */
      triggerCtEvent: 'tap',
      /**
       * @cfg {Boolean} useComponents
       * Flag the use a component based DataView implementation.  This allows the full use of components in the
       * DataView at the cost of some performance.
       *
       * Checkout the [Sencha Touch DataView Guide](../../../components/dataview.html) for more information on using this configuration.
       * @accessor
       */
      useComponents: null,
      /**
       * @cfg {String} defaultType
       * The xtype used for the component based DataView.
       *
       * __Note:__ this is only used when `{@link #useComponents}` is `true`.
       * @accessor
       */
      defaultType: DataItem
    },

    storeEventHooks: function () {
      var me = this
      return {
        // beforeload: _.bind(me.onBeforeLoad, me),
        // sync: _.bind(me.onLoad, me),
        reset: _.bind(me.refresh, me),
      // add: _.bind(me.onStoreAdd, me),
      // remove: _.bind(me.onStoreRemove, me),
      // update: _.bind(me.onStoreUpdate, me)
      }
    },

    constructor: function (config) {
      var me = this
      var layout

      me.hasLoadedStore = false

      Selectable.apply(me, arguments)

      me.indexOffset = 0

      Container.apply(me, arguments)

      // <debug>
      layout = this.getLayout()
      if (layout && !layout.isAuto) {
        console.error('The base layout for a DataView must always be an Auto Layout')
      }
    // </debug>
    },

    applyStore: function (store) {
      var me = this
      var bindEvents = _.extend({}, me.storeEventHooks(), { scope: me })
      if (store) {
        if (store && _.isObject(store) && store.isStore) {
          store.on(bindEvents)
        }
      }
      return store
    },

    hideEmptyText: function () {
      if (this.getEmptyText()) {
        this.emptyTextCmp.hide()
      }
    },

    initialize: function () {
      this._super.apply(this, arguments)
      var me = this
      var container
      var triggerEvent = me.getTriggerEvent()

      me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me)

      container = me.container = this.add(new Tau.dataview[me.getUseComponents() ? 'component' : 'element'].Container({
        baseCls: this.getBaseCls()
      }))
      container.dataview = me

      if (triggerEvent) {
        me.on(triggerEvent, me.onItemTrigger, me)
      }

      container.on({
        itemtouchstart: 'onItemTouchStart',
        itemtouchend: 'onItemTouchEnd',
        itemtap: 'onItemTap',
        itemtaphold: 'onItemTapHold',
        itemtouchmove: 'onItemTouchMove',
        itemsingletap: 'onItemSingleTap',
        itemdoubletap: 'onItemDoubleTap',
        itemswipe: 'onItemSwipe',
        scope: me
      })

      if (me.getStore()) {
        if (me.isPainted()) {
          me.refresh()
        } else {
          me.on({
            painted: 'refresh',
            single: true
          })
        }
      }
    },

    /**
     * Function which can be overridden to provide custom formatting for each Record that is used by this
     * DataView's {@link #tpl template} to render each node.
     * @param {Object/Object[]} data The raw data object that was used to create the Record.
     * @param {Number} index the index number of the Record being prepared for rendering.
     * @param {Ext.data.Model} record The Record being prepared for rendering.
     * @return {Array/Object} The formatted data in a format expected by the internal {@link #tpl template}'s `overwrite()` method.
     * (either an array if your params are numeric (i.e. `{0}`) or an object (i.e. `{foo: 'bar'}`))
     */
    prepareData: function (data, index, record) {
      return data
    },

    /**
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     */
    refresh: function () {
      var me = this
      var container = me.container

      if (!me.getStore()) {
        if (!me.hasLoadedStore && !me.getDeferEmptyText()) {
          me.showEmptyText()
        }
        return
      }
      if (container) {
        me.trigger('refresh', me)
        me.doRefresh()
      }
    },

    updateStore: function (newStore, oldStore) {
      var me = this,
        bindEvents = _.extend({}, me.storeEventHooks(), { scope: me }),
        proxy, reader

      if (oldStore && _.isObject(oldStore) && oldStore.isStore) {
        oldStore.un(bindEvents)

        if (!me.isDestroyed) {
          me.onStoreClear()
        }

        if (oldStore.getAutoDestroy()) {
          oldStore.destroy()
        }else {
          proxy = oldStore.getProxy()
          if (proxy) {
            reader = proxy.getReader()
            if (reader) {
              reader.un('exception', 'handleException', this)
            }
          }
        }
      }

      if (newStore) {
        if (newStore.isLoaded()) {
          this.hasLoadedStore = true
        }

        if (newStore.isLoading()) {
          me.onBeforeLoad()
        }
        if (me.container) {
          me.refresh()
        }
      }
    }
  }).mixin(Selectable)
}))
