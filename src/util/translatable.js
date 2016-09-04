/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', './translatable/cssTransform', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('./translatable/cssTransform'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('./translatable/cssTransform'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, CssTransform, _, Tau) {
  return define('Tau.util.Translatable', Class, {
    constructor: function (config) {
      var namespace = Tau.util.translatable

      switch (Tau.browser.getPreferredTranslationMethod(config)) {
        case 'scrollposition':
          return new namespace.ScrollPosition(config)
        case 'csstransform':
          return new CssTransform(config)
        case 'cssposition':
          return new namespace.CssPosition(config)
      }
    },

    stopAnimation: function () {
      if (!this.isAnimating) {
        return
      }

      this.activeEasingX = null
      this.activeEasingY = null

      this.isAnimating = false

      Ext.AnimationQueue.stop(this.doAnimationFrame, this)
      this.trigger('animationend', this, this.x, this.y)
    }
  })
}))
