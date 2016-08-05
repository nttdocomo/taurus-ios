/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['backbone', 'underscore', './polyfill/object/classify', 'backbone-super'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('backbone'), require('underscore'), require('./polyfill/object/classify'), require('backbone-super')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('backbone'), require('underscore'), require('./polyfill/object/classify'), require('backbone-super')))
  } else {
    root.Class = factory()
  }
}(this, function (Backbone, _) {
  var Class = function () {}
  _.extend(Class.prototype, Backbone.Events, {
    initConfigMap: {},
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
        _.extend(defaultConfig, config)
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
