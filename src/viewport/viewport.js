/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../tau', './ios'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../tau'), require('./ios'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../tau'), require('./ios'))
  }
}(this, function (define, Class, Tau, Ios) {
  var Browser = define('Tau.viewport.Viewport', Class, {
    constructor: function (config) {
      var osName = Tau.os.name
      var viewportName, viewport

      switch (osName) {
        case 'Android':
          viewportName = (Tau.browser.name == 'ChromeMobile') ? 'Default' : 'AndroidStock'
          break

        case 'iOS':
          viewportName = 'Ios'
          break

        case 'Windows':
          viewportName = (Tau.browser.name == 'IE') ? 'WindowsPhone' : 'Default'
          break

        case 'WindowsPhone':
          viewportName = 'WindowsPhone'
          break

        default:
          viewportName = 'Default'
          break
      }

      viewport = Tau.create('Ext.viewport.' + viewportName, config)

      return viewport
    }
  }, {})
  return new Browser(navigator.userAgent)
}))
