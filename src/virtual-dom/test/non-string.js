;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Non-string = factory();
  }
}(this, function() {
var test = require("tape")
var h = require("../h.js")
var diff = require("../diff.js")
var patch = require("../patch.js")
var createElement = require("../create-element.js")

test("coerce numbers to strings in children array", function (assert) {
    var leftNode = h("div", [ "clicked ", 1336, " times" ])
    var rightNode = h("div", [ "clicked ", 1337, " times" ])
    var rootNode = createElement(leftNode)
    var newRoot = patch(rootNode, diff(leftNode, rightNode))
    assert.strictEqual(
        newRoot.outerHTML || newRoot.toString(),
        '<div>clicked 1337 times</div>'
    )
    assert.end()
})

return Non-string;
}));
