/*global define*/
;(function (root, factory) {
  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore'], function (_) {
        // Export global even in AMD case in case this script is loaded with
        // others that may still expect a global Backbone.
        return factory(_)
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'), require('backbone'))
      })
    }

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined' && typeof require === 'function') {
    var _ = require('underscore')
    var Backbone = require('backbone')
    factory(_, Backbone)

  // Finally, as a browser global.
  } else {
    factory(root._, root.Backbone)
  }
}(this, function factory (_, Backbone) {
  _.deepClone = function (obj) {
    return (!obj || (typeof obj !== 'object')) ? obj
    : (_.isString(obj)) ? String.prototype.slice.call(obj)
    : (_.isDate(obj)) ? new Date(obj.valueOf())
    : (_.isFunction(obj.clone)) ? obj.clone()
    : (_.isArray(obj)) ? _.map(obj, function (t) { return _.deepClone(t) })
    : _.mapObject(obj, function (val, key) { return _.deepClone(val) })
  }
}))
