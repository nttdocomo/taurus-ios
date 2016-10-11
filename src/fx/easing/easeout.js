/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['jquery'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('jquery'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'))
  }
}(this, function ($) {
  $.easing.easeout = function (t, b, c, d, s) {
    if (typeof s === 'undefined') s = 1.70158
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
  }
}))
