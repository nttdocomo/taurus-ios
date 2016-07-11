/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./vdom/patch'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('./vdom/patch'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/patch'));
	}
}(this, function(patch){
	return patch;
}));
