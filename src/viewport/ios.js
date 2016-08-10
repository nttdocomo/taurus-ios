/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './default', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./default'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./default'), require('../tau'))
  }
}(this, function (define, Default, Tau) {
  return define('Tau.viewport.Ios', Default, {
    constructor: function () {
      Default.apply(this, arguments)

      /* if (this.getAutoMaximize() && !this.isFullscreen()) {
        this.addWindowListener('touchstart', Ext.Function.bind(this.onTouchStart, this));
      }*/
    }
  })
}))
