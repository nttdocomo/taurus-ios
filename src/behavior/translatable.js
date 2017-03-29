/*global define*/
;(function (root, factory) {
  if (typeof define === 'function') {
    if (define.amd) {
      define(['../core/define', './behavior', '../util/translatable', '../underscore', '../tau'], factory)
    }
    if (define.cmd) {
      define(function (require, exports, module) {
        return factory(require('../core/define'), require('./behavior'), require('../util/translatable'), require('../underscore'), require('../tau'))
      })
    }
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('../core/define'), require('./behavior'), require('../util/translatable'), require('../underscore'), require('../tau'))
  }
}(this, function (define, Behavior, Translatable, _, Tau) {
  return define('Tau.behavior.Translatable', Behavior, {

    setConfig: function (config) {
      var translatable = this.translatable
      var component = this.component

      if (config) {
        if (!translatable) {
          this.translatable = translatable = new Translatable(config)
          translatable.setElement(component.renderElement)
          translatable.on('destroy', 'onTranslatableDestroy', this)
        } else if (_.isObject(config)) {
          translatable.setConfig(config)
        }
      } else if (translatable) {
        translatable.destroy()
      }

      return this
    },
    getTranslatable: function () {
      return this.translatable
    }
  })
}))
