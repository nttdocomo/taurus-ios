/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../titleBar'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../titleBar'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../titleBar'))
  }
}(this, function (define, TitleBar) {
  return define(TitleBar, {
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
    }
  })
}))
