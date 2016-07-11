/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./vtree/diff'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("./vtree/diff"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vtree/diff'));
	}
}(this, function(diff){
	return diff;
}));
