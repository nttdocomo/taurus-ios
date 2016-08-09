/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', 'class', 'underscore', '../dom/element'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('class'), require('underscore'), require('../dom/element'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('class'), require('underscore'), require('../dom/element'))
  }
}(this, function (define, Class, _, Element) {
  return define('Tau.util.Wrapper', Class, {
    constructor: function (elementConfig, wrappedElement) {
      var element = this.link('element', Element.create(elementConfig))

      if (wrappedElement) {
        element.insertBefore(wrappedElement)
        this.wrap(wrappedElement)
      }
    },

    wrap: function (wrappedElement) {
      var element = this.element
      var innerDom

      this.wrappedElement = wrappedElement

      innerDom = element.$dom

      wrappedElement.$dom.wrap(innerDom)

      /* while (innerDom.firstElementChild !== null) {
        innerDom = innerDom.firstElementChild
      }

      innerDom.appendChild(wrappedElement.dom)*/
    }
  })
}))
