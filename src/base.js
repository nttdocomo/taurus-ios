/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./class/create', 'backbone', 'underscore', './util/observable', 'backbone-super', './underscore/deepClone'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./class/create'), require('backbone'), require('underscore'), require('./util/observable'), require('backbone-super'), require('./underscore/deepClone'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./class/create'), require('backbone'), require('underscore'), require('./util/observable'), require('backbone-super'), require('./underscore/deepClone'))
  }
}(this, function (create, Backbone, _, Observable) {
  var Base = create(Backbone.View, {
    initConfigList: [],
    initConfigMap: {},
    defaultConfig: {},
    initConfig: function (instanceConfig) {
      var me = this
      var configNameCache = create.configNameCache
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
      var initConfigList = prototype.initConfigList = []
      var initConfigMap = prototype.initConfigMap
      var defaultConfig = _.deepClone(prototype.defaultConfig)
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
    }
  })
  /* Base.extend = function (protoProps, classProps) {
    var parentPrototype = this.prototype

    protoProps = _.extend({}, parentPrototype, protoProps)
    parentPrototype.initConfigList = parentPrototype.initConfigList.slice()
    parentPrototype.initConfigMap = _.clone(parentPrototype.initConfigMap)
    return Backbone.View.extend.apply(this, protoProps, classProps)
  }*/
  Base.mixin(Observable);
  return Base
}))
