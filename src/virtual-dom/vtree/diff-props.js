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
				return factory(require("underscore").isObject,require("../vnode/is-vhook"));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./vdom/patch'));
	}
}(this, function(isObject,isHook){
    function diffProps(a, b) {
        var diff

        for (var aKey in a) {
            if (!(aKey in b)) {
                diff = diff || {}
                diff[aKey] = undefined
            }

            var aValue = a[aKey]
            var bValue = b[aKey]

            if (aValue === bValue) {
                continue
            } else if (isObject(aValue) && isObject(bValue)) {
                if (getPrototype(bValue) !== getPrototype(aValue)) {
                    diff = diff || {}
                    diff[aKey] = bValue
                } else if (isHook(bValue)) {
                     diff = diff || {}
                     diff[aKey] = bValue
                } else {
                    var objectDiff = diffProps(aValue, bValue)
                    if (objectDiff) {
                        diff = diff || {}
                        diff[aKey] = objectDiff
                    }
                }
            } else {
                diff = diff || {}
                diff[aKey] = bValue
            }
        }

        for (var bKey in b) {
            if (!(bKey in a)) {
                diff = diff || {}
                diff[bKey] = b[bKey]
            }
        }

        return diff
    }

    function getPrototype(value) {
      if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
      } else if (value.__proto__) {
        return value.__proto__
      } else if (value.constructor) {
        return value.constructor.prototype
      }
    }
	return diffProps;
}));
