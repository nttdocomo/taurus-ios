(function (root, factory) {
   if(typeof define === "function") {
       if(define.amd){
           define(['../class/create'], factory);
       }
       if(define.cmd){
           define(function(require, exports, module){
               return factory(require('../class/create'));
           })
       }
   } else if(typeof module === "object" && module.exports) {
       module.exports = factory(require('../class/create'));
   }
}(this, function(create){}))
