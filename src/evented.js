/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', 'class', 'underscore', './mixin/observable', './mixin/identifiable', 'backbone-super', './underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('class'), require('underscore'), require('./mixin/observable'), require('./mixin/identifiable'), require('backbone-super'), require('./underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('class'), require('underscore'), require('./mixin/observable'), require('./mixin/identifiable'), require('backbone-super'), require('./underscore/deepClone'))
  }
}(this, function (define, Class, _, Observable, Identifiable) {
  return define('Tau.Evented', Class, {
    initialized: false,

    constructor: function (config) {
      this.initialConfig = config
      this.initialize()
    },

    initialize: function () {
      this.initConfig(this.initialConfig)
      this.initialized = true
    },

    doSet: function (me, value, oldValue, options) {
      var nameMap = options.nameMap

      me[nameMap.internal] = value
      if (me[nameMap.doSet]) {
        me[nameMap.doSet].call(this, value, oldValue)
      }
    },

    onClassExtended: function (Class, data) {
      if (!data.hasOwnProperty('eventedConfig')) {
        return
      }

      var config = data.config,
        eventedConfig = data.eventedConfig,
        name, nameMap

      data.config = (config) ? _.extend(config, eventedConfig) : eventedConfig

      /*
       * These are generated setters for eventedConfig
       *
       * If the component is initialized, it invokes fireAction to fire the event as well,
       * which indicate something has changed. Otherwise, it just executes the action
       * (happens during initialization)
       *
       * This is helpful when we only want the event to be fired for subsequent changes.
       * Also it's a major performance improvement for instantiation when fired events
       * are mostly useless since there's no listeners
       */
      for (name in eventedConfig) {
        if (eventedConfig.hasOwnProperty(name)) {
          nameMap = define.getConfigNameMap(name)

          data[nameMap.set] = define.generateSetter(nameMap)
        }
      }
    }
  }, {
    generateSetter: function (nameMap) {
      var internalName = nameMap.internal,
        applyName = nameMap.apply,
        changeEventName = nameMap.changeEvent,
        doSetName = nameMap.doSet

      return function (value) {
        var initialized = this.initialized,
          oldValue = this[internalName],
          applier = this[applyName]

        if (applier) {
          value = applier.call(this, value, oldValue)

          if (typeof value == 'undefined') {
            return this
          }
        }

        // The old value might have been changed at this point
        // (after the apply call chain) so it should be read again
        oldValue = this[internalName]

        if (value !== oldValue) {
          if (initialized) {
            this.fireAction(changeEventName, [this, value, oldValue], this.doSet, this, {
              nameMap: nameMap
            })
          }else {
            this[internalName] = value
            if (this[doSetName]) {
              this[doSetName].call(this, value, oldValue)
            }
          }
        }

        return this
      }
    }
  }).mixin(Observable)
}))
