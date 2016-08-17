/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../polyfill/object/merge', '../core/factory', './scroller', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('./scroller'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('./scroller'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, merge, factory, Scroller, _, Tau) {
  return define('Tau.scroll.View', Class, {
    config: {
      element: null,
      scroller: {}
    },
    constructor: function (config) {
      config = this.processConfig(config)
      this.useIndicators = { x: true, y: true }
      this.doHideIndicators = _.bind(this.doHideIndicators, this)
      this.initConfig(config)
    },

    applyScroller: function (config, currentScroller) {
      return factory(config, Scroller, currentScroller)
    },

    doHideIndicators: function () {
      var indicators = this.getIndicators()

      if (this.isAxisEnabled('x')) {
        indicators.x.hide()
      }

      if (this.isAxisEnabled('y')) {
        indicators.y.hide()
      }
    },

    /**
     * @method getScroller
     * Returns the scroller instance in this view. Checkout the documentation of {@link Ext.scroll.Scroller} and
     * {@link Ext.Container#getScrollable} for more information.
     * @return {Ext.scroll.View} The scroller
     */

    /**
     * @private
     */
    processConfig: function (config) {
      if (!config) {
        return null
      }

      if (typeof config === 'string') {
        config = {
          direction: config
        }
      }

      config = merge({}, config)

      var scrollerConfig = config.scroller
      var name

      if (!scrollerConfig) {
        config.scroller = scrollerConfig = {}
      }

      for (name in config) {
        if (config.hasOwnProperty(name)) {
          if (!this.hasConfig(name)) {
            scrollerConfig[name] = config[name]
            delete config[name]
          }
        }
      }

      return config
    }
  })
}))
