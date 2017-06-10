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
  var slice = [].slice
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
  mediator.execute = function () {
    var handler, name, silent
    var options = arguments[0]
    var args = arguments.length >= 2 ? slice.call(arguments, 1) : []
    if (options && typeof options === 'object') {
      name = options.name
      silent = options.silent
    } else {
      name = options
    }
    handler = handlers[name]
    if (handler) {
      return handler.method.apply(handler.instance, args)
    } else if (!silent) {
      throw new Error('mediator.execute: ' + name + ' handler is not defined')
    }
  }
  return mediator
}))
