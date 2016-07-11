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
				return factory(require("./is-vnode"),require("./is-vtext"),require("./is-widget"),require("./is-thunk"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/patch'));
	}
}(this, function(isVNode,isVText,isWidget,isThunk){
    function handleThunk(a, b) {
        var renderedA = a
        var renderedB = b

        if (isThunk(b)) {
            renderedB = renderThunk(b, a)
        }

        if (isThunk(a)) {
            renderedA = renderThunk(a, null)
        }

        return {
            a: renderedA,
            b: renderedB
        }
    }

    function renderThunk(thunk, previous) {
        var renderedThunk = thunk.vnode

        if (!renderedThunk) {
            renderedThunk = thunk.vnode = thunk.render(previous)
        }

        if (!(isVNode(renderedThunk) ||
                isVText(renderedThunk) ||
                isWidget(renderedThunk))) {
            throw new Error("thunk did not return a valid node");
        }

        return renderedThunk
    }
	return handleThunk;
}));
