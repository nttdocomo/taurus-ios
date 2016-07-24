/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', 'backbone', 'underscore', './util/observable', 'backbone-super', './underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('backbone'), require('underscore'), require('./util/observable'), require('backbone-super'), require('./underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('backbone'), require('underscore'), require('./util/observable'), require('backbone-super'), require('./underscore/deepClone'))
  }
}(this, function (define, Backbone, _, Observable) {
  var Base = define(Backbone.View, {
    initConfigList: [],
    initConfigMap: {},
    defaultConfig: {},
    initConfig: function (instanceConfig) {
      var me = this
      var configNameCache = define.configNameCache
      // var prototype = me.constructor.prototype
      var initConfigList = me.initConfigList
      var initConfigMap = this.initConfigMap
      var config = me.configClass
      var defaultConfig = me.defaultConfig
      var nameMap
      var getName
      me.initConfig = function () {}
      me.config = config
      if (instanceConfig) {
        initConfigList = initConfigList.slice()
        for (var name in instanceConfig) {
          if (name in defaultConfig && !initConfigMap[name]) {
            initConfigList.push(name)
          }
        }
      }
      // Point all getters to the initGetters
      for (var i = 0, ln = initConfigList.length; i < ln; i++) {
        name = initConfigList[i]
        nameMap = configNameCache[name]
        me[nameMap.get] = me[nameMap.initGet]
      }
      me.beforeInitConfig(config)
      for (i = 0, ln = initConfigList.length; i < ln; i++) {
        name = initConfigList[i]
        nameMap = configNameCache[name]
        getName = nameMap.get

        if (me.hasOwnProperty(getName)) {
          me[nameMap.set](config[name])
          delete me[getName]
        }
      }
    // console.log(me)
    }
  }, {
    /**
     * @private
     * @static
     * @inheritable
     */
    addConfig: function (config, fullMerge) {
      var prototype = this.prototype
      var initConfigList = prototype.initConfigList
      var initConfigMap = prototype.initConfigMap
      var defaultConfig = prototype.defaultConfig
      var hasInitConfigItem, name, value

      for (name in config) {
        if (config.hasOwnProperty(name) && (fullMerge || !(name in defaultConfig))) {
          value = config[name]
          hasInitConfigItem = initConfigMap[name]

          if (value !== null) {
            if (!hasInitConfigItem) {
              initConfigMap[name] = true
              initConfigList.push(name)
            }
          } else if (hasInitConfigItem) {
            initConfigMap[name] = false
            initConfigList = _.without(initConfigList, name)
          // Ext.Array.remove(initConfigList, name)
          }
        }
      }

      if (fullMerge) {
        _.extend(defaultConfig, config)
      }else {
        _.defaults(defaultConfig, config)
      }

      prototype.configClass = _.omit(_.deepClone(defaultConfig), function (value, key, object) {
        return _.isUndefined(value)
      })
    },
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
            this.fireAction(changeEventName, [this, value, oldValue], this.doSet, this, {
              nameMap: nameMap
            })
          }else {
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
        }else {
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
      // </feature>

      prototype.mixins[name] = mixin
    },
    onClassExtended: function (Class, data) {
      if (!data.hasOwnProperty('eventedConfig')) {
        return
      }

      var ExtClass = define,
        config = data.config,
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
  Base.mixin(Observable)
  return Base
}))
