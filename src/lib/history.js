/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../backbone', '../backbone-super', 'underscore', './utils', '../mediator'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'))
  }
}(this, function (Backbone, inherits, _, utils, mediator) {
  var routeStripper = /^[#\/]|\s+$/g
  var History = Backbone.History.extend({
    getFragment: function (fragment, forcePushState) {
      var root
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname + this.location.search
          root = this.root.replace(/\/$/, '')
          if (!fragment.indexOf(root)) {
            fragment = fragment.slice(root.length)
          }
        } else {
          fragment = this.getHash()
        }
      }
      return fragment.replace(routeStripper, '')
    }
  })
  return History
}))
