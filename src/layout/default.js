/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', './abstract', './wrapper/boxDock', './wrapper/inner'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('./abstract'), require('./wrapper/boxDock'), require('./wrapper/inner')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('./abstract'), require('./wrapper/boxDock'), require('./wrapper/inner')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Abstract, BoxDock, Inner) {
  return define(Abstract, {
    config: {
      /**
       * @cfg {Ext.fx.layout.Card} animation Layout animation configuration
       * Controls how layout transitions are animated.  Currently only available for
       * Card Layouts.
       *
       * Possible values are:
       *
       * - cover
       * - cube
       * - fade
       * - flip
       * - pop
       * - reveal
       * - scroll
       * - slide
       * @accessor
       */
      animation: null
    },
    constructor: function (config) {
      this.initialConfig = config
    },

    dockItem: function (item) {
      var DockClass = BoxDock
      var dockedItems = this.dockedItems
      var ln = dockedItems.length
      var container = this.container
      var itemIndex = container.indexOf(item)
      var positionDirectionMap = this.positionDirectionMap
      var direction = positionDirectionMap[item.getDocked()]
      var dockInnerWrapper = this.dockInnerWrapper
      var referenceDirection, i, dockedItem, index, previousItem, slice
      var referenceItem, referenceDocked, referenceWrapper, newWrapper, nestedWrapper, oldInnerWrapper

      this.monitorSizeStateChange()
      this.monitorSizeFlagsChange()

      if (!dockInnerWrapper) {
        dockInnerWrapper = this.link('dockInnerWrapper', new Inner({
          container: this.container
        }))
      }

      if (ln === 0) {
        dockedItems.push(item)

        newWrapper = new DockClass({
          container: this.container,
          direction: direction
        })

        newWrapper.addItem(item)
        newWrapper.getElement().replace(dockInnerWrapper.getElement())
        newWrapper.setInnerWrapper(dockInnerWrapper)
        container.onInitialized('onContainerSizeStateChange', this)
      } else {
        for (i = 0; i < ln; i++) {
          dockedItem = dockedItems[i]
          index = container.indexOf(dockedItem)

          if (index > itemIndex) {
            referenceItem = previousItem || dockedItems[0]
            dockedItems.splice(i, 0, item)
            break
          }

          previousItem = dockedItem
        }

        if (!referenceItem) {
          referenceItem = dockedItems[ln - 1]
          dockedItems.push(item)
        }

        referenceDocked = referenceItem.getDocked()
        referenceWrapper = referenceItem.$dockWrapper
        referenceDirection = positionDirectionMap[referenceDocked]

        if (direction === referenceDirection) {
          referenceWrapper.addItem(item)
        } else {
          slice = referenceWrapper.getItemsSlice(itemIndex)

          newWrapper = new DockClass({
            container: this.container,
            direction: direction
          })

          if (slice.length > 0) {
            if (slice.length === referenceWrapper.itemsCount) {
              nestedWrapper = referenceWrapper
              newWrapper.setSizeState(nestedWrapper.getSizeState())
              newWrapper.getElement().replace(nestedWrapper.getElement())
            } else {
              nestedWrapper = new DockClass({
                container: this.container,
                direction: referenceDirection
              })
              nestedWrapper.setInnerWrapper(referenceWrapper.getInnerWrapper())
              nestedWrapper.addItems(slice)
              referenceWrapper.setInnerWrapper(newWrapper)
            }

            newWrapper.setInnerWrapper(nestedWrapper)
          } else {
            oldInnerWrapper = referenceWrapper.getInnerWrapper()
            referenceWrapper.setInnerWrapper(null)
            newWrapper.setInnerWrapper(oldInnerWrapper)
            referenceWrapper.setInnerWrapper(newWrapper)
          }

          newWrapper.addItem(item)
        }
      }

      container.onInitialized('refreshDockedItemLayoutSizeFlags', this, [item])
    },

    insertInnerItem: function (item, index) {
      var container = this.container
      var containerDom = container.el
      var itemDom = item.el
      var nextSibling = index !== -1 ? container.getInnerAt(index + 1) : null
      var nextSiblingDom = null
      var translatable

      if (nextSibling) {
        translatable = nextSibling.getTranslatable()
        if (translatable && translatable.getUseWrapper()) {
          nextSiblingDom = translatable.getWrapper().dom
        } else {
          nextSiblingDom = nextSibling ? nextSibling.element.dom : null
        }
      }

      containerDom.insertBefore(itemDom, nextSiblingDom)

      return this
    },

    setContainer: function (container) {
      /* var options = {
        delegate: '> component'
      }*/

      this.dockedItems = []

      this._super.apply(this, arguments)

      /* container.on('centeredchange', 'onItemCenteredChange', this, options, 'before')
        .on('floatingchange', 'onItemFloatingChange', this, options, 'before')
        .on('dockedchange', 'onBeforeItemDockedChange', this, options, 'before')
        .on('afterdockedchange', 'onAfterItemDockedChange', this, options)*/
    },

    onItemAdd: function (item) {
      var docked = item.getDocked()

      if (docked !== null) {
        this.dockItem(item)
      } else if (item.isCentered()) {
        this.onItemCenteredChange(item, true)
      } else if (item.isFloating()) {
        this.onItemFloatingChange(item, true)
      } else {
        this.onItemInnerStateChange(item, true)
      }
    },

    onItemRemove: function () {},

    onItemMove: function () {},

    onItemCenteredChange: function () {},

    onItemFloatingChange: function () {},

    onItemDockedChange: function () {},

    /**
     * @param {Ext.Component} item
     * @param {Boolean} isInner
     * @param {Boolean} [destroying]
     */
    onItemInnerStateChange: function (item, isInner, destroying) {
      if (isInner) {
        this.insertInnerItem(item, this.container.innerIndexOf(item))
      } else {
        this.removeInnerItem(item)
      }
    }
  })
}))
