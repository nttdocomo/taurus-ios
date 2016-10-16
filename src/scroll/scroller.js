/*global define, console*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../base', '../polyfill/object/merge', '../util/translatable', '../dom/element', '../core/factory', 'jquery', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../base'), require('../polyfill/object/merge'), require('../util/translatable'), require('../dom/element'), require('../core/factory'), require('jquery'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../base'), require('../polyfill/object/merge'), require('../util/translatable'), require('../dom/element'), require('../core/factory'), require('jquery'), require('underscore'), require('tau'), require('../fx/easing/easeout'))
  }
}(this, function (define, Base, merge, Translatable, Element, factory, $, _, Tau) {
  return define('Tau.scroll.Scroller', Base, {
    config: {
      /**
       * @cfg containerSize
       * @private
       */
      containerSize: 'auto',
      minPosition: { x: 0, y: 0 },
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
    cls: Tau.baseCSSPrefix + 'scroll-scroller',
    containerCls: Tau.baseCSSPrefix + 'scroll-container',

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function (config) {
      var element = config && config.element

      this.listeners = {
        // scope: this,
        touchstart: _.bind(this.onTouchStart, this),
        touchend: _.bind(this.onTouchEnd, this)
      /* dragstart: this.onDragStart,
      drag: 'onDrag',
      dragend: 'onDragEnd'*/
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
      this.getContainer().$dom.on(this.listeners)
    },
    getAnimationEasing: function (axis) {
      var currentPosition = -this.position[axis]
      var minPosition = this.getMinPosition()[axis]
      var maxPosition = this.getMaxPosition()[axis]
      var boundValue = null
      if (currentPosition < minPosition) {
        boundValue = minPosition
      } else if (currentPosition > maxPosition) {
        boundValue = maxPosition
      }
      return -boundValue
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
     */
    onAnimationEnd: function () {
      this.snapToBoundary()
      this.onScrollEnd()
    },

    /**
     * @private
     */
    onAnimationFrame: function (translatable, x, y) {
      var position = this.position

      position.x = -x
      position.y = -y

      this.trigger('scroll', this, position.x, position.y)
    },

    /**
     * @private
     */
    onScrollEnd: function () {
      var position = this.position

      if (this.isTouching/* || !this.snapToSlot()*/) {
        this.trigger('scrollend', this, position.x, position.y)
      }
    },

    /**
     * @private
     */
    onTouchStart: function (e) {
      var point = e.touches ? e.touches[0] : e
      var startPosition = this.startPosition
      var position = this.position
      this.isTouching = true
      this.stopAnimation()

      // position.x    = point.pageX
      // position.y    = point.pageY

      startPosition.x = point.pageX
      startPosition.y = point.pageY
      $(window).on({
        touchmove: _.bind(this.onTouchMove, this) /*,
        delegate: '.' + Tau.baseCSSPrefix + 'list-item',
        single: true,
        scope: this*/
      })
    },

    /**
     * @private
     */
    onTouchEnd: function () {
      var position = this.position
      var easingX, easingY
      if (!this.isDragging) {
        return
      }

      this.isTouching = false
      this.isDragging = false

      easingY = this.getAnimationEasing('y')

      this.getTranslatable().animate(null, easingY)
      //this.getContainer().$dom.animate(easingX, easingY)
      /* if (easingX || easingY) {
        this.getTranslatable().animate(null, null)
      } else {
        this.onScrollEnd()
      }*/
      if (!this.isDragging /* && this.snapToSlot()*/) {
        this.trigger('scrollstart', position.x, position.y)
      }
      $(window).off({
        touchmove: _.bind(this.onTouchMove, this)
      })
    },
    onTouchMove: function (e) {
      var point = e.touches ? e.touches[0] : e
      var startPosition = this.startPosition
      var position = this.position
      var timestamp = Date.now()
      var deltaX, deltaY, newX, newY
      deltaX = point.pageX - startPosition.x
      // lastDragPosition.x = x
      startPosition.x = point.pageX

      deltaY = point.pageY - startPosition.y
      // lastDragPosition.y = y
      startPosition.y = point.pageY

      newX = position.x + deltaX
      newY = position.y + deltaY
      this.isDragging = true

      // this.scrollTo(lastDragPosition.x, lastDragPosition.y)
      this.scrollTo(newX, newY)
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

        translationY = y
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
          animationframe: _.bind(this.onAnimationFrame, this),
          animationend: _.bind(this.onAnimationEnd, this)
        }
      })
    },

    /**
     * @private
     * @return {String}
     */
    applyDirection: function (direction) {
      var minPosition = this.getMinPosition(),
        maxPosition = this.getMaxPosition(),
        isHorizontal, isVertical

      this.givenDirection = direction

      if (direction === 'auto') {
        isHorizontal = maxPosition.x > minPosition.x
        isVertical = maxPosition.y > minPosition.y

        if (isHorizontal && isVertical) {
          direction = 'both'
        }
        else if (isHorizontal) {
          direction = 'horizontal'
        }else {
          direction = 'vertical'
        }
      }

      return direction
    },

    /**
     * @private
     */
    updateDirection: function (direction, oldDirection) {
      var isAxisEnabledFlags = this.isAxisEnabledFlags,
        verticalCls = this.cls + '-vertical',
        horizontalCls = this.cls + '-horizontal',
        element = this.getElement()

      if (oldDirection === 'both' || oldDirection === 'horizontal') {
        element.removeCls(horizontalCls)
      }

      if (oldDirection === 'both' || oldDirection === 'vertical') {
        element.removeCls(verticalCls)
      }

      isAxisEnabledFlags.x = isAxisEnabledFlags.y = false
      if (direction === 'both' || direction === 'horizontal') {
        isAxisEnabledFlags.x = true
        element.addCls(horizontalCls)
      }

      if (direction === 'both' || direction === 'vertical') {
        isAxisEnabledFlags.y = true
        element.addCls(verticalCls)
      }
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
