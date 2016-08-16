/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./util/namespace', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./util/namespace'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./util/namespace'), require('tau'))
  }
}(this, function (define, Tau) {
  return define('Tau.Function', {
    /**
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for `name` and `value`.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * - `name` and `value` as 2 arguments
     * - one single object argument with multiple key - value pairs
     *
     * For example:
     *
     *     var setValue = Ext.Function.flexSetter(function(name, value) {
     *         this[name] = value;
     *     });
     *
     *     // Afterwards
     *     // Setting a single name - value
     *     setValue('name1', 'value1');
     *
     *     // Settings multiple name - value pairs
     *     setValue({
     *         name1: 'value1',
     *         name2: 'value2',
     *         name3: 'value3'
     *     });
     *
     * @param {Function} fn
     * @return {Function} flexSetter
     */
    flexSetter: function (fn) {
      return function (a, b) {
        var k, i

        if (a === null) {
          return this
        }

        if (typeof a !== 'string') {
          for (k in a) {
            if (a.hasOwnProperty(k)) {
              fn.call(this, k, a[k])
            }
          }

          if (Tau.enumerables) {
            for (i = Tau.enumerables.length; i--;) {
              k = Tau.enumerables[i]
              if (a.hasOwnProperty(k)) {
                fn.call(this, k, a[k])
              }
            }
          }
        } else {
          fn.call(this, a, b)
        }

        return this
      }
    }
  })
}))
