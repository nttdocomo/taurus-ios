(function (root, factory) {
   if (typeof define === "function") {
       if(define.amd){
           define(['./class/create','backbone','underscore','backbone-super'], factory);
       }
       if(define.cmd){
           define(function(require, exports, module){
               return factory(require('./class/create'),require('backbone'),require('underscore'),require('backbone-super'));
           })
       }
   } else if(typeof module === "object" && module.exports) {
       module.exports = factory(require('./class/create'),require('backbone'),require('underscore'),require('backbone-super'));
   }
}(this, function(create,Backbone,_){
    return create(Backbone.View,{
        initConfigList:[],
        initConfig:function(instanceConfig){
            var me = this,
            configNameCache = create.configNameCache,
            prototype = me.constructor.prototype,
            initConfigList = me.initConfigList,
            defaultConfig = me.config;
            if (instanceConfig) {
                initConfigList = initConfigList.slice();
                for (name in instanceConfig) {
                    if (name in defaultConfig && !initConfigMap[name]) {
                        initConfigList.push(name);
                    }
                }
            }
            // Point all getters to the initGetters
            for (i = 0,ln = initConfigList.length; i < ln; i++) {
                name = initConfigList[i];
                nameMap = configNameCache[name];
                me[nameMap.get] = me[nameMap.initGet];
            }
            for (i = 0,ln = initConfigList.length; i < ln; i++) {
                name = initConfigList[i];
                nameMap = configNameCache[name];
                getName = nameMap.get;

                if (this.hasOwnProperty(getName)) {
                    this[nameMap.set].call(this, config[name]);
                    delete this[getName];
                }
            }
            console.log(this)
        }
    })
}))
