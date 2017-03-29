/*global define*/
/**
 * @author nttdocomo
 */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './dom/element', './base', './virtual-dom/h', './virtual-dom/diff', './virtual-dom/patch', './virtual-dom/create-element', './renderQueue', './dom2hscript/index', './underscore', './backbone', './backbone-super', './polyfill/array/remove'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./dom/element'), require('./base'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('./renderQueue'), require('./dom2hscript/index'), require('./underscore'), require('./backbone'), require('./backbone-super'), require('./polyfill/array/remove'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./dom/element'), require('./base'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('./renderQueue'), require('./dom2hscript/index'), require('./underscore'), require('./backbone'), require('./backbone-super'), require('./polyfill/array/remove'))
  }
}(this, function (define, Element, Base, h, diff, patch, createElement, renderQueue, dom2hscript, _, Backbone) {
  return define('Tau.AbstractComponent', Base, {
    constructor: function () {
      Base.apply(this, arguments)
      //Backbone.View.apply(this, arguments)
    },
    /**
     * @private
     * Significantly improve instantiation time for Component with multiple references
     * Ext.Element instance of the reference domNode is only created the very first time
     * it's ever used.
     */
    addReferenceNode: function (config, domNode) {
      var me = this
      var name
      if (config.reference) {
        name = config.reference
        Object.defineProperty(this, name, {
          get: function () {
            var reference

            delete this[name]
            this[name] = reference = Element.get(domNode)
            return reference
          },
          configurable: true
        })
      }
      if (config.children) {
        _.each(config.children, function (children, i) {
          me.addReferenceNode(children, domNode.childNodes[i])
        })
      }
      /* Object.defineProperty(this, name, {
        get: function () {
          var reference

          delete this[name]
          this[name] = reference = new Element(domNode)
          return reference
        },
        configurable: true
      })*/
    },
    onClassExtended: function (Class, members) {
      if (!members.hasOwnProperty('cachedConfig')) {
        return
      }

      var prototype = Class.prototype
      var config = members.config
      var cachedConfig = members.cachedConfig
      var cachedConfigList = prototype.cachedConfigList
      var hasCachedConfig = prototype.hasCachedConfig
      var name, value

      delete members.cachedConfig

      prototype.cachedConfigList = cachedConfigList = (cachedConfigList) ? cachedConfigList.slice() : []
      prototype.hasCachedConfig = hasCachedConfig = (hasCachedConfig) ? Object.create(hasCachedConfig) : {}

      if (!config) {
        members.config = config = {}
      }

      for (name in cachedConfig) {
        if (cachedConfig.hasOwnProperty(name)) {
          value = cachedConfig[name]

          if (!hasCachedConfig[name]) {
            hasCachedConfig[name] = true
            cachedConfigList.push(name)
          }

          config[name] = value
        }
      }
    },
    initElement: function () {
      // var id = this.getId()
      var me = this
      var prototype = this.constructor.prototype
      var elementConfig = this.getElementConfig()
      var element = Element.create(elementConfig)
      var renderElement = element.dom
      var i, ln
      this.setElement(renderElement)
      /* if (elementConfig.reference) {
        if (elementConfig.reference === 'element') {
          this.element = element
        } else {
          this[elementConfig.reference] = this.$el
        }
      }*/
      this.addReferenceNode(elementConfig, element.dom)
      var children = me.$el.children()
      /* _.each(elementConfig.children, function (item, i) {
        if (item.reference) {
          me[item.reference] = new Element(children.get(i), item)
        }
      })*/
      if (!this.innerElement) {
        this.innerElement = element
      }

      if (!this.bodyElement) {
        this.bodyElement = this.innerElement
      }

      if (renderElement === element.dom) {
        this.renderElement = element
      }

      var configNameCache = define.configNameCache
      var defaultConfig = this.config
      var cachedConfigList = this.cachedConfigList
      var initConfigList = this.initConfigList
      var initConfigMap = this.initConfigMap
      var configList = []
      var name, nameMap, internalName

      for (i = 0, ln = cachedConfigList.length; i < ln; i++) {
        name = cachedConfigList[i]
        nameMap = configNameCache[name]

        if (initConfigMap[name]) {
          initConfigMap[name] = false
          initConfigList = _.without(initConfigList, name) // initConfigList.remove(name)
        }

        if (defaultConfig[name] !== null) {
          configList.push(name)
          this[nameMap.get] = this[nameMap.initGet]
        }
      }

      for (i = 0, ln = configList.length; i < ln; i++) {
        name = configList[i]
        nameMap = configNameCache[name]
        internalName = nameMap.internal

        this[internalName] = null
        this[nameMap.set](defaultConfig[name])
        delete this[nameMap.get]

        prototype[internalName] = this[internalName]
      }
    }
  }).mixin(Backbone.View)
}))
