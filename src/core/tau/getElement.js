/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../dom/element'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../dom/element'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../dom/element'))
  }
}(this, function (Element) {
  return function (element) {
    return Element.get(element)
  }
}))
