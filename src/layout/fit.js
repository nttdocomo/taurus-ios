/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', './default', '../tau'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('./default'), require('../tau')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('./default'), require('../tau')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Default, Tau) {
  return define('Tau.layout.Fit', Default, {
    isFit: true,

    layoutClass: Tau.baseCSSPrefix + 'layout-fit',

    itemClass: Tau.baseCSSPrefix + 'layout-fit-item',

    setContainer: function (container) {
      this._super.apply(this, arguments)

      container.innerElement.addCls(this.layoutClass)
      this.onContainerSizeFlagsChange()
      this.monitorSizeFlagsChange()
    },

    onContainerSizeFlagsChange: function () {
      var container = this.container
      var sizeFlags = container.getSizeFlags()
      var stretched = Boolean(sizeFlags & container.LAYOUT_STRETCHED)
      var innerItems = container.innerItems
      var i, ln, item

      this._super()

      for (i = 0, ln = innerItems.length; i < ln; i++) {
        item = innerItems[i]
        item.setLayoutSizeFlags(sizeFlags)
      }

      container.innerElement.toggleCls('x-stretched', stretched)
    },

    onItemInnerStateChange: function (item, isInner) {
      this._super.apply(this, arguments)
      item.toggleCls(this.itemClass, isInner)
      item.setLayoutSizeFlags(isInner ? this.container.getSizeFlags() : 0)
    }
  })
}))
