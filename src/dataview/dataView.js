/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', './component/dataItem', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('./component/dataItem'), require('tau'))
  }
}(this, function (define, Container, DataItem, Tau) {
  return define('Tau.dataview.DataView', Container, {
    config: {
      /**
       * @cfg {String} defaultType
       * The xtype used for the component based DataView.
       *
       * __Note:__ this is only used when `{@link #useComponents}` is `true`.
       * @accessor
       */
      defaultType: DataItem
    }
  })
}))