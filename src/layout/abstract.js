/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', '../base', '../underscore', '../mixin/observable', '../backbone-super'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('../base'), require('../underscore'), require('../mixin/observable'), require('../backbone-super')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('../base'), require('../underscore'), require('../mixin/observable'), require('../backbone-super')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Base, _, Observable, inherits) {
  return define(Base, {
    constructor: function (config) {
      this.initialConfig = config
    },

    setContainer: function (container) {
      this.container = container

      this.initConfig(this.initialConfig)

      return this
    },

    onItemAdd: function () {},

    onItemRemove: function () {},

    onItemMove: function () {},

    onItemCenteredChange: function () {},

    onItemFloatingChange: function () {},

    onItemDockedChange: function () {},

    onItemInnerStateChange: function () {}
  })
}))
