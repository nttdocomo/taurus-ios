/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../core/factory', '../../component', '../../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../core/factory'), require('../../component'), require('../../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../core/factory'), require('../../component'), require('../../tau'))
  }
}(this, function (define, factory, Component, Tau) {
  return define('Tau.dataview.component.ListItem', Component, {
    config: {
      baseCls: Tau.baseCSSPrefix + 'list-item',
      header: {
        xclass: Component,
        cls: Tau.baseCSSPrefix + 'list-header',
        html: ' '
      }
    }
  })
}))
