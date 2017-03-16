/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone', 'backbone-super', 'underscore', '../utils', '../mediator', '../lib/event-broker'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'), require('backbone-super'), require('underscore'), require('../utils'), require('../mediator'), require('../lib/event-broker'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'), require('backbone-super'), require('underscore'), require('../utils'), require('../mediator'), require('../lib/event-broker'))
  }
}(this, function (Backbone, inherits, _, utils, mediator, History, EventBroker) {
  var Controller = function () {
    this.initialize.apply(this, arguments)
  }
  _.extend(Controller.prototype, Backbone.Events)
  _.extend(Controller.prototype, EventBroker)
  _.extend(Controller.prototype, {
    initialize: function () {}
  })
  return Controller
}))
