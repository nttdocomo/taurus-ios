/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './dataView', '../layout/Fit', '../core/factory', './component/simpleListItem', './component/ListItem', './listItemHeader', '../container', '../util/positionMap', '../env/browser', '../polyfill/array/remove', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./dataView'), require('../layout/Fit'), require('../core/factory'), require('./component/simpleListItem'), require('./component/ListItem'), require('./listItemHeader'), require('../container'), require('../util/positionMap'), require('../env/browser'), require('../polyfill/array/remove'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./dataView'), require('../layout/Fit'), require('../core/factory'), require('./component/simpleListItem'), require('./component/ListItem'), require('./listItemHeader'), require('../container'), require('../util/positionMap'), require('../env/browser'), require('../polyfill/array/remove'), require('underscore'), require('tau'))
  }
}(this, function (define, DataView, Fit, factory, SimpleListItem, ListItem, ListItemHeader, Container, PositionMap, browser, remove, _, Tau) {
  return define('Tau.dataview.List', DataView, {
    config: {
      /**
       * @cfg baseCls
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'list',
      /**
         * @cfg {String} defaultType
         * The xtype used for the component based DataView. Defaults to dataitem.
         * Note this is only used when useComponents is true.
         * @accessor
         */
      defaultType: undefined,
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
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * `true` to display a disclosure icon on each list item.
         * The list will still fire the disclose event, and the event can be stopped before itemtap.
         * By setting this config to a function, the function passed will be called when the disclosure
         * is tapped.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
      onItemDisclosure: null,

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
      ui: 'normal',
      /**
         * @cfg {Boolean} useSimpleItems
         * Set this to true if you just want to have the list create simple items that use the itemTpl.
         * These simple items still support headers, grouping and disclosure functionality but avoid
         * container layouts and deeply nested markup. For many Lists using this configuration will
         * drastically increase the scrolling and render performance.
         */
      useSimpleItems: true
    },
    topRenderedIndex: 0,
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

    applyDefaultType: function (defaultType) {
      if (!defaultType) {
        defaultType = this.getUseSimpleItems() ? SimpleListItem : ListItem
      }
      return defaultType
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

    createItem: function (config) {
      var me = this
      var container = me.container
      var listItems = me.listItems
      var infinite = me.getInfinite()
      var scrollElement = me.scrollElement
      var item, header, itemCls

      item = factory(config)
      item.dataview = me
      item.$height = config.minHeight

      if (!infinite) {
        itemCls = me.getBaseCls() + '-item-relative'
        item.addCls(itemCls)
      }

      header = item.getHeader()
      if (!infinite) {
        header.addCls(itemCls)
      } else {
        header.setTranslatable({
          translationMethod: this.translationMethod
        })
        header.translate(0, -10000)

        scrollElement.insertFirst(header.renderElement)
      }

      container.doAdd(item)
      listItems.push(item)

      return item
    },

    getListItemConfig: function () {
      var me = this
      var minimumHeight = me.getItemMap().getMinimumHeight()
      var config = {
        xclass: me.getDefaultType(),
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
      container.innerElement.$dom.on({
        click: function () {
          console.log('asdasd')
        },
        touchend: this.onItemTouchEnd,
        tap: this.onItemTap,
        taphold: this.onItemTapHold,
        singletap: this.onItemSingleTap,
        doubletap: this.onItemDoubleTap,
        swipe: this.onItemSwipe
      })

      //container.innerElement.$dom.trigger('touchstart')

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

    hideScrollDockItems: function () {
      var me = this
      var infinite = me.getInfinite()
      var scrollDockItems = me.scrollDockItems
      var i, ln, item

      if (!infinite) {
        return
      }

      for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
        item = scrollDockItems.top[i]
        item.translate(0, -10000)
      }

      for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
        item = scrollDockItems.bottom[i]
        item.translate(0, -10000)
      }
    },

    onItemTap: function (e) {
      this._super(this.parseEvent(e))
    },

    onItemTouchStart: function (e) {
      console.log('asdads')
      this.container.innerElement.on({
        touchmove: 'onItemTouchMove'/*,
        delegate: '.' + Tau.baseCSSPrefix + 'list-item',
        single: true,
        scope: this*/
      })
      // this._super(e)
    },

    onItemTouchEnd: function (e) {
      this.container.innerElement.un({
        touchmove: 'onItemTouchMove',
        delegate: '.' + Tau.baseCSSPrefix + 'list-item',
        scope: this
      })
      this.callParent(this.parseEvent(e))
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

    refreshScroller: function () {
      var me = this

      if (me.isPainted()) {
        if (!me.getInfinite() && me.getGrouped() && me.getPinHeaders()) {
          me.updateHeaderMap()
        }

        me.container.getScrollable().getScroller().refresh()
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
    },

    updateListItem: function (item, index, info) {
      var me = this
      var record = info.store.at(index)
      var headerIndices = me.headerIndices
      var footerIndices = me.footerIndices
      var header = item.getHeader()
      var scrollDockItems = me.scrollDockItems
      var updatedItems = me.updatedItems
      var currentItemCls = item.renderElement.classList.slice()
      var currentHeaderCls = header.renderElement.classList.slice()
      var infinite = me.getInfinite()
      var storeCount = info.store.getCount()
      var itemCls = []
      var headerCls = []
      var itemRemoveCls = [info.headerCls, info.footerCls, info.firstCls, info.lastCls, info.selectedCls, info.stripeCls]
      var headerRemoveCls = [info.headerCls, info.footerCls, info.firstCls, info.lastCls]
      var ln, i, scrollDockItem, classCache

      // When we update a list item, the header and scrolldocks can make it have to be retransformed.
      // For that reason we want to always set the position to -10000 so that the next time we translate
      // all the pieces are transformed to the correct location
      if (infinite) {
        item.$position = -10000
      }

      // We begin by hiding/showing the item and its header depending on a record existing at this index
      if (!record) {
        item.setRecord(null)
        if (infinite) {
          item.translate(0, -10000)
        } else {
          item.hide()
        }

        if (infinite) {
          header.translate(0, -10000)
        } else {
          header.hide()
        }
        item.$hidden = true
        return
      } else if (item.$hidden) {
        if (!infinite) {
          item.show()
        }
        item.$hidden = false
      }

      if (infinite) {
        updatedItems.push(item)
      }

      // If this item was previously used for the first record in the store, and now it will not be, then we hide
      // any scrollDockTop items and change the isFirst flag
      if (item.isFirst && index !== 0 && scrollDockItems.top.length) {
        for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
          scrollDockItem = scrollDockItems.top[i]
          if (infinite) {
            scrollDockItem.translate(0, -10000)
          }
        }
        item.isFirst = false
      }

      // If this item was previously used for the last record in the store, and now it will not be, then we hide
      // any scrollDockBottom items and change the istLast flag
      if (item.isLast && index !== storeCount - 1 && scrollDockItems.bottom.length) {
        for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
          scrollDockItem = scrollDockItems.bottom[i]
          if (infinite) {
            scrollDockItem.translate(0, -10000)
          }
        }
        item.isLast = false
      }

      // If the item is already bound to this record then we shouldn't have to do anything
      if (item.$dataIndex !== index) {
        item.$dataIndex = index
        me.trigger('itemindexchange', me, record, index, item)
      }

      // This is where we actually update the item with the record
      if (item.getRecord() === record) {
        item.updateRecord(record)
      } else {
        item.setRecord(record)
      }

      if (me.isSelected(record)) {
        itemCls.push(info.selectedCls)
      }

      if (info.grouped) {
        if (headerIndices[index]) {
          itemCls.push(info.headerCls)
          headerCls.push(info.headerCls)
          header.setHtml(info.store.getGroupString(record))

          if (!infinite) {
            header.renderElement.insertBefore(item.renderElement)
          }
          header.show()
        } else {
          if (infinite) {
            header.translate(0, -10000)
          } else {
            header.hide()
          }
        }
        if (footerIndices[index]) {
          itemCls.push(info.footerCls)
          headerCls.push(info.footerCls)
        }
      }

      if (!info.grouped) {
        header.hide()
      }

      if (index === 0) {
        item.isFirst = true
        itemCls.push(info.firstCls)
        headerCls.push(info.firstCls)

        if (!info.grouped) {
          itemCls.push(info.headerCls)
          headerCls.push(info.headerCls)
        }

        if (!infinite) {
          for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
            scrollDockItem = scrollDockItems.top[i]
            if (info.grouped) {
              scrollDockItem.renderElement.insertBefore(header.renderElement)
            } else {
              scrollDockItem.renderElement.insertBefore(item.renderElement)
            }
          }
        }
      }

      if (index === storeCount - 1) {
        item.isLast = true
        itemCls.push(info.lastCls)
        headerCls.push(info.lastCls)

        if (!info.grouped) {
          itemCls.push(info.footerCls)
          headerCls.push(info.footerCls)
        }

        if (!infinite) {
          for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
            scrollDockItem = scrollDockItems.bottom[i]
            scrollDockItem.renderElement.insertAfter(item.renderElement)
          }
        }
      }

      if (info.striped && index % 2 === 1) {
        itemCls.push(info.stripeCls)
      }

      if (currentItemCls) {
        for (i = 0; i < itemRemoveCls.length; i++) {
          remove(currentItemCls, itemRemoveCls[i])
        }
        itemCls = _.union(itemCls, currentItemCls)
      }

      if (currentHeaderCls) {
        for (i = 0; i < headerRemoveCls.length; i++) {
          remove(currentHeaderCls, headerRemoveCls[i])
        }
        headerCls = _.union(headerCls, currentHeaderCls)
      }

      classCache = itemCls.join(' ')

      if (item.classCache !== classCache) {
        item.renderElement.setCls(itemCls)
        item.classCache = classCache
      }

      header.renderElement.setCls(headerCls)
    }
  })
}))
