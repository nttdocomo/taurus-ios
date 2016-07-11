/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./vtree/diff'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require("./version"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vtree/diff'));
	}
}(this, function(version){
    function VirtualText(text) {
        this.text = String(text)
    }

    VirtualText.prototype.version = version
    VirtualText.prototype.type = "VirtualText"
	return VirtualText;
}));
