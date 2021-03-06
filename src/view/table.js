(function (root, factory) {
	if(typeof define === "function") {
	  	if(define.amd){
		    // Now we're wrapping the factory and assigning the return
		    // value to the root (window) and returning it as well to
		    // the AMD loader.
		    define(["../../view/base","./tableCell","underscore"], function(Base,NavBar,NavItem,_){
		    	return (root.myModule = factory(Base));
		    });
		}
	  	if(define.cmd){
	  		define(function(require, exports, module){
				return factory(require('../../view/base'),require('./tableCell'),require('underscore'));
			})
	  	}
	} else if(typeof module === "object" && module.exports) {
	    // I've not encountered a need for this yet, since I haven't
	    // run into a scenario where plain modules depend on CommonJS
	    // *and* I happen to be loading in a CJS browser environment
	    // but I'm including it for the sake of being thorough
	    module.exports = (root.myModule = factory(require("../../view/base"),require('./tableCell'),require('underscore')));
	} else {
	    root.myModule = factory(root.postal);
	}
}(this, function(Base,TableCell,_) {
	return Base.extend({
		className:'list-block',
		tpl:'<ul></ul>',
		initialize:function(){
			var me = this;
			Base.prototype.initialize.apply(me,arguments)
		},
		afterRender:function(){
			var me = this;
			Base.prototype.afterRender.apply(me,arguments)
			console.log(me.collection)
			me.collection.each(function(model){
				new TableCell({
					model:model,
					columns:me.columns,
					renderTo:me.$el.find('ul')
				})
			})
		}
	})
}));
