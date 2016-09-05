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
}(this, function (_) { // Array Remove - By John Resig (MIT Licensed)
  if (!String.prototype.capitalize) {
    String.prototype.capitalize = function () {
      return this.charAt(0).toUpperCase() + this.substr(1)
    }
  }
}))
