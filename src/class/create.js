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
        return Class.extend(data)
    };
    _.extend(create,{
        preprocessors:{},
        process:function(){
            var preprocessors = this.preprocessors;
        },
        registerPreprocessor: function(name, fn) {
            this.preprocessors[name] = {
                name: name,
                fn: fn
            };

            return this;
        }
    })
    create.registerPreprocessor('config',function(){

    })
    return create
}))
