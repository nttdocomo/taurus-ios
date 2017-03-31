/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../class', '../../dom/element', '../../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../class'), require('../../dom/element'), require('../../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../class'), require('../../dom/element'), require('../../tau'))
  }
}(this, function (define, Class, Element, Tau) {
  return define('Tau.layout.wrapper.BoxDock', Class, {
    config: {
      direction: 'horizontal',
      element: {
        className: Tau.baseCSSPrefix + 'dock'
      },
      bodyElement: {
        className: Tau.baseCSSPrefix + 'dock-body'
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
      var docked = item.getDocked()
      var position = this.positionMap[docked]
      var wrapper = item.$dockWrapper
      var container = this.getContainer()
      var index = container.indexOf(item)
      var element = item.element
      var items = this.items
      var sideItems = items[position]
      var i, ln, sibling, referenceElement, siblingIndex

      if (wrapper) {
        wrapper.removeItem(item)
      }

      item.$dockWrapper = this
      item.addCls(Tau.baseCSSPrefix + 'dock-item')
      item.addCls(Tau.baseCSSPrefix + 'docked-' + docked)

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
      } else {
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
      element.addCls(Tau.baseCSSPrefix + 'dock-' + this.getDirection())
    },

    updateInnerWrapper: function (innerWrapper, oldInnerWrapper) {
      var bodyElement = this.getBodyElement()

      if (oldInnerWrapper && oldInnerWrapper.$outerWrapper === this) {
        oldInnerWrapper.getElement().detach()
        delete oldInnerWrapper.$outerWrapper
      }

      if (innerWrapper) {
        innerWrapper.setSizeState(this.getSizeState())
        innerWrapper.$outerWrapper = this
        bodyElement.append(innerWrapper.getElement())
      }
    },

    updateSizeState: function (state) {
      var innerWrapper = this.getInnerWrapper()

      this.getElement().setSizeState(state)

      if (innerWrapper) {
        innerWrapper.setSizeState(state)
      }
    }
  })
}))
