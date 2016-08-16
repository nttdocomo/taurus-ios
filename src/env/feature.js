/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../function', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../function'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../function'), require('underscore'), require('tau'))
  }
}(this, function (define, Class, fn, _, Tau) {
  var Feature = define('Tau.env.Feature', Class, {
    constructor: function (config) {
      var me = this
      me.testElements = {}

      me.has = function (name) {
        return !!me.has[name]
      }

      if (!Tau.theme) {
        Tau.theme = {
          name: 'Default'
        }
      }

      Tau.theme.is = {}
      Tau.theme.is[Tau.theme.name] = true

      Tau.doc.ready(function () {
        me.registerTest({
          ProperHBoxStretching: function () {
            // IE10 currently has a bug in their flexbox row layout. We feature detect the issue here.
            var bodyElement = document.createElement('div')
            var innerElement = bodyElement.appendChild(document.createElement('div'))
            var contentElement = innerElement.appendChild(document.createElement('div'))
            var innerWidth

            bodyElement.setAttribute('style', 'width: 100px; height: 100px; position: relative;')
            innerElement.setAttribute('style', 'position: absolute; display: -ms-flexbox; display: -webkit-flex; display: -moz-flexbox; display: flex; -ms-flex-direction: row; -webkit-flex-direction: row; -moz-flex-direction: row; flex-direction: row; min-width: 100%;')
            contentElement.setAttribute('style', 'width: 200px; height: 50px;')
            document.body.appendChild(bodyElement)
            innerWidth = innerElement.offsetWidth
            document.body.removeChild(bodyElement)

            return (innerWidth > 100)
          }
        })
      })
    },

    registerTest: fn.flexSetter(function (name, fn) {
      this.has[name] = fn.call(this)

      return this
    })
  })
  var feature = Tau.feature = new Feature
  var has = Tau.feature.has
  return feature
}))
