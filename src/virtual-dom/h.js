/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./virtual-hyperscript/index'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('./virtual-hyperscript/index'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./virtual-hyperscript/index'));
	}
}(this, function(h){
	return h;
}));
