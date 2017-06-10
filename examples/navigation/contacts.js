/*global define*/
define(function (require) {
  var define = require('../../src/core/define')
  var Backbone = require('../../src/backbone')
  var List = require('../../src/dataview/list')
  var Store = require('../../src/data/store')
  var util = require('../../src/chaplin/lib/utils')
  var $ = require('jquery')
  require('../jquery.mockjax')
  var Contacts = require('./store/contacts')
  return define(List, {
    config: {
      title: 'Address Book',
      cls: 't-contacts',
      variableHeights: true,

      store: new Contacts(),
      itemTpl: [
        '<div class="headshot" style="background-image:url(resources/images/headshots/<%=headshot%>);"></div>',
        '<%=firstName%> <%=lastName%>',
        '<span><%=title%></span>'
      ].join('')
    },

    onItemSingleTap: function (e) {
      var args = this.parseEvent(e)
      this._super.apply(this, args)
      var index = args[2]
      var me = this
      var store = me.getStore()
      var record = store && store.at(index)
      util.redirectTo({url: 'contact/' + record.cid})
    }
  })
})
