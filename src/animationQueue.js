/**
 * @author nttdocomo
 */
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './class'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./class'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./class'))
  }
}(this, function (define, Class) {
  return define('Tau.AnimationQueue', Class, {
    /**
     *
     * @param {Function} fn
     * @param {Object} [scope]
     * @param {Object} [args]
     */
    stop: function (fn, scope, args) {
      if (!this.isRunning) {
        return
      }

      var queue = this.queue,
        ln = queue.length,
        i, item

      for (i = 0; i < ln; i++) {
        item = queue[i]
        if (item[0] === fn && item[1] === scope && item[2] === args) {
          queue.splice(i, 1)
          i--
          ln--
        }
      }

      if (ln === 0) {
        this.doStop()
        // <debug>
        this.onStop()
        // </debug>
        this.isRunning = false

        this.idleTimer = setTimeout(this.whenIdle, 100)
      }
    }
  })
}))
