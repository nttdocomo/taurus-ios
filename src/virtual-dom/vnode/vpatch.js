/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./version'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("./version"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./version'));
	}
}(this, function(version){
    VirtualPatch.NONE = 0
    VirtualPatch.VTEXT = 1
    VirtualPatch.VNODE = 2
    VirtualPatch.WIDGET = 3
    VirtualPatch.PROPS = 4
    VirtualPatch.ORDER = 5
    VirtualPatch.INSERT = 6
    VirtualPatch.REMOVE = 7
    VirtualPatch.THUNK = 8

    function VirtualPatch(type, vNode, patch) {
        this.type = Number(type)
        this.vNode = vNode
        this.patch = patch
    }

    VirtualPatch.prototype.version = version
    VirtualPatch.prototype.type = "VirtualPatch"
	return VirtualPatch;
}));
