/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', './default', 'tau'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('./default'), require('tau')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('./default'), require('tau')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Default, Tau) {
  return define(Default, {
    isCard: true,
    layoutClass: Tau.baseCSSPrefix + 'layout-card',
    itemClass: Tau.baseCSSPrefix + 'layout-card-item',
    onItemInnerStateChange: function (item, isInner, destroying) {
      this._super.apply(this, arguments)
      var container = this.container
      var activeItem = container.getActiveItem()

      item.toggleCls(this.itemClass, isInner)
      item.setLayoutSizeFlags(isInner ? container.LAYOUT_BOTH : 0)

      if (isInner) {
        if (activeItem !== container.innerIndexOf(item) && activeItem !== item && item !== container.pendingActiveItem) {
          item.hide()
        }
      } else {
        if (!destroying && !item.isDestroyed && item.isDestroying !== true) {
          item.show()
        }
      }
    },

    setContainer: function (container) {
      this._super.apply(this, arguments)

      container.innerElement.addClass(this.layoutClass)
      //container.onInitialized('onContainerInitialized', this)
    }
  })
}))
