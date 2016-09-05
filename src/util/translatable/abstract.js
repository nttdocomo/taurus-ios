/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../class', '../../animationQueue', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../class'), require('../../animationQueue'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../class'), require('../../animationQueue'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, AnimationQueue, _, Tau) {
  return define('Tau.util.translatable.Abstract', Class, {
    constructor: function (config) {
      this.initConfig(config)
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
