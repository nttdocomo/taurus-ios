/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['./core/define', './class', './polyfill/requestAnimationFrame', './env/os', './underscore', './tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('./core/define'), require('./class'), require('./polyfill/requestAnimationFrame'), require('./env/os'), require('./underscore'), require('./tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./core/define'), require('./class'), require('./polyfill/requestAnimationFrame'), require('./env/os'), require('./underscore'), require('./tau'))
  }
}(this, function (define, Class, requestAnimationFrame, os, _, Tau) {
  define('Tau.TaskQueue', Class, {
    constructor: function () {
      this.readQueue = []
      this.writeQueue = []

      this.run = _.bind(this.run, this)
      this.watch = _.bind(this.watch, this)

      // iOS has a nasty bug which causes pending requestAnimationFrame to not release
      // the callback when the WebView is switched back and forth from / to being background process
      // We use a watchdog timer to workaround this, and restore the pending state correctly if this happens
      // This timer has to be set as an interval from the very beginning and we have to keep it running for
      // as long as the app lives, setting it later doesn't seem to work
      if (os.is.iOS) {
        setInterval(this.watch, 500)
      }
    },
    requestWrite: function (fn, scope, args) {
      this.request(false)
      this.writeQueue.push(arguments)
    },
    request: function (mode) {
      if (!this.pending) {
        this.pendingTime = Date.now()
        this.pending = true
        this.mode = mode
        if (mode) {
          setTimeout(this.run, 1)
        } else {
          requestAnimationFrame(this.run)
        }
      }
    },

    run: function () {
      this.pending = false

      var readQueue = this.readQueue,
        writeQueue = this.writeQueue,
        request = null,
        queue

      if (this.mode) {
        queue = readQueue

        if (writeQueue.length > 0) {
          request = false
        }
      }else {
        queue = writeQueue

        if (readQueue.length > 0) {
          request = true
        }
      }

      var tasks = queue.slice(),
        i, ln, task, fn, scope

      queue.length = 0

      for (i = 0, ln = tasks.length; i < ln; i++) {
        task = tasks[i]
        fn = task[0]
        scope = task[1]

        if (typeof fn == 'string') {
          fn = scope[fn]
        }

        if (task.length > 2) {
          fn.apply(scope, task[2])
        }else {
          fn.call(scope)
        }
      }

      tasks.length = 0

      if (request !== null) {
        this.request(request)
      }
    },

    watch: function () {
      if (this.pending && Date.now() - this.pendingTime >= 500) {
        this.run()
      }
    }
  })
  return new Tau.TaskQueue
}))
