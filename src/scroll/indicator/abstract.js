/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../../core/define', '../../component', 'underscore', 'tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../../core/define'), require('../../component'), require('underscore'), require('tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../../core/define'), require('../../component'), require('underscore'), require('tau'))
  }
}(this, function (define, Component, _, Tau) {
  return define('Tau.scroll.indicator.Abstract', Component, {
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

    updateValue: function (value) {
      var barLength = this.barLength,
        gapLength = this.gapLength,
        length = this.getLength(),
        newLength, offset, extra

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
      Ext.TaskQueue.requestWrite('doUpdateLength', this, [length])
    }
  })
}))
