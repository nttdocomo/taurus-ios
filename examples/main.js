(function (root, factory) {
	if(typeof define === "function") {
	  	if(define.amd){
		    // Now we're wrapping the factory and assigning the return
		    // value to the root (window) and returning it as well to
		    // the AMD loader.
		    define(["../src/bar/navBar","../src/page/pages",'../src/view/table','../src/form/form','../src/form/field/text',"backbone","underscore",'chance'], function(NavBar,Pages,Table,Form,Switch,Backbone,_,chance){
		    	return (root.myModule = factory(NavBar,Pages,Table,Backbone,_,chance));
		    });
		}
	  	if(define.cmd){
	  		define(function(require, exports, module){
				return factory(require,require('../src/bar/navBar'),require('../src/page/pages'),require('../src/view/table'),require('../src/form/form'),require('../src/form/field/text'),require('backbone'),require('underscore'),require('chance'));
			})
	  	}
	} else if(typeof module === "object" && module.exports) {
	    // I've not encountered a need for this yet, since I haven't
	    // run into a scenario where plain modules depend on CommonJS
	    // *and* I happen to be loading in a CJS browser environment
	    // but I'm including it for the sake of being thorough
	    module.exports = (root.myModule = factory(require('../src/bar/navBar'),require('../src/page/pages'),require('../src/view/table'),require('../src/form/form'),require('../src/form/field/text'),require("backbone"),require('underscore'),require('chance')));
	} else {
	    root.myModule = factory(root.postal);
	}
}(this, function(require,NavBar,Pages,Table,Form,Text,Backbone,_,chance) {
	var Router = Backbone.Router.extend({
		routes: {
			"*action":"index"
		},
		constructor:function(options){
			var me = this;
			me.on('route',me.storeRoute);
			me.history = [];
			Backbone.Router.prototype.constructor.call(me,options)
		},
		initialize : function() {
			var me = this;
			$(document).on('click', 'a',function(e){
				var me = this,referer_url = location.pathname,
				href = $(this).attr('href'),
				parentPage = $(this).parents('.page'),
				protocol = this.protocol + '//';
				if (href.slice(protocol.length) !== protocol) {
					e.preventDefault();
					if(parentPage.hasClass('page-from-right-to-center') || parentPage.hasClass('page-from-left-to-center') || parentPage.hasClass('page-from-center-to-right') || parentPage.hasClass('page-from-center-to-left')){
						return false;
					}
					Backbone.history.navigate(href, true);
			    }
				return false;
			})
			me.navBar = new NavBar({
				renderTo:$('.view')
			})
			me.pages = new Pages({
				renderTo:$('.view')
			})
			me.navBar.on('back',function(){
				me.previous()
				me.pages.back();
			})
		},
		storeRoute:function(){
			this.history.push(Backbone.history.fragment)
		},
		previous:function(){
			var me = this;
			if(this.history.length > 1){
				me.navigate(me.history[me.history.length-2], false)
				me.history.pop();
			}
		},
	    index:function(fragment){
	    	var me = this;
	    	console.log(fragment)
	    	require.async(['../../src/ios/page/page'],function(Page){
	    		var match,item,deps = [];
	    		switch(fragment){
	    			case 'forms/':
	    				require.async(['../../src/ios/form/field/switch'],function(Switch){
				    		var page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Table,
									collection:new Backbone.Collection([{
										text:'Checkboxes and Radios',
										href:'forms/checkboxes-and-radios/'
									},{
										text:'Smart Selects',
										href:'forms/smart-select/'
									}]),
									columns:[{
										dataIndex:'text'
									}]
								}]
				    		})
			    			me.setActivePage(page)
			    		})
			    		break;
			    	case 'forms/checkboxes-and-radios/':
	    				require.async(['../../src/ios/form/field/switch','../../src/ios/form/field/checkbox','../../src/ios/form/field/radio'],function(Switch,CheckBox,Radio){
	    					var name = chance.word(),
				    		page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Form,
									title:'Checkbox group',
									items:_.map(_.range(chance.natural({min: 2, max: 4})),function(){
										return {
											'class':CheckBox,
											name:chance.word(),
											fieldLabel:chance.word()
										}
									})/*[{
										'class':Text,
										name:chance.word(),
										fieldLabel:chance.word()
									},{
										'class':CheckBox,
										name:chance.word(),
										fieldLabel:chance.word()
									},{
										'class':Switch,
										name:chance.word(),
										fieldLabel:chance.word()
									}]*/
								},{
									'class':Form,
									title:'Radio group',
									items:_.map(_.range(chance.natural({min: 2, max: 4})),function(){
										return {
											'class':Radio,
											name:name,
											value:chance.word(),
											fieldLabel:chance.word()
										}
									})
								}]
				    		})
			    			me.setActivePage(page)
			    		})
			    		break;
			    	case 'forms/smart-select/':
	    				require.async(['../../src/ios/form/field/smartSelect','../../src/ios/form/field/radio'],function(SmartSelect,Radio){
	    					var name = chance.word(),
				    		page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Form,
									title:'Smart select',
									items:_.map(_.range(chance.natural({min: 2, max: 4})),function(){
										return {
											'class':SmartSelect,
											navBar:me.navBar,
											pages:me.pages,
											multiSelect:chance.bool(),
											name:chance.word(),
											valueField:'value',
											displayField:'fieldLabel',
											fieldLabel:chance.word(),
											collection:new Backbone.Collection(_.map(_.range(chance.natural({min: 2, max: 4})),function(){
												return {
													value:chance.word(),
													fieldLabel:chance.word()
												}
											})),
											listeners:{
												'click':function(){
													me.history.push("")
												}
											}
										}
									})
								}]
				    		})
			    			me.setActivePage(page)
			    		})
			    		break;
			    	default:
			    		require.async(['../../src/ios/form/field/switch'],function(Switch){
				    		var cells = [];
				    		for (var i = chance.natural({min: 2, max: 20}) - 1; i >= 0; i--) {
				    			cells[i] = {
									text:chance.word()
								}
								if(chance.bool()){
									match = chance.url().match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/)
									cells[i].href = [match[4],match[6]].join('')
								}
								if(chance.bool()){
									cells[i].image = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PCEtLQpTb3VyY2UgVVJMOiBob2xkZXIuanMvNjR4NjQKQ3JlYXRlZCB3aXRoIEhvbGRlci5qcyAyLjYuMC4KTGVhcm4gbW9yZSBhdCBodHRwOi8vaG9sZGVyanMuY29tCihjKSAyMDEyLTIwMTUgSXZhbiBNYWxvcGluc2t5IC0gaHR0cDovL2ltc2t5LmNvCi0tPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PCFbQ0RBVEFbI2hvbGRlcl8xNTQ1MTEwYWEzMiB0ZXh0IHsgZmlsbDojQUFBQUFBO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1mYW1pbHk6QXJpYWwsIEhlbHZldGljYSwgT3BlbiBTYW5zLCBzYW5zLXNlcmlmLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHQgfSBdXT48L3N0eWxlPjwvZGVmcz48ZyBpZD0iaG9sZGVyXzE1NDUxMTBhYTMyIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSIxNC41IiB5PSIzNi41Ij42NHg2NDwvdGV4dD48L2c+PC9nPjwvc3ZnPg=='
								}
				    		}
				    		var page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Table,
									collection:new Backbone.Collection([{
										text:'Forms',
										href:'forms/'
									}]),
									columns:[{
										dataIndex:'text'
									}]
								}]
				    		})
			    			me.setActivePage(page)
			    		})
			    		break;
	    		}
	    		/*if(1){
	    			item = (function(){
						require.async(['../../src/ios/form/field/switch'],function(Switch){
				    		var page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Table,
									collection:new Backbone.Collection([{
										text:'Form',
										href:'/form'
									}]),
									columns:[{
										dataIndex:'text'
									}]
								}]
				    		})
			    			me.setActivePage(page)
			    		})
					})();
	    		} else {
	    			item = (function(){
						require.async(['../../src/ios/form/field/switch','../../src/ios/form/field/checkbox'],function(Switch,CheckBox){
				    		var page = new Page({
				    			title:chance.word(),
				    			items:[{
									'class':Form,
									items:[{
										'class':Text,
										name:chance.word(),
										fieldLabel:chance.word()
									},{
										'class':CheckBox,
										name:chance.word(),
										fieldLabel:chance.word()
									},{
										'class':Switch,
										name:chance.word(),
										fieldLabel:chance.word()
									}]
								}]
				    		})
			    			me.setActivePage(page)
			    		})
					})();
	    		}*/
	    	})
	    },
		setActivePage:function(page){
			var me = this;
			me.activePage = page;
			me.navBar.pushItem({
				title:page.title/*,
				backBarButtonItem:{
					title:'取消'
				}*/
			})
			me.pages.pushItem(page)
		}
	})
	new Router();
	Backbone.history.start({pushState: true, root: '/examples/ios'});
}));
