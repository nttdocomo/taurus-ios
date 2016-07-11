(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function') {
    if(define.amd){
      define(['underscore'], function(_, Backbone) {
        // Export global even in AMD case in case this script is loaded with
        // others that may still expect a global Backbone.
        return factory( _);
      });
    }
    if(define.cmd){
      define(function(require, exports, module){
        return factory(require('underscore'));
      })
    }

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined' && typeof require === 'function') {
    var _ = require('underscore');
    factory(_);

  // Finally, as a browser global.
  } else {
    factory(root._);
  }

}(this, function factory(_) {
    var getConfigNameMap = function(name){

    };
    return function(Class,config){
        var configNameCache = {};
        var prototype = Class.prototype,
            defaultConfig = prototype.config,
            nameMap, name, setName, getName, initGetName, internalName, value;
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

        delete data.config;
    }
}))
