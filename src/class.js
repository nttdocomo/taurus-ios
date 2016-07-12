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
    ExtClass
}))
