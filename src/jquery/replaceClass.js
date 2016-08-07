/*global define*/
;(function (root, factory) {
  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function') {
    if (define.amd) {
      define(['jquery'], function (_) {
        // Export global even in AMD case in case this script is loaded with
        // others that may still expect a global Backbone.
        return factory(_)
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('jquery'))
      })
    }

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined' && typeof require === 'function') {
    var _ = require('jquery')
    factory(_)

  // Finally, as a browser global.
  } else {
    factory(root._)
  }
}(this, function factory ($) {
  var removeTest = function (test, subject) {
    if (typeof test.test === 'function') {
      return test.test(subject)
    } else {
      return test === subject
    }
  }
  var replaceClass = function (oldClass, newClass) {
    for (var i = 0, l = this.length; i < l; i++) {
      var el = this[i]
      if (el.nodeType === 1) {
        var classNames = el.className.split(/\s+/)
        if (oldClass) {
          for (var k = 0; k < oldClass.length; k++) {
            var name = oldClass[k]
            for (var n = classNames.length; n--;) {
              if (removeTest(name, classNames[n])) classNames.splice(n, 1)
            }
          }
        }
        if (newClass) classNames = classNames.concat(newClass)
        el.className = classNames.join(' ')
      }
    }
  }
  $.fn.replaceClass = replaceClass
  return replaceClass
}))
