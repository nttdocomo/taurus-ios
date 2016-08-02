/*global define*/
/**
 * @author nttdocomo
 */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './dom/element', './base', './virtual-dom/h', './virtual-dom/diff', './virtual-dom/patch', './virtual-dom/create-element', 'renderQueue', './dom2hscript/index', 'underscore', 'backbone', 'backbone-super'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./dom/element'), require('./base'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('backbone'), require('backbone-super'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./dom/element'), require('./base'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('backbone'), require('backbone-super'))
  }
}(this, function (define, Element, Base, h, diff, patch, createElement, renderQueue, dom2hscript, _, Backbone) {
  return define('Tau.AbstractComponent', Base, {
    initElement: function () {
      // var id = this.getId()
      var elementConfig = this.getElementConfig()
      var renderElement = Element.create(elementConfig, true)
      var i, ln, referenceNode, reference, element
      this.setElement(renderElement)
      if (!this.innerElement) {
        this.innerElement = renderElement
      }
    }
  }).mixin(Backbone.View)
}))
