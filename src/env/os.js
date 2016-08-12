/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../class', 'tau', './browser'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../class'), require('tau'), require('./browser'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../class'), require('tau'), require('./browser'))
  }
}(this, function (define, Class, Tau, browser) {
  var OS = define('Tau.env.OS', Class, {
    constructor: function (userAgent, platform, browserScope) {
      var constructor = this.constructor
      var prefixes = constructor.prefixes
      var names = constructor.names
      var is, i, prefix, match, name, match1
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

      if (platform) {
        this.setFlag(platform.replace(/ simulator$/i, ''))
      }
    },

    setFlag: function (name, value) {
      if (typeof value === 'undefined') {
        value = true
      }

      this.is[name] = value
      this.is[name.toLowerCase()] = value

      return this
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
  var osEnv, osName, deviceType
  Tau.os = osEnv = new OS(userAgent, navigation.platform)
  osName = osEnv.name
  var search = window.location.search.match(/deviceType=(Tablet|Phone)/)
  var nativeDeviceType = window.deviceType

  // Override deviceType by adding a get variable of deviceType. NEEDED FOR DOCS APP.
  // E.g: example/kitchen-sink.html?deviceType=Phone
  if (search && search[1]) {
    deviceType = search[1]
  } else if (nativeDeviceType === 'iPhone') {
    deviceType = 'Phone'
  } else if (nativeDeviceType === 'iPad') {
    deviceType = 'Tablet'
  } else {
    if (!osEnv.is.Android && !osEnv.is.iOS && !osEnv.is.WindowsPhone && /Windows|Linux|MacOS/.test(osName)) {
      deviceType = 'Desktop'

        // always set it to false when you are on a desktop not using Ripple Emulation
      Tau.browser.is.WebView = Tau.browser.is.Ripple
    } else if (osEnv.is.iPad || osEnv.is.RIMTablet || osEnv.is.Android3 || browser.is.Silk || (osEnv.is.Android && userAgent.search(/mobile/i) === -1)) {
      deviceType = 'Tablet'
    } else {
      deviceType = 'Phone'
    }
  }
  osEnv.setFlag(deviceType, true)
  osEnv.deviceType = deviceType
  return OS
}))
