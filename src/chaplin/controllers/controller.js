/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone', 'backbone-super', 'underscore', '../lib/utils', '../mediator', '../lib/event-broker'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'), require('backbone-super'), require('underscore'), require('../lib/utils'), require('../mediator'), require('../lib/event-broker'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'), require('backbone-super'), require('underscore'), require('../lib/utils'), require('../mediator'), require('../lib/event-broker'))
  }
}(this, function (Backbone, inherits, _, utils, mediator, EventBroker) {
  var Controller = function () {
    this.initialize.apply(this, arguments)
  }
  Controller.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps)
    child.extend = this.extend
    return child
  }
  _.extend(Controller.prototype, Backbone.Events)
  _.extend(Controller.prototype, EventBroker)
  _.extend(Controller.prototype, {
    initialize: function () {},
    dispose: function () {
      var i, key, len, member, ref
      if (this.disposed) {
        return
      }
      ref = Object.keys(this)
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i]
        member = this[key]
        if (typeof (member != null ? member.dispose : void 0) === 'function') {
          member.dispose()
          delete this[key]
        }
      }
      this.unsubscribeAllEvents()
      this.stopListening()
      this.disposed = true
      return Object.freeze(this)
    }
  })
  return Controller
}))
