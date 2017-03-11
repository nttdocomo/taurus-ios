/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../base', '../taurus'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../base'), require('../taurus'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../base'), require('../taurus'))
  }
}(this, function (define, Base, Taurus) {
  return define('Tau.app.Controller', Base, {
    config: {
      controls: {}
    },
    init: Taurus.emptyFn,

    /**
     * @private
     */
    applyControl: function (config) {
      this.control(config, this)

      return config
    }
  })
}))
