/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './dataView', '../layout/Fit', '../core/factory', './listItemHeader', '../container', '../util/positionMap', '../env/browser', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./dataView'), require('../layout/Fit'), require('../core/factory'), require('./listItemHeader'), require('../container'), require('../util/positionMap'), require('../env/browser'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./dataView'), require('../layout/Fit'), require('../core/factory'), require('./listItemHeader'), require('../container'), require('../util/positionMap'), require('../env/browser'), require('underscore'), require('tau'))
  }
}(this, function (define, DataView, Fit, factory, ListItemHeader, Container, PositionMap, browser, _, Tau) {
  return define('Tau.dataview.List', DataView, {
    config: {
      /**
       * @cfg baseCls
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'list',
      /**
       * @cfg {Boolean} grouped
       * Whether or not to group items in the provided Store with a header for each item.
       * @accessor
       */
      grouped: null,

      /**
       * @cfg {Boolean/Object} indexBar
       * `true` to render an alphabet IndexBar docked on the right.
       * This can also be a config object that will be passed to {@link Ext.IndexBar}.
       * @accessor
       */
      indexBar: false,

      /**
       * @cfg {Boolean} infinite
       * Set this to false to render all items in this list, and render them relatively.
       * Note that this configuration can not be dynamically changed after the list has instantiated.
       */
      infinite: false,
      /**
       * @cfg {Number} itemHeight
       * This allows you to set the default item height and is used to roughly calculate the amount
       * of items needed to fill the list. By default items are around 50px high.
       */
      itemHeight: 42,

      /**
       * @cfg {Object} itemMap
       * @private
       */
      itemMap: {},

      /**
       * @cfg {Object} scrollable
       * @private
       */
      scrollable: null,
      /**
       * @cfg layout
       * Hide layout config in DataView. It only causes confusion.
       * @accessor
       * @private
       */
      layout: Fit,
      /**
       * @cfg {Boolean} striped
       * Set this to true if you want the items in the list to be zebra striped, alternating their
       * background color.
       */
      striped: false,

      /**
       * @cfg {String} ui
       * The style of this list. Available options are `normal` and `round`.
       * Please note: if you use the `round` UI, {@link #pinHeaders} will be automatically turned off as
       * it is not supported.
       */
      ui: 'normal'
    },
    constructor: function () {
      var me = this
      var layout

      DataView.apply(me, arguments)

      // <debug>
      layout = this.getLayout()
      if (layout && !layout.isFit) {
        console.error('The base layout for a DataView must always be a Fit Layout')
      }
    // </debug>
    },

    applyItemMap: function (itemMap) {
      return factory(itemMap, PositionMap, this.getItemMap())
    },

    doRefresh: function () {
      var me = this
      var infinite = me.getInfinite()
      var scroller = me.container.getScrollable().getScroller()
      var storeCount = me.getStore().getCount()

      if (infinite) {
        me.getItemMap().populate(storeCount, this.topRenderedIndex)
      }

      if (me.getGrouped()) {
        me.refreshHeaderIndices()
      }

      // This will refresh the items on the screen with the new data
      if (storeCount) {
        me.hideScrollDockItems()
        me.hideEmptyText()
        if (!infinite) {
          me.setItemsCount(storeCount)
          if (me.getScrollToTopOnRefresh()) {
            scroller.scrollTo(0, 0)
          }
        } else {
          if (me.getScrollToTopOnRefresh()) {
            me.topRenderedIndex = 0
            me.topVisibleIndex = 0
            scroller.position.y = 0
          }
          me.updateAllListItems()
        }
      } else {
        me.onStoreClear()
      }
    },

    // We create complex instance arrays and objects in beforeInitialize so that we can use these inside of the initConfig process.
    beforeInitialize: function () {
      var me = this
      var container = me.container
      var baseCls = me.getBaseCls()
      var scrollable, scrollViewElement, pinnedHeader

      _.extend(me, {
        listItems: [],
        headerItems: [],
        updatedItems: [],
        headerMap: [],
        scrollDockItems: {
          top: [],
          bottom: []
        }
      })

      // We determine the translation methods for headers and items within this List based
      // on the best strategy for the device
      this.translationMethod = Tau.browser.is.AndroidStock2 ? 'cssposition' : 'csstransform'

      // Create the inner container that will actually hold all the list items
      if (!container) {
        container = me.container = factory({
          xclass: Container,
          scrollable: {
            scroller: {
              autoRefresh: !me.getInfinite(),
              direction: 'vertical'
            }
          }
        })
      }

      // We add the container after creating it manually because when you add the container,
      // the items config is initialized. When this happens, any scrollDock items will be added,
      // which in turn tries to add these items to the container
      me.add(container)

      // We make this List's scrollable the inner containers scrollable
      scrollable = container.getScrollable()
      scrollViewElement = me.scrollViewElement = scrollable.getElement()
      me.scrollElement = scrollable.getScroller().getElement()

      me.setScrollable(scrollable)
      me.scrollableBehavior = container.getScrollableBehavior()

      // Create the pinnedHeader instance thats being used when grouping is enabled
      // and insert it into the scrollElement
      pinnedHeader = me.pinnedHeader = factory({
        xclass: ListItemHeader,
        html: '&nbsp;',
        translatable: {
          translationMethod: this.translationMethod
        },
        cls: [baseCls + '-header', baseCls + '-header-swap']
      })
      pinnedHeader.translate(0, -10000)
      pinnedHeader.$position = -10000
      scrollViewElement.insertFirst(pinnedHeader.renderElement)

      // We want to intercept any translate calls made on the scroller to perform specific list logic
      me.bind(scrollable.getScroller().getTranslatable(), 'doTranslate', 'onTranslate')
    },

    getListItemConfig: function () {
      var me = this
      var minimumHeight = me.getItemMap().getMinimumHeight()
      var config = {
        xtype: me.getDefaultType(),
        itemConfig: me.getItemConfig(),
        tpl: me.getItemTpl(),
        minHeight: minimumHeight,
        cls: me.getItemCls()
      }

      if (me.getInfinite()) {
        config.translatable = {
          translationMethod: this.translationMethod
        }
      }

      if (!me.getVariableHeights()) {
        config.height = minimumHeight
      }

      return config
    },

    getListItemInfo: function () {
      var me = this
      var baseCls = me.getBaseCls()

      return {
        store: me.getStore(),
        grouped: me.getGrouped(),
        baseCls: baseCls,
        selectedCls: me.getSelectedCls(),
        headerCls: baseCls + '-header-wrap',
        footerCls: baseCls + '-footer-wrap',
        firstCls: baseCls + '-item-first',
        lastCls: baseCls + '-item-last',
        stripeCls: baseCls + '-item-odd',
        striped: me.getStriped(),
        itemMap: me.getItemMap(),
        defaultItemHeight: me.getItemHeight()
      }
    },

    // We override DataView's initialize method with an empty function
    initialize: function () {
      var me = this
      var container = me.container
      var scrollViewElement = me.scrollViewElement
      var indexBar = me.getIndexBar()
      var triggerEvent = me.getTriggerEvent()
      var triggerCtEvent = me.getTriggerCtEvent()

      if (indexBar) {
        scrollViewElement.appendChild(indexBar.renderElement)
      }

      if (triggerEvent) {
        me.on(triggerEvent, me.onItemTrigger, me)
      }
      if (triggerCtEvent) {
        me.on(triggerCtEvent, me.onContainerTrigger, me)
      }
      container.element.$dom.on('tap', '.' + me.getBaseCls() + '-disclosure', _.bind(me.handleItemDisclosure, me))
      /* container.element.on('tap', '.' + me.getBaseCls() + '-disclosure', {
        delegate: '.' + me.getBaseCls() + '-disclosure',
        tap: 'handleItemDisclosure',
        scope: me
      })*/

      /* container.element.on({
        resize: 'onContainerResize',
        scope: me
      })*/

      // Android 2.x not a direct child
      container.innerElement.on({
        touchstart: 'onItemTouchStart',
        touchend: 'onItemTouchEnd',
        tap: 'onItemTap',
        taphold: 'onItemTapHold',
        singletap: 'onItemSingleTap',
        doubletap: 'onItemDoubleTap',
        swipe: 'onItemSwipe',
        delegate: '.' + Tau.baseCSSPrefix + 'list-item',
        scope: me
      })

      if (me.getStore()) {
        me.refresh()
      }
    },

    handleItemDisclosure: function (e) {
      var me = this
      var item = Tau.getCmp(Tau.get(e.getTarget()).up('.x-list-item').id)
      var index = item.$dataIndex
      var record = me.getStore().getAt(index)

      me.trigger('disclose', [me, record, item, index, e], 'doDisclose')
    },

    onStoreClear: function () {
      var me = this
      var scroller = me.container.getScrollable().getScroller()
      var infinite = me.getInfinite()

      if (me.pinnedHeader) {
        me.pinnedHeader.translate(0, -10000)
      }

      if (!infinite) {
        me.setItemsCount(0)
        scroller.scrollTo(0, 0)
      } else {
        me.topRenderedIndex = 0
        me.topVisibleIndex = 0
        scroller.position.y = 0
        me.updateAllListItems()
      }
    },

    setItemsCount: function (itemsCount) {
      var me = this
      var listItems = me.listItems
      var config = me.getListItemConfig()
      var difference = itemsCount - listItems.length
      var i

      // This loop will create new items if the new itemsCount is higher than the amount of items we currently have
      for (i = 0; i < difference; i++) {
        me.createItem(config)
      }

      // This loop will destroy unneeded items if the new itemsCount is lower than the amount of items we currently have
      for (i = difference; i < 0; i++) {
        listItems.pop().destroy()
      }

      me.itemsCount = itemsCount

      // Finally we update all the list items with the correct content
      me.updateAllListItems()

      // Android Stock bug where redraw is needed to show empty list
      if (browser.is.AndroidStock && me.container.element && itemsCount === 0 && difference !== 0) {
        me.container.element.redraw()
      }

      return me.listItems
    },

    updateAllListItems: function () {
      var me = this
      var store = me.getStore()
      var items = me.listItems
      var info = me.getListItemInfo()
      var topRenderedIndex = me.topRenderedIndex
      var i, ln

      if (store) {
        for (i = 0, ln = items.length; i < ln; i++) {
          me.updateListItem(items[i], topRenderedIndex + i, info)
        }
      }

      if (me.isPainted()) {
        if (me.getInfinite() && store && store.getCount()) {
          me.handleItemHeights()
        }
        me.refreshScroller()
      }
    }
  })
}))
