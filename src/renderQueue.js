/**
 * @author nttdocomo
 */
/* global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./raf'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./raf'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./raf'))
  }
}(this, function (raf) {
  var queue = []
  var scheduled = false

  function scheduleRender () {
    if (scheduled) {
      return
    }
    scheduled = true
    raf(function () {
      renderQueue()
      scheduled = false
    })
  }

  function renderQueue () {
    var obj = queue.pop()
    while (obj) {
      obj._vDomRender()
    }
  }

  return function (obj) {
    if (queue.indexOf(obj) === -1) {
      queue.push(obj)
    }
    scheduleRender()
  }
}))
