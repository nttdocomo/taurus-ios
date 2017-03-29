/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('../tau'))
  }
}(this, function (define, Class, Tau) {
  var OS = define('Tau.Version', Class, {
    constructor: function (userAgent, platform, browserScope) {
      var prefixes = this.constructor.prefixes
      var is, i, prefix, match, name, names
      for (i in prefixes) {
        if (prefixes.hasOwnProperty(i)) {
          prefix = prefixes[i]

          match = userAgent.match(new RegExp('(?:' + prefix + ')([^\\s;]+)'))

          if (match) {
            name = names[i]
            match1 = match[1]

            // This is here because some HTC android devices show an OSX Snow Leopard userAgent by default.
            // And the Kindle Fire doesn't have any indicator of Android as the OS in its User Agent
            /* if (match1 && match1 === 'HTC_') {
              version = new Tau.Version('2.3')
            } else if (match1 && match1 === 'Silk/') {
              version = new Tau.Version('2.3')
            } else {
              version = new Tau.Version(match[match.length - 1])
            }*/

            break
          }
        }
      }

      if (!name) {
        name = names[(userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]]
        // version = new Tau.Version('')
      }

      this.name = name
      is = this.is = function (name) {
        return is[name] === true
      }
    }
  }, {
    names: {
      ios: 'iOS',
      android: 'Android',
      windowsPhone: 'WindowsPhone',
      webos: 'webOS',
      blackberry: 'BlackBerry',
      rimTablet: 'RIMTablet',
      mac: 'MacOS',
      win: 'Windows',
      tizen: 'Tizen',
      linux: 'Linux',
      bada: 'Bada',
      chrome: 'ChromeOS',
      other: 'Other'
    },
    prefixes: {
      tizen: '(Tizen )',
      ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
      android: '(Android |HTC_|Silk/)', // Some HTC devices ship with an OSX userAgent by default,
      // so we need to add a direct check for HTC_
      windowsPhone: 'Windows Phone ',
      blackberry: '(?:BlackBerry|BB)(?:.*)Version\/',
      rimTablet: 'RIM Tablet OS ',
      webos: '(?:webOS|hpwOS)\/',
      bada: 'Bada\/',
      chrome: 'CrOS '
    }
  })
  var navigation = window.navigator
  var userAgent = navigation.userAgent
  var osEnv, osName
  Tau.os = osEnv = new OS(userAgent, navigation.platform)
  osName = osEnv.name
  return OS
}))
