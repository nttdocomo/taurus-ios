/**
 * @author nttdocomo
 */
/*global define, requestAnimationFrame, cancelAnimationFrame*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './class', 'underscore', 'tau', './polyfill/requestAnimationFrame'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./class'), require('underscore'), require('tau'), require('./polyfill/requestAnimationFrame'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./class'), require('underscore'), require('tau'), require('./polyfill/requestAnimationFrame'))
  }
}(this, function (define, Class, _, Tau) {
  var AnimationQueue = define('Tau.AnimationQueue', Class, {
    constructor: function () {
      this.queue = []
      this.runningQueue = []
      this.isRunning = false
    },

    doIterate: function () {
      this.animationFrameId = requestAnimationFrame(_.bind(this.run, this))
    },
    // </debug>

    doStart: function () {
      this.animationFrameId = requestAnimationFrame(_.bind(this.run, this))
      this.lastRunTime = Date.now()
    },

    doStop: function () {
      cancelAnimationFrame(this.animationFrameId)
    },

    invoke: function (listener) {
      var fn = listener[0]
      var scope = listener[1]
      var args = listener[2]

      fn = (typeof fn === 'string' ? scope[fn] : fn)

      if (_.isArray(args)) {
        fn.apply(scope, args)
      }else {
        fn.call(scope, args)
      }
    },
    onStop: Tau.emptyFn,

    run: function () {
      if (!this.isRunning) {
        return
      }

      var queue = this.runningQueue
      var i, ln

      this.lastRunTime = Date.now()
      this.frameStartTime = window.performance.now()

      queue.push.apply(queue, this.queue)

      for (i = 0, ln = queue.length; i < ln; i++) {
        this.invoke(queue[i])
      }

      queue.length = 0

      // <debug>
      var now = this.frameStartTime,
        startCountTime = this.startCountTime,
        elapse = now - startCountTime,
        count = ++this.count

      if (elapse >= 200) {
        // this.onFpsChanged(count * 1000 / elapse, count, elapse)
        this.startCountTime = now
        this.count = 0
      }
      // </debug>

      this.doIterate()
    },
    /**
     *
     * @param {Function} fn
     * @param {Object} [scope]
     * @param {Object} [args]
     */
    start: function (fn, scope, args) {
      this.queue.push(arguments)

      if (!this.isRunning) {
        if (this.hasOwnProperty('idleTimer')) {
          clearTimeout(this.idleTimer)
          delete this.idleTimer
        }

        if (this.hasOwnProperty('idleQueueTimer')) {
          clearTimeout(this.idleQueueTimer)
          delete this.idleQueueTimer
        }

        this.isIdle = false
        this.isRunning = true
        // <debug>
        this.startCountTime = window.performance.now()
        this.count = 0
        // </debug>
        this.doStart()
      }
    },
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
  return new AnimationQueue
}))
