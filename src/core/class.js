/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', 'backbone-super'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('backbone-super'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('backbone-super'))
  }
}(this, function (define, Backbone) {
  var Class = function () {}
  Class.extend = Backbone.View.extend
  return Class
}))
