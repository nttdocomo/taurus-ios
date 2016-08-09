/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './container', './component', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./container'), require('./component'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./container'), require('./component'), require('tau'))
  }
}(this, function (define, Container, Component, Tau) {
  return define('Tau.Title', Container, {
    config: {
      /**
       * @cfg
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'title',

      /**
       * @cfg {String} title The title text
       */
      title: ''
    },

    // @private
    updateTitle: function (newTitle) {
      this.setHtml(newTitle)
    }
  })
}))
