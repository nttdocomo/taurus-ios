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
  return define('Tau.scroll.indicator.CssTransform', Abstract, {
    config: {
      cls: 'csstransform'
    }
  })
}))
