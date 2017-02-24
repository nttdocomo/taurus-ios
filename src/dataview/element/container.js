/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../component'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../component'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../component'))
  }
}(this, function (define, Component) {
  define('Tau.dataview.element.Container', Component, {
    doInitialize: function () {
      this.element.on({
        touchstart: 'onItemTouchStart',
        touchend: 'onItemTouchEnd',
        //tap: 'onItemTap',
        taphold: 'onItemTapHold',
        touchmove: 'onItemTouchMove',
        singletap: 'onItemSingleTap',
        doubletap: 'onItemDoubleTap',
        swipe: 'onItemSwipe',
        delegate: '> div',
        scope: this
      })
    },

    // @private
    initialize: function () {
      this._super()
      this.doInitialize()
    }
  })
}))
