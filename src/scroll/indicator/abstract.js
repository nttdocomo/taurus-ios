/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../component', '../../taskQueue', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../component'), require('../../taskQueue'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../component'), require('../../taskQueue'), require('underscore'), require('tau'))
  }
}(this, function (define, Component, TaskQueue, _, Tau) {
  return define('Tau.scroll.indicator.Abstract', Component, {
    config: {
      baseCls: Tau.baseCSSPrefix + 'scroll-indicator',

      axis: 'x',

      value: null,

      length: null,

      minLength: 6,

      hidden: true,

      ui: 'dark',

      /**
       * @cfg {Boolean} [autoHide=true] Set to `false` to always show the indicator for this axis.
       */
      autoHide: true
    },
    cachedConfig: {
      active: true,
      axis: 'x',
      barCls: Tau.baseCSSPrefix + 'scroll-bar',
      length: null,
      minLength: 6,
      ratio: 1,
      value: null
    },

    barElement: null,

    doUpdateLength: function (length) {
      if (!this.isDestroyed) {
        var axis = this.getAxis(),
          element = this.element

        if (axis === 'x') {
          element.setWidth(length)
        }else {
          element.setHeight(length)
        }
      }
    },

    getElementConfig: function () {
      return {
        reference: 'barElement',
        children: [this._super()]
      }
    },

    refresh: function () {
      var bar = this.barElement,
        barDom = bar.dom,
        ratio = this.getRatio(),
        axis = this.getAxis(),
        barLength = (axis === 'x') ? barDom.offsetWidth : barDom.offsetHeight,
        length = barLength * ratio

      this.barLength = barLength

      this.gapLength = barLength - length

      this.setLength(length)

      this.updateValue(this.getValue())
    },

    setOffset: function (offset) {
      offset = Math.round(offset)
      if (this.lastOffset === offset || this.lastOffset === -10000) {
        return
      }
      this.lastOffset = offset
      TaskQueue.requestWrite('doSetOffset', this, [offset])
    },

    doSetOffset: function (offset) {
      if (!this.isDestroyed) {
        var axis = this.getAxis()
        var element = this.element

        if (axis === 'x') {
          element.translate(offset, 0)
        }else {
          element.translate(0, offset)
        }
      }
    },

    updateActive: function (active) {
      this.barElement[active ? 'addCls' : 'removeCls']('active')
    },

    updateAxis: function (axis) {
      this.element.addCls(this.getBaseCls(), null, axis)
      this.barElement.addCls(this.getBarCls(), null, axis)
    },

    updateBarCls: function (barCls) {
      this.barElement.addCls(barCls)
    },

    updateValue: function (value) {
      var barLength = this.barLength
      var gapLength = this.gapLength
      var length = this.getLength()
      var newLength, offset, extra

      if (value <= 0) {
        offset = 0
        this.updateLength(this.applyLength(length + value * barLength))
      }
      else if (value >= 1) {
        extra = Math.round((value - 1) * barLength)
        newLength = this.applyLength(length - extra)
        extra = length - newLength
        this.updateLength(newLength)
        offset = gapLength + extra
      }else {
        offset = gapLength * value
      }

      this.setOffset(offset)
    },

    applyLength: function (length) {
      return Math.max(this.getMinLength(), length)
    },

    updateLength: function (length) {
      length = Math.round(length)
      if (this.lastLength === length) {
        return
      }
      this.lastLength = length
      TaskQueue.requestWrite('doUpdateLength', this, [length])
    }
  })
}))
