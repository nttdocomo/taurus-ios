
/*global seajs*/
'use strict'
seajs.config({
  paths: {
    'taurus': './'
  },
  base: window.location.pathname.replace(/^(\/taurus)?\/.*/, '$1') + '/src',
  charset: 'utf-8',
  vars: {
    'locale': (navigator.language || navigator.browserLanguage).toLowerCase()
  }
})
// QUnit.config.autoload = false
// QUnit.config.autostart = false
seajs.use([
  './underscore/deepClone'
], function (deepClone) {
  deepClone.run()
// start QUnit.
// QUnit.load()
// QUnit.start()
})
