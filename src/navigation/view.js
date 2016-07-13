/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['../class/create','../component'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('../class/create'),require('../component'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('../class/create'),require('../component'));
	}
}(this, function(create,Component){
	return create(Component,{
        config:{
            baseCls: 'navigationview',
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
             *     });
             *
             * @accessor
             */
            navigationBar: {
                docked: 'top'
            },
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
                type: 'card',
                animation: {
                    duration: 300,
                    easing: 'ease-out',
                    type: 'slide',
                    direction: 'left'
                }
            }
        },
        // @private
        initialize: function() {
            var me = this,
                navBar = me.getNavigationBar();

            //add a listener onto the back button in the navigationbar
            if (navBar) {
                navBar.on({
                    back: me.onBackButtonTap,
                    scope: me
                });

                me.relayEvents(navBar, 'rightbuttontap');

                me.relayEvents(me, {
                    add: 'push',
                    remove: 'pop'
                });
            }

            //<debug>
            var layout = me.getLayout();
            if (layout && !layout.isCard) {
                Ext.Logger.error('The base layout for a NavigationView must always be a Card Layout');
            }
            //</debug>
        }
	});
}));
