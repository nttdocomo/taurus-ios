/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', './indicator/cssTransform', './indicator/scrollPosition', './indicator/rounded', '../core/factory', '../underscore', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('./indicator/cssTransform'), require('./indicator/scrollPosition'), require('./indicator/rounded'), require('../core/factory'), require('../underscore'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('./indicator/cssTransform'), require('./indicator/scrollPosition'), require('./indicator/rounded'), require('../core/factory'), require('../underscore'), require('../tau'))
  }
}(this, function (define, Class, CssTransform, ScrollPosition, Rounded, factory, _, Tau) {
  return define('Tau.scroll.Indicator', Class, {

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function (config) {
      switch (Tau.browser.getPreferredTranslationMethod(config)) {
        case 'scrollposition':
          return new ScrollPosition(config)
        case 'csstransform':
          if (Tau.browser.is.AndroidStock4) {
            return new CssTransform(config)
          } else {
            return new Rounded(config)
          }
      }
    }
  })
}))
