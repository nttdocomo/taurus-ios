/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './abstractMixedCollection'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./abstractMixedCollection'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./abstractMixedCollection'))
  }
}(this, function (define, AbstractMixedCollection) {
  return define(AbstractMixedCollection, {})
}))
