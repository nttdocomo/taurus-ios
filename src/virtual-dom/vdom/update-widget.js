/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(["../vnode/is-widget.js"],factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("../vnode/is-widget.js"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require("../vnode/is-widget.js"));
	}
}(this, function(isWidget){
    function updateWidget(a, b) {
        if (isWidget(a) && isWidget(b)) {
            if ("name" in a && "name" in b) {
                return a.id === b.id
            } else {
                return a.init === b.init
            }
        }

        return false
    }
	return updateWidget;
}));
