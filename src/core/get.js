/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('underscore'), require('tau'))
  }
}(this, function (_, Tau) {
  var get = function (name) {
    var root = window
    var parts = name.split('.')
    var i, ln, part
    for (i = 0, ln = parts.length; i < ln; i++) {
      part = parts[i]

      if (typeof part !== 'string') {
        root = part
      } else {
        if (!root || !root[part]) {
          return null
        }

        root = root[part]
      }
    }
    return root
  }
  Tau.get = get
  return get
}))
