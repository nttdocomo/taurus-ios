/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require, exports, module)
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  }
}(this, function (require, exports, module) {
  return {
    escapeRegExp: function (str) {
      return String(str || '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
    },
    redirectTo: function (pathDesc, params, options) {
      return require.async(['../mediator'], function (mediator) {
        mediator.execute('router:route', pathDesc, params, options)
      })
    },
    loadModule: (function () {
      var enqueue
      if (typeof define === 'function') {
        if (define.amd) {
          return require
        }
        if (define.cmd) {
          return require.async
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
