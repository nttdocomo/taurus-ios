/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', './abstract', 'modernizr'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('./abstract'), require('modernizr'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('./abstract'), require('modernizr'))
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
    }
  })
}))
