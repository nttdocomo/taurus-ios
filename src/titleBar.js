(function (root, factory) {
   if(typeof define === "function") {
       if(define.amd){
           define(['./class/create','./component'], factory);
       }
       if(define.cmd){
           define(function(require, exports, module){
               return factory(require('./class/create'),require('./component'));
           })
       }
   } else if(typeof module === "object" && module.exports) {
       module.exports = factory(require('./class/create'),require('./component'));
   }
}(this, function(create,Component){
    return create(Component)
}))
