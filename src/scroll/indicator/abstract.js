/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../component', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../component'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../component'), require('underscore'), require('tau'))
  }
}(this, function (define, Component, _, Tau) {
  return define('Tau.scroll.indicator.Abstract', Component, {
    cachedConfig: {
      ratio: 1,

      barCls: Tau.baseCSSPrefix + 'scroll-bar',

      active: true
    }
  })
}))
