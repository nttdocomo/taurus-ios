/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './component', 'underscore'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./component'), require('underscore'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./component'), require('underscore'))
  }
}(this, function (define, Compnent, _) {
  return define(Compnent, {
    initialize: function () {
      this._super.apply(this, arguments)

      this.$el.on({
        'tap': this.onTap
        /* scope: this,
        tap: 'onTap',
        touchstart: 'onPress',
        touchend: 'onRelease'*/
      })
    }
  })
}))
