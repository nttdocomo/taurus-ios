/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../tau'))
  }
}(this, function (define, Class, Tau) {
  return define('Tau.behavior.Behavior', Class, {
    constructor: function (component) {
      this.component = component

      component.on('destroy', this.onComponentDestroy)
    },

    onComponentDestroy: Tau.emptyFn
  })
}))
