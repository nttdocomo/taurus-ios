define(function (require) {
    var h = require("../../src/virtual-dom/h"),
    diff = require("../../src/virtual-dom/diff"),
    createElement = require("../../src/virtual-dom/create-element"),
    patch = require("../../src/virtual-dom/patch"),
    dom2hscript = require('../../src/dom2hscript/index');
    console.log(new Function(dom2hscript.parseHTML('<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>')))
    var leftNode = new Function('h','return ' + dom2hscript.parseHTML('<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>'))(h)
    var rightNode = eval(dom2hscript.parseHTML('<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>10</li></ul>'))
    // Render the left node to a DOM node
    console.log(h('div', {
        className:'title',
        namespace: "http://www.w3.org/2000/svg"
    }, [h('div',{
        className: 'description'
    })]))
    var rootNode = createElement(leftNode)
    document.body.appendChild(rootNode)

    // Update the DOM with the results of a diff
    var patches = diff(leftNode, rightNode)
    patch(rootNode, patches)
})
