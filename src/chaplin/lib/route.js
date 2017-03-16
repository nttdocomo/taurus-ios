/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone', 'backbone-super', 'underscore', './utils', '../mediator', './history', './event-broker', '../controllers/controller'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'), require('backbone-super'), require('underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'), require('../controllers/controller'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'), require('backbone-super'), require('underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'), require('../controllers/controller'))
  }
}(this, function (Backbone, inherits, _, utils, mediator, History, EventBroker, Controller) {
  var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g
  var optionalRegExp = /\((.*?)\)/g
  var paramRegExp = /(?::|\*)(\w+)/g
  var processTrailingSlash = function (path, trailing) {
    switch (trailing) {
      case true:
        if (path.slice(-1) !== '/') {
          path += '/'
        }
        break
      case false:
        if (path.slice(-1) === '/') {
          path = path.slice(0, -1)
        }
    }
    return path
  }
  var Route = function (pattern, controller, action, options) {
    if (typeof pattern !== 'string') {
      throw new Error('Route: RegExps are not supported. Use strings with :names and `constraints` option of route')
    }
    var me = this
    me.pattern = pattern
    me.controller = controller
    me.action = action
    // me.handler = _.bind(me.handler, me)
    me.options = _.extend({}, options)
    if (me.options.paramsInQS !== false) {
      me.options.paramsInQS = true
    }
    if (me.options.name != null) {
      me.name = me.options.name
    }
    if (me.name && me.name.indexOf('#') !== -1) {
      throw new Error('Route: "#" cannot be used in name')
    }
    if (me.name == null) {
      me.name = me.controller + '#' + me.action
    }
    me.allParams = []
    me.requiredParams = []
    me.optionalParams = []
    if (me.action in Controller.prototype) {
      throw new Error('Route: You should not use existing controller ' + 'properties as action names')
    }
    me.createRegExp()
    Object.freeze(me)
  }
  Route.extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps)
    child.extend = this.extend
    return child
  }
  _.extend(Route.prototype, {
    createRegExp: function () {
      var pattern
      var me = this
      pattern = me.pattern
      pattern = pattern.replace(escapeRegExp, '\\$&')
      this.replaceParams(pattern, function (match, param) {
        return me.allParams.push(param)
      })
      pattern = pattern.replace(optionalRegExp, me.parseOptionalPortion)
      pattern = this.replaceParams(pattern, function (match, param) {
        me.requiredParams.push(param)
        return me.paramCapturePattern(match)
      })
      me.regExp = RegExp('^' + pattern + '(?=\\/*(?=\\?|$))')
      return me.regExp
    },
    extractParams: function (path) {
      var i, index, len, match, matches, paramName, params, ref
      params = {}
      matches = this.regExp.exec(path)
      ref = matches.slice(1)
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        match = ref[index]
        paramName = this.allParams.length ? this.allParams[index] : index
        params[paramName] = match
      }
      return params
    },
    paramCapturePattern: function (param) {
      if (param[0] === ':') {
        return '([^\\/\\?]+)'
      } else {
        return '(.*?)'
      }
    },
    test: function (path) {
      var constraints, matched
      matched = this.regExp.test(path)
      if (!matched) {
        return false
      }
      constraints = this.options.constraints
      if (constraints) {
        return this.testConstraints(this.extractParams(path))
      }
      return true
    },
    replaceParams: function (s, callback) {
      return s.replace(paramRegExp, callback)
    },
    handler: function (pathParams, options) {
      var actionParams, params, path, query, ref, route
      options = _.extend({}, options)
      if (pathParams && typeof pathParams === 'object') {
        query = utils.queryParams.stringify(options.query)
        params = pathParams
        path = this.reverse(params)
      } else {
        ref = pathParams.split('?')
        path = ref[0]
        query = ref[1]
        if (query == null) {
          query = ''
        } else {
          options.query = utils.queryParams.parse(query)
        }
        params = this.extractParams(path)
        path = processTrailingSlash(path, this.options.trailing)
      }
      actionParams = _.extend({}, params, this.options.params)
      route = {
        path: path,
        action: this.action,
        controller: this.controller,
        name: this.name,
        query: query
      }
      return this.publishEvent('router:match', route, actionParams, options)
    }
  }, EventBroker)
  return Route
}))
