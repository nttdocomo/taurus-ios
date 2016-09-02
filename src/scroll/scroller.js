/*global define, console*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../polyfill/object/merge', '../core/factory', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../polyfill/object/merge'), require('../core/factory'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, merge, factory, _, Tau) {
  return define('Tau.scroll.Scroller', Class, {
    config: {
      element: null,

      /**
       * @cfg {String} direction
       * Possible values: 'auto', 'vertical', 'horizontal', or 'both'.
       * @accessor
       */
      direction: 'auto',
      translatable: {
        translationMethod: 'auto',
        useWrapper: false
      }
    },

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function (config) {
      var element = config && config.element

      this.listeners = {
        scope: this,
        touchstart: 'onTouchStart',
        touchend: 'onTouchEnd',
        dragstart: 'onDragStart',
        drag: 'onDrag',
        dragend: 'onDragEnd'
      }

      this.minPosition = { x: 0, y: 0 }

      this.startPosition = { x: 0, y: 0 }

      this.position = { x: 0, y: 0 }

      this.velocity = { x: 0, y: 0 }

      this.isAxisEnabledFlags = { x: false, y: false }

      this.flickStartPosition = { x: 0, y: 0 }

      this.flickStartTime = { x: 0, y: 0 }

      this.lastDragPosition = { x: 0, y: 0 }

      this.dragDirection = {x: 0, y: 0}

      this.initialConfig = config

      if (element) {
        this.setElement(element)
      }

      return this
    },

    /**
     * Returns `true` if a specified axis is enabled.
     * @param {String} axis The axis to check (`x` or `y`).
     * @return {Boolean} `true` if the axis is enabled.
     */
    isAxisEnabled: function (axis) {
      this.getDirection()

      return this.isAxisEnabledFlags[axis]
    },

    /**
     * Scrolls to the given location.
     *
     * @param {Number} x The scroll position on the x axis.
     * @param {Number} y The scroll position on the y axis.
     * @param {Boolean/Object} animation (optional) Whether or not to animate the scrolling to the new position.
     *
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    scrollTo: function (x, y, animation) {
      if (this.isDestroyed) {
        return this
      }

      // <deprecated product=touch since=2.0>
      if (typeof x !== 'number' && arguments.length === 1) {
        // <debug warn>
        console.debug('Calling scrollTo() with an object argument is deprecated, please pass x and y arguments instead", this')
        // </debug>

        y = x.y
        x = x.x
      }
      // </deprecated>

      var translatable = this.getTranslatable()
      var position = this.position
      var positionChanged = false
      var translationX, translationY

      if (this.isAxisEnabled('x')) {
        if (isNaN(x) || typeof x !== 'number') {
          x = position.x
        } else {
          if (position.x !== x) {
            position.x = x
            positionChanged = true
          }
        }

        translationX = -x
      }

      if (this.isAxisEnabled('y')) {
        if (isNaN(y) || typeof y !== 'number') {
          y = position.y
        } else {
          if (position.y !== y) {
            position.y = y
            positionChanged = true
          }
        }

        translationY = -y
      }

      if (positionChanged) {
        if (animation !== undefined && animation !== false) {
          translatable.translateAnimated(translationX, translationY, animation)
        } else {
          this.fireEvent('scroll', this, position.x, position.y)
          translatable.translate(translationX, translationY)
        }
      }

      return this
    }
  })
}))
