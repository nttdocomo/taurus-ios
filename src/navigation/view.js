/**
 * @author nttdocomo
 */
/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', '../container', './bar', '../layout/card', '../core/factory', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('../container'), require('./bar'), require('../layout/card'), require('../core/factory'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('../container'), require('./bar'), require('../layout/card'), require('../core/factory'), require('../tau'))
  }
}(this, function (define, Component, Bar, Card, factory, Tau) {
  return define('Tau.navigation.View', Component, {
    config: {
      baseCls: Tau.baseCSSPrefix + 'navigationview',
      /**
       * @cfg {Boolean/Object} navigationBar
       * The NavigationBar used in this navigation view. It defaults to be docked to the top.
       *
       * You can just pass in a normal object if you want to customize the NavigationBar. For example:
       *
       *     navigationBar: {
       *         ui: 'dark',
       *         docked: 'bottom'
       *     }
       *
       * You **cannot** specify a *title* property in this configuration. The title of the navigationBar is taken
       * from the configuration of this views children:
       *
       *     view.push({
       *         title: 'This views title which will be shown in the navigation bar',
       *         html: 'Some HTML'
       *     })
       *
       * @accessor
       */
      navigationBar: {
        docked: 'top'
      },

      /**
       * @cfg {String} defaultBackButtonText
       * The text to be displayed on the back button if:
       *
       * - The previous view does not have a title.
       * - The {@link #useTitleForBackButtonText} configuration is `true`.
       * @accessor
       */
      defaultBackButtonText: 'Back',
      /**
       * @cfg {Object}
       * Layout used in this navigation view, type must be set to 'card'.
       * **Android NOTE:** Older Android devices have poor animation performance. It is recommended to set the animation to null, for example:
       *
       *      layout: {
       *          type: 'card',
       *          animation: null
       *      }
       *
       * @accessor
       */
      layout: {
        xclass: Card,
        animation: {
          duration: 300,
          easing: 'ease-out',
          type: 'slide',
          direction: 'left'
        }
      },

      /**
       * @cfg {Boolean} useTitleForBackButtonText
       * Set to `false` if you always want to display the {@link #defaultBackButtonText} as the text
       * on the back button. `true` if you want to use the previous views title.
       * @accessor
       */
      useTitleForBackButtonText: false
    },
    // @private
    initialize: function () {
      var me = this
      var navBar = me.getNavigationBar()

      // add a listener onto the back button in the navigationbar
      if (navBar) {
        navBar.on({
          back: me.onBackButtonTap,
          scope: me
        })

        me.relayEvents(navBar, 'rightbuttontap')

        me.relayEvents(me, {
          add: 'push',
          remove: 'pop'
        })
      }

      // <debug>
      var layout = me.getLayout()
      if (layout && !layout.isCard) {
        // Ext.Logger.error('The base layout for a NavigationView must always be a Card Layout')
      }
    // </debug>
    },

    /**
     * @private
     */
    applyActiveItem: function (activeItem, currentActiveItem) {
      var me = this
      var innerItems = me.getInnerItems()

      // Make sure the items are already initialized
      me.getItems()

      // If we are not initialzed yet, we should set the active item to the last item in the stack
      if (!me.initialized) {
        activeItem = innerItems.length - 1
      }

      return this._super(activeItem, currentActiveItem)
    },
    // @private
    applyNavigationBar: function (config) {
      var me = this
      if (!config) {
        config = {
          hidden: true,
          docked: 'top'
        }
      }

      if (config.title) {
        delete config.title
      // <debug>
      // Ext.Logger.warn("Ext.navigation.View: The 'navigationBar' configuration does not accept a 'title' property. You " +
      // "set the title of the navigationBar by giving this navigation view's children a 'title' property.")
      // </debug>
      }

      config.view = this
      config.useTitleForBackButtonText = this.getUseTitleForBackButtonText()

      // Blackberry specific nav setup where title is on the top title bar and the bottom toolbar is used for buttons and BACK
      if (config.splitNavigation) {
        this.$titleContainer = this.add({
          docked: 'top',
          xtype: 'titlebar',
          ui: 'light',
          title: this.$currentTitle || ''
        })

        var containerConfig = (config.splitNavigation === true) ? {} : config.splitNavigation

        this.$backButtonContainer = this.add({
          xtype: 'toolbar',
          docked: 'bottom',
          hidden: true
        })

        // Any item that is added to the BackButtonContainer should be monitored for visibility
        // this will allow the toolbar to be hidden when no items exist in it.
        this.$backButtonContainer.on({
          scope: me,
          add: me.onBackButtonContainerAdd,
          remove: me.onBackButtonContainerRemove
        })

        this.$backButton = this.$backButtonContainer.add({
          xtype: 'button',
          text: 'Back',
          hidden: true,
          ui: 'back'
        })

        // Default config items go into the bottom bar
        if (config.items) {
          this.$backButtonContainer.add(config.items)
        }

        // If the user provided items and splitNav items, default items go into the bottom bar, split nav items go into the top
        if (containerConfig.items) {
          this.$titleContainer.add(containerConfig.items)
        }

        this.$backButton.on({
          scope: this,
          tap: this.onBackButtonTap
        })

        config = {
          hidden: true,
          docked: 'top'
        }
      }

      // return Ext.factory(config, Ext.navigation.Bar, this.getNavigationBar())
      return factory(config, Bar) // new Bar(config)
    },

    // @private
    updateNavigationBar: function (newNavigationBar, oldNavigationBar) {
      if (oldNavigationBar) {
        this.remove(oldNavigationBar, true)
      }

      if (newNavigationBar) {
        this.add(newNavigationBar)
      }
    },

    /**
     * @private
     */
    onItemAdd: function (item, index) {
      // Check for title configuration
      if (item && item.getDocked() && item.config.title === true) {
        this.$titleContainer = item
      }

      this.doItemLayoutAdd(item, index)

      var navigaitonBar = this.getInitialConfig().navigationBar

      if (!this.isItemsInitializing && item.isInnerItem()) {
        this.setActiveItem(item)

        // Update the navigationBar
        if (navigaitonBar) {
          this.getNavigationBar().onViewAdd(this, item, index)
        }

        // Update the custom backButton
        if (this.$backButtonContainer) {
          this.$backButton.show()
        }
      }

      if (item && item.isInnerItem()) {
        // Update the title container title
        this.updateTitleContainerTitle((item.getTitle) ? item.getTitle() : item.config.title)
      }

      if (this.initialized) {
        this.fireEvent('add', this, item, index)
      }
    },

    /**
     * Pushes a new view into this navigation view using the default animation that this view has.
     * @param {Object} view The view to push.
     * @return {Ext.Component} The new item you just pushed.
     */
    push: function (view) {
        return this.add(view)
    },

    /**
     * @private
     * Updates the title of the titleContainer, if it exists
     */
    updateTitleContainerTitle: function (title) {
      if (this.$titleContainer) {
        // <debug>
        if (!this.$titleContainer.setTitle) {
          /* Ext.Logger.error('You have selected to display a title in a component that does not \
                    support titles in NavigationView. Please remove the `title` configuration from your \
                    NavigationView item, or change it to a component that has a `setTitle` method.')*/
        }
        // </debug>

        this.$titleContainer.setTitle(title)
      } else {
        this.$currentTitle = title
      }
    }
  })
}))
