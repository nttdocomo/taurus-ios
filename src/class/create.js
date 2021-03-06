/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('underscore'))
  }
}(this, function (_) {
  var create = function (Class, data, classProps) {
    create.process(Class, data)
    return Class.extend(data, classProps)
  }
  _.extend(create, {
    preprocessors: {},
    configNameCache: {},
    process: function (Class, data) {
      var me = this
      var args = arguments
      var preprocessors = this.preprocessors
      _.each(preprocessors, function (preprocessor) {
        var process = preprocessor.fn
        process.apply(me, args)
      })
    },

    /**
     * @private
     * @static
     */
    generateInitGetter: function (nameMap) {
      var name = nameMap.name
      var setName = nameMap.set
      var getName = nameMap.get
      var initializingName = nameMap.initializing

      return function () {
        this[initializingName] = true
        delete this[getName]

        this[setName](this.config[name])
        delete this[initializingName]

        return this[getName].apply(this, arguments)
      }
    },

    /**
     * @private
     * @static
     */
    generateGetter: function (nameMap) {
      var internalName = nameMap.internal

      return function () {
        return this[internalName]
      }
    },

    /**
     * @private
     * @static
     */
    generateSetter: function (nameMap) {
      var internalName = nameMap.internal
      var getName = nameMap.get
      var applyName = nameMap.apply
      var updateName = nameMap.update
      var setter

      setter = function (value) {
        var oldValue = this[internalName]
        var applier = this[applyName]
        var updater = this[updateName]

        delete this[getName]

        if (applier) {
          value = applier.call(this, value, oldValue)
          if (typeof value === 'undefined') {
            return this
          }
        }

        this[internalName] = value

        if (updater && value !== oldValue) {
          updater.call(this, value, oldValue)
        }

        return this
      }

      setter.$isDefault = true

      return setter
    },
    /**
     * @private
     * @static
     */
    getConfigNameMap: function (name) {
      var cache = this.configNameCache
      var map = cache[name]
      var capitalizedName

      if (!map) {
        capitalizedName = name.charAt(0).toUpperCase() + name.substr(1)

        map = cache[name] = {
          name: name,
          internal: '_' + name,
          initializing: 'is' + capitalizedName + 'Initializing',
          apply: 'apply' + capitalizedName,
          update: 'update' + capitalizedName,
          set: 'set' + capitalizedName,
          get: 'get' + capitalizedName,
          initGet: 'initGet' + capitalizedName,
          doSet: 'doSet' + capitalizedName,
          changeEvent: name.toLowerCase() + 'change'
        }
      }

      return map
    },
    registerPreprocessor: function (name, fn) {
      this.preprocessors[name] = {
        name: name,
        fn: fn
      }

      return this
    }
  })
  create.registerPreprocessor('config', function (Class, data) {
    var config = data.config
    var prototype = Class.prototype
    var defaultConfig = prototype.config || {}
    var value, nameMap, setName, getName, initGetName, internalName
    delete data.config
    for (var name in config) {
      // Once per config item, per class hierarchy
      if (config.hasOwnProperty(name) && !(name in defaultConfig)) {
        value = config[name]
        nameMap = this.getConfigNameMap(name)
        setName = nameMap.set
        getName = nameMap.get
        initGetName = nameMap.initGet
        internalName = nameMap.internal

        data[initGetName] = this.generateInitGetter(nameMap)

        if (value === null && !data.hasOwnProperty(internalName)) {
          data[internalName] = null
        }

        if (!data.hasOwnProperty(getName)) {
          data[getName] = this.generateGetter(nameMap)
        }

        if (!data.hasOwnProperty(setName)) {
          data[setName] = this.generateSetter(nameMap)
        }
      }
    }
    Class.addConfig && Class.addConfig(config, true)
  })
  return create
}))
