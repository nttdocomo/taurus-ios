/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './container', './component', './title', './tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./container'), require('./component'), require('./title'), require('./tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./container'), require('./component'), require('./title'), require('./tau'))
  }
}(this, function (define, Container, Component, Title, Tau) {
  return define(Container, {
    config: {
      /**
       * @cfg
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'toolbar',

      /**
       * @cfg
       * @inheritdoc
       */
      cls: Tau.baseCSSPrefix + 'navigation-bar',

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
    applyInitialItems: function (items) {
      var me = this
      var titleAlign = me.getTitleAlign()
      var defaults = me.getDefaults() || {}

      me.initialItems = items

      me.leftBox = me.add({
        xclass: Container,
        style: 'position: relative',
        layout: {
          type: 'hbox',
          align: 'center'
        },
        listeners: {
          resize: 'refreshTitlePosition',
          scope: me
        }
      })

      me.spacer = me.add({
        xclass: Component,
        style: 'position: relative',
        flex: 1,
        listeners: {
          resize: 'refreshTitlePosition',
          scope: me
        }
      })

      me.rightBox = me.add({
        xclass: Container,
        style: 'position: relative',
        layout: {
          type: 'hbox',
          align: 'center'
        },
        listeners: {
          resize: 'refreshTitlePosition',
          scope: me
        }
      })

      switch (titleAlign) {
        case 'left':
          me.titleComponent = me.leftBox.add({
            xtype: 'title',
            cls: Tau.baseCSSPrefix + 'title-align-left',
            hidden: defaults.hidden
          })
          me.refreshTitlePosition = Tau.emptyFn
          break
        case 'right':
          me.titleComponent = me.rightBox.add({
            xtype: 'title',
            cls: Tau.baseCSSPrefix + 'title-align-right',
            hidden: defaults.hidden
          })
          me.refreshTitlePosition = Tau.emptyFn
          break
        default:
          me.titleComponent = me.add({
            xclass: Title,
            hidden: defaults.hidden,
            centered: true
          })
          break
      }

      me.doAdd = me.doBoxAdd
    /* me.remove = me.doBoxRemove
    me.doInsert = me.doBoxInsert*/
    },
    doBoxAdd: function (item) {
      if (item.config.align === 'right') {
        this.rightBox.add(item)
      } else {
        this.leftBox.add(item)
      }
    },
    // @private
    updateTitle: function (newTitle) {
      this.titleComponent.setTitle(newTitle)

      if (this.isPainted()) {
        this.refreshTitlePosition()
      }
    }
  })
}))
