/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['../component'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('../component'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('../component'));
	}
}(this, function(Component){
	return Component.extend({
        baseCls: 'navigationview',
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
