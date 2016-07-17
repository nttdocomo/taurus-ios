/*global define*/
define(function (require) {
  var View = require('../../src/navigation/view')
  var $ = require('../../src/jquery')
  var navigationView = new View()
  console.log(navigationView)
  $(document.body).append(navigationView.$el)
})
