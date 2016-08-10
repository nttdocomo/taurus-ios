/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', '../tau', 'jquery', 'underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('../tau'), require('jquery'), require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('../tau'), require('jquery'), require('underscore'))
  }
}(this, function (define, Container, Tau, $, _) {
  return define('Tau.viewport.Default', Container, {
    config: {
      /**
       * @cfg
       * @private
       */
      autoRender: true
    },
    constructor: function (config) {
      this.on('ready', _.bind(this.onReady, this))
      $(document).ready(_.bind(this.onDomReady, this))
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
        console.log('rendered')
      }
    }
  })
}))
