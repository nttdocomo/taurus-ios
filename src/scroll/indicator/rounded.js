/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', './abstract', 'underscore', 'tau', 'modernizr'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('./abstract'), require('underscore'), require('tau'), require('modernizr'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('./abstract'), require('underscore'), require('tau'), require('modernizr'))
  }
}(this, function (define, Abstract, _, Tau, Modernizr) {
  return define('Tau.scroll.indicator.Rounded', Abstract, {

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function (config) {
      Abstract.apply(this, arguments)
      this.transformPropertyName = Modernizr.prefixed('transform')
    }
  })
}))
