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
}(this, function(version){
    function isThunk(t) {
        return t && t.type === "Thunk"
    }
	return isThunk;
}));
