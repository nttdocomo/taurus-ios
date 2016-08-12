/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('underscore'))
  }
}(this, function (_, get) {
  var Tau = {}
  _.extend(Tau, {
    baseCSSPrefix: 't-',
    emptyFn: function () {},
    getDom: function (el) {
      if (!el || !document) {
        return null
      }

      return el.$dom ? el.$dom : (typeof el === 'string' ? document.getElementById(el) : el)
    },

    /**
     * Returns `true` if the passed value is an HTMLElement.
     * @param {Object} value The value to test.
     * @return {Boolean}
     */
    isElement: function (value) {
      return value ? value.nodeType === 1 : false
    }
  })
  return Tau
}))
