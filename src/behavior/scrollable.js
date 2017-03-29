/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './behavior', '../scroll/view', '../env/feature', '../underscore', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./behavior'), require('../scroll/view'), require('../env/feature'), require('../underscore'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./behavior'), require('../scroll/view'), require('../env/feature'), require('../underscore'), require('../tau'))
  }
}(this, function (define, Behavior, View, feature, _, Tau) {
  return define('Tau.behavior.Scrollable', Behavior, {
    constructor: function () {
      this.listeners = {
        painted: 'onComponentPainted',
        scope: this
      }

      Behavior.apply(this, arguments)
    },

    setConfig: function (config) {
      var scrollView = this.scrollView
      var component = this.component
      var scrollerElement, extraWrap, scroller, direction

      if (config) {
        if (!scrollView) {
          this.scrollView = scrollView = new View(config)
          scrollView.on('destroy', 'onScrollViewDestroy', this)

          component.setUseBodyElement(true)

          this.scrollerElement = scrollerElement = component.innerElement

          if (!feature.has.ProperHBoxStretching) {
            scroller = scrollView.getScroller()
            direction = (_.isObject(config) ? config.direction : config) || 'auto'

            if (direction !== 'vertical') {
              extraWrap = scrollerElement.wrap()
              extraWrap.addCls(Tau.baseCSSPrefix + 'translatable-hboxfix')
              if (direction === 'horizontal') {
                extraWrap.setStyle({height: '100%'})
              }
              this.scrollContainer = extraWrap.wrap()
              scrollView.FixedHBoxStretching = scroller.FixedHBoxStretching = true
            } else {
              this.scrollContainer = scrollerElement.wrap()
            }
          } else {
            this.scrollContainer = scrollerElement.wrap()
          }

          scrollView.setElement(component.bodyElement)

          if (component.isPainted()) {
            this.onComponentPainted()
          }

          component.on(this.listeners)
        } else if (_.isString(config) || _.isObject(config)) {
          scrollView.setConfig(config)
        }
      } else if (scrollView) {
        scrollView.destroy()
      }

      return this
    },

    getScrollView: function () {
      return this.scrollView
    }
  })
}))
