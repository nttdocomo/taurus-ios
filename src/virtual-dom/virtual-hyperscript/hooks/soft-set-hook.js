'use strict';
/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory();
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	}
}(this, function(){
    function SoftSetHook(value) {
        if (!(this instanceof SoftSetHook)) {
            return new SoftSetHook(value);
        }

        this.value = value;
    }

    SoftSetHook.prototype.hook = function (node, propertyName) {
        if (node[propertyName] !== this.value) {
            node[propertyName] = this.value;
        }
    };
	return SoftSetHook;
}));
