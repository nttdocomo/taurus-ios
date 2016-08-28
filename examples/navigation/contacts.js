/*global define*/
define(function (require) {
  var define = require('../../src/core/define')
  var List = require('../../src/dataview/list')
  var Store = require('../../src/data/store')
  var Contacts = define(Store, {
    config: {
      autoLoad: true
    }
  })
  new Contacts()
  return define(List, {
    config: {
      title: 'Address Book',
      cls: 't-contacts',
      variableHeights: true,

      store: new Contacts(),
      itemTpl: [
        '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
        '{firstName} {lastName}',
        '<span>{title}</span>'
      ].join('')
    }
  })
})
