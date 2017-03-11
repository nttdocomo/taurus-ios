/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../../src/core/define', '../../../src/app/controller'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../../src/core/define'), require('../../../src/app/controller'), require('../taurus'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../../src/core/define'), require('../../../src/app/controller'), require('../taurus'))
  }
}(this, function (define, Controller, Taurus) {
  return define(Controller, {
    config: {
      control: {
        main: {
          push: 'onMainPush',
          pop: 'onMainPop'
        },
        editButton: {
          tap: 'onContactEdit'
        },
        contacts: {
          itemtap: 'onContactSelect'
        },
        saveButton: {
          tap: 'onContactSave'
        },
        editContact: {
          change: 'onContactChange'
        }
      }
    }
  })
}))
