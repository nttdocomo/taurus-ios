/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory())
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory())
  } else {
    root.Class = factory()
  }
}(this, function () {
  return function createNS (namespace, value) {
    var root = window
    var parts = namespace.split('.')
    for (var e = 0, len = parts.length; e < len; e++) {
      var g = parts[e]
      typeof root[g] === 'undefined' && (root[g] = {})
      root = root[g]
    }
    root = value
    /*if (value) {
      for (var i in value) {
        root[i] = value[i]
      }
    }*/
    return root
  }
}))
