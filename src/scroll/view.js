/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../polyfill/object/merge', '../core/factory', './scroller', './indicator', '../dom/element', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('./scroller'), require('./indicator'), require('../dom/element'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('./scroller'), require('./indicator'), require('../dom/element'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, merge, factory, Scroller, Indicator, Element, _, Tau) {
  return define('Tau.scroll.View', Class, {
    config: {
      cls: Tau.baseCSSPrefix + 'scroll-view',
      element: null,
      indicators: {
        x: {
          axis: 'x'
        },
        y: {
          axis: 'y'
        }
      },
      scroller: {}
    },
    constructor: function (config) {
      config = this.processConfig(config)
      this.useIndicators = { x: true, y: true }
      this.doHideIndicators = _.bind(this.doHideIndicators, this)
      this.initConfig(config)
    },

    applyIndicators: function (config, indicators) {
      var defaultClass = Indicator
      var useIndicators = this.useIndicators

      if (!config) {
        config = {}
      }

      if (!config.x) {
        useIndicators.x = false
        config.x = {}
      }

      if (!config.y) {
        useIndicators.y = false
        config.y = {}
      }

      return {
        x: factory(config.x, defaultClass, indicators && indicators.x),
        y: factory(config.y, defaultClass, indicators && indicators.y)
      }
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

    isAxisEnabled: function (axis) {
      return this.getScroller().isAxisEnabled(axis) && this.useIndicators[axis]
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
    },

    refreshIndicator: function (axis) {
      if (!this.isAxisEnabled(axis)) {
        return this
      }

      var scroller = this.getScroller(),
        indicator = this.getIndicators()[axis],
        scrollerContainerSize = scroller.getContainerSize()[axis],
        scrollerSize = scroller.getSize()[axis],
        ratio = scrollerContainerSize / scrollerSize

      indicator.setRatio(ratio)
      indicator.refresh()
    },

    refreshIndicators: function () {
      var indicators = this.getIndicators()

      indicators.x.setActive(this.isAxisEnabled('x'))
      indicators.y.setActive(this.isAxisEnabled('y'))

      this.refreshIndicator('x')
      this.refreshIndicator('y')
    },

    updateElement: function (element) {
      var scroller = this.getScroller()
      var scrollerElement = element.getFirstChild().getFirstChild()
      if (this.FixedHBoxStretching) {
        scrollerElement = scrollerElement.getFirstChild()
      }

      element.addCls(this.getCls())
      element.insertFirst(this.indicatorsGrid)

      scroller.setElement(scrollerElement)

      this.refreshIndicators()

      return this
    },

    updateIndicators: function (indicators) {
      this.indicatorsGrid = Element.create({
        className: Tau.baseCSSPrefix + 'scroll-bar-grid-wrapper',
        children: [{
          className: Tau.baseCSSPrefix + 'scroll-bar-grid',
          children: [
            {
              children: [{}, {
                children: [indicators.y.barElement]
              }]
            },
            {
              children: [{
                children: [indicators.x.barElement]
              }, {}]
            }
          ]
        }]
      })
    }
  })
}))