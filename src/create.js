(function (root, factory) {
   if(typeof define === "function") {
       if(define.amd){
           define(['underscore'], factory);
       }
       if(define.cmd){
           define(function(require, exports, module){
               return factory(require('underscore'));
           })
       }
   } else if(typeof module === "object" && module.exports) {
       module.exports = factory(require('underscore'));
   }
}(this, function(_){
	var create = function(Class,data){

	}
	_.extend(create, {
		process:function(Class, data){
			var preprocessors = this.preprocessors;
			while (fn === null) {
				
			}
		},
		/**
         * Register a new pre-processor to be used during the class creation process.
         *
         * @private
         * @static
         * @param {String} name The pre-processor's name.
         * @param {Function} fn The callback function to be executed. Typical format:
         *
         *     function(cls, data, fn) {
         *         // Your code here
         *
         *         // Execute this when the processing is finished.
         *         // Asynchronous processing is perfectly OK
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     });
         *
         * @param {Function} fn.cls The created class.
         * @param {Object} fn.data The set of properties passed in {@link Ext.Class} constructor.
         * @param {Function} fn.fn The callback function that __must__ to be executed when this
         * pre-processor finishes, regardless of whether the processing is synchronous or
         * asynchronous.
         * @param {String[]} [properties]
         * @param {String} [position]
         * @param {Object} [relativeTo]
         * @return {Ext.Class} this
         */
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
        	this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            return this;
        }
	})
}))
