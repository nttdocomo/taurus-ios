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
				return factory(document,require("./apply-properties"),require("../vnode/is-vnode"),require("../vnode/is-vtext"),require("../vnode/is-widget"),require("../vnode/handle-thunk"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/patch'));
	}
}(this, function(document,applyProperties,isVNode,isVText,isWidget,handleThunk){
    function createElement(vnode, opts) {
        var doc = opts ? opts.document || document : document
        var warn = opts ? opts.warn : null

        vnode = handleThunk(vnode).a

        if (isWidget(vnode)) {
            return vnode.init()
        } else if (isVText(vnode)) {
            return doc.createTextNode(vnode.text)
        } else if (!isVNode(vnode)) {
            if (warn) {
                warn("Item is not a valid virtual dom node", vnode)
            }
            return null
        }

        var node = (vnode.namespace === null) ?
            doc.createElement(vnode.tagName) :
            doc.createElementNS(vnode.namespace, vnode.tagName)

        var props = vnode.properties
        applyProperties(node, props)

        var children = vnode.children

        for (var i = 0; i < children.length; i++) {
            var childNode = createElement(children[i], opts)
            if (childNode) {
                node.appendChild(childNode)
            }
        }

        return node
    }
	return createElement;
}));
