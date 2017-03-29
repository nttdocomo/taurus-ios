/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../component', '../underscore', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../component'), require('../underscore'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../component'), require('../underscore'), require('../tau'))
  }
}(this, function (define, Class, _, Tau) {
  return define('Tau.dataview.ListItemHeader', Class, {
    config: {
      /**
       * @cfg
       * @inheritdoc
       */
      baseCls: Tau.baseCSSPrefix + 'list-header'
    }
  })
}))
