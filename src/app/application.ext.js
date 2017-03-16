/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './controller', '../taurus'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./controller'), require('../taurus'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./controller'), require('../taurus'))
  }
}(this, function (define, Controller, Taurus) {
  return define(Controller, {
    config: {
      /**
       * @cfg {Function} launch An optional function that will be called when the Application is ready to be
       * launched. This is normally used to render any initial UI required by your application
       * @accessor
       */
      launch: Taurus.emptyFn,
      controllers: [],
      controllerInstances: []
    },
    constructor: function () {
      var me = this
      Controller.apply(me, arguments)
      me.instantiateControllers()
      var launcher = me.getLaunch()
      var controllers = this.getControllerInstances()
      for (var i = controllers.length - 1; i >= 0; i--) {
        controllers[i].init(this)
      }
      launcher.call(me)
    },

    /**
     * @private
     * Called once all of our controllers have been loaded
     */
    instantiateControllers: function () {
      var controllerNames = this.getControllers()
      var instances = []
      var length = controllerNames.length
      var Klass, i

      for (i = 0; i < length; i++) {
        Klass = controllerNames[i]

        instances.push(new Klass({
          application: this
        }))
      }

      return this.setControllerInstances(instances)
    }
  })
}))
