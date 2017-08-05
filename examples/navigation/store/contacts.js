/* global define */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['taurus-ios/core/define', 'taurus-ios/data/store'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('taurus-ios/core/define'), require('taurus-ios/data/store'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('taurus-ios/core/define'), require('taurus-ios/data/store'))
  }
}(this, function (define, Store) {
  return define('AddressBook.store.Contacts', Store, {
    url: 'contacts.json',
    config: {
      model: 'AddressBook.model.Contact',
      autoLoad: true,
      sorters: 'firstName',
      grouper: {
        groupFn: function (record) {
          return record.get('lastName')[0]
        }
      },
      proxy: {
        type: 'ajax',
        url: 'contacts.json'
      }
    }
  })
}))
