/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./version'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("./version"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./version'));
	}
}(this, function(version){
    function isVirtualText(x) {
        return x && x.type === "VirtualText" && x.version === version
    }
	return isVirtualText;
}));
