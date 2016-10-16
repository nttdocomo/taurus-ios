/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['./core/define', 'backbone', 'underscore', 'tau', './polyfill/object/classify', 'backbone-super', './polyfill/object/merge'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('./core/define'), require('backbone'), require('underscore'), require('tau'), require('./polyfill/object/classify'), require('backbone-super'), require('./polyfill/object/merge')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('./core/define'), require('backbone'), require('underscore'), require('tau'), require('./polyfill/object/classify'), require('backbone-super'), require('./polyfill/object/merge')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Backbone, _, Tau) {
  var Class = function () {}
  _.extend(Class.prototype, Backbone.Events, {
    configClass: Tau.emptyFn,
    initConfigMap: {},

    /**
     * @private
     */
    hasConfig: function (name) {
      return (name in this.defaultConfig)
    },
    initConfig: function (instanceConfig) {
      var me = this
      var configNameCache = define.configNameCache
      // var prototype = me.constructor.prototype
      var initConfigList = me.initConfigList
      var initConfigMap = this.initConfigMap
      var ConfigClass = me.configClass
      var config = new ConfigClass()
      var defaultConfig = me.defaultConfig
      var nameMap
      var getName
      me.initConfig = function () {}
      if (instanceConfig) {
        _.extend(config, instanceConfig)
      }
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
    },

    /**
     * @private
     */
    setConfig: function (config, applyIfNotSet) {
      if (!config) {
        return this
      }

      var configNameCache = define.configNameCache
      var currentConfig = this.config
      var defaultConfig = this.defaultConfig
      var initialConfig = this.initialConfig
      var configList = []
      var name, i, ln, nameMap

      applyIfNotSet = Boolean(applyIfNotSet)

      for (name in config) {
        if ((applyIfNotSet && (name in initialConfig))) {
          continue
        }

        currentConfig[name] = config[name]

        if (name in defaultConfig) {
          configList.push(name)
          nameMap = configNameCache[name]
          this[nameMap.get] = this[nameMap.initGet]
        }
      }

      for (i = 0, ln = configList.length; i < ln; i++) {
        name = configList[i]
        nameMap = configNameCache[name]
        this[nameMap.set].call(this, config[name])
        delete this[nameMap.get]
      }

      return this
    },
    beforeInitConfig: function () {},
    isInstance: true,
    // </feature>

    /**
     * @private
     * @param {String} name
     * @param {Mixed} value
     * @return {Mixed}
     */
    link: function (name, value) {
      this.$links = {}
      this.link = this.doLink
      return this.link.apply(this, arguments)
    },

    doLink: function (name, value) {
      this.$links[name] = true

      this[name] = value

      return value
    }
  })
  Class.extend = Backbone.View.extend
  _.extend(Class, {
    '$onExtended': [],
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
        Object.merge(defaultConfig, config)
      } else {
        _.defaults(defaultConfig, config)
      }

      prototype.configClass = Object.classify(defaultConfig)/* _.omit(_.deepClone(defaultConfig), function (value, key, object) {
        return _.isUndefined(value)
      })*/
    },

    /**
     * @private
     * @static
     * @inheritable
     */
    onExtended: function (fn, scope) {
      this.$onExtended.push({
        fn: fn,
        scope: scope
      })

      return this
    },
    /**
     * @private
     * @static
     * @inheritable
     */
    triggerExtended: function () {
      var callbacks = this.$onExtended
      var ln = callbacks.length
      var i, callback

      if (ln > 0) {
        for (i = 0; i < ln; i++) {
          callback = callbacks[i]
          callback.fn.apply(callback.scope || this, arguments)
        }
      }
    }
  })
  return Class
}))
