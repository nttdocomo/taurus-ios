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
