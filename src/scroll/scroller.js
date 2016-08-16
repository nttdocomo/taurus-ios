/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../polyfill/object/merge', '../core/factory', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, merge, factory, _, Tau) {
  return define('Tau.scroll.Scroller', Class, {})
}))