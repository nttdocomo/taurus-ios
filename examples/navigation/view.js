/*global define*/
define(function (require) {
  var View = require('../../src/navigation/view')
  var Viewport = require('../../src/viewport/viewport')
  var Button = require('../../src/button')
  var Contacts = require('./contacts')
  var $ = require('../../src/jquery')
  // var factory = require('../../src/core/factory')
  var define = require('../../src/core/define')
  var NavigationView = define(View, {
    config: {
      navigationBar: {
        items: [{
          xclass: Button,
          id: 'editButton',
          text: 'Edit',
          align: 'right',
          hidden: true /*,
	        hideAnimation: Ext.os.is.Android ? false : {
	          type: 'fadeOut',
	          duration: 200
	        },
	        showAnimation: Ext.os.is.Android ? false : {
	          type: 'fadeIn',
	          duration: 200
	        }*/
        }, {
          xclass: Button,
          id: 'saveButton',
          text: 'Save',
          ui: 'sencha',
          align: 'right',
          hidden: true /*,
	        hideAnimation: Ext.os.is.Android ? false : {
	          type: 'fadeOut',
	          duration: 200
	        },
	        showAnimation: Ext.os.is.Android ? false : {
	          type: 'fadeIn',
	          duration: 200
	        }*/
        }]
      },
      items: [{
        xclass: Contacts
      }]
    }
  })
  // var Contacts = define()
  var viewport = new Viewport
  viewport.add({
    xclass: NavigationView
  })
  ///var navigationView = new NavigationView()
  //$(document.body).append(navigationView.$el)
})
