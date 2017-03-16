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
    },
    loadModule: (function () {
      var define, enqueue, require
      define = window.define
      require = window.require
      if (typeof define === 'function') {
        if (define.amd) {
          return function (moduleName, handler) {
            return require([moduleName], handler)
          }
        }
        if (define.cmd) {
          return function (moduleName, handler) {
            return require.async([moduleName], handler)
          }
        }
      } else {
        enqueue = typeof setImmediate !== 'undefined' && setImmediate !== null ? setImmediate : setTimeout
        return function (moduleName, handler) {
          return enqueue(function () {
            return handler(require(moduleName))
          })
        }
      }
    })()
  }
}))
