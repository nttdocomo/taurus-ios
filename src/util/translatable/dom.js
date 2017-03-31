/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', './abstract', '../../core/tau/getElement', '../../underscore', '../../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('./abstract'), require('../../core/tau/getElement'), require('../../underscore'), require('../../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('./abstract'), require('../../core/tau/getElement'), require('../../underscore'), require('../../tau'))
  }
}(this, function (define, Abstract, get, _, Tau) {
  return define('Tau.util.translatable.Dom', Abstract, {
    config: {
      element: null
    },

    applyElement: function (element) {
      if (!element) {
        return
      }

      return get(element)
    },

    updateElement: function () {
      this.refresh()
    }
  })
}))
