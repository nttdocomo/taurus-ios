/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', './component/dataItem', '../mixin/selectable', 'tau', './element/container'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('../mixin/selectable'), require('tau'), require('./element/container'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('../mixin/selectable'), require('tau'), require('./element/container'))
  }
}(this, function (define, Container, DataItem, Selectable, Tau) {
  return define('Tau.dataview.DataView', Container, {
    config: {
      /**
       * @cfg baseCls
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'dataview',
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
        }else {
          me.on({
            painted: 'refresh',
            single: true
          })
        }
      }
    }
  })
}))
