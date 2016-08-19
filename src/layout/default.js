/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    if (define.amd) {
      define(['../core/define', './abstract', './wrapper/boxDock', './wrapper/inner', '../util/wrapper', 'tau'], function () {
        return (root.Class = factory())
      })
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return (root.Class = factory(require('../core/define'), require('./abstract'), require('./wrapper/boxDock'), require('./wrapper/inner'), require('../util/wrapper'), require('tau')))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = (root.Class = factory(require('../core/define'), require('./abstract'), require('./wrapper/boxDock'), require('./wrapper/inner'), require('../util/wrapper'), require('tau')))
  } else {
    root.Class = factory()
  }
}(this, function (define, Abstract, BoxDock, Inner, Wrapper, Tau) {
  return define(Abstract, {
    isAuto: true,
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

    positionDirectionMap: {
      top: 'vertical',
      bottom: 'vertical',
      left: 'horizontal',
      right: 'horizontal'
    },
    centerWrapperClass: 't-center',
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

    insertBodyItem: function (item) {
      var container = this.container.setUseBodyElement(true)
      var bodyDom = container.bodyElement.dom

      if (item.getZIndex() === null) {
        item.setZIndex((container.indexOf(item) + 1) * 2)
      }

      bodyDom.insertBefore(item.element.dom, bodyDom.firstChild)

      return this
    },

    insertInnerItem: function (item, index) {
      var container = this.container
      var containerDom = container.innerElement.dom
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

    monitorSizeFlagsChange: function () {
      this.monitorSizeFlagsChange = Tau.emptyFn
      this.container.on('sizeflagschange', 'onContainerSizeFlagsChange', this)
    },

    monitorSizeStateChange: function () {
      this.monitorSizeStateChange = Tau.emptyFn
      this.container.on('sizestatechange', 'onContainerSizeStateChange', this)
    },

    onContainerSizeFlagsChange: function () {
      var items = this.dockedItems
      var i, ln, item

      for (i = 0, ln = items.length; i < ln; i++) {
        item = items[i]
        this.refreshDockedItemLayoutSizeFlags(item)
      }
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

    onItemCenteredChange: function (item, centered) {
      var wrapperName = '$centerWrapper'

      if (centered) {
        this.insertBodyItem(item)
        item.link(wrapperName, new Wrapper({
          classList: [this.centerWrapperClass]
        }, item.element))
      } else {
        item.unlink(wrapperName)
        this.removeBodyItem(item)
      }
    },

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
