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
    function isHook(hook) {
        return hook &&
          (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
           typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
    }
	return isHook;
}));
