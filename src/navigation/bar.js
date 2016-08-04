/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../titleBar', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../titleBar'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../titleBar'), require('tau'))
  }
}(this, function (define, TitleBar, Tau) {
  return define(TitleBar, {
    config: {
      /**
       * @cfg {Ext.Button/Object} backButton The configuration for the back button
       * @private
       * @accessor
       */
      backButton: {
        align: 'left',
        ui: 'back',
        hidden: true
      },
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
         * @cfg {String} title
         * The title of the toolbar. You should NEVER set this, it is used internally. You set the title of the
         * navigation bar by giving a navigation views children a title configuration.
         * @private
         * @accessor
         */
      title: null
    },
    /**
     * @event back
     * Fires when the back button was tapped.
     * @param {Ext.navigation.Bar} this This bar
     */

    constructor: function (config) {
      config = config || {}

      if (!config.items) {
        config.items = []
      }

      this.backButtonStack = []
      this.activeAnimations = []

      TitleBar.call(this, config)
    },

    /**
     * @private
     */
    doChangeView: function (view, hasPrevious, reverse) {
      var me = this,
        leftBox = me.leftBox,
        leftBoxElement = leftBox.element,
        titleComponent = me.titleComponent,
        titleElement = titleComponent.element,
        backButton = me.getBackButton(),
        titleText = me.getTitleText(),
        backButtonText = me.getBackButtonText(),
        animation = me.getAnimation() && view.getLayout().getAnimation(),
        animated = animation && animation.isAnimation && view.isPainted(),
        properties, leftGhost, titleGhost, leftProps, titleProps

      if (animated) {
        leftGhost = me.createProxy(leftBox.element)
        leftBoxElement.setStyle('opacity', '0')
        backButton.setText(backButtonText)
        backButton[hasPrevious ? 'show' : 'hide']()

        titleGhost = me.createProxy(titleComponent.element.getParent())
        titleElement.setStyle('opacity', '0')
        me.setTitle(titleText)

        properties = me.measureView(leftGhost, titleGhost, reverse)
        leftProps = properties.left
        titleProps = properties.title

        me.isAnimating = true
        me.animate(leftBoxElement, leftProps.element)
        me.animate(titleElement, titleProps.element, function () {
          titleElement.setLeft(properties.titleLeft)
          me.isAnimating = false
          me.refreshTitlePosition()
        })

        if (Ext.browser.is.AndroidStock2 && !this.getAndroid2Transforms()) {
          leftGhost.ghost.destroy()
          titleGhost.ghost.destroy()
        }else {
          me.animate(leftGhost.ghost, leftProps.ghost)
          me.animate(titleGhost.ghost, titleProps.ghost, function () {
            leftGhost.ghost.destroy()
            titleGhost.ghost.destroy()
          })
        }
      }else {
        if (hasPrevious) {
          backButton.setText(backButtonText)
          backButton.show()
        }else {
          backButton.hide()
        }
        me.setTitle(titleText)
      }
    },

    /**
     * Returns the text needed for the current title at anytime.
     * @private
     */
    getTitleText: function () {
      return this.backButtonStack[this.backButtonStack.length - 1]
    },

    /**
     * @private
     */
    onViewAdd: function (view, item) {
      var me = this
      var backButtonStack = me.backButtonStack
      var hasPrevious, title

      // me.endAnimation()

      title = (item.getTitle) ? item.getTitle() : item.config.title

      backButtonStack.push(title || '&nbsp;')
      hasPrevious = backButtonStack.length > 1

      me.doChangeView(view, hasPrevious, false)
    }
  })
}))
