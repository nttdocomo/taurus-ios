/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', 'class', '../../dom/element'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('class'), require('../../dom/element'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('class'), require('../../dom/element'))
  }
}(this, function (define, Class, Element) {
  return define('Tau.layout.wrapper.BoxDock', Class, {
    config: {
      direction: 'horizontal',
      element: {
        className: 'x-dock'
      },
      bodyElement: {
        className: 'x-dock-body'
      },
      innerWrapper: null,
      sizeState: false,
      container: null
    },
    positionMap: {
      top: 'start',
      left: 'start',
      bottom: 'end',
      right: 'end'
    },

    constructor: function (config) {
      this.items = {
        start: [],
        end: []
      }

      this.itemsCount = 0

      this.initConfig(config)
    },
    addItem: function (item) {
      var docked = item.getDocked(),
        position = this.positionMap[docked],
        wrapper = item.$dockWrapper,
        container = this.getContainer(),
        index = container.indexOf(item),
        element = item.element,
        items = this.items,
        sideItems = items[position],
        i, ln, sibling, referenceElement, siblingIndex

      if (wrapper) {
        wrapper.removeItem(item)
      }

      item.$dockWrapper = this
      item.addCls('x-dock-item')
      item.addCls('x-docked-' + docked)

      for (i = 0, ln = sideItems.length; i < ln; i++) {
        sibling = sideItems[i]
        siblingIndex = container.indexOf(sibling)

        if (siblingIndex > index) {
          referenceElement = sibling.element
          sideItems.splice(i, 0, item)
          break
        }
      }

      if (!referenceElement) {
        sideItems.push(item)
        referenceElement = this.getBodyElement()
      }

      this.itemsCount++

      if (position === 'start') {
        element.insertBefore(referenceElement)
      }else {
        element.insertAfter(referenceElement)
      }
    },

    applyBodyElement: function (bodyElement) {
      return Element.create(bodyElement)
    },

    updateBodyElement: function (bodyElement) {
      this.getElement().append(bodyElement)
    },

    applyElement: function (element) {
      return Element.create(element)
    },

    updateElement: function (element) {
      element.addCls('x-dock-' + this.getDirection())
    }
  })
}))
