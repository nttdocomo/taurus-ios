/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../base', 'underscore', 'backbone', 'backbone-super'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../base'), require('underscore'), require('backbone'), require('backbone-super'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../base'), require('underscore'), require('backbone'), require('backbone-super'))
  }
}(this, function (define, Base, _, Backbone) {
  var Store = define('Tau.data.Store', Base, {
    config: {
      autoLoad: true
    },
    isStore: true,
    constructor: function (config) {
      /* config = config || {}

      this.data = this._data = this.createDataCollection()

      this.data.setSortRoot('data')
      this.data.setFilterRoot('data')

      this.removed = []

      if (config.id && !config.storeId) {
        config.storeId = config.id
        delete config.id
      }*/

      this.initConfig(config)

      Base.apply(this, arguments)
      Backbone.Collection.apply(this, arguments)
    },

    /**
     * Returns `true` if the Store has been loaded.
     * @return {Boolean} `true` if the Store has been loaded.
     */
    isLoaded: function () {
      return Boolean(this.loaded)
    },

    /**
     * Returns `true` if the Store is currently performing a load operation.
     * @return {Boolean} `true` if the Store is currently loading.
     */
    isLoading: function () {
      return Boolean(this.loading)
    },
    load: function () {
      this.fetch({
        success: _.bind(this.onProxyLoad, this),
        reset: true
      })
    },
    onProxyLoad: function () {},
    updateAutoLoad: function (autoLoad) {
      this.load(_.isObject(autoLoad) ? autoLoad : null)
    /* var proxy = this.getProxy()
    if (autoLoad && (proxy && !proxy.isMemoryProxy)) {
      this.load(_.isObject(autoLoad) ? autoLoad : null)
    }*/
    },

    /**
     * Gets the number of cached records. Note that filtered records are not included in this count.
     * If using paging, this may not be the total size of the dataset.
     * @return {Number} The number of Records in the Store's cache.
     */
    getCount: function () {
      return this.length || 0
    }
  })
  Store.mixin(Backbone.Collection)
  return Store
}))
