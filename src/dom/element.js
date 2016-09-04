/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', 'class', 'underscore', '../virtual-dom/h', '../virtual-dom/create-element', '../mixin/identifiable', 'jquery', '../core/tau/getDom', '../env/browser', 'tau', '../polyfill/array/remove'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('class'), require('underscore'), require('../virtual-dom/h'), require('../virtual-dom/create-element'), require('../mixin/identifiable'), require('jquery'), require('../core/tau/getDom'), require('../env/browser'), require('tau'), require('../polyfill/array/remove'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('class'), require('underscore'), require('../virtual-dom/h'), require('../virtual-dom/create-element'), require('../mixin/identifiable'), require('jquery'), require('../core/tau/getDom'), require('../env/browser'), require('tau'), require('../polyfill/array/remove'))
  }
}(this, function (define, Class, _, h, createElement, Identifiable, $, getDom, Browser, Tau) {
  var Element = define('Tau.dom.Element', Class, {
    classNameSplitRegex: /[\s]+/,
    SEPARATOR: '-',
    isElement: true,
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
      this.$dom = $(dom)
      if (vdom) {
        this.vdom = vdom
      }

      this.getUniqueId()
    }, /**
     * Adds the given CSS class(es) to this Element.
     * @param {String} names The CSS class(es) to add to this element.
     * @param {String} [prefix] (optional) Prefix to prepend to each class.
     * @param {String} [suffix] (optional) Suffix to append to each class.
     */
    addCls: function (names, prefix, suffix) {
      if (!names) {
        return this
      }

      if (!this.isSynchronized) {
        this.synchronize()
      }

      var dom = this.dom
      var map = this.hasClassMap
      var classList = this.classList
      var SEPARATOR = this.SEPARATOR
      var i, ln, name

      prefix = prefix ? prefix + SEPARATOR : ''
      suffix = suffix ? SEPARATOR + suffix : ''

      if (typeof names === 'string') {
        names = names.split(this.spacesRe)
      }

      for (i = 0, ln = names.length; i < ln; i++) {
        name = prefix + names[i] + suffix

        if (!map[name]) {
          map[name] = true
          classList.push(name)
        }
      }

      dom.className = classList.join(' ')

      return this
    },
    appendChild: function (element) {
      this.append(element)
    },

    append: function (element) {
      this.$dom.append(getDom(element))
    },
    getFirstChild: function () {
      return Element.get(this.dom.firstElementChild)
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
    },

    /**
     * Inserts this element before the passed element in the DOM.
     * @param {String/HTMLElement/Ext.dom.Element} el The element before which this element will be inserted.
     * The id of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    insertBefore: function (el) {
      el = getDom(el)
      this.$dom.insertBefore(el)
      return this
    },

    /**
     * Inserts an element as the first child of this element.
     * @param {String/HTMLElement/Ext.dom.Element} element The `id` or element to insert.
     * @return {Ext.dom.Element} this
     */
    insertFirst: function (element) {
      var elementDom = getDom(element)
      var dom = this.dom
      var firstChild = dom.firstChild

      if (!firstChild) {
        dom.appendChild(elementDom)
      } else {
        elementDom.insertBefore(firstChild)
      }

      return this
    },

    isPainted: (function () {
      return !Browser.is.IE ? function () {
        var dom = this.dom
        return Boolean(dom && dom.offsetParent)
      } : function () {
        var dom = this.dom
        return Boolean(dom && (dom.offsetHeight !== 0 && dom.offsetWidth !== 0))
      }
    })(),

    isSynchronized: false,

    /**
     * Removes the given CSS class(es) from this Element.
     * @param {String} names The CSS class(es) to remove from this element.
     * @param {String} [prefix=''] Prefix to prepend to each class to be removed.
     * @param {String} [suffix=''] Suffix to append to each class to be removed.
     */
    removeCls: function (names, prefix, suffix) {
      if (!names) {
        return this
      }

      if (!this.isSynchronized) {
        this.synchronize()
      }

      if (!suffix) {
        suffix = ''
      }

      var dom = this.$dom
      var map = this.hasClassMap
      var removeClsList = []
      var SEPARATOR = this.SEPARATOR
      var i, ln, name

      prefix = prefix ? prefix + SEPARATOR : ''
      suffix = suffix ? SEPARATOR + suffix : ''

      if (typeof names === 'string') {
        names = names.split(this.spacesRe)
      }

      for (i = 0, ln = names.length; i < ln; i++) {
        name = prefix + names[i] + suffix

        if (map[name]) {
          delete map[name]
          removeClsList.push(name)
        }
      }

      dom.removeClass(removeClsList.join(' '))

      return this
    },

    /**
     * Replaces the passed element with this element.
     * @param {String/HTMLElement/Ext.dom.Element} element The element to replace.
     * The id of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    replace: function (element) {
      element = getDom(element)

      element.replaceWith(this.$dom)

      return this
    },

    /**
     * Replaces a CSS class on the element with another.
     * If the old name does not exist, the new name will simply be added.
     * @param {String} oldName The CSS class to replace.
     * @param {String} newName The replacement CSS class.
     * @param {String} [prefix=''] Prefix to prepend to each class to be replaced.
     * @param {String} [suffix=''] Suffix to append to each class to be replaced.
     * @return {Ext.dom.Element} this
     */
    replaceCls: function (oldName, newName, prefix, suffix) {
      if (!oldName && !newName) {
        return this
      }

      oldName = oldName || []
      newName = newName || []

      if (!this.isSynchronized) {
        this.synchronize()
      }

      if (!suffix) {
        suffix = ''
      }

      var $dom = this.$dom
      /* var map = this.hasClassMap
      var classList = this.classList*/
      var SEPARATOR = this.SEPARATOR
      // var i, ln, name

      prefix = prefix ? prefix + SEPARATOR : ''
      suffix = suffix ? SEPARATOR + suffix : ''

      if (typeof oldName === 'string') {
        oldName = oldName.split(this.spacesRe)
      }
      if (typeof newName === 'string') {
        newName = newName.split(this.spacesRe)
      }
      oldName = oldName.map(function (item) {
        return prefix + item + suffix
      })
      newName = newName.map(function (item) {
        return prefix + item + suffix
      })
      $dom.replaceClass(oldName, newName)
      /* for (i = 0, ln = oldName.length; i < ln; i++) {
        name = prefix + oldName[i] + suffix

        if (map[name]) {
          delete map[name]
          classList.remove(name)
        }
      }

      for (i = 0, ln = newName.length; i < ln; i++) {
        name = prefix + newName[i] + suffix

        if (!map[name]) {
          map[name] = true
          classList.push(name)
        }
      }

      dom.className = classList.join(' ')*/

      return this
    },
    setCls: function (names) {
      this.$dom.attr('class', names.join(' '))
    },

    /**
     * Sets the `innerHTML` of this element.
     * @param {String} html The new HTML.
     */
    setHtml: function (html) {
      this.$dom.html(html)
    },

    setSizeState: function (state) {
      var classes = _.map(['sized', 'unsized', 'stretched'], function (item) {
        return Tau.baseCSSPrefix + item
      })
      var states = [true, false, null]
      var index = states.indexOf(state)
      var addedClass

      if (index !== -1) {
        addedClass = classes[index]
        classes.splice(index, 1)
        this.addCls(addedClass)
      }

      this.removeCls(classes)

      return this
    },

    /**
     * @private
     */
    synchronize: function () {
      var dom = this.dom
      var hasClassMap = {}
      var className = dom.className
      var classList, i, ln, name

      if (className.length > 0) {
        classList = dom.className.split(this.classNameSplitRegex)

        for (i = 0, ln = classList.length; i < ln; i++) {
          name = classList[i]
          hasClassMap[name] = true
        }
      } else {
        classList = []
      }

      this.classList = classList

      this.hasClassMap = hasClassMap

      this.isSynchronized = true

      return this
    },

    /**
     * Toggles the specified CSS class on this element (removes it if it already exists, otherwise adds it).
     * @param {String} className The CSS class to toggle.
     * @return {Ext.dom.Element} this
     */
    toggleCls: function (className, force) {
      this.$dom.toggleClass(className)

      return this
    },

    translate: function () {
      var transformStyleName = 'webkitTransform' in document.createElement('div').style ? 'webkitTransform' : 'transform'

      return function (x, y, z) {
        this.dom.style[transformStyleName] = 'translate3d(' + (x || 0) + 'px, ' + (y || 0) + 'px, ' + (z || 0) + 'px)'
      }
    }(),

    /**
     * Translates the passed page coordinates into left/top CSS values for this element.
     * @param {Number/Array} x The page `x` or an array containing [x, y].
     * @param {Number} y (optional) The page `y`, required if `x` is not an array.
     * @return {Object} An object with `left` and `top` properties. e.g. `{left: (value), top: (value)}`.
     */
    translatePoints: function (x, y) {
      y = isNaN(x[1]) ? y : x[1]
      x = isNaN(x[0]) ? x : x[0]

      var me = this
      var relative = me.isStyle('position', 'relative')
      var o = me.getXY()
      var l = parseInt(me.getStyle('left'), 10)
      var t = parseInt(me.getStyle('top'), 10)

      l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft)
      t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop)

      return {left: (x - o[0] + l), top: (y - o[1] + t)}
    },

    /**
     * Creates and wraps this element with another element.
     * @param {Object} [config] (optional) DomHelper element config object for the wrapper element or `null` for an empty div
     * @param {Boolean} [domNode] (optional) `true` to return the raw DOM element instead of Ext.dom.Element.
     * @return {HTMLElement/Ext.dom.Element} The newly created wrapper element.
     */
    wrap: function (config, domNode) {
      var dom = this.dom
      var wrapper = this.constructor.create(config, domNode)
      var wrapperDom = (domNode) ? wrapper : wrapper.dom
      var parentNode = dom.parentNode

      if (parentNode) {
        parentNode.insertBefore(wrapperDom, dom)
      }

      wrapperDom.appendChild(dom)

      return wrapper
    }
  }, {
    cache: {},
    hyperScript: function (attributes) {
      var me = this
      if (!attributes) {
        attributes = {}
      }
      var tag = attributes.tag
      var classList = attributes.classList || []
      if (!tag) {
        tag = 'div'
      }
      if (!attributes.className) {
        attributes.className = ''
      }
      if (attributes.cls) {
        classList.push(attributes.cls)
      }
      if (classList) {
        attributes.className += classList.join(' ')
        // tag += '.' + classList.join('.')
      }
      if (attributes.children) {
        return h(tag, attributes, _.map(attributes.children, function (children) {
          return me.hyperScript(children)
        }))
      } else {
        return h(tag, attributes)
      }
    },
    create: function (attributes, domNode) {
      console.log(arguments)
      if (!attributes) {
        attributes = {}
      }
      var vdom = this.hyperScript(attributes)
      var element = createElement(vdom)
      // var instance = new this(element, vdom)
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
      }*/

      if (domNode) {
        return element
      } else {
        return this.get(element, vdom)
      }
    },

    /**
     * Retrieves Ext.dom.Element objects. {@link Ext#get} is alias for {@link Ext.dom.Element#get}.
     *
     * Uses simple caching to consistently return the same object. Automatically fixes if an object was recreated with
     * the same id via AJAX or DOM.
     *
     * @param {String/HTMLElement/Ext.Element} element The `id` of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} The Element object (or `null` if no matching element was found).
     * @static
     * @inheritable
     */
    get: function (element, vdom) {
      var cache = this.cache
      var instance, dom, id

      if (!element) {
        return null
      }

      // DOM Id
      if (typeof element === 'string') {
        dom = document.getElementById(element)

        if (cache.hasOwnProperty(element)) {
          instance = cache[element]
        }

        // Is this in the DOM proper
        if (dom) {
          // Update our Ext Element dom reference with the true DOM (it may have changed)
          if (instance) {
            instance.dom = dom
          } else {
            // Create a new instance of Ext Element
            instance = cache[element] = new this(dom)
          }
        } else if (!instance) { // Not in the DOM, but if its in the cache, we can still use that as a DOM fragment reference, otherwise null
          instance = null
        }

        return instance
      }

      // DOM element
      if ('tagName' in element) {
        id = element.id

        if (cache.hasOwnProperty(id)) {
          instance = cache[id]
          instance.dom = element
          return instance
        } else {
          instance = new this(element, vdom)
          cache[instance.getId()] = instance
        }

        return instance
      }

      // Ext Element
      if (element.isElement) {
        return element
      }

      // Ext Composite Element
      if (element.isComposite) {
        return element
      }

      // Array passed
      if (_.isArray(element)) {
        return this.select(element)
      }

      // DOM Document
      if (element === document) {
        // create a bogus element object representing the document object
        if (!this.documentElement) {
          this.documentElement = new this(document.documentElement)
          this.documentElement.setId('ext-application')
        }

        return this.documentElement
      }

      return null
    }
  })
  Element.mixin(Identifiable)
  return Element
}))
