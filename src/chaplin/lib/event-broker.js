/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../mediator'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../mediator'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../mediator'))
  }
}(this, function (mediator) {
  var slice = [].slice
  var EventBroker = {
    subscribeEvent: function (type, handler) {
      if (typeof type !== 'string') {
        throw new TypeError('EventBroker#subscribeEvent: ' + 'type argument must be a string')
      }
      if (typeof handler !== 'function') {
        throw new TypeError('EventBroker#subscribeEvent: ' + 'handler argument must be a function')
      }
      mediator.unsubscribe(type, handler, this)
      return mediator.subscribe(type, handler, this)
    },
    publishEvent: function () {
      var args, type
      type = arguments[0]
      args = arguments.length >= 2 ? slice.call(arguments, 1) : []
      if (typeof type !== 'string') {
        throw new TypeError('EventBroker#publishEvent: ' + 'type argument must be a string')
      }
      return mediator.publish.apply(mediator, [type].concat(slice.call(args)))
    }
  }
  return EventBroker
}))
