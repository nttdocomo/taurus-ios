/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../core/factory', '../../component', '../../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../core/factory'), require('../../component'), require('../../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../core/factory'), require('../../component'), require('../../tau'))
  }
}(this, function (define, factory, Component, Tau) {
  return define('Tau.dataview.component.SimpleListItem', Component, {
    config: {
      baseCls: Tau.baseCSSPrefix + 'list-item',
      disclosure: {
        xclass: Component,
        cls: Tau.baseCSSPrefix + 'list-disclosure',
        hidden: true
      },
      header: {
        xclass: Component,
        cls: Tau.baseCSSPrefix + 'list-header',
        html: ' '
      },

      /**
       * @cfg {Ext.data.Model} record The model instance of this ListTplItem. It is controlled by the List.
       * @accessor
       */
      record: null
    },

    initialize: function () {
      this.element.addCls(this.getBaseCls() + '-tpl')
    },

    applyHeader: function (header) {
      if (header && !header.isComponent) {
        header = factory(header, Component, this.getHeader())
      }
      return header
    },

    updateHeader: function (header, oldHeader) {
      if (oldHeader) {
        oldHeader.destroy()
      }
    },

    updateRecord: function (record) {
      var me = this,
        dataview = me.dataview || this.getDataview(),
        // data = record && dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
        data = record && dataview.prepareData(record.toJSON(), dataview.getStore().indexOf(record), record),
        disclosure = this.getDisclosure()

      me.updateData(data || null)

      if (disclosure && record && dataview.getOnItemDisclosure()) {
        var disclosureProperty = dataview.getDisclosureProperty()
        disclosure[(data.hasOwnProperty(disclosureProperty) && data[disclosureProperty] === false) ? 'hide' : 'show']()
      }
    }
  })
}))
