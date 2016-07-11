'use strict';

/*global window, global*/
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
    var root = typeof window !== 'undefined' ?
        window : typeof global !== 'undefined' ?
        global : {};

    function Individual(key, value) {
        if (key in root) {
            return root[key];
        }

        root[key] = value;

        return value;
    }
	return Individual;
}));
