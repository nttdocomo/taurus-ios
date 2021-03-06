/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory()
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  }
}(this, function () {
  return {
    escapeRegExp: function (str) {
      String(str || '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
    }
  }
}))
