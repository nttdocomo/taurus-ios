/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', '../tau', '../env/os', 'jquery', 'underscore', '../core/tau/getBody'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('../tau'), require('../env/os'), require('jquery'), require('underscore'), require('../core/tau/getBody'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('../tau'), require('../env/os'), require('jquery'), require('underscore'), require('../core/tau/getBody'))
  }
}(this, function (define, Container, Tau, OS, $, _, getBody) {
  return define('Tau.viewport.Default', Container, {
    config: {
      /**
       * @cfg
       * @private
       */
      autoRender: true,
      /**
       * @cfg
       * @private
       */
      width: '100%',

      /**
       * @cfg
       * @private
       */
      height: '100%'
    },
    constructor: function (config) {
      this.on('ready', _.bind(this.onReady, this))
      $(document).ready(_.bind(this.onDomReady, this))
      Container.apply(this, arguments)
    },

    doSetHeight: function (height) {
      Tau.getBody().height(height)

      this._super.apply(this, arguments)
    },

    doSetWidth: function (width) {
      Tau.getBody().width(width)

      this._super.apply(this, arguments)
    },

    onDomReady: function () {
      this.isReady = true
      // this.updateSize()
      this.trigger('ready', this)
    },
    onReady: function () {
      if (this.getAutoRender()) {
        this.render()
      }
      /* if (Tau.browser.name == 'ChromeiOS') {
        this.setHeight('-webkit-calc(100% - ' + ((window.outerHeight - window.innerHeight) / 2) + 'px)')
      }*/
    },
    render: function () {
      if (!this.rendered) {
        var body = getBody()
        var clsPrefix = Tau.baseCSSPrefix
        var classList = []
        var osEnv = Tau.os
        console.log('rendered')
        this.renderTo(body)
        classList.push(clsPrefix + osEnv.deviceType.toLowerCase())
        body.addCls(classList)
      }
    }
  })
}))
