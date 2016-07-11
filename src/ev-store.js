'use strict';
'use strict';
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
				return factory(require("individual/one-version"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vtree/diff'));
	}
}(this, function(OneVersionConstraint){
    var MY_VERSION = '7';
    OneVersionConstraint('ev-store', MY_VERSION);

    var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

    function EvStore(elem) {
        var hash = elem[hashKey];

        if (!hash) {
            hash = elem[hashKey] = {};
        }

        return hash;
    }
	return EvStore;
}));
