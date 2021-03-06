/**
 * @author nttdocomo
 */
/* global define */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./performance-now'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./performance-now'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./performance-now'))
  }
}(this, function (now) {
  var root = typeof window === 'undefined' ? global : window
  var vendors = ['moz', 'webkit']
  var suffix = 'AnimationFrame'
  var raf = root['request' + suffix]
  var caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

  for (var i = 0; !raf && i < vendors.length; i++) {
    raf = root[vendors[i] + 'Request' + suffix]
    caf = root[vendors[i] + 'Cancel' + suffix] || root[vendors[i] + 'CancelRequest' + suffix]
  }

  // Some versions of FF have rAF but not cAF
  if (!raf || !caf) {
    var last = 0
    var id = 0
    var queue = []
    var frameDuration = 1000 / 60
    var _now, next

    raf = function (callback) {
      if (queue.length === 0) {
        _now = now()
        next = Math.max(0, frameDuration - (_now - last))
        last = next + _now
        setTimeout(function () {
          var cp = queue.slice(0)
          // Clear queue here to prevent
          // callbacks from appending listeners
          // to the current frame's queue
          queue.length = 0
          for (var i = 0; i < cp.length; i++) {
            if (!cp[i].cancelled) {
              try {
                cp[i].callback(last)
              } catch(e) {
                setTimeout(function () { throw e }, 0)
              }
            }
          }
        }, Math.round(next))
      }
      queue.push({
        handle: ++id,
        callback: callback,
        cancelled: false
      })
      return id
    }

    caf = function (handle) {
      for (var i = 0; i < queue.length; i++) {
        if (queue[i].handle === handle) {
          queue[i].cancelled = true
        }
      }
    }
  }
  return function (fn) {
    // Wrap in a new function to prevent
    // `cancel` potentially being assigned
    // to the native rAF function
    return raf.call(root, fn)
  }
}))
