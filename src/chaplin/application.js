/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../backbone', '../backbone-super', '../underscore', './lib/router', './dispatcher'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./lib/router'), require('./dispatcher'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./lib/router'), require('./dispatcher'))
  }
}(this, function (Backbone, inherits, _, Router, Dispatcher) {
  var Application = function (options) {
    if (options === null) {
      options = {}
    }
    this.initialize(options)
  }
  Application.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps)
    child.extend = this.extend
    return child
  }
  _.extend(Application.prototype, {
    initialize: function (options) {
      if (options === null) {
        options = {}
      }
      if (this.started) {
        throw new Error('Application#initialize: App was already started')
      }
      this.initRouter(options.routes, options)
      this.initDispatcher(options)
      /* this.initLayout(options)
      this.initComposer(options)
      this.initMediator()*/
      return this.start()
    },
    initRouter: function (routes, options) {
      this.router = new Router(options)
      return typeof routes === 'function' ? routes(_.bind(this.router.match, this.router)) : void 0
    },
    initDispatcher: function (options) {
      this.dispatcher = new Dispatcher(options)
      return this.dispatcher
    },
    start: function () {
      this.router.startHistory()
      this.started = true
      this.disposed = false
      return this// Object.seal(this)
    }
  })
  return Application
}))
