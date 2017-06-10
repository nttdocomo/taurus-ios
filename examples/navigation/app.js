/*global define*/
define(function (require) {
  // var application = require('../../src/application')
  var Application = require('../../src/chaplin/application')
  var View = require('../../src/navigation/view')
  var routes = require('./routes')
  // var Viewport = require('../../src/viewport/viewport')
  var Button = require('../../src/button')
  var Contacts = require('./contacts')
  require('../../src/env/feature')
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
  NavigationView
  var app = new Application({
    title: 'My Application',
    root: document.location.pathname,
    controllerPath: 'http://dev.taurus-ios.com/examples/navigation/controller/',
    routes: routes/* ,
    start: function () {
      var viewport = new Viewport()
      viewport.add({
        xclass: NavigationView
      })
    }*/
  })
  return app
  // var Contacts = define()
  /* Tau.doc.ready(function () {
    var viewport = new Viewport()
    viewport.add({
      xclass: NavigationView
    })
  })*/
  // var navigationView = new NavigationView()
  // $(document.body).append(navigationView.$el)
})
