/*global define*/
/**
 * @author nttdocomo
 */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './dom/element', './abstractComponent', './virtual-dom/h', './virtual-dom/diff', './virtual-dom/patch', './virtual-dom/create-element', 'renderQueue', './dom2hscript/index', 'underscore', 'backbone-super'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./dom/element'), require('./abstractComponent'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('backbone-super'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./dom/element'), require('./abstractComponent'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('backbone-super'))
  }
}(this, function (define, Element, AbstractComponent, h, diff, patch, createElement, renderQueue, dom2hscript, _) {
  return define('Tau.Component', AbstractComponent, {
    replaceElement: true,
    eventedConfig: {
      /**
       * @cfg {String} docked
       * The dock position of this component in its container. Can be `left`, `top`, `right` or `bottom`.
       *
       * __Notes__
       *
       * You must use a HTML5 doctype for {@link #docked} `bottom` to work. To do this, simply add the following code to the HTML file:
       *
       *     <!doctype html>
       *
       * So your index.html file should look a little like this:
       *
       *     <!doctype html>
       *     <html>
       *         <head>
       *             <title>MY application title</title>
       *             ...
       *
       * @accessor
       * @evented
       */
      docked: null,
      /**
       * @cfg {Boolean} centered
       * Whether or not this Component is absolutely centered inside its Container
       * @accessor
       * @evented
       */
      centered: null
    },
    config: {
      /**
       * @cfg {String} itemId
       * An itemId can be used as an alternative way to get a reference to a component when no object reference is
       * available. Instead of using an `{@link #id}` with {@link Ext#getCmp}, use `itemId` with
       * {@link Ext.Container#getComponent} which will retrieve `itemId`'s or {@link #id}'s. Since `itemId`'s are an
       * index to the container's internal MixedCollection, the `itemId` is scoped locally to the container - avoiding
       * potential conflicts with {@link Ext.ComponentManager} which requires a **unique** `{@link #id}`.
       *
       * Also see {@link #id}, {@link Ext.Container#query}, {@link Ext.Container#down} and {@link Ext.Container#child}.
       *
       * @accessor
       */
      itemId: undefined
    },
    template: [],
    floating: false,
    LAYOUT_BOTH: 0x3,
    events: {
      'click': function () {
        console.log('click')
      }
    },
    constructor: function (config) {
      var me = this
      me.initialConfig = config
      me.initElement()
      me.initConfig(me.initialConfig)
      AbstractComponent.apply(me, arguments)
      me.initialize()
    },
    beforeInitConfig: function (config) {
      this.beforeInitialize.apply(this, arguments)
    },

    /**
     * @private
     */
    beforeInitialize: function () {},

    /**
     * @private
     * @return {Object}
     * @return {String} return.reference
     * @return {Array} return.classList
     * @return {Object} return.children
     */
    getElementConfig: function () {
      return {
        reference: 'element',
        classList: ['x-unsized'],
        children: this.getTemplate()
      }
    },
    getTemplate: function () {
      return this.template
    },
    getTplData: function (model) {
      return {
        title: model.get('title')
      }
    },
    hide: function () {
      this.$el.hide()
    },

    /**
     * @private
     * @return {Boolean}
     */
    isCentered: function () {
      return Boolean(this.getCentered())
    },

    isFloating: function () {
      return this.floating
    },

    isInnerItem: function () {
      return this.isInner
    },

    /**
     * @private
     */
    isRendered: function () {
      return this.rendered
    },
    refreshSizeState: function () {
      this.refreshSizeStateOnInitialized = true
    },
    render: function (immediately) {
      var me = this
      // initial render
      if (!me._vDomElement || immediately === true) {
        me._vDomRender()

      /* if (!me._vDomElement) {
        me._vDomElement = createElement(me._vDomTree)

        if (me.replaceElement) {
          me.el = me._vDomElement
        } else {
          me.el.appendChild(me._vDomElement)
        }
      }*/
      } else { // queue the render to the next animation frame
        renderQueue(me)
      }

      return me
    },
    setLayoutSizeFlags: function (flags) {
      this.layoutStretched = !!(flags & this.LAYOUT_STRETCHED)
      this.widthLayoutSized = !!(flags & this.LAYOUT_WIDTH)
      this.heightLayoutSized = !!(flags & this.LAYOUT_HEIGHT)

      this.refreshSizeState()
    },

    /**
     * @private
     * @chainable
     */
    setParent: function (parent) {
      var currentParent = this.parent

      if (parent && currentParent && currentParent !== parent) {
        currentParent.remove(this, false)
      }

      this.parent = parent

      return this
    },
    toggleCls: function (className, /* private */ force) {
      this.$el.toggleClass(className)

      return this
    },
    /**
     * do a virtual dom diff and update the real DOM
     */
    _vDomRender: function () {
      var me = this
      var newTree = me.template(me.model)

      if (me._vDomElement) {
        var patches = diff(me._vDomElement, newTree)
        patch(me.el, patches)
      }

      me._vDomTree = newTree
    },
    _ensureElement: function () {
      var me = this
      if (!me.el) {
        var attrs = _.extend({}, _.result(me, 'attributes'))
        if (me.id) attrs.id = _.result(me, 'id')
        if (me.className) attrs['class'] = _.result(me, 'className')
        me.setElement(me._createElement(_.result(me, 'tagName'), attrs))
        me._setAttributes(attrs)
      } else {
        me.setElement(_.result(me, 'el'))
      }
    },
    _createElement: function (tag, attrs) {
      var me = this
      me._vDomElement = h(tag, attrs)
      return createElement(me._vDomElement)
    }
  })
}))
