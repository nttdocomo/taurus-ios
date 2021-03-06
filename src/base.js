/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './class', './underscore', './mixin/observable', './mixin/identifiable', './taurus', './jquery', './backbone-super', './underscore/deepClone', './core/lang/string'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./class'), require('./underscore'), require('./mixin/observable'), require('./mixin/identifiable'), require('./taurus'), require('./jquery'), require('./backbone-super'), require('./underscore/deepClone'), require('./core/lang/string'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./class'), require('./underscore'), require('./mixin/observable'), require('./mixin/identifiable'), require('./taurus'), require('./jquery'), require('./backbone-super'), require('./underscore/deepClone'), require('./core/lang/string'))
  }
}(this, function (define, Class, _, Observable, Identifiable, Tau, $) {
  var Base = define(Class, {
    initConfigList: [],
    defaultConfig: {},

    constructor: function (config) {
      this.initialConfig = config
      this.initialize()
    },

    doSet: function (me, value, oldValue, options) {
      var nameMap = options.nameMap

      me[nameMap.internal] = value
      if (me[nameMap.doSet]) {
        me[nameMap.doSet].call(this, value, oldValue)
      }
    },

    initialize: function () {
      this.initConfig(this.initialConfig)
      this.initialized = true
    },
    getInitialConfig: function (name) {
      var config = this.config

      if (!name) {
        return config
      } else {
        return config[name]
      }
    },

    /**
     * @private
     */
    onConfigUpdate: function (names, callback, scope) {
      var self = this.constructor
      var className = self.$className
        // </debug>
      var i, ln, name, updaterName, updater, newUpdater

      names = $.makeArray(names)

      scope = scope || this

      for (i = 0, ln = names.length; i < ln; i++) {
        name = names[i]
        updaterName = 'update' + name.capitalize()
        updater = this[updaterName] || Tau.emptyFn
        newUpdater = function () {
          updater.apply(this, arguments)
          scope[callback].apply(scope, arguments)
        }
        newUpdater.$name = updaterName
        newUpdater.$owner = self
        // <debug>
        newUpdater.displayName = className + '#' + updaterName
        // </debug>

        this[updaterName] = newUpdater
      }
    },
    triggerAction: function (eventName, args, fn, scope, options, order) {
      var fnType = typeof fn
      var arg = args.slice(0)
      args.unshift(eventName)
      this.trigger.apply(this, args)
      arg.push(options)
      if (fnType !== 'undefined') {
        fn.apply(this, arg)
      }
    }
  }, {
    generateSetter: function (nameMap) {
      var internalName = nameMap.internal
      var applyName = nameMap.apply
      var changeEventName = nameMap.changeEvent
      var doSetName = nameMap.doSet

      return function (value) {
        var initialized = this.initialized
        var oldValue = this[internalName]
        var applier = this[applyName]

        if (applier) {
          value = applier.call(this, value, oldValue)

          if (typeof value === 'undefined') {
            return this
          }
        }

        // The old value might have been changed at this point
        // (after the apply call chain) so it should be read again
        oldValue = this[internalName]

        if (value !== oldValue) {
          if (initialized) {
            this.triggerAction(changeEventName, [this, value, oldValue], this.doSet, this, {
              nameMap: nameMap
            })
          } else {
            this[internalName] = value
            if (this[doSetName]) {
              this[doSetName](value, oldValue)
            }
          }
        }

        return this
      }
    },

    // <feature classSystem.mixins>
    /**
     * Used internally by the mixins pre-processor
     * @private
     * @static
     * @inheritable
     */
    mixin: function (mixinClass) {
      var mixin = mixinClass.prototype
      var prototype = this.prototype
      var key

      if (typeof mixin.onClassMixedIn !== 'undefined') {
        mixin.onClassMixedIn.call(mixinClass, this)
      }

      if (!prototype.hasOwnProperty('mixins')) {
        if ('mixins' in prototype) {
          prototype.mixins = _.clone(prototype.mixins)
        } else {
          prototype.mixins = {}
        }
      }

      for (key in mixin) {
        if (key === 'mixins') {
          _.extend(prototype.mixins, mixin[key])
        } else if (typeof prototype[key] === 'undefined' && key !== 'mixinId' && key !== 'config') {
          prototype[key] = mixin[key]
        }
      }

      // <feature classSystem.config>
      if ('config' in mixin) {
        this.addConfig(mixin.config, false)
      }
      return this
      // </feature>

    // prototype.mixins[name] = mixin
    },
    onClassExtended: function (Class, data) {
      if (!data.hasOwnProperty('eventedConfig')) {
        return
      }

      var ExtClass = define
      var config = data.config
      var eventedConfig = data.eventedConfig
      var name, nameMap

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
          nameMap = ExtClass.getConfigNameMap(name)

          data[nameMap.set] = this.generateSetter(nameMap)
        }
      }
    }
  })
  /* Base.extend = function (protoProps, classProps) {
    var parentPrototype = this.prototype

    protoProps = _.extend({}, parentPrototype, protoProps)
    parentPrototype.initConfigList = parentPrototype.initConfigList.slice()
    parentPrototype.initConfigMap = _.clone(parentPrototype.initConfigMap)
    return Backbone.View.extend.apply(this, protoProps, classProps)
  }*/
  Base.mixin(Observable).mixin(Identifiable)
  return Base
}))
