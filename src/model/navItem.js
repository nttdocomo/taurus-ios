(function (root, factory) {
	if(typeof define === "function") {
	  	if(define.amd){
		    // Now we're wrapping the factory and assigning the return
		    // value to the root (window) and returning it as well to
		    // the AMD loader.
		    define(["backbone"], function(Backbone){
		    	return (root.myModule = factory(Base));
		    });
		}
	  	if(define.cmd){
	  		define(function(require, exports, module){
				return factory(require('backbone'));
			})
	  	}
	} else if(typeof module === "object" && module.exports) {
	    // I've not encountered a need for this yet, since I haven't
	    // run into a scenario where plain modules depend on CommonJS
	    // *and* I happen to be loading in a CJS browser environment
	    // but I'm including it for the sake of being thorough
	    module.exports = (root.myModule = factory(require("backbone")));
	} else {
	    root.myModule = factory(root.Base);
	}
}(this, function(Backbone) {
	return Backbone.Model.extend({
	})
}));