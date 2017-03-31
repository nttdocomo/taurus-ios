/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', './abstract', '../../modernizr'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('./abstract'), require('../../modernizr'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('./abstract'), require('../../modernizr'))
  }
}(this, function (define, Abstract, Modernizr) {
  return define('Tau.scroll.indicator.Rounded', Abstract, {
    config: {
      cls: 'rounded'
    },

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function (config) {
      Abstract.apply(this, arguments)
      this.transformPropertyName = Modernizr.prefixed('transform')
    },

    doUpdateLength: function (length) {
      if (!this.isDestroyed) {
        var axis = this.getAxis()
        var endElement = this.endElement
        var middleElementStyle = this.middleElement.dom.style
        var endElementLength = this.endElementLength
        var endElementOffset = length - endElementLength
        var middleElementLength = endElementOffset - this.startElementLength
        var transformPropertyName = this.transformPropertyName

        if (axis === 'x') {
          endElement.translate(endElementOffset, 0)
          middleElementStyle[transformPropertyName] = 'translate3d(0, 0, 0) scaleX(' + middleElementLength + ')'
        } else {
          endElement.translate(0, endElementOffset)
          middleElementStyle[transformPropertyName] = 'translate3d(0, 0, 0) scaleY(' + middleElementLength + ')'
        }
      }
    },
    getElementConfig: function () {
      var config = this._super()

      config.children[0].children = [
        {
          reference: 'startElement'
        },
        {
          reference: 'middleElement'
        },
        {
          reference: 'endElement'
        }
      ]

      return config
    },

    refresh: function () {
      var axis = this.getAxis()
      var startElementDom = this.startElement.dom
      var endElementDom = this.endElement.dom
      var middleElement = this.middleElement
      var startElementLength, endElementLength

      if (axis === 'x') {
        startElementLength = startElementDom.offsetWidth
        endElementLength = endElementDom.offsetWidth
        middleElement.setLeft(startElementLength)
      } else {
        startElementLength = startElementDom.offsetHeight
        endElementLength = endElementDom.offsetHeight
        middleElement.setTop(startElementLength)
      }

      this.startElementLength = startElementLength
      this.endElementLength = endElementLength

      this._super()
    }
  })
}))
