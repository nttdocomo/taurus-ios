/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore', '../tau', './get'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'), require('../tau'), require('./get'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('underscore'), require('../tau'), require('./get'))
  }
}(this, function (_, Tau, get) {
  var create = function (namespace, config) {
    var cls = get(namespace)
    return new cls(config)
  }
  Tau.create = create
  return create
}))
