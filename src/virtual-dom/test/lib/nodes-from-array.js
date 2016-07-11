;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Nodes-from-array = factory();
  }
}(this, function() {
var h = require("../../h.js")

module.exports = nodesFromArray

function nodesFromArray(array) {
    var i =0
    var children = []
    var key
    var properties

    for(; i < array.length; i++) {
        key = array[i]

        if (key != null) {
            properties = {
                key: key,
                id: String(key)
            }
        }
        else {
            properties = {
                id: 'no-key-' + i
            }
        }

        children.push(h('div', properties, properties.id))
    }

    return h('div', children)
}

return Nodes-from-array;
}));
