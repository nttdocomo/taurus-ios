(function (root, factory) {
   if(typeof define === "function") {
       if(define.amd){
           define(['underscore'], factory);
       }
       if(define.cmd){
           define(function(require, exports, module){
               return factory(require('underscore'));
           })
       }
   } else if(typeof module === "object" && module.exports) {
       module.exports = factory(require('underscore'));
   }
}(this, function(_){
    var create = function(Class,data){
        create.process(Class, data);
        return Class.extend(data)
    };
    _.extend(create,{
        preprocessors:{},
        configNameCache:{},
        process:function(Class, data){
            var me = this,
            args = arguments,
            preprocessors = this.preprocessors;
            _.each(preprocessors,function(preprocessor){
                var process = preprocessor.fn;
                process.apply(me, args);
            })
        },

        /**
         * @private
         * @static
         */
        generateInitGetter: function(nameMap) {
            var name = nameMap.name,
                setName = nameMap.set,
                getName = nameMap.get,
                initializingName = nameMap.initializing;

            return function() {
                this[initializingName] = true;
                delete this[getName];

                this[setName].call(this, this.config[name]);
                delete this[initializingName];

                return this[getName].apply(this, arguments);
            }
        },

        /**
         * @private
         * @static
         */
        generateGetter: function(nameMap) {
            var internalName = nameMap.internal;

            return function() {
                return this[internalName];
            }
        },

        /**
         * @private
         * @static
         */
        generateSetter: function(nameMap) {
            var internalName = nameMap.internal,
                getName = nameMap.get,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setter;

            setter = function(value) {
                var oldValue = this[internalName],
                    applier = this[applyName],
                    updater = this[updateName];

                delete this[getName];

                if (applier) {
                    value = applier.call(this, value, oldValue);
                    if (typeof value == 'undefined') {
                        return this;
                    }
                }

                this[internalName] = value;

                if (updater && value !== oldValue) {
                    updater.call(this, value, oldValue);
                }

                return this;
            };

            setter.$isDefault = true;

            return setter;
        },
        /**
         * @private
         * @static
         */
        getConfigNameMap: function(name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

                map = cache[name] = {
                    name: name,
                    internal: '_' + name,
                    initializing: 'is' + capitalizedName + 'Initializing',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    set: 'set' + capitalizedName,
                    get: 'get' + capitalizedName,
                    initGet: 'initGet' + capitalizedName,
                    doSet : 'doSet' + capitalizedName,
                    changeEvent: name.toLowerCase() + 'change'
                }
            }

            return map;
        },
        registerPreprocessor: function(name, fn) {
            this.preprocessors[name] = {
                name: name,
                fn: fn
            };

            return this;
        }
    })
    create.registerPreprocessor('config',function(Class, data){
        var config = data.config,
        prototype = Class.prototype,
        defaultConfig = prototype.config || {};
        delete data.config;
        for (name in config) {
            // Once per config item, per class hierarchy
            if (config.hasOwnProperty(name) && !(name in defaultConfig)) {
                value = config[name];
                nameMap = this.getConfigNameMap(name);
                setName = nameMap.set;
                getName = nameMap.get;
                initGetName = nameMap.initGet;
                internalName = nameMap.internal;

                data[initGetName] = this.generateInitGetter(nameMap);

                if (value === null && !data.hasOwnProperty(internalName)) {
                    data[internalName] = null;
                }

                if (!data.hasOwnProperty(getName)) {
                    data[getName] = this.generateGetter(nameMap);
                }

                if (!data.hasOwnProperty(setName)) {
                    data[setName] = this.generateSetter(nameMap);
                }
            }
        }
    })
    return create
}))
