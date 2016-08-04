/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', 'class', 'backbone', 'backbone-super', 'underscore', '../virtual-dom/h', '../virtual-dom/create-element', '../mixin/identifiable'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('class'), require('backbone'), require('backbone-super'), require('underscore'), require('../virtual-dom/h'), require('../virtual-dom/create-element'), require('../mixin/identifiable'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('class'), require('backbone'), require('backbone-super'), require('underscore'), require('../virtual-dom/h'), require('../virtual-dom/create-element'), require('../mixin/identifiable'))
  }
}(this, function (define, Class, Backbone, inherits, _, h, createElement, Identifiable) {
  var Element = define('Tau.dom.Element', Class, {
    constructor: function (dom, vdom) {
      if (typeof dom === 'string') {
        dom = document.getElementById(dom)
      }
      if (!dom) {
        throw new Error('Invalid domNode reference or an id of an existing domNode: ' + dom)
      }
      /**
       * The DOM element
       * @property dom
       * @type HTMLElement
       */
      this.dom = dom
      if (vdom) {
        this.vdom = vdom
      }

      this.getUniqueId()
    },

    getUniqueId: function () {
      var id = this.id
      var dom

      if (!id) {
        dom = this.dom

        if (dom.id.length > 0) {
          this.id = id = dom.id
        } else {
          dom.id = id = Identifiable.prototype.getUniqueId.call(this)
        }

        Element.cache[id] = this
      }

      return id
    }
  }, {
    cache: {},
    hyperScript: function (attributes) {
      var me = this
      var tag = attributes.tag
      var classList = attributes.classList
      if (!tag) {
        tag = 'div'
      }
      if (classList) {
        tag += '.' + classList.join('.')
      }
      if (attributes.children) {
        return h(tag, _.map(attributes.children, function (children) {
          return me.hyperScript(children)
        }))
      } else {
        return h(tag)
      }
    },
    create: function (attributes, domNode) {
      console.log(arguments)
      var vdom = this.hyperScript(attributes)
      var element = createElement(this.hyperScript(attributes))
      var instance = new Element(element, vdom)
      return element
    /* var ATTRIBUTES = this.CREATE_ATTRIBUTES
    var element, elementStyle, tag, value, name, i, ln

    if (!attributes) {
      attributes = {}
    }

    if (attributes.isElement) {
      return attributes.dom
    } else if ('nodeType' in attributes) {
      return attributes
    }

    if (typeof attributes === 'string') {
      return document.createTextNode(attributes)
    }

    tag = attributes.tag

    if (!tag) {
      tag = 'div'
    }
    if (attributes.namespace) {
      element = document.createElementNS(attributes.namespace, tag)
    } else {
      element = document.createElement(tag)
    }
    elementStyle = element.style

    for (name in attributes) {
      if (name !== 'tag') {
        value = attributes[name]

        switch (name) {
          case ATTRIBUTES.style:
            if (typeof value === 'string') {
              element.setAttribute(name, value)
            }else {
              for (i in value) {
                if (value.hasOwnProperty(i)) {
                  elementStyle[i] = value[i]
                }
              }
            }
            break

          case ATTRIBUTES.className:
          case ATTRIBUTES.cls:
            element.className = value
            break

          case ATTRIBUTES.classList:
            element.className = value.join(' ')
            break

          case ATTRIBUTES.text:
            element.textContent = value
            break

          case ATTRIBUTES.hidden:
            if (value) {
              element.style.display = 'none'
            }
            break

          case ATTRIBUTES.html:
            element.innerHTML = value
            break

          case ATTRIBUTES.children:
            for (i = 0, ln = value.length; i < ln; i++) {
              element.appendChild(this.create(value[i], true))
            }
            break

          default:
            element.setAttribute(name, value)
        }
      }
    }

    if (domNode) {
      return element
    }else {
      return this.get(element)
    }*/
    }
  })
  Element.mixin(Identifiable)
  return Element
}))
