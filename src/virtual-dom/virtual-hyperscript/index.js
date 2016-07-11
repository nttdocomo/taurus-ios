'use strict';
/**
 * @author nttdocomo
 */
 (function (root, factory) {
	if(typeof define === "function") {
		if(define.amd){
			define(['./virtual-hyperscript/index'], factory);
		}
		if(define.cmd){
			define(function(require, exports, module){
				return factory(require('underscore').isArray,require('../vnode/vnode'),require('../vnode/vtext'),require('../vnode/is-vnode'),require('../vnode/is-vtext'),require('../vnode/is-widget'),require('../vnode/is-vhook'),require('../vnode/is-thunk'),require('./parse-tag'),require('./hooks/soft-set-hook'),require('./hooks/ev-hook'));
			})
		}
	} else if(typeof module === "object" && module.exports) {
		module.exports = factory(require('./virtual-hyperscript/index'));
	}
}(this, function(isArray,VNode,VText,isVNode,isVText,isWidget,isHook,isVThunk,parseTag,softSetHook,evHook){
    function h(tagName, properties, children) {
        var childNodes = [];
        var tag, props, key, namespace;

        if (!children && isChildren(properties)) {
            children = properties;
            props = {};
        }

        props = props || properties || {};
        tag = parseTag(tagName, props);

        // support keys
        if (props.hasOwnProperty('key')) {
            key = props.key;
            props.key = undefined;
        }

        // support namespace
        if (props.hasOwnProperty('namespace')) {
            namespace = props.namespace;
            props.namespace = undefined;
        }

        // fix cursor bug
        if (tag === 'INPUT' &&
            !namespace &&
            props.hasOwnProperty('value') &&
            props.value !== undefined &&
            !isHook(props.value)
        ) {
            if (props.value !== null && typeof props.value !== 'string') {
                throw UnsupportedValueType({
                    expected: 'String',
                    received: typeof props.value,
                    Vnode: {
                        tagName: tag,
                        properties: props
                    }
                });
            }
            props.value = softSetHook(props.value);
        }

        transformProperties(props);

        if (children !== undefined && children !== null) {
            addChild(children, childNodes, tag, props);
        }


        return new VNode(tag, props, childNodes, key, namespace);
    }

    function addChild(c, childNodes, tag, props) {
        if (typeof c === 'string') {
            childNodes.push(new VText(c));
        } else if (typeof c === 'number') {
            childNodes.push(new VText(String(c)));
        } else if (isChild(c)) {
            childNodes.push(c);
        } else if (isArray(c)) {
            for (var i = 0; i < c.length; i++) {
                addChild(c[i], childNodes, tag, props);
            }
        } else if (c === null || c === undefined) {
            return;
        } else {
            throw UnexpectedVirtualElement({
                foreignObject: c,
                parentVnode: {
                    tagName: tag,
                    properties: props
                }
            });
        }
    }

    function transformProperties(props) {
        for (var propName in props) {
            if (props.hasOwnProperty(propName)) {
                var value = props[propName];

                if (isHook(value)) {
                    continue;
                }

                if (propName.substr(0, 3) === 'ev-') {
                    // add ev-foo support
                    props[propName] = evHook(value);
                }
            }
        }
    }

    function isChild(x) {
        return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
    }

    function isChildren(x) {
        return typeof x === 'string' || isArray(x) || isChild(x);
    }

    function UnexpectedVirtualElement(data) {
        var err = new Error();

        err.type = 'virtual-hyperscript.unexpected.virtual-element';
        err.message = 'Unexpected virtual child passed to h().\n' +
            'Expected a VNode / Vthunk / VWidget / string but:\n' +
            'got:\n' +
            errorString(data.foreignObject) +
            '.\n' +
            'The parent vnode is:\n' +
            errorString(data.parentVnode)
            '\n' +
            'Suggested fix: change your `h(..., [ ... ])` callsite.';
        err.foreignObject = data.foreignObject;
        err.parentVnode = data.parentVnode;

        return err;
    }

    function UnsupportedValueType(data) {
        var err = new Error();

        err.type = 'virtual-hyperscript.unsupported.value-type';
        err.message = 'Unexpected value type for input passed to h().\n' +
            'Expected a ' +
            errorString(data.expected) +
            ' but got:\n' +
            errorString(data.received) +
            '.\n' +
            'The vnode is:\n' +
            errorString(data.Vnode)
            '\n' +
            'Suggested fix: Cast the value passed to h() to a string using String(value).';
        err.Vnode = data.Vnode;

        return err;
    }

    function errorString(obj) {
        try {
            return JSON.stringify(obj, null, '    ');
        } catch (e) {
            return String(obj);
        }
    }
	return h;
}));
