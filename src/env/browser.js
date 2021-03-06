/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../modernizr', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../modernizr'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../modernizr'), require('../tau'))
  }
}(this, function (define, Class, Modernizr, Tau) {
  var Browser = define('Tau.env.Browser', Class, {
    constructor: function (userAgent) {
      var constructor = this.constructor
      var browserNames = constructor.browserNames
      var browserName = browserNames.other
      var engineNames = constructor.engineNames
      var engineName = engineNames.other
      var is
      is = this.is = function (name) {
        return is[name] === true
      }
      this.setFlag(browserName)
    },

    setFlag: function (name, value) {
      if (typeof value === 'undefined') {
        value = true
      }

      this.is[name] = value
      this.is[name.toLowerCase()] = value

      return this
    },

    getPreferredTranslationMethod: function (config) {
      if (typeof config === 'object' && 'translationMethod' in config && config.translationMethod !== 'auto') {
        return config.translationMethod
      } else {
        if (!Modernizr.csstransforms) {
          return 'scrollposition'
        } else {
          return 'csstransform'
        }
      }
    }
  }, {
    browserNames: {
      ie: 'IE',
      firefox: 'Firefox',
      safari: 'Safari',
      chrome: 'Chrome',
      opera: 'Opera',
      dolfin: 'Dolfin',
      webosbrowser: 'webOSBrowser',
      chromeMobile: 'ChromeMobile',
      chromeiOS: 'ChromeiOS',
      silk: 'Silk',
      other: 'Other'
    },
    engineNames: {
      webkit: 'WebKit',
      gecko: 'Gecko',
      presto: 'Presto',
      trident: 'Trident',
      other: 'Other'
    },
    enginePrefixes: {
      webkit: 'AppleWebKit/',
      gecko: 'Gecko/',
      presto: 'Presto/',
      trident: 'Trident/'
    },
    browserPrefixes: {
      ie: 'MSIE ',
      firefox: 'Firefox/',
      chrome: 'Chrome/',
      safari: 'Version/',
      opera: 'OPR/',
      dolfin: 'Dolfin/',
      webosbrowser: 'wOSBrowser/',
      chromeMobile: 'CrMo/',
      chromeiOS: 'CriOS/',
      silk: 'Silk/'
    }
  })
  var browser = Tau.browser = new Browser(navigator.userAgent)
  return browser
}))
