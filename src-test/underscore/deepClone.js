/*global define, QUnit*/
'use strict'
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      // Now we're wrapping the factory and assigning the return
      // value to the root (window) and returning it as well to
      // the AMD loader.
      define(['../../src/underscore', '../../src/underscore/deepClone'], function (Backbone, $, _, ToolTip) {
        return (root.Class = factory(Backbone, $, _, ToolTip))
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../../src/underscore'), require('../../src/underscore/deepClone')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../../src/underscore'), require('../../src/underscore/deepClone')))
  } else {
    root.Class = factory()
  }
}(this, function (_) {
  var run = function () {
    var sourceObject = {
      'a': 1
    }
    var cloneObject = _.deepClone(sourceObject)
    QUnit.test('ToolTip', function (assert) {
      assert.equal(cloneObject.a, sourceObject.a, '原对象和克隆对象对应的键值相等')
      sourceObject.a = 2
      assert.equal(cloneObject.a, 1, '即使原对象对应的键值修改了，不影响克隆对象')
    })
    sourceObject['b'] = undefined
    cloneObject = _.deepClone(sourceObject)
    /* QUnit.test('ToolTip', function (assert) {
      assert.equal(cloneObject.a, sourceObject.a, '原对象和克隆对象对应的键值相等')
      sourceObject.a = 2
      assert.equal(cloneObject.a, 1, '即使原对象对应的键值修改了，不影响克隆对象')
    })*/
    console.log(cloneObject)
  }
  return {run: run}
}))
