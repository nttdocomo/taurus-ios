/*global define*/
/**
 * @author nttdocomo
 */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './dom/element', './abstractComponent', './virtual-dom/h', './virtual-dom/diff', './virtual-dom/patch', './virtual-dom/create-element', 'renderQueue', './dom2hscript/index', 'underscore', 'tau', 'backbone-super', './jquery/replaceClass'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./dom/element'), require('./abstractComponent'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('tau'), require('backbone-super'), require('./jquery/replaceClass'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./dom/element'), require('./abstractComponent'), require('./virtual-dom/h'), require('./virtual-dom/diff'), require('./virtual-dom/patch'), require('./virtual-dom/create-element'), require('renderQueue'), require('./dom2hscript/index'), require('underscore'), require('tau'), require('backbone-super'), require('./jquery/replaceClass'))
  }
}(this, function (define, Element, AbstractComponent, h, diff, patch, createElement, renderQueue, dom2hscript, _, Tau) {
  return define('Tau.Component', AbstractComponent, {
    replaceElement: true,
    cachedConfig: {
      /**
       * @cfg {String} baseCls
       * The base CSS class to apply to this component's element. This will also be prepended to
       * other elements within this component. To add specific styling for sub-classes, use the {@link #cls} config.
       * @accessor
       */
      baseCls: null,

      /**
       * @cfg {String/String[]} cls The CSS class to add to this component's element, in addition to the {@link #baseCls}
       * @accessor
       */
      cls: null,

      /**
       * @cfg {String} [floatingCls="x-floating"] The CSS class to add to this component when it is floatable.
       * @accessor
       */
      floatingCls: 'floating',

      /**
       * @cfg {Boolean} hidden
       * Whether or not this Component is hidden (its CSS `display` property is set to `none`)
       * @accessor
       * @evented
       */
      hidden: null,

      /**
       * @cfg {String} [hiddenCls="x-item-hidden"] The CSS class to add to the component when it is hidden
       * @accessor
       */
      hiddenCls: 'item-hidden',
      /**
       * @cfg {String/Ext.Element/HTMLElement} html Optional HTML content to render inside this Component, or a reference
       * to an existing element on the page.
       * @accessor
       */
      html: null,

      /**
       * @cfg {String} ui The ui to be used on this Component
       */
      ui: null,

      /**
       * @cfg {Number/String} margin The margin to use on this Component. Can be specified as a number (in which case
       * all edges get the same margin) or a CSS string like '5 10 10 10'
       * @accessor
       */
      margin: null,

      /**
       * @cfg {Number/String} padding The padding to use on this Component. Can be specified as a number (in which
       * case all edges get the same padding) or a CSS string like '5 10 10 10'
       * @accessor
       */
      padding: null,

      /**
       * @cfg {Number/String} border The border width to use on this Component. Can be specified as a number (in which
       * case all edges get the same border width) or a CSS string like '5 10 10 10'.
       *
       * Please note that this will not add
       * a `border-color` or `border-style` CSS property to the component; you must do that manually using either CSS or
       * the {@link #style} configuration.
       *
       * ## Using {@link #style}:
       *
       *     Ext.Viewport.add({
       *         centered: true,
       *         width: 100,
       *         height: 100,
       *
       *         border: 3,
       *         style: 'border-color: blue; border-style: solid;'
       *         // ...
       *     })
       *
       * ## Using CSS:
       *
       *     Ext.Viewport.add({
       *         centered: true,
       *         width: 100,
       *         height: 100,
       *
       *         border: 3,
       *         cls: 'my-component'
       *         // ...
       *     })
       *
       * And your CSS file:
       *
       *     .my-component {
       *         border-color: red
       *         border-style: solid
       *     }
       *
       * @accessor
       */
      border: null,

      /**
       * @cfg {String/Mixed} showAnimation
       * Animation effect to apply when the Component is being shown.  Typically you want to use an
       * inbound animation type such as 'fadeIn' or 'slideIn'. For more animations, check the {@link Ext.fx.Animation#type} config.
       * @accessor
       */
      showAnimation: null,

      /**
       * @cfg {String} [styleHtmlCls="x-html"]
       * The class that is added to the content target when you set `styleHtmlContent` to `true`.
       * @accessor
       */
      styleHtmlCls: 'html',

      /**
       * @cfg {Boolean} [styleHtmlContent=false]
       * `true` to automatically style the HTML inside the content target of this component (body for panels).
       * @accessor
       */
      styleHtmlContent: null,

      /**
       * @cfg {Number} zIndex The z-index to give this Component when it is rendered
       * @accessor
       */
      zIndex: null
    },
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

    /**
     * @private
     */
    isInner: true,
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
      me.onInitializedListeners = []
      me.initialConfig = config
      me.initElement()
      me.initConfig(me.initialConfig)
      AbstractComponent.apply(me, arguments)
      me.initialize()
    },

    /**
     * @private
     * Checks if the `cls` is a string. If it is, changed it into an array.
     * @param {String/Array} cls
     * @return {Array/null}
     */
    applyCls: function (cls) {
      if (typeof cls === 'string') {
        cls = [cls]
      }

      // reset it back to null if there is nothing.
      if (!cls || !cls.length) {
        cls = null
      }

      return cls
    },

    /**
     * Adds a CSS class (or classes) to this Component's rendered element.
     * @param {String} cls The CSS class to add.
     * @param {String} [prefix=""] Optional prefix to add to each class.
     * @param {String} [suffix=""] Optional suffix to add to each class.
     */
    addCls: function (cls, prefix, suffix) {
      var oldCls = this.getCls()
      var newCls = (oldCls) ? oldCls.slice() : []
      var ln, i, cachedCls

      prefix = prefix || ''
      suffix = suffix || ''

      if (typeof cls === 'string') {
        cls = [cls]
      }

      ln = cls.length

      // check if there is currently nothing in the array and we don't need to add a prefix or a suffix.
      // if true, we can just set the newCls value to the cls property, because that is what the value will be
      // if false, we need to loop through each and add them to the newCls array
      if (!newCls.length && prefix === '' && suffix === '') {
        newCls = cls
      } else {
        for (i = 0; i < ln; i++) {
          cachedCls = prefix + cls[i] + suffix
          if (newCls.indexOf(cachedCls) === -1) {
            newCls.push(cachedCls)
          }
        }
      }

      this.setCls(newCls)
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

    getInnerHtmlElement: function () {
      var innerHtmlElement = this.innerHtmlElement
      var styleHtmlCls

      if (!innerHtmlElement || !innerHtmlElement.dom || !innerHtmlElement.dom.parentNode) {
        this.innerHtmlElement = innerHtmlElement = Element.create({ cls: Tau.baseCSSPrefix + 'innerhtml' })

        if (this.getStyleHtmlContent()) {
          styleHtmlCls = this.getStyleHtmlCls()
          this.innerHtmlElement.addCls(styleHtmlCls)
          this.innerElement.removeCls(styleHtmlCls)
        }
        this.innerElement.appendChild(innerHtmlElement)
      }

      return innerHtmlElement
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
    isPainted: function () {
      return this.renderElement.isPainted()
    },

    /**
     * @private
     */
    isRendered: function () {
      return this.rendered
    },

    /**
     * @private
     */
    onInitialized: function (fn, scope, args) {
      var listeners = this.onInitializedListeners

      if (!scope) {
        scope = this
      }

      if (this.initialized) {
        if (typeof fn === 'string') {
          scope[fn].apply(scope, args)
        } else {
          fn.apply(scope, args)
        }
      } else {
        listeners.push({
          fn: fn,
          scope: scope,
          args: args
        })
      }
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

    renderTo: function (container, insertBeforeElement) {
      var dom = this.renderElement.$dom
      var containerDom = Tau.getDom(container)
      var insertBeforeChildDom = Tau.getDom(insertBeforeElement)

      if (containerDom) {
        if (insertBeforeChildDom) {
          containerDom.insertBefore(dom, insertBeforeChildDom)
        } else {
          containerDom.append(dom)
        }

        this.setRendered(Boolean(dom.offsetParent))
      }
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

    /**
     * @private
     * @param {Boolean} rendered
     */
    setRendered: function (rendered) {
      var wasRendered = this.rendered

      if (rendered !== wasRendered) {
        this.rendered = rendered

        return true
      }

      return false
    },

    /**
     * Shows this component optionally using an animation.
     * @param {Object/Boolean} [animation] You can specify an animation here or a bool to use the {@link #showAnimation} config.
     * @return {Ext.Component}
     * @chainable
     */
    show: function (animation) {
      if (this.activeAnimation) {
        this.activeAnimation.on({
          animationend: function () {
            this.show(animation)
          },
          scope: this,
          single: true
        })
        return this
      }

      var hidden = this.getHidden()
      if (hidden || hidden === null) {
        if (animation === true) {
          animation = 'fadeIn'
        } else if (animation === undefined || (animation && animation.isComponent)) {
          animation = this.getShowAnimation()
        }

        if (animation) {
          this.beforeShowAnimation()
          this.onBefore({
            hiddenchange: 'animateFn',
            scope: this,
            single: true,
            args: [animation]
          })
        }

        this.setHidden(false)
      }

      return this
    },
    toggleCls: function (className, /* private */ force) {
      this.$el.toggleClass(className)

      return this
    },
    updateBaseCls: function (newBaseCls, oldBaseCls) {
      var me = this
      var ui = me.getUi()

      if (oldBaseCls) {
        me.element.removeClass(oldBaseCls)

        if (ui) {
          me.element.removeClass(me.currentUi)
        }
      }

      if (newBaseCls) {
        me.element.addClass(newBaseCls)

        if (ui) {
          me.element.addClass(function () {
            return [newBaseCls, ui].join('-')
          })
          me.currentUi = newBaseCls + '-' + ui
        }
      }
    },
    /**
     * @private
     * All cls methods directly report to the {@link #cls} configuration, so anytime it changes, {@link #updateCls} will be called
     */
    updateCls: function (newCls, oldCls) {
      if (this.element && ((newCls && !oldCls) || (!newCls && oldCls) || newCls.length !== oldCls.length || _.difference(newCls, oldCls).length > 0)) {
        this.element.replaceCls(oldCls, newCls)
      }
    },

    updateHtml: function (html) {
      if (!this.isDestroyed) {
        var innerHtmlElement = this.getInnerHtmlElement()

        if (Tau.isElement(html)) {
          innerHtmlElement.setHtml('')
          innerHtmlElement.append(html)
        } else {
          innerHtmlElement.setHtml(html)
        }
      }
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
