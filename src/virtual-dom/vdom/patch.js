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
				return factory(document,require("underscore").isArray,require("./create-element"),require("./dom-index"),require("./patch-op"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/patch'));
	}
}(this, function(document,isArray,render,domIndex,patchOp){
    function patch(rootNode, patches, renderOptions) {
        renderOptions = renderOptions || {}
        renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
            ? renderOptions.patch
            : patchRecursive
        renderOptions.render = renderOptions.render || render

        return renderOptions.patch(rootNode, patches, renderOptions)
    }

    function patchRecursive(rootNode, patches, renderOptions) {
        var indices = patchIndices(patches)

        if (indices.length === 0) {
            return rootNode
        }

        var index = domIndex(rootNode, patches.a, indices)
        var ownerDocument = rootNode.ownerDocument

        if (!renderOptions.document && ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }

        for (var i = 0; i < indices.length; i++) {
            var nodeIndex = indices[i]
            rootNode = applyPatch(rootNode,
                index[nodeIndex],
                patches[nodeIndex],
                renderOptions)
        }

        return rootNode
    }

    function applyPatch(rootNode, domNode, patchList, renderOptions) {
        if (!domNode) {
            return rootNode
        }

        var newNode

        if (isArray(patchList)) {
            for (var i = 0; i < patchList.length; i++) {
                newNode = patchOp(patchList[i], domNode, renderOptions)

                if (domNode === rootNode) {
                    rootNode = newNode
                }
            }
        } else {
            newNode = patchOp(patchList, domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }

        return rootNode
    }

    function patchIndices(patches) {
        var indices = []

        for (var key in patches) {
            if (key !== "a") {
                indices.push(Number(key))
            }
        }

        return indices
    }
	return patch;
}));
