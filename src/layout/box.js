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
  return define(Default, {
    config: {
      orient: 'horizontal',

      /**
       * @cfg {String} align
       * Controls how the child items of the container are aligned. Acceptable configuration values for this property are:
       *
       * - ** start ** : child items are packed together at left side of container
       * - ** center ** : child items are packed together at mid-width of container
       * - ** end ** : child items are packed together at right side of container
       * - **stretch** : child items are stretched vertically to fill the height of the container
       *
       * @accessor
       */
      align: 'stretch',

      /**
       * @cfg {Boolean} constrainAlign
       * Limits the size of {@link #align aligned} components to the size of the container.
       *
       * In order for this option to work in Safari, the container must have
       * {@link Ext.Container#autoSize autoSize} set to `false`.
       */
      constrainAlign: false,

      /**
       * @cfg {String} pack
       * Controls how the child items of the container are packed together. Acceptable configuration values
       * for this property are:
       *
       * - ** start ** : child items are packed together at left side of container
       * - ** center ** : child items are packed together at mid-width of container
       * - ** end ** : child items are packed together at right side of container
       * - ** space-between ** : child items are distributed evenly with the first
       * item at the start and the last item at the end
       * - ** space-around ** : child items are distributed evenly with equal space
       * around them
       * - ** justify ** : behaves the same as `space-between` for backward compatibility.
       *
       * @accessor
       */
      pack: 'start',

      /**
       * @cfg {Boolean} vertical
       * `true` to layout items vertically, otherwise horizontally.
       *
       * @since 6.2.0
       */
      vertical: false,

      /**
       * @cfg {Boolean} reverse
       * `true` to reverse the natural layout direction.
       * - When vertical, items are laid out bottom to top.
       * - When horizontal (assuming LTR), items are laid out right to left.
       *
       * @since 6.5.0
       */
      reverse: false
    },
    cls: Tau.baseCSSPrefix + 'layout-box',
    baseItemCls: Tau.baseCSSPrefix + 'layout-box-item',
    constrainAlignCls: Tau.baseCSSPrefix + 'constrain-align',
    flexedCls: Tau.baseCSSPrefix + 'flexed',
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

      container.innerElement.addCls(this.layoutClass)
      // container.onInitialized('onContainerInitialized', this)
    }
  })
}))
