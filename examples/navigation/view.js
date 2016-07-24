/*global define*/
define(function (require) {
  var View = require('../../src/navigation/view')
  var $ = require('../../src/jquery')
  var factory = require('../../src/core/factory')
  var navigationView = factory({
    xclass:View
  })
  console.log(navigationView)
  $(document.body).append(navigationView.$el)
})
