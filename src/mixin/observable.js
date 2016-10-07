/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './mixin', 'underscore', 'backbone', '../underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./mixin'), require('underscore'), require('backbone'), require('../underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./mixin'), require('underscore'), require('backbone'), require('../underscore/deepClone'))
  }
}(this, function (define, Mixin, _, Backbone) {
  return define(Mixin, {
    config: {
      listeners: null
    },
    // @private
    isObservable: true,

    applyListeners: function (listeners) {
      if (listeners) {
        this.on(listeners)
      }
    },
    /**
     * @private
     * Creates an event handling function which re-fires the event from this object as the passed event name.
     * @param {String} newName
     * @return {Function}
     */
    createEventRelayer: function (newName) {
      return function () {
        return this.trigger.apply(this, Array.prototype.slice.call(arguments, 0, -2))
      }
    },
    /**
     * Relays selected events from the specified Observable as if the events were fired by `this`.
     * @param {Object} object The Observable whose events this object is to relay.
     * @param {String/Array/Object} events Array of event names to relay.
     */
    relayEvents: function (object, events, prefix) {
      var i, ln, oldName, newName

      if (typeof prefix === 'undefined') {
        prefix = ''
      }

      if (typeof events === 'string') {
        events = [events]
      }

      if (_.isArray(events)) {
        for (i = 0, ln = events.length; i < ln; i++) {
          oldName = events[i]
          newName = prefix + oldName

          object.on(oldName, this.createEventRelayer(newName), this)
        }
      }else {
        for (oldName in events) {
          if (events.hasOwnProperty(oldName)) {
            newName = prefix + events[oldName]

            object.on(oldName, this.createEventRelayer(newName), this)
          }
        }
      }

      return this
    }
  }).extend(Backbone.Events)
}))
