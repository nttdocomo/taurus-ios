/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './container'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./container'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./container'))
  }
}(this, function (define, Container) {
  return define(Container, {
    config: {
      /**
       * @cfg
       * @inheritdoc
       */
      baseCls: 'toolbar',

      /**
       * @cfg
       * @inheritdoc
       */
      cls: 'navigation-bar',

      /**
       * @cfg {String} ui
       * Style options for Toolbar. Either 'light' or 'dark'.
       * @accessor
       */
      ui: 'dark',

      /**
       * @cfg {String} title
       * The title of the toolbar.
       * @accessor
       */
      title: null,

      /**
       * @cfg {String} titleAlign
       * The alignment for the title of the toolbar.
       * @accessor
       */
      titleAlign: 'center',

      /**
       * @cfg {String} defaultType
       * The default xtype to create.
       * @accessor
       */
      defaultType: 'button',

      /**
       * @cfg {String} minHeight
       * The minimum height height of the Toolbar.
       * @accessor
       */
      minHeight: null,

      /**
       * @cfg
       * @hide
       */
      layout: {
        type: 'hbox'
      },

      /**
       * @cfg {Array/Object} items The child items to add to this TitleBar. The {@link #defaultType} of
       * a TitleBar is {@link Ext.Button}, so you do not need to specify an `xtype` if you are adding
       * buttons.
       *
       * You can also give items a `align` configuration which will align the item to the `left` or `right` of
       * the TitleBar.
       * @accessor
       */
      items: [],

      /**
       * @cfg {String} maxButtonWidth The maximum width of the button by percentage
       * @accessor
       */
      maxButtonWidth: '40%'
    },

    beforeInitialize: function () {
      this.applyItems = this.applyInitialItems
    },

    initialize: function () {
      delete this.applyItems

      this.add(this.initialItems)
      delete this.initialItems

      this.on({
        painted: 'refreshTitlePosition',
        single: true
      })
    },
    applyInitialItems: function () {
      console.log('applyInitialItems')
    }
  })
}))
