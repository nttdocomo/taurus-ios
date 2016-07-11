'use strict';
/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['ev-store'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("ev-store"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('ev-store'));
	}
}(this, function(EvStore){
    function EvHook(value) {
        if (!(this instanceof EvHook)) {
            return new EvHook(value);
        }

        this.value = value;
    }

    EvHook.prototype.hook = function (node, propertyName) {
        var es = EvStore(node);
        var propName = propertyName.substr(3);

        es[propName] = this.value;
    };

    EvHook.prototype.unhook = function(node, propertyName) {
        var es = EvStore(node);
        var propName = propertyName.substr(3);

        es[propName] = undefined;
    };
	return EvHook;
}));
