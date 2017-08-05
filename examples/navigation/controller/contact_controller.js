define(function (require) {
  require('chaplin/controllers/controller')
  var app = require('../app')
  var Show = require('../view/contact/show')
  return Controller.extend({
    index: function () {
      console.log('index')
    },
    show: function (params) {
      console.log(arguments)
      if (!this.showContact) {
        this.showContact = new Show()
      }
      this.showContact.setRecord(record)
      app.main.push(this.showContact)
      console.log('show')
    }
  })
})
