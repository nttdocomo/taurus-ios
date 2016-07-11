;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Index = factory();
  }
}(this, function() {
require("./main.js")
require("./hook.js")
require("./nested-properties.js")
require("./undefined-properties.js")
require("./keys.js")
require("./thunk.js")
require("./style.js")
require("./attributes")
require("./non-string.js")

require("../vdom/test/")
require("../vtree/test/")
require("../virtual-hyperscript/test/")
require("../vnode/test/")

return Index;
}));
