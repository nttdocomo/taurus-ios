/*global define, console*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../base', '../polyfill/object/merge', '../util/translatable', '../dom/element', '../core/factory', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../base'), require('../polyfill/object/merge'), require('../util/translatable'), require('../dom/element'), require('../core/factory'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../base'), require('../polyfill/object/merge'), require('../util/translatable'), require('../dom/element'), require('../core/factory'), require('underscore'), require('tau'))
  }
}(this, function (define, Base, merge, Translatable, Element, factory, _, Tau) {
  return define('Tau.scroll.Scroller', Base, {
    config: {
      /**
       * @cfg containerSize
       * @private
       */
      containerSize: 'auto',
      /**
       * @cfg size
       * @private
       */
      size: 'auto',
      element: null,

      /**
       * @cfg {String} direction
       * Possible values: 'auto', 'vertical', 'horizontal', or 'both'.
       * @accessor
       */
      direction: 'auto',

      /**
       * @cfg {Boolean} disabled
       * Whether or not this component is disabled.
       * @accessor
       */
      disabled: null,
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
        // scope: this,
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
     * @private
     */
    attachListeneners: function () {
      this.getContainer().on(this.listeners)
    },

    /**
     * @private
     * Returns the container for this scroller
     */
    getContainer: function () {
      var container = this.container
      var element

      if (!container) {
        element = this.getElement().getParent()
        this.container = container = this.FixedHBoxStretching ? element.getParent() : element
        // <debug error>
        if (!container) {
          console.error("Making an element scrollable that doesn't have any container")
        }
        // </debug>
        container.addCls(this.containerCls)
      }

      return container
    },

    /**
     * @private
     * @return {Object}
     */
    getMaxPosition: function () {
      var maxPosition = this.maxPosition
      var size, containerSize

      if (!maxPosition) {
        size = this.getSize()
        containerSize = this.getContainerSize()

        this.maxPosition = maxPosition = {
          x: Math.max(0, size.x - containerSize.x),
          y: Math.max(0, size.y - containerSize.y)
        }

        this.trigger('maxpositionchange', this, maxPosition)
      }

      return maxPosition
    },

    /**
     * @private
     * @return {Object}
     */
    getMinPosition: function () {
      var minPosition = this.minPosition

      if (!minPosition) {
        this.minPosition = minPosition = {
          x: 0,
          y: 0
        }

        this.trigger('minpositionchange', this, minPosition)
      }

      return minPosition
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
     * @private
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    refresh: function () {
      this.stopAnimation()

      this.getTranslatable().refresh()
      this.setSize(this.givenSize)
      this.setContainerSize(this.givenContainerSize)
      this.setDirection(this.givenDirection)

      this.trigger('refresh', this)

      return this
    },
    /**
     * @private
     */
    refreshMaxPosition: function () {
      this.maxPosition = null
      this.getMaxPosition()
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
          this.trigger('scroll', this, position.x, position.y)
          translatable.translate(translationX, translationY)
        }
      }

      return this
    },

    /**
     * @private
     */
    snapToBoundary: function () {
      var position = this.position
      var minPosition = this.getMinPosition()
      var maxPosition = this.getMaxPosition()
      var minX = minPosition.x
      var minY = minPosition.y
      var maxX = maxPosition.x
      var maxY = maxPosition.y
      var x = Math.round(position.x)
      var y = Math.round(position.y)

      if (x < minX) {
        x = minX
      } else if (x > maxX) {
        x = maxX
      }

      if (y < minY) {
        y = minY
      } else if (y > maxY) {
        y = maxY
      }

      this.scrollTo(x, y)
    },

    /**
     * @private
     * @return {Object}
     */
    applyContainerSize: function (size) {
      var containerDom = this.getContainer().dom
      var x, y

      if (!containerDom) {
        return
      }

      this.givenContainerSize = size

      if (size === 'auto') {
        x = containerDom.offsetWidth
        y = containerDom.offsetHeight
      } else {
        x = size.x
        y = size.y
      }

      return {
        x: x,
        y: y
      }
    },

    /**
     * @private
     * @param {String/Object} size
     * @return {Object}
     */
    applySize: function (size) {
      var dom = this.getElement().dom
      var x, y

      if (!dom) {
        return
      }

      this.givenSize = size

      if (size === 'auto') {
        x = dom.offsetWidth
        y = dom.offsetHeight
      } else if (typeof size === 'number') {
        x = size
        y = size
      } else {
        x = size.x
        y = size.y
      }

      return {
        x: x,
        y: y
      }
    },

    /**
     * @private
     */
    applyElement: function (element) {
      if (!element) {
        return
      }

      return Element.get(element)
    },

    /**
     * @private
     * @chainable
     */
    updateElement: function (element) {
      this.initialize()

      if (!this.FixedHBoxStretching) {
        element.addCls(this.cls)
      }

      if (!this.getDisabled()) {
        this.attachListeneners()
      }

      this.onConfigUpdate(['containerSize', 'size'], 'refreshMaxPosition')

      this.on('maxpositionchange', _.bind(this.snapToBoundary, this))
      this.on('minpositionchange', _.bind(this.snapToBoundary, this))

      return this
    },

    applyTranslatable: function (config, translatable) {
      return factory(config, Translatable, translatable)
    },

    updateTranslatable: function (translatable) {
      translatable.setConfig({
        element: this.getElement(),
        listeners: {
          animationframe: 'onAnimationFrame',
          animationend: 'onAnimationEnd',
          scope: this
        }
      })
    },

    /**
     * @private
     * Stops the animation of the scroller at any time.
     */
    stopAnimation: function () {
      this.getTranslatable().stopAnimation()
    }
  })
}))
