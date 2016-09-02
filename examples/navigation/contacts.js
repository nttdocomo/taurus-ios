/*global define*/
define(function (require) {
  var define = require('../../src/core/define')
  var List = require('../../src/dataview/list')
  var Store = require('../../src/data/store')
  var $ = require('jquery')
  require('../jquery.mockjax')
  var Contacts = define(Store, {
    // url: '/restful/api',
    config: {
      autoLoad: true
    }
  })
  $.mockjax({
    url: '/restful/api',
    // You may need to include the [json2.js](https://raw.github.com/douglascrockford/JSON-js/master/json2.js) library for older browsers
    responseText: [
      {
        'firstName': 'Berny',
        'lastName': 'Beahan',
        'title': 'Global Response Facilitator',
        'city': 'Amsterdam',
        'state': 'North Holland',
        'country': 'Netherlands',
        'headshot': '1.jpeg',
        'telephone': '+1 (650) 555 1212',
        'latitude': '52.370216',
        'longitude': '4.895168'
      },
      {
        'firstName': 'Henderson',
        'lastName': 'Auer',
        'title': 'Customer Configuration Coordinator',
        'city': 'Palo Alto',
        'state': 'California',
        'country': 'USA',
        'headshot': '2.jpeg',
        'telephone': '+1 (650) 555 1212',
        'latitude': '37.441883',
        'longitude': '-122.143019'
      },
      {
        'firstName': 'Hector',
        'lastName': 'Will',
        'title': 'Dynamic Identity Supervisor',
        'city': 'Foster City',
        'state': 'California',
        'country': 'USA',
        'headshot': '3.jpeg',
        'telephone': '+1 (650) 555 1212',
        'latitude': '37.558547',
        'longitude': '-122.271079'
      },
      {
        'firstName': 'Chelsea',
        'lastName': 'Grand',
        'title': 'Dynamic Response Planner',
        'city': 'Redwood City',
        'state': 'California',
        'country': 'USA',
        'headshot': '4.jpeg',
        'telephone': '+1 (650) 555 1212',
        'latitude': '37.485215',
        'longitude': '-122.236355'
      },
      {
        'firstName': 'Onie',
        'lastName': 'Feest',
        'title': 'International Communications Associate',
        'city': 'Palo Alto',
        'state': 'California',
        'country': 'USA',
        'headshot': '5.jpeg',
        'latitude': '37.441883',
        'longitude': '-122.143019'
      },
      {
        'firstName': 'Celia',
        'lastName': 'Golf',
        'title': 'Direct Brand Strategist',
        'city': 'Palo Alto',
        'state': 'California',
        'country': 'USA',
        'headshot': '6.jpeg',
        'latitude': '37.441883',
        'longitude': '-122.143019'
      },
      {
        'firstName': 'Tierra',
        'lastName': 'Bell',
        'title': 'Future Infrastructure Supervisor',
        'city': 'Palo Alto',
        'state': 'California',
        'country': 'USA',
        'headshot': '7.jpeg',
        'latitude': '37.441883',
        'longitude': '-122.143019'
      }
    ]
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
