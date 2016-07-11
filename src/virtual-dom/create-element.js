/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./vdom/create-element'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('./vdom/create-element'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/create-element'));
	}
}(this, function(createElement){
	return createElement;
}));
