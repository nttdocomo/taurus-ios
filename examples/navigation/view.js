/*global define*/
define(function (require) {
  var View = require('../../src/navigation/view')
  var List = require('../../src/dataview/list')
  var Button = require('../../src/button')
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
        xclass: List
      }]
    }
  })
  // var Contacts = define()
  var navigationView = new NavigationView()
  $(document.body).append(navigationView.$el)
})
