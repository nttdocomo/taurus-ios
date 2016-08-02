/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', './abstract'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('./abstract')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('./abstract')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Abstract) {
  return define(Abstract, {
    constructor: function (config) {
      this.initialConfig = config
    },

    insertInnerItem: function (item, index) {
      var container = this.container
      var containerDom = container.el
      var itemDom = item.el
      var nextSibling = index !== -1 ? container.getInnerAt(index + 1) : null
      var nextSiblingDom = null
      var translatable

      if (nextSibling) {
        translatable = nextSibling.getTranslatable()
        if (translatable && translatable.getUseWrapper()) {
          nextSiblingDom = translatable.getWrapper().dom
        } else {
          nextSiblingDom = nextSibling ? nextSibling.element.dom : null
        }
      }

      containerDom.insertBefore(itemDom, nextSiblingDom)

      return this
    },

    setContainer: function (container) {
      this.container = container

      this.initConfig(this.initialConfig)

      return this
    },

    onItemAdd: function (item) {
      var docked = item.getDocked()

      if (docked !== null) {
        this.dockItem(item)
      } else if (item.isCentered()) {
        this.onItemCenteredChange(item, true)
      } else if (item.isFloating()) {
        this.onItemFloatingChange(item, true)
      } else {
        this.onItemInnerStateChange(item, true)
      }
    },

    onItemRemove: function () {},

    onItemMove: function () {},

    onItemCenteredChange: function () {},

    onItemFloatingChange: function () {},

    onItemDockedChange: function () {},

    /**
     * @param {Ext.Component} item
     * @param {Boolean} isInner
     * @param {Boolean} [destroying]
     */
    onItemInnerStateChange: function (item, isInner, destroying) {
      if (isInner) {
        this.insertInnerItem(item, this.container.innerIndexOf(item))
      } else {
        this.removeInnerItem(item)
      }
    }
  })
}))
