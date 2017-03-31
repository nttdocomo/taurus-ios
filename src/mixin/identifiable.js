/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../underscore'))
  }
}(this, function (define, Class, _) {
  var Identifiable = define(Class, {
    defaultIdPrefix: 'tau-',
    idCleanRegex: /\.|[^\w\-]/g,
    defaultIdSeparator: '-',
    getOptimizedId: function () {
      return this.id
    },

    getUniqueId: function () {
      var id = this.id
      var prototype, separator, xtype, uniqueIds, prefix

      if (!id) {
        prototype = this.constructor.prototype
        separator = this.defaultIdSeparator

        uniqueIds = Identifiable.uniqueIds

        if (!prototype.hasOwnProperty('identifiablePrefix')) {
          xtype = this.xtype

          if (xtype) {
            prefix = this.defaultIdPrefix + xtype + separator
          } else {
            prefix = prototype.$className.replace(this.idCleanRegex, separator).toLowerCase() + separator
          }

          prototype.identifiablePrefix = prefix
        }

        prefix = this.identifiablePrefix

        if (!uniqueIds.hasOwnProperty(prefix)) {
          uniqueIds[prefix] = 0
        }

        id = this.id = _.uniqueId(prefix)// prefix + (++uniqueIds[prefix])
      }

      this.getUniqueId = this.getOptimizedId

      return id
    },
    /**
     * Retrieves the id of this component. Will autogenerate an id if one has not already been set.
     * @return {String} id
     */
    getId: function () {
      var id = this.id

      if (!id) {
        id = this.getUniqueId()
      }

      this.getId = this.getOptimizedId

      return id
    }
  }, {
    uniqueIds: {}
  })
  return Identifiable
}))
