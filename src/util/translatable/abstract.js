/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../evented', '../../animationQueue', 'underscore', 'tau', 'velocity'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../evented'), require('../../animationQueue'), require('underscore'), require('tau'), require('velocity'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../evented'), require('../../animationQueue'), require('underscore'), require('tau'), require('velocity'))
  }
}(this, function (define, Class, AnimationQueue, _, Tau) {
  return define('Tau.util.translatable.Abstract', Class, {
    x: 0,
    y: 0,
    constructor: function (config) {
      this.initConfig(config)
    },

    animate: function (easingX, easingY, easingZ) {
      var me = this
      this.activeEasingX = easingX
      this.activeEasingY = easingY

      this.isAnimating = true
      this.lastX = null
      this.lastY = null

      //AnimationQueue.start(this.doAnimationFrame, this)
      this.getElement().$dom.animate({
        tween: 1000
      }, {
        progress: _.bind(this.doAnimationFrame, this)/* function (animation, progress, remainingMs) {
          me.doTranslate(me.x - me.x * progress, me.y - me.y * progress)
        }*/,
        easing: "easein",
        duration: 200
      })

      this.trigger('animationstart', this, this.x, this.y)
      return this
    },

    doAnimationFrame: function (animation, progress, remainingMs) {
      var me = this
      var x, y
      /* easingX = me.activeEasingX,
        easingY = me.activeEasingY,
        now = Date.now(),
        x, y

      if (!me.isAnimating) {
        return
      }

      me.lastRun = now

      if (easingX === null && easingY === null) {
        me.stopAnimation()
        return
      }

      if (easingX !== null) {
        me.x = x = Math.round(easingX.getValue())

        if (easingX.isEnded) {
          me.activeEasingX = null
          me.trigger('axisanimationend', me, 'x', x)
        }
      }else {
        x = me.x
      }

      if (easingY !== null) {
        me.y = y = Math.round(easingY.getValue())

        if (easingY.isEnded) {
          me.activeEasingY = null
          me.trigger('axisanimationend', me, 'y', y)
        }
      }else {
        y = me.y
      }

      if (me.lastX !== x || me.lastY !== y) {
        me.doTranslate(x, y)

        me.lastX = x
        me.lastY = y
      }*/
      x = me.x - me.x * progress
      y = me.y - me.y * progress
      me.doTranslate(x, y)

      me.trigger('animationframe', me, x, y)
    },
    stopAnimation: function () {
      if (!this.isAnimating) {
        return
      }

      this.activeEasingX = null
      this.activeEasingY = null

      this.isAnimating = false

      AnimationQueue.stop(this.doAnimationFrame, this)
      this.trigger('animationend', this, this.x, this.y)
    },

    translate: function (x, y, animation) {
      if (animation) {
        return this.translateAnimated(x, y, animation)
      }

      if (this.isAnimating) {
        this.stopAnimation()
      }

      if (!isNaN(x) && typeof x === 'number') {
        this.x = x
      }

      if (!isNaN(y) && typeof y === 'number') {
        this.y = y
      }
      this.doTranslate(x, y)
    },

    refresh: function () {
      this.translate(this.x, this.y)
    }
  })
}))
