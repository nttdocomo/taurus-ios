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
				return factory(require('raf'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory();
	}
}(this, function(raf){
    var queue = [],
    scheduled = false;

    function scheduleRender() {
    	if (scheduled) {
    		return;
    	}
    	scheduled = true;
    	raf(function() {
    		renderQueue();
    		scheduled = false;
    	});
    }

    function renderQueue() {
    	var obj;
    	while(obj = queue.pop()) {
    		obj._vDomRender();
    	}
    }

    return function(obj) {
    	if (queue.indexOf(obj) === -1) {
    		queue.push(obj);
    	}
    	scheduleRender();
    };
}));
