/*global define*/
define(function (require) {
  var define = require('../../src/core/define')
  var List = require('../../src/dataview/list')
  return define(List, {
    config: {
      title: 'Address Book',
      cls: 'x-contacts',
      variableHeights: true,

      store: 'Contacts',
      itemTpl: [
        '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
        '{firstName} {lastName}',
        '<span>{title}</span>'
      ].join('')
    }
  })
})
