/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'))
  }
}(this, function (Backbone) {
  var mediator = {}
  var handlers = mediator._handlers = {}
  mediator.subscribe = mediator.on = Backbone.Events.on
  mediator.unsubscribe = mediator.off = Backbone.Events.off
  mediator.subscribeOnce = mediator.once = Backbone.Events.once
  mediator.publish = mediator.trigger = Backbone.Events.trigger
  mediator.setHandler = function (name, method, instance) {
    handlers[name] = {
      instance: instance,
      method: method
    }
    return handlers[name]
  }
  return mediator
}))
