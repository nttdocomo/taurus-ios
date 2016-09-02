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
    module.exports = factory(require('../core/define'), require('../base'), require('backbone'), require('backbone-super'))
  }
}(this, function (define, Base, Backbone) {
  var Store = define('Tau.data.Store', Base, {
    config: {
      autoLoad: true
    },
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
    },
    load:function () {
      this.fetch()
    },
    updateAutoLoad: function (autoLoad) {
      var proxy = this.getProxy()
      if (autoLoad && (proxy && !proxy.isMemoryProxy)) {
        this.load(_.isObject(autoLoad) ? autoLoad : null)
      }
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
  //Store.mixin(Backbone.Collection)
  return Store
}))
