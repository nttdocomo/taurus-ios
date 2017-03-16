/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../backbone', '../backbone-super', 'underscore', './utils', '../mediator', './history', './event-broker'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'))
  }
}(this, function (Backbone, inherits, _, utils, mediator, History, EventBroker) {
  var Route = function (pattern, controller, action, options) {
    if (typeof this.pattern !== 'string') {
      throw new Error('Route: RegExps are not supported. Use strings with :names and `constraints` option of route')
    }
    this.options = _.extend({}, options)
    if (this.options.paramsInQS !== false) {
      this.options.paramsInQS = true
    }
    if (this.options.name != null) {
      this.name = this.options.name
    }
    if (this.name && this.name.indexOf('#') !== -1) {
      throw new Error('Route: "#" cannot be used in name')
    }
    if (this.name == null) {
      this.name = this.controller + '#' + this.action
    }
    this.allParams = []
    this.requiredParams = []
    this.optionalParams = []
    /* if (this.action in Controller.prototype) {
      throw new Error('Route: You should not use existing controller ' + 'properties as action names')
    }*/
    this.createRegExp()
    Object.freeze(this)
  }
  Route.extend = inherits
  _.extend(Route.prototype, {})
}))
