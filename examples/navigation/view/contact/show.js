/* global define */
define(function (require) {
  var Container = require('../../src/container')
  var define = require('../../src/core/define')
  define(Container, {
    config: {
      title: 'Information',
      baseCls: 'x-show-contact',
      layout: 'vbox',

      items: [
        {
          id: 'content',
          tpl: [
            '<div class="top">',
            '<div class="headshot" style="background-image:url(resources/images/headshots/{headshot});"></div>',
            '<div class="name">{firstName} {lastName}<span>{title}</span></div>',
            '</div>'
          ].join('')
        }
      ],

      record: null
    }
  })
})
