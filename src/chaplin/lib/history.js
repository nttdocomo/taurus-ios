/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['backbone', 'backbone-super', 'underscore', './utils', '../mediator'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('backbone'), require('backbone-super'), require('underscore'), require('./utils'), require('../mediator'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('backbone'), require('backbone-super'), require('underscore'), require('./utils'), require('../mediator'))
  }
}(this, function (Backbone, inherits, _, utils, mediator) {
  var routeStripper = /^[#\/]|\s+$/g
  var rootStripper = /^\/+|\/+$/g
  var History = Backbone.History.extend({
    getFragment: function (fragment, forcePushState) {
      var root
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname + this.location.search
          root = this.root.replace(/\/$/, '')
          if (!fragment.indexOf(root)) {
            fragment = fragment.slice(root.length)
          }
        } else {
          fragment = this.getHash()
        }
      }
      return fragment.replace(routeStripper, '')
    },
    start: function (options) {
      var atRoot, fragment, loc, history
      history = this.history
      if (Backbone.History.started) {
        throw new Error('Backbone.history has already been started')
      }
      Backbone.History.started = true
      this.options = _.extend({}, {
        root: '/'
      }, this.options, options)
      this.root = this.options.root
      this._wantsHashChange = this.options.hashChange !== false
      this._wantsPushState = Boolean(this.options.pushState)
      this._hasPushState = Boolean(this.options.pushState && (history != null ? history.pushState : false))
      fragment = this.getFragment()
      routeStripper = this.options.routeStripper != null ? this.options.routeStripper : routeStripper
      rootStripper = this.options.rootStripper != null ? this.options.rootStripper : rootStripper
      this.root = ('/' + this.root + '/').replace(rootStripper, '/')
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl)
      } else if (this._wantsHashChange) {
        Backbone.$(window).on('hashchange', this.checkUrl)
      }
      this.fragment = fragment
      loc = this.location
      atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true)
        this.location.replace(this.root + '#' + this.fragment)
        return true
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '')
        this.history.replaceState({}, document.title, this.root + this.fragment)
      }
      if (!this.options.silent) {
        return this.loadUrl()
      }
    },
    loadUrl: function (fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false
      fragment = this.fragment = this.getFragment(fragment)
      return _.some(this.handlers, function (handler) {
        if (handler.route.test(fragment)) {
          handler.callback.call(handler.route, fragment)
          return true
        }
      })
    }
  })
  return History
}))
