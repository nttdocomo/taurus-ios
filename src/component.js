/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['backbone','./virtual-dom/h',"./virtual-dom/diff","./virtual-dom/patch",'./virtual-dom/create-element','renderQueue','./dom2hscript/index','underscore','backbone-super'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('backbone'),require('./virtual-dom/h'),require("./virtual-dom/diff"),require("./virtual-dom/patch"),require('./virtual-dom/create-element'),require('renderQueue'),require('./dom2hscript/index'),require('underscore'),require('backbone-super'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('backbone'),require('./virtual-dom/h'),require("./virtual-dom/diff"),require("./virtual-dom/patch"),require('./virtual-dom/create-element'),require('renderQueue'),require('./dom2hscript/index'),require('underscore'),require('backbone-super'));
	}
}(this, function(Backbone,h,diff,patch,createElement,renderQueue,dom2hscript,_){
	return Backbone.View.extend({
        replaceElement:true,
        config:{
            tpl:'<div><%=title%></div>'
        },
        events:{
            'click':function(){
                console.log('click')
            }
        },
        constructor:function(options) {
            var me = this;
            me.initConfig(options)
            me._super(options)
        },
        getTplData:function(model){
            return {
                title:model.get('title')
            }
        },
        initConfig:function(options){
            var me = this,config = me.config;
        },
        render:function(immediately){
            var me = this;
            // initial render
    		if (!me._vDomElement || immediately === true) {
    			me._vDomRender();

    			/*if (!me._vDomElement) {
    				me._vDomElement = createElement(me._vDomTree);

    				if (me.replaceElement) {
    					me.el = me._vDomElement;
    				} else {
    					me.el.appendChild(me._vDomElement);
    				}
    			}*/
    		}
    		// queue the render to the next animation frame
    		else {
    			renderQueue(me);
    		}

    		return me;
        },
        template:function(model){
            var me = this;
            return new Function('h','return ' + dom2hscript.parseHTML(_.template(me.tpl)(me.getTplData(model))))(h);
        },
    	/**
    	 * do a virtual dom diff and update the real DOM
    	 */
    	_vDomRender: function() {
    		var me = this,newTree = me.template(me.model);

    		if (me._vDomElement) {
    			var patches = diff(me._vDomElement, newTree);
    			patch(me.el, patches);
    		}

    		me._vDomTree = newTree;
    	},
        _ensureElement: function() {
            var me = this;
            if (!me.el) {
                var attrs = _.extend({}, _.result(me, 'attributes'));
                if (me.id) attrs.id = _.result(me, 'id');
                if (me.className) attrs['class'] = _.result(me, 'className');
                me.setElement(me._createElement(_.result(me, 'tagName'),attrs));
                me._setAttributes(attrs);
            } else {
                me.setElement(_.result(me, 'el'));
            }
        },
        _createElement:function(tag, attrs){
            var me = this;
            me._vDomElement = h(tag, attrs)
            return createElement(me._vDomElement)
        }
	});
}));
