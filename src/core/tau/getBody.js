/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../get', '../../util/namespace', './getElement'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../get'), require('../../util/namespace'), require('./getElement'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../get'), require('../../util/namespace'), require('./getElement'))
  }
}(this, function (get, create, getElement) {
  return function () {
    var documentBodyElement = get('Tau.documentBodyElement')
    if (!documentBodyElement) {
      if (!document.body) {
        throw new Error('[Ext.getBody] document.body does not exist at this point')
      }

      documentBodyElement = getElement(document.body)
      create('Tau.documentBodyElement', documentBodyElement)
    }
    return documentBodyElement
  }
}))
