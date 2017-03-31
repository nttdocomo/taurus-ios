'use strict';
/**
 * @author nttdocomo
 */
/* global define*/
(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./vdom/patch'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../browser-split'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./vdom/patch'))
  }
}(this, function (split) {
  var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/
  var notClassId = /^\.|#/
  function parseTag (tag, props) {
    if (!tag) {
      return 'DIV'
    }

    var noId = !(props.hasOwnProperty('id'))

    var tagParts = split(tag, classIdSplit)
    var tagName = null

    if (notClassId.test(tagParts[1])) {
      tagName = 'DIV'
    }

    var classes, part, type, i

    for (i = 0; i < tagParts.length; i++) {
      part = tagParts[i]
      if (!part) {
        continue
      }

      type = part.charAt(0)

      if (!tagName) {
        tagName = part
      } else if (type === '.') {
        classes = classes || []
        classes.push(part.substring(1, part.length))
      } else if (type === '#' && noId) {
        props.id = part.substring(1, part.length)
      }
    }

    if (classes) {
      if (props.className) {
        classes.push(props.className)
      }

      props.className = classes.join(' ')
    }

    return props.namespace ? tagName : tagName.toUpperCase()
  }
  return parseTag
}))
