/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../backbone', '../backbone-super', 'underscore', './utils', '../mediator', './history', './event-broker', './route'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'), require('./route'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../backbone'), require('../backbone-super'), require('../underscore'), require('./utils'), require('../mediator'), require('./history'), require('./event-broker'), require('./route'))
  }
}(this, function (Backbone, inherits, _, utils, mediator, History, EventBroker, Route) {
  var Router = function (options) {
    var isWebFile
    var me = this
    me.options = options != null ? options : {}
    // this.match = bind(this.match, this)
    isWebFile = window.location.protocol !== 'file:'
    _.defaults(me.options, {
      pushState: isWebFile,
      root: '/',
      trailing: false
    })
    me.removeRoot = new RegExp('^' + utils.escapeRegExp(me.options.root) + '(#)?')
    me.subscribeEvent('!router:route', me.oldEventError)
    me.subscribeEvent('!router:routeByName', me.oldEventError)
    me.subscribeEvent('!router:changeURL', me.oldURLEventError)
    me.subscribeEvent('dispatcher:dispatch', me.changeURL)
    mediator.setHandler('router:route', me.route, me)
    mediator.setHandler('router:reverse', me.reverse, me)
    me.createHistory()
  }
  Router.extend = inherits
  _.extend(Router.prototype, {
    createHistory: function () {
      Backbone.history = new History()
      return Backbone.history
    },
    startHistory: function () {
      return Backbone.history.start(this.options)
    },
    oldEventError: function () {
      throw new Error('!router:route and !router:routeByName events were removed. Use `Chaplin.utils.redirectTo`')
    },
    oldURLEventError: function () {
      throw new Error('!router:changeURL event was removed.')
    },
    changeURL: function (controller, params, route, options) {
      var navigateOptions, url
      if (!((route.path != null) && (options != null ? options.changeURL : void 0))) {
        return
      }
      url = route.path + (route.query ? '?' + route.query : '')
      navigateOptions = {
        trigger: options.trigger === true,
        replace: options.replace === true
      }
      return Backbone.history.navigate(url, navigateOptions)
    },
    match: function (pattern, target, options) {
      var action, controller, ref1, route
      if (options == null) {
        options = {}
      }
      if (arguments.length === 2 && target && typeof target === 'object') {
        options = target
        controller = options.controller
        action = options.action
        if (!(controller && action)) {
          throw new Error('Router#match must receive either target or ' + 'options.controller & options.action')
        }
      } else {
        controller = options.controller
        action = options.action
        if (controller || action) {
          throw new Error('Router#match cannot use both target and ' + 'options.controller / options.action')
        }
        ref1 = target.split('#')
        controller = ref1[0]
        action = ref1[1]
      }
      _.defaults(options, {
        trailing: this.options.trailing
      })
      route = new Route(pattern, controller, action, options)
      Backbone.history.handlers.push({
        route: route,
        callback: route.handler
      })
      return route
    },
    reverse: function (criteria, params, query) {
      var handler, handlers, i, len, reversed, root, url
      root = this.options.root
      if ((params != null) && typeof params !== 'object') {
        throw new TypeError('Router#reverse: params must be an array or an ' + 'object')
      }
      handlers = Backbone.history.handlers
      for (i = 0, len = handlers.length; i < len; i++) {
        handler = handlers[i]
        if (!(handler.route.matches(criteria))) {
          continue
        }
        reversed = handler.route.reverse(params, query)
        if (reversed !== false) {
          url = root ? root + reversed : reversed
          return url
        }
      }
      throw new Error('Router#reverse: invalid route criteria specified: ' + ('' + (JSON.stringify(criteria))))
    },
    route: function (pathDesc, params, options) {
      var handler, path, pathParams
      if (pathDesc && typeof pathDesc === 'object') {
        path = pathDesc.url
        if (!params && pathDesc.params) {
          params = pathDesc.params
        }
      }
      params = Array.isArray(params) ? params.slice() : _.extend({}, params)
      if (path != null) {
        path = path.replace(this.removeRoot, '')
        handler = this.findHandler(function (handler) {
          return handler.route.test(path)
        })
        options = params
        params = null
      } else {
        options = _.extend({}, options)
        handler = this.findHandler(function (handler) {
          if (handler.route.matches(pathDesc)) {
            params = handler.route.normalizeParams(params)
            if (params) {
              return true
            }
          }
          return false
        })
      }
      if (handler) {
        _.defaults(options, {
          changeURL: true
        })
        pathParams = path != null ? path : params
        handler.callback(pathParams, options)
        return true
      } else {
        throw new Error('Router#route: request was not routed')
      }
    }
  }, EventBroker)
  return Router
}))
