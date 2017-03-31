/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', './dom', '../../core/tau/getElement', '../underscore', '../../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('./dom'), require('../../core/tau/getElement'), require('../underscore'), require('../../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('./dom'), require('../../core/tau/getElement'), require('../underscore'), require('../../tau'))
  }
}(this, function (define, Dom, get, _, Tau) {
  return define('Tau.util.translatable.CssTransform', Dom, {
    doTranslate: function (x, y) {
      var element = this.getElement()
      if (!this.isDestroyed && !element.isDestroyed) {
        element.translate(x, y)
      }
    },

    destroy: function () {
      var element = this.getElement()

      if (element && !element.isDestroyed) {
        element.dom.style.webkitTransform = null
      }

      this.callSuper()
    }
  })
}))
