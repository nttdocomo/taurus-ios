/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone', 'backbone-super', 'underscore', './lib/event-broker', './lib/utils', './mediator'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'), require('backbone-super'), require('underscore'), require('./lib/event-broker'), require('./lib/utils'), require('./mediator'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'), require('backbone-super'), require('underscore'), require('./lib/event-broker'), require('./lib/utils'), require('./mediator'))
  }
}(this, function (Backbone, inherits, _, EventBroker, utils, mediator) {
  var Dispatcher = function () {
    this.initialize.apply(this, arguments)
  }
  _.extend(Dispatcher.prototype, {
    initialize: function (options) {
      var me = this
      if (options == null) {
        options = {}
      }
      me.settings = _.defaults(options, {
        controllerPath: 'controllers/',
        controllerSuffix: '_controller'
      })
      return me.subscribeEvent('router:match', me.dispatch)
    },
    controllerLoaded: function (route, params, options, Controller) {
      var controller, prev, previous
      this.nextPreviousRoute = this.currentRoute
      if (this.nextPreviousRoute) {
        previous = _.extend({}, this.nextPreviousRoute)
        if (this.currentParams != null) {
          previous.params = this.currentParams
        }
        if (previous.previous) {
          delete previous.previous
        }
        prev = {
          previous: previous
        }
      }
      this.nextCurrentRoute = _.extend({}, route, prev)
      controller = new Controller(params, this.nextCurrentRoute, options)
      return this.executeBeforeAction(controller, this.nextCurrentRoute, params, options)
    },
    dispatch: function (route, params, options) {
      var ref, ref1
      var me = this
      params = _.extend({}, params)
      options = _.extend({}, options)
      if (options.query == null) {
        options.query = {}
      }
      if (options.forceStartup !== true) {
        options.forceStartup = false
      }
      if (!options.forceStartup && ((ref = me.currentRoute) != null ? ref.controller : void 0) === route.controller && ((ref1 = this.currentRoute) != null ? ref1.action : void 0) === route.action && _.isEqual(this.currentParams, params) && _.isEqual(this.currentQuery, options.query)) {
        return
      }
      return this.loadController(route.controller, function (Controller) {
        return me.controllerLoaded(route, params, options, Controller)
      })
    },
    executeAction: function (controller, route, params, options) {
      if (this.currentController) {
        this.publishEvent('beforeControllerDispose', this.currentController)
        this.currentController.dispose(params, route, options)
      }
      this.currentController = controller
      this.currentParams = _.extend({}, params)
      this.currentQuery = _.extend({}, options.query)
      controller[route.action](params, route, options)
      if (controller.redirected) {
        return
      }
      return this.publishEvent('dispatcher:dispatch', this.currentController, params, route, options)
    },
    executeBeforeAction: function (controller, route, params, options) {
      var me = this
      var before = controller.beforeAction
      var executeAction = function () {
        if (controller.redirected || me.currentRoute && route === me.currentRoute) {
          me.nextPreviousRoute = me.nextCurrentRoute = null
          controller.dispose()
          return
        }
        me.previousRoute = me.nextPreviousRoute
        me.currentRoute = me.nextCurrentRoute
        me.nextPreviousRoute = me.nextCurrentRoute = null
        return me.executeAction(controller, route, params, options)
      }
      var promise
      if (!before) {
        executeAction()
        return
      }
      if (typeof before !== 'function') {
        throw new TypeError('Controller#beforeAction: function expected. ' + 'Old object-like form is not supported.')
      }
      promise = controller.beforeAction(params, route, options)
      if (typeof (promise != null ? promise.then : void 0) === 'function') {
        return promise.then(executeAction)
      } else {
        return executeAction()
      }
    },
    loadController: function (name, handler) {
      var fileName, moduleName
      if (name === Object(name)) {
        return handler(name)
      }
      fileName = name + this.settings.controllerSuffix
      moduleName = this.settings.controllerPath + fileName
      return utils.loadModule(moduleName, handler)
    }
  }, EventBroker)
  return Dispatcher
}))
