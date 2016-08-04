/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', 'class', 'underscore', '../mixin/observable', 'backbone-super'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('class'), require('underscore'), require('../mixin/observable'), require('backbone-super'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('class'), require('underscore'), require('../mixin/observable'), require('backbone-super'))
  }
}(this, function (define, Class, _, Observable, inherits) {
  return define('Tau.util.AbstractMixedCollection', Class, {
    /**
     * Creates new MixedCollection.
     * @param {Boolean} [allowFunctions=false] Specify `true` if the {@link #addAll}
     * function should add function references to the collection.
     * @param {Function} [keyFn] A function that can accept an item of the type(s) stored in this MixedCollection
     * and return the key value for that item.  This is used when available to look up the key on items that
     * were passed without an explicit key parameter to a MixedCollection method.  Passing this parameter is
     * equivalent to providing an implementation for the {@link #getKey} method.
     */
    constructor: function (allowFunctions, keyFn) {
      var me = this

      me.items = []
      me.map = {}
      me.keys = []
      me.length = 0

      me.allowFunctions = allowFunctions === true

      if (keyFn) {
        me.getKey = keyFn
      }

      Observable.call(me)
    },
    /**
     * Adds an item to the collection. Fires the {@link #event-add} event when complete.
     * @param {String} key The key to associate with the item, or the new item.
     *
     * If a {@link #getKey} implementation was specified for this MixedCollection,
     * or if the key of the stored items is in a property called `id`,
     * the MixedCollection will be able to _derive_ the key for the new item.
     * In this case just pass the new item in this parameter.
     * @param {Object} obj The item to add.
     * @return {Object} The item added.
     */
    add: function (key, obj) {
      var me = this
      var myObj = obj
      var myKey = key
      var old

      if (arguments.length === 1) {
        myObj = myKey
        myKey = me.getKey(myObj)
      }
      if (typeof myKey !== 'undefined' && myKey !== null) {
        old = me.map[myKey]
        if (typeof old !== 'undefined') {
          return me.replace(myKey, myObj)
        }
        me.map[myKey] = myObj
      }
      me.length++
      me.items.push(myObj)
      me.keys.push(myKey)
      me.trigger('add', me.length - 1, myObj, myKey)
      return myObj
    },

    /**
     * Returns index within the collection of the passed Object.
     * @param {Object} o The item to find the index of.
     * @return {Number} index of the item. Returns -1 if not found.
     */
    indexOf: function(o){
      return _.indexOf(this.items, o)
    }
  }).mixin(Observable)
}))
