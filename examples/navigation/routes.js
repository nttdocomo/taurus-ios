/*global define*/
define(function () {
  'use strict'
  return function (match) {
    match('', 'contact#index')
    match('contact/:id/edit', 'contact#edit')
    return match('contact/:id', 'contact#show')
  }
})
