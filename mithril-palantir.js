var m$2 = function app(window$2, undefined) {
    if (Number('3') >= 3)
        console.log(app.name.replace(/\$.*/, '') + '()', app.arguments);
    if (Number('3') >= 2)
        console.time('TIME SINCE MITHRIL SOURCED');
    var OBJECT = '[object Object]', ARRAY = '[object Array]', STRING = '[object String]', FUNCTION = 'function';
    var type = {}.toString;
    var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/;
    var voidElements = /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/;
    var $document,
        // caching commonly used variables
        $location, $requestAnimationFrame, $cancelAnimationFrame;
    function initialize(window$3) {
        if (Number('3') >= 2) {
            function mithrilLoadTime() {
                console.warn('DOMContentLoaded');
                console.timeEnd('TIME SINCE MITHRIL SOURCED');
                console.time('TIME SINCE DOMContentLoaded');
            }
            window.document.onload = addEventListener('DOMContentLoaded', mithrilLoadTime, true);
        }
        if (Number('3') >= 1) {
            function mithrilClickTime() {
                console.time('CLICK');
                console.warn('CLICK HAPPENED');
            }
            window.onclick = addEventListener('click', mithrilClickTime, true);
            function mithrilChangeTime() {
                console.time('CHANGE');
                console.warn('CHANGE HAPPENED');
            }
            window.onchange = addEventListener('change', mithrilChangeTime, true);
        }
        if (Number('3') >= 3)
            console.log(initialize.name.replace(/\$.*/, '') + '()', initialize.arguments);
        $document = window$3.document;
        $location = window$3.location;
        $cancelAnimationFrame = window$3.cancelAnimationFrame || window$3.clearTimeout;
        $requestAnimationFrame = window$3.requestAnimationFrame || window$3.setTimeout;
    }
    initialize(window$2);
    function m$3() {
        if (Number('3') >= 3)
            console.log(m$3.name.replace(/\$.*/, '') + '()', m$3.arguments);
        var args = [].slice.call(arguments);
        var hasAttrs = args[1] != null && type.call(args[1]) === OBJECT && !('tag' in args[1]) && !('subtree' in args[1]);
        var attrs = hasAttrs ? args[1] : {};
        var classAttrName = 'class' in attrs ? 'class' : 'className';
        var cell = {
            tag: 'div',
            attrs: {}
        };
        var match, classes = [];
        if (type.call(args[0]) != STRING)
            throw new Error('selector in m(selector, attrs, children) should be a string');
        while (match = parser.exec(args[0])) {
            if (match[1] === '' && match[2])
                cell.tag = match[2];
            else if (match[1] === '#')
                cell.attrs.id = match[2];
            else if (match[1] === '.')
                classes.push(match[2]);
            else if (match[3][0] === '[') {
                var pair = attrParser.exec(match[3]);
                cell.attrs[pair[1]] = pair[3] || (pair[2] ? '' : true);
            }
        }
        if (classes.length > 0)
            cell.attrs[classAttrName] = classes.join(' ');
        var children = hasAttrs ? args[2] : args[1];
        if (type.call(children) === ARRAY) {
            cell.children = children;
        } else {
            cell.children = hasAttrs ? args.slice(2) : args.slice(1);
        }
        for (var attrName in attrs) {
            if (attrName === classAttrName) {
                if (attrs[attrName] !== '')
                    cell.attrs[attrName] = (cell.attrs[attrName] || '') + ' ' + attrs[attrName];
            } else
                cell.attrs[attrName] = attrs[attrName];
        }
        return cell;
    }
    function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
        if (Number('3') >= 3)
            console.count('BUILD');
        if (//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
            //the diff algorithm can be summarized as this:
            //1 - compare `data` and `cached`
            //2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
            //3 - recursively apply this algorithm for every array and for the children of every virtual element
            //the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
            //- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
            //- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
            //- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
            //- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node
            //`parentElement` is a DOM element used for W3C DOM API calls
            //`parentTag` is only used for handling a corner case for textarea values
            //`parentCache` is used to remove nodes in some multi-node cases
            //`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
            //`data` and `cached` are, respectively, the new and old nodes being diffed
            //`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
            //`editable` is a flag that indicates whether an ancestor is contenteditable
            //`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
            //`configs` is a list of config functions to run after the topmost `build` call finishes running
            //there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
            //- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements (e.g. function foo() {if (cond) return m("div")}
            //- it simplifies diffing code
            //data.toString() is null if data is the return value of Console.log in Firefox
            data == null || data.toString() == null)
            data = '';
        if (data.subtree === 'retain')
            return cached;
        var cachedType = type.call(cached), dataType = type.call(data);
        if (cached == null || cachedType !== dataType) {
            if (cached != null) {
                if (parentCache && parentCache.nodes) {
                    var offset = index - parentIndex;
                    var end = offset + (dataType === ARRAY ? data : cached.nodes).length;
                    clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end));
                } else if (cached.nodes)
                    clear(cached.nodes, cached);
            }
            cached = new data.constructor();
            if (cached.tag)
                cached = {};
            //if constructor creates a virtual dom element, use a blank object as the base cached node instead of copying the virtual el (#277)
            cached.nodes = [];
        }
        if (dataType === ARRAY) {
            for (var
                    //recursively flatten array
                    i = 0, len = data.length; i < len; i++) {
                if (type.call(data[i]) === ARRAY) {
                    data = data.concat.apply([], data);
                    i--;
                }
            }
            var
                //check current index again and flatten until there are no more nested arrays at that index
                nodes = [], intact = cached.length === data.length, subArrayCount = 0;
            var DELETION = //keys algorithm: sort elements without recreating them if keys are present
                //1) create a map of all existing keys, and mark all for deletion
                //2) add new keys to map and mark them for addition
                //3) if key exists in new list, change action from deletion to a move
                //4) for each key, handle its corresponding action as marked in previous steps
                //5) copy unkeyed items into their respective gaps
                1, INSERTION = 2, MOVE = 3;
            var existing = {}, unkeyed = [], shouldMaintainIdentities = false;
            for (var i = 0; i < cached.length; i++) {
                if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
                    shouldMaintainIdentities = true;
                    existing[cached[i].attrs.key] = {
                        action: DELETION,
                        index: i
                    };
                }
            }
            if (shouldMaintainIdentities) {
                if (data.indexOf(null) > -1)
                    data = data.filter(function (x) {
                        return x != null;
                    });
                var keysDiffer = false;
                if (data.length != cached.length)
                    keysDiffer = true;
                else
                    for (var i = 0, cachedCell, dataCell; cachedCell = cached[i], dataCell = data[i]; i++) {
                        if (cachedCell.attrs && dataCell.attrs && cachedCell.attrs.key != dataCell.attrs.key) {
                            keysDiffer = true;
                            break;
                        }
                    }
                if (keysDiffer) {
                    for (var i = 0, len = data.length; i < len; i++) {
                        if (data[i] && data[i].attrs) {
                            if (data[i].attrs.key != null) {
                                var key = data[i].attrs.key;
                                if (!existing[key])
                                    existing[key] = {
                                        action: INSERTION,
                                        index: i
                                    };
                                else
                                    existing[key] = {
                                        action: MOVE,
                                        index: i,
                                        from: existing[key].index,
                                        element: cached.nodes[existing[key].index] || $document.createElement('div')
                                    };
                            } else
                                unkeyed.push({
                                    index: i,
                                    element: parentElement.childNodes[i] || $document.createElement('div')
                                });
                        }
                    }
                    var actions = [];
                    for (var prop in existing)
                        actions.push(existing[prop]);
                    var changes = actions.sort(sortChanges);
                    var newCached = new Array(cached.length);
                    for (var i = 0, change; change = changes[i]; i++) {
                        if (change.action === DELETION) {
                            clear(cached[change.index].nodes, cached[change.index]);
                            newCached.splice(change.index, 1);
                        }
                        if (change.action === INSERTION) {
                            var dummy = $document.createElement('div');
                            dummy.key = data[change.index].attrs.key;
                            parentElement.insertBefore(dummy, parentElement.childNodes[change.index] || null);
                            newCached.splice(change.index, 0, {
                                attrs: { key: data[change.index].attrs.key },
                                nodes: [dummy]
                            });
                        }
                        if (change.action === MOVE) {
                            if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
                                parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null);
                            }
                            newCached[change.index] = cached[change.from];
                        }
                    }
                    for (var i = 0, len = unkeyed.length; i < len; i++) {
                        var change = unkeyed[i];
                        parentElement.insertBefore(change.element, parentElement.childNodes[change.index] || null);
                        newCached[change.index] = cached[change.index];
                    }
                    cached = newCached;
                    cached.nodes = new Array(parentElement.childNodes.length);
                    for (var i = 0, child; child = parentElement.childNodes[i]; i++)
                        cached.nodes[i] = child;
                }
            }
            for (var
                    //end key algorithm
                    i = 0, cacheCount = 0, len = data.length; i < len; i++) {
                var //diff each item in the array
                item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs);
                if (item === undefined)
                    continue;
                if (!item.nodes.intact)
                    intact = false;
                if (item.$trusted) {
                    //fix offset of next element if item was a trusted string w/ more than one html element
                    //the first clause in the regexp matches elements
                    //the second clause (after the pipe) matches text nodes
                    subArrayCount += (item.match(/<[^\/]|\>\s*[^<]/g) || []).length;
                } else
                    subArrayCount += type.call(item) === ARRAY ? item.length : 1;
                cached[cacheCount++] = item;
            }
            if (!intact) {
                for (var
                        //diff the array itself
                        //update the list of DOM nodes by collecting the nodes from each item
                        i = 0, len = data.length; i < len; i++) {
                    if (cached[i] != null)
                        nodes.push.apply(nodes, cached[i].nodes);
                }
                for (var
                        //remove items from the end of the array if the new array is shorter than the old one
                        //if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
                        i = 0, node; node = cached.nodes[i]; i++) {
                    if (node.parentNode != null && nodes.indexOf(node) < 0)
                        clear([node], [cached[i]]);
                }
                if (data.length < cached.length)
                    cached.length = data.length;
                cached.nodes = nodes;
            }
        } else if (data != null && dataType === OBJECT) {
            if (!data.attrs)
                data.attrs = {};
            if (!cached.attrs)
                cached.attrs = {};
            var dataAttrKeys = Object.keys(data.attrs);
            var hasKeys = dataAttrKeys.length > ('key' in data.attrs ? 1 : 0);
            if (//if an element is different enough from the one in cache, recreate it
                data.tag != cached.tag || dataAttrKeys.join() != Object.keys(cached.attrs).join() || data.attrs.id != cached.attrs.id) {
                if (cached.nodes.length)
                    clear(cached.nodes);
                if (cached.configContext && typeof cached.configContext.onunload === FUNCTION)
                    cached.configContext.onunload();
            }
            if (type.call(data.tag) != STRING)
                return;
            var node, isNew = cached.nodes.length === 0;
            if (data.attrs.xmlns)
                namespace = data.attrs.xmlns;
            else if (data.tag === 'svg')
                namespace = 'http://www.w3.org/2000/svg';
            else if (data.tag === 'math')
                namespace = 'http://www.w3.org/1998/Math/MathML';
            if (isNew) {
                if (data.attrs.is)
                    node = namespace === undefined ? $document.createElement(data.tag, data.attrs.is) : $document.createElementNS(namespace, data.tag, data.attrs.is);
                else
                    node = namespace === undefined ? $document.createElement(data.tag) : $document.createElementNS(namespace, data.tag);
                cached = {
                    tag: data.tag,
                    //set attributes first, then create children
                    attrs: hasKeys ? setAttributes(node, data.tag, data.attrs, {}, namespace) : data.attrs,
                    children: data.children != null && data.children.length > 0 ? build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs) : data.children,
                    nodes: [node]
                };
                if (cached.children && !cached.children.nodes)
                    cached.children.nodes = [];
                if (//edge case: setting value on <select> doesn't work before children exist, so set it again after children have been created
                    data.tag === 'select' && data.attrs.value)
                    setAttributes(node, data.tag, { value: data.attrs.value }, {}, namespace);
                parentElement.insertBefore(node, parentElement.childNodes[index] || null);
            } else {
                node = cached.nodes[0];
                if (hasKeys)
                    setAttributes(node, data.tag, data.attrs, cached.attrs, namespace);
                cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs);
                cached.nodes.intact = true;
                if (shouldReattach === true && node != null)
                    parentElement.insertBefore(node, parentElement.childNodes[index] || null);
            }
            if (//schedule configs to be called. They are called after `build` finishes running
                typeof data.attrs.config === FUNCTION) {
                var context = cached.configContext = cached.configContext || {};
                var // bind
                callback = function (data$2, args) {
                    if (Number('3') >= 3)
                        console.log('callback', callback.arguments);
                    return function () {
                        return data$2.attrs.config.apply(data$2, args);
                    };
                };
                configs.push(callback(data, [
                    node,
                    !isNew,
                    context,
                    cached
                ]));
            }
        } else if (typeof dataType != FUNCTION) {
            var
            //handle text nodes
            nodes;
            if (cached.nodes.length === 0) {
                if (data.$trusted) {
                    nodes = injectHTML(parentElement, index, data);
                } else {
                    nodes = [$document.createTextNode(data)];
                    if (!parentElement.nodeName.match(voidElements))
                        parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
                }
                cached = 'string number boolean'.indexOf(typeof data) > -1 ? new data.constructor(data) : data;
                cached.nodes = nodes;
            } else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
                nodes = cached.nodes;
                if (!editable || editable !== $document.activeElement) {
                    if (data.$trusted) {
                        clear(nodes, cached);
                        nodes = injectHTML(parentElement, index, data);
                    } else {
                        if (//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
                            //we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
                            parentTag === 'textarea')
                            parentElement.value = data;
                        else if (editable)
                            editable.innerHTML = data;
                        else {
                            if (nodes[0].nodeType === 1 || nodes.length > 1) {
                                //was a trusted string
                                clear(cached.nodes, cached);
                                nodes = [$document.createTextNode(data)];
                            }
                            parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null);
                            nodes[0].nodeValue = data;
                        }
                    }
                }
                cached = new data.constructor(data);
                cached.nodes = nodes;
            } else
                cached.nodes.intact = true;
        }
        return cached;
    }
    function sortChanges(a, b) {
        if (Number('3') >= 3)
            console.log(sortChanges.name.replace(/\$.*/, '') + '()', sortChanges.arguments);
        return a.action - b.action || a.index - b.index;
    }
    function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
        if (Number('3') >= 3)
            console.log(setAttributes.name.replace(/\$.*/, '') + '()', setAttributes.arguments);
        for (var attrName in dataAttrs) {
            var dataAttr = dataAttrs[attrName];
            var cachedAttr = cachedAttrs[attrName];
            if (!(attrName in cachedAttrs) || cachedAttr !== dataAttr) {
                cachedAttrs[attrName] = dataAttr;
                try {
                    if (//`config` isn't a real attributes, so ignore it
                        attrName === 'config' || attrName == 'key')
                        continue;
                    else if (//hook event handlers to the auto-redrawing system
                        typeof dataAttr === FUNCTION && attrName.indexOf('on') === 0) {
                        node[attrName] = autoredraw(dataAttr, node);
                    } else if (//handle `style: {...}`
                        attrName === 'style' && dataAttr != null && type.call(dataAttr) === OBJECT) {
                        for (var rule in dataAttr) {
                            if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule])
                                node.style[rule] = dataAttr[rule];
                        }
                        for (var rule in cachedAttr) {
                            if (!(rule in dataAttr))
                                node.style[rule] = '';
                        }
                    } else if (//handle SVG
                        namespace != null) {
                        if (attrName === 'href')
                            node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', dataAttr);
                        else if (attrName === 'className')
                            node.setAttribute('class', dataAttr);
                        else
                            node.setAttribute(attrName, dataAttr);
                    } else if (//handle cases that are properties (but ignore cases where we should use setAttribute instead)
                        //- list and form are typically used as strings, but are DOM element references in js
                        //- when using CSS selectors (e.g. `m("[style='']")`), style is used as a string, but it's an object in js
                        attrName in node && !(attrName === 'list' || attrName === 'style' || attrName === 'form' || attrName === 'type')) {
                        if (//#348 don't set the value if not needed otherwise cursor placement breaks in Chrome
                            tag !== 'input' || node[attrName] !== dataAttr)
                            node[attrName] = dataAttr;
                    } else
                        node.setAttribute(attrName, dataAttr);
                } catch (e) {
                    if (//swallow IE's invalid argument errors to mimic HTML's fallback-to-doing-nothing-on-invalid-attributes behavior
                        e.message.indexOf('Invalid argument') < 0)
                        throw e;
                }
            } else if (//#348 dataAttr may not be a string, so use loose comparison (double equal) instead of strict (triple equal)
                attrName === 'value' && tag === 'input' && node.value != dataAttr) {
                node.value = dataAttr;
            }
        }
        return cachedAttrs;
    }
    function clear(nodes, cached) {
        if (Number('3') >= 3)
            console.log(clear.name.replace(/\$.*/, '') + '()', clear.arguments);
        for (var i = nodes.length - 1; i > -1; i--) {
            if (nodes[i] && nodes[i].parentNode) {
                try {
                    nodes[i].parentNode.removeChild(nodes[i]);
                } catch (e) {
                }
                //ignore if this fails due to order of events (see http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
                cached = [].concat(cached);
                if (cached[i])
                    unload(cached[i]);
            }
        }
        if (nodes.length != 0)
            nodes.length = 0;
    }
    function unload(cached) {
        if (Number('3') >= 3)
            console.log(unload.name.replace(/\$.*/, '') + '()', unload.arguments);
        if (cached.configContext && typeof cached.configContext.onunload === FUNCTION)
            cached.configContext.onunload();
        if (cached.children) {
            if (type.call(cached.children) === ARRAY) {
                for (var i = 0, child; child = cached.children[i]; i++)
                    unload(child);
            } else if (cached.children.tag)
                unload(cached.children);
        }
    }
    function injectHTML(parentElement, index, data) {
        if (Number('3') >= 3)
            console.log(injectHTML.name.replace(/\$.*/, '') + '()', injectHTML.arguments);
        var nextSibling = parentElement.childNodes[index];
        if (nextSibling) {
            var isElement = nextSibling.nodeType != 1;
            var placeholder = $document.createElement('span');
            if (isElement) {
                parentElement.insertBefore(placeholder, nextSibling || null);
                placeholder.insertAdjacentHTML('beforebegin', data);
                parentElement.removeChild(placeholder);
            } else
                nextSibling.insertAdjacentHTML('beforebegin', data);
        } else
            parentElement.insertAdjacentHTML('beforeend', data);
        var nodes = [];
        while (parentElement.childNodes[index] !== nextSibling) {
            nodes.push(parentElement.childNodes[index]);
            index++;
        }
        return nodes;
    }
    function autoredraw(callback, object) {
        if (Number('3') >= 3)
            console.log(autoredraw.name.replace(/\$.*/, '') + '()', autoredraw.arguments);
        return function (e) {
            e = e || event;
            m$3.redraw.strategy('diff');
            m$3.startComputation();
            try {
                return callback.call(object, e);
            } finally {
                endFirstComputation();
            }
        };
    }
    var html;
    var documentNode = {
        appendChild: function (node) {
            if (html === undefined)
                html = $document.createElement('html');
            if ($document.documentElement && $document.documentElement !== node) {
                $document.replaceChild(node, $document.documentElement);
            } else
                $document.appendChild(node);
            this.childNodes = $document.childNodes;
        },
        insertBefore: function (node) {
            this.appendChild(node);
        },
        childNodes: []
    };
    var nodeCache = [], cellCache = {};
    m$3.render = function (root, cell, forceRecreation) {
        if (Number('3') >= 1)
            console.time('RENDER');
        if (Number('3') >= 3)
            console.log('render' + '()', m$3.render.arguments);
        if (Number('3') >= 3)
            console.groupCollapsed('m.render() {BODY}');
        var configs = [];
        if (!root)
            throw new Error('Please ensure the DOM element exists before rendering a template into it.');
        var id = getCellCacheKey(root);
        var isDocumentRoot = root === $document;
        var node = isDocumentRoot || root === $document.documentElement ? documentNode : root;
        if (isDocumentRoot && cell.tag != 'html')
            cell = {
                tag: 'html',
                attrs: {},
                children: cell
            };
        if (cellCache[id] === undefined)
            clear(node.childNodes);
        if (forceRecreation === true)
            reset(root);
        cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs);
        for (var i = 0, len = configs.length; i < len; i++)
            configs[i]();
        ;
        if (Number('3') >= 3)
            console.groupEnd('m.render() {BODY}');
        if (Number('3') >= 1)
            console.timeEnd('RENDER');
    };
    function getCellCacheKey(element) {
        if (Number('3') >= 3)
            console.log(getCellCacheKey.name.replace(/\$.*/, '') + '()', getCellCacheKey.arguments);
        var index = nodeCache.indexOf(element);
        return index < 0 ? nodeCache.push(element) - 1 : index;
    }
    m$3.trust = function (value) {
        if (Number('3') >= 3)
            console.log('trust' + '()', m$3.trust.arguments);
        value = String(value);
        value.$trusted = true;
        return value;
    };
    function gettersetter(store) {
        if (Number('3') >= 3)
            console.log(gettersetter.name.replace(/\$.*/, '') + '()', gettersetter.arguments);
        var prop = function () {
            if (Number('3') >= 3)
                console.log('prop', prop.arguments);
            if (arguments.length)
                store = arguments[0];
            return store;
        };
        prop.toJSON = function () {
            if (Number('3') >= 3)
                console.log('toJSON' + '()', prop.toJSON.arguments);
            return store;
        };
        return prop;
    }
    m$3.prop = function (store) {
        if (Number('3') >= 3)
            console.log('prop' + '()', m$3.prop.arguments);
        if ((//note: using non-strict equality check here because we're checking if store is null OR undefined
            store != null && type.call(store) === OBJECT || typeof store === FUNCTION) && typeof store.then === FUNCTION) {
            return propify(store);
        }
        return gettersetter(store);
    };
    var roots = [], modules = [], controllers = [], lastRedrawId = null, lastRedrawCallTime = 0, computePostRedrawHook = null, prevented = false, topModule;
    var FRAME_BUDGET = 16;
    //60 frames per second = 1 call per 16 ms
    m$3.module = function (root, module$2) {
        if (Number('3') >= 1)
            console.log('m.route() ', m.route());
        if (/* if (Number(get_env('MITHRIL_DEBUG')) >= 1 ) console.dir($method.controller.prototype); */
            Number('3') >= 1)
            console.log(module$2.controller.prototype, m$3.module.arguments);
        if (!root)
            throw new Error('Please ensure the DOM element exists before rendering a template into it.');
        var index = roots.indexOf(root);
        if (index < 0)
            index = roots.length;
        var isPrevented = false;
        if (controllers[index] && typeof controllers[index].onunload === FUNCTION) {
            var event$2 = {
                preventDefault: function () {
                    isPrevented = true;
                }
            };
            controllers[index].onunload(event$2);
        }
        if (!isPrevented) {
            m$3.redraw.strategy('all');
            m$3.startComputation();
            roots[index] = root;
            var currentModule = topModule = module$2 = module$2 || {};
            var controller = new (module$2.controller || function () {
            })();
            if (//controllers may call m.module recursively (via m.route redirects, for example)
                //this conditional ensures only the last recursive m.module call is applied
                currentModule === topModule) {
                controllers[index] = controller;
                modules[index] = module$2;
            }
            endFirstComputation();
            return controllers[index];
        }
        ;
    };
    m$3.redraw = function (force) {
        if (Number('3') >= 3)
            console.log('redraw' + '()', m$3.redraw.arguments);
        if (//lastRedrawId is a positive number if a second redraw is requested before the next animation frame
            //lastRedrawID is null if it's the first redraw and not an event handler
            lastRedrawId && force !== true) {
            if (//when setTimeout: only reschedule redraw if time between now and previous redraw is bigger than a frame, otherwise keep currently scheduled timeout
                //when rAF: always reschedule redraw
                new Date() - lastRedrawCallTime > FRAME_BUDGET || $requestAnimationFrame === window$2.requestAnimationFrame) {
                if (lastRedrawId > 0)
                    $cancelAnimationFrame(lastRedrawId);
                lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET);
            }
        } else {
            redraw();
            lastRedrawId = $requestAnimationFrame(function () {
                lastRedrawId = null;
            }, FRAME_BUDGET);
        }
    };
    m$3.redraw.strategy = m$3.prop();
    var blank = function () {
        if (Number('3') >= 3)
            console.log('blank', blank.arguments);
        return '';
    };
    function redraw() {
        var strategy = m.redraw.strategy();
        if (typeof redraw._count_diff === 'undefined')
            redraw._count_diff = m.prop(0);
        if (typeof redraw._count_all === 'undefined')
            redraw._count_all = m.prop(0);
        if (typeof redraw._count_none === 'undefined')
            redraw._count_none = m.prop(0);
        if (Number('3') >= 1)
            console.time('REDRAW');
        if (Number('3') >= 1)
            console.timeStamp('REDRAW BEGIN ');
        if (Number('3') >= 3)
            console.log(redraw.name.replace(/\$.*/, '') + '()', redraw.arguments);
        if (Number(isNaN('3')))
            console.profile('REDRAW');
        var forceRedraw = m$3.redraw.strategy() === 'all';
        for (var i = 0, root; root = roots[i]; i++) {
            if (controllers[i]) {
                m$3.render(root, modules[i].view ? modules[i].view(controllers[i]) : blank(), forceRedraw);
            }
        }
        if (//after rendering within a routed context, we need to scroll back to the top, and fetch the document title for history.pushState
            computePostRedrawHook) {
            computePostRedrawHook();
            computePostRedrawHook = null;
        }
        lastRedrawId = null;
        lastRedrawCallTime = new Date();
        m$3.redraw.strategy('diff');
        ;
        if (Number(isNaN('3')))
            console.profileEnd('REDRAW');
        if (Number('3') >= 1)
            console.timeStamp('REDRAW END');
        if (Number('3') >= 1)
            console.timeEnd('CLICK');
        if (Number('3') >= 1)
            console.timeEnd('CHANGE');
        if (Number('3') >= 1)
            console.timeEnd('REDRAW');
        if (Number('3') >= 2)
            console.timeEnd('TIME SINCE DOMContentLoaded');
        if (strategy === 'diff')
            redraw._count_diff(redraw._count_diff() + 1);
        if (strategy === 'all')
            redraw._count_all(redraw._count_all() + 1);
        if (strategy === 'none')
            redraw._count_none(redraw._count_none() + 1);
        console.info(redraw.name, '[' + strategy + ']', redraw._count_diff() + 'd', redraw._count_all() + 'a', redraw._count_none() + 'n');
    }
    var pendingRequests = 0;
    m$3.startComputation = function () {
        if (Number('3') >= 2)
            console.time('COMPUTATION');
        if (Number('3') >= 3)
            console.log('startComputation' + '()', m$3.startComputation.arguments);
        pendingRequests++;
    };
    m$3.endComputation = function () {
        if (Number('3') >= 3)
            console.log('endComputation' + '()', m$3.endComputation.arguments);
        pendingRequests = Math.max(pendingRequests - 1, 0);
        if (pendingRequests === 0)
            m$3.redraw();
        if (Number('3') >= 2)
            console.timeEnd('COMPUTATION');
    };
    var endFirstComputation = function () {
        if (Number('3') >= 3)
            console.log('endFirstComputation', endFirstComputation.arguments);
        if (m$3.redraw.strategy() == 'none') {
            pendingRequests--;
            m$3.redraw.strategy('diff');
        } else
            m$3.endComputation();
    };
    m$3.withAttr = function (prop, withAttrCallback) {
        if (Number('3') >= 3)
            console.log('withAttr' + '()', m$3.withAttr.arguments);
        return function (e) {
            e = e || event;
            var currentTarget = e.currentTarget || this;
            withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop));
        };
    };
    var //routing
    modes = {
        pathname: '',
        hash: '#',
        search: '?'
    };
    var redirect = function () {
            if (Number('3') >= 3)
                console.log('redirect', redirect.arguments);
        }, routeParams, currentRoute;
    m$3.route = function () {
        if (Number('3') >= 3)
            console.log('route' + '()', m$3.route.arguments);
        if (//m.route()
            arguments.length === 0)
            return currentRoute;
        else if (//m.route(el, defaultRoute, routes)
            arguments.length === 3 && type.call(arguments[1]) === STRING) {
            var root = arguments[0], defaultRoute = arguments[1], router = arguments[2];
            redirect = function (source) {
                var path = currentRoute = normalizeRoute(source);
                if (!routeByValue(root, router, path)) {
                    m$3.route(defaultRoute, true);
                }
            };
            var listener = m$3.route.mode === 'hash' ? 'onhashchange' : 'onpopstate';
            window$2[listener] = function () {
                var path = $location[m$3.route.mode];
                if (m$3.route.mode === 'pathname')
                    path += $location.search;
                if (currentRoute != normalizeRoute(path)) {
                    redirect(path);
                }
            };
            computePostRedrawHook = setScroll;
            window$2[listener]();
        } else if (//config: m.route
            arguments[0].addEventListener) {
            var element = arguments[0];
            var isInitialized = arguments[1];
            var context = arguments[2];
            element.href = (m$3.route.mode !== 'pathname' ? $location.pathname : '') + modes[m$3.route.mode] + this.attrs.href;
            element.removeEventListener('click', routeUnobtrusive);
            element.addEventListener('click', routeUnobtrusive);
        } else if (//m.route(route, params)
            type.call(arguments[0]) === STRING) {
            var oldRoute = currentRoute;
            currentRoute = arguments[0];
            var args = arguments[1] || {};
            var queryIndex = currentRoute.indexOf('?');
            var params = queryIndex > -1 ? parseQueryString(currentRoute.slice(queryIndex + 1)) : {};
            for (var i in args)
                params[i] = args[i];
            var querystring = buildQueryString(params);
            var currentPath = queryIndex > -1 ? currentRoute.slice(0, queryIndex) : currentRoute;
            if (querystring)
                currentRoute = currentPath + (currentPath.indexOf('?') === -1 ? '?' : '&') + querystring;
            var shouldReplaceHistoryEntry = (arguments.length === 3 ? arguments[2] : arguments[1]) === true || oldRoute === arguments[0];
            if (window$2.history.pushState) {
                computePostRedrawHook = function () {
                    window$2.history[shouldReplaceHistoryEntry ? 'replaceState' : 'pushState'](null, $document.title, modes[m$3.route.mode] + currentRoute);
                    setScroll();
                };
                redirect(modes[m$3.route.mode] + currentRoute);
            } else
                $location[m$3.route.mode] = currentRoute;
        }
    };
    m$3.route.param = function (key) {
        if (!routeParams)
            throw new Error('You must call m.route(element, defaultRoute, routes) before calling m.route.param()');
        return routeParams[key];
    };
    m$3.route.mode = 'search';
    function normalizeRoute(route) {
        if (Number('3') >= 3)
            console.log(normalizeRoute.name.replace(/\$.*/, '') + '()', normalizeRoute.arguments);
        return route.slice(modes[m$3.route.mode].length);
    }
    function routeByValue(root, router, path) {
        if (Number('3') >= 3)
            console.log(routeByValue.name.replace(/\$.*/, '') + '()', routeByValue.arguments);
        routeParams = {};
        var queryStart = path.indexOf('?');
        if (queryStart !== -1) {
            routeParams = parseQueryString(path.substr(queryStart + 1, path.length));
            path = path.substr(0, queryStart);
        }
        for (var route in router) {
            if (route === path) {
                m$3.module(root, router[route]);
                return true;
            }
            var matcher = new RegExp('^' + route.replace(/:[^\/]+?\.{3}/g, '(.*?)').replace(/:[^\/]+/g, '([^\\/]+)') + '/?$');
            if (matcher.test(path)) {
                path.replace(matcher, function () {
                    var keys = route.match(/:[^\/]+/g) || [];
                    var values = [].slice.call(arguments, 1, -2);
                    for (var i = 0, len = keys.length; i < len; i++)
                        routeParams[keys[i].replace(/:|\./g, '')] = decodeURIComponent(values[i]);
                    m$3.module(root, router[route]);
                });
                return true;
            }
        }
    }
    function routeUnobtrusive(e) {
        if (Number('3') >= 3)
            console.log(routeUnobtrusive.name.replace(/\$.*/, '') + '()', routeUnobtrusive.arguments);
        e = e || event;
        if (e.ctrlKey || e.metaKey || e.which === 2)
            return;
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
        var currentTarget = e.currentTarget || this;
        var args = m$3.route.mode === 'pathname' && currentTarget.search ? parseQueryString(currentTarget.search.slice(1)) : {};
        m$3.route(currentTarget[m$3.route.mode].slice(modes[m$3.route.mode].length), args);
    }
    function setScroll() {
        if (Number('3') >= 3)
            console.log(setScroll.name.replace(/\$.*/, '') + '()', setScroll.arguments);
        if (m$3.route.mode != 'hash' && $location.hash)
            $location.hash = $location.hash;
        else
            window$2.scrollTo(0, 0);
    }
    function buildQueryString(object, prefix) {
        if (Number('3') >= 3)
            console.log(buildQueryString.name.replace(/\$.*/, '') + '()', buildQueryString.arguments);
        var str = [];
        for (var prop in object) {
            var key = prefix ? prefix + '[' + prop + ']' : prop, value = object[prop];
            var valueType = type.call(value);
            var pair = value != null && valueType === OBJECT ? buildQueryString(value, key) : valueType === ARRAY ? value.map(function (item) {
                return encodeURIComponent(key + '[]') + '=' + encodeURIComponent(item);
            }).join('&') : encodeURIComponent(key) + '=' + encodeURIComponent(value);
            str.push(pair);
        }
        return str.join('&');
    }
    function parseQueryString(str) {
        if (Number('3') >= 3)
            console.log(parseQueryString.name.replace(/\$.*/, '') + '()', parseQueryString.arguments);
        var pairs = str.split('&'), params = {};
        for (var i = 0, len = pairs.length; i < len; i++) {
            var pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = pair[1] ? decodeURIComponent(pair[1]) : '';
        }
        return params;
    }
    function reset(root) {
        if (Number('3') >= 3)
            console.log(reset.name.replace(/\$.*/, '') + '()', reset.arguments);
        var cacheKey = getCellCacheKey(root);
        clear(root.childNodes, cellCache[cacheKey]);
        cellCache[cacheKey] = undefined;
    }
    m$3.deferred = function () {
        if (Number('3') >= 3)
            console.log('deferred' + '()', m$3.deferred.arguments);
        var deferred = new Deferred();
        deferred.promise = propify(deferred.promise);
        return deferred;
    };
    function propify(promise) {
        if (Number('3') >= 3)
            console.log(propify.name.replace(/\$.*/, '') + '()', propify.arguments);
        var prop = m$3.prop();
        promise.then(prop);
        prop.then = function (resolve, reject) {
            if (Number('3') >= 3)
                console.log('then' + '()', prop.then.arguments);
            return propify(promise.then(resolve, reject));
        };
        return prop;
    }
    function Deferred(successCallback, failureCallback) {
        if (Number('3') >= 3)
            console.log(Deferred.name.replace(/\$.*/, '') + '()', Deferred.arguments);
        var RESOLVING = 1, REJECTING = 2, RESOLVED = 3, REJECTED = 4;
        var self = this, state = 0, promiseValue = 0, next = [];
        self.promise = {};
        self.resolve = function (value) {
            if (Number('3') >= 3)
                console.log('resolve' + '()', self.resolve.arguments);
            if (!state) {
                promiseValue = value;
                state = RESOLVING;
                fire();
            }
            return this;
        };
        self.reject = function (value) {
            if (Number('3') >= 3)
                console.log('reject' + '()', self.reject.arguments);
            if (!state) {
                promiseValue = value;
                state = REJECTING;
                fire();
            }
            return this;
        };
        self.promise.then = function (successCallback$2, failureCallback$2) {
            var deferred = new Deferred(successCallback$2, failureCallback$2);
            if (state === RESOLVED) {
                deferred.resolve(promiseValue);
            } else if (state === REJECTED) {
                deferred.reject(promiseValue);
            } else {
                next.push(deferred);
            }
            return deferred.promise;
        };
        function finish(type$2) {
            if (Number('3') >= 3)
                console.log(finish.name.replace(/\$.*/, '') + '()', finish.arguments);
            state = type$2 || REJECTED;
            next.map(function (deferred) {
                state === RESOLVED && deferred.resolve(promiseValue) || deferred.reject(promiseValue);
            });
        }
        function thennable(then, successCallback$2, failureCallback$2, notThennableCallback) {
            if (Number('3') >= 3)
                console.log(thennable.name.replace(/\$.*/, '') + '()', thennable.arguments);
            if ((promiseValue != null && type.call(promiseValue) === OBJECT || typeof promiseValue === FUNCTION) && typeof then === FUNCTION) {
                try {
                    var
                    // count protects against abuse calls from spec checker
                    count = 0;
                    then.call(promiseValue, function (value) {
                        if (count++)
                            return;
                        promiseValue = value;
                        successCallback$2();
                    }, function (value) {
                        if (count++)
                            return;
                        promiseValue = value;
                        failureCallback$2();
                    });
                } catch (e) {
                    m$3.deferred.onerror(e);
                    promiseValue = e;
                    failureCallback$2();
                }
            } else {
                notThennableCallback();
            }
        }
        function fire() {
            if (Number('3') >= 3)
                console.log(fire.name.replace(/\$.*/, '') + '()', fire.arguments);
            var
            // check if it's a thenable
            then;
            try {
                then = promiseValue && promiseValue.then;
            } catch (e) {
                m$3.deferred.onerror(e);
                promiseValue = e;
                state = REJECTING;
                return fire();
            }
            thennable(then, function () {
                state = RESOLVING;
                fire();
            }, function () {
                state = REJECTING;
                fire();
            }, function () {
                try {
                    if (state === RESOLVING && typeof successCallback === FUNCTION) {
                        promiseValue = successCallback(promiseValue);
                    } else if (state === REJECTING && typeof failureCallback === 'function') {
                        promiseValue = failureCallback(promiseValue);
                        state = RESOLVING;
                    }
                } catch (e) {
                    m$3.deferred.onerror(e);
                    promiseValue = e;
                    return finish();
                }
                if (promiseValue === self) {
                    promiseValue = TypeError();
                    finish();
                } else {
                    thennable(then, function () {
                        finish(RESOLVED);
                    }, finish, function () {
                        finish(state === RESOLVING && RESOLVED);
                    });
                }
            });
        }
    }
    m$3.deferred.onerror = function (e) {
        if (type.call(e) === '[object Error]' && !e.constructor.toString().match(/ Error/))
            throw e;
    };
    m$3.sync = function (args) {
        if (Number('3') >= 3)
            console.log('sync' + '()', m$3.sync.arguments);
        var method = 'resolve';
        function synchronizer(pos, resolved) {
            if (Number('3') >= 3)
                console.log(synchronizer.name.replace(/\$.*/, '') + '()', synchronizer.arguments);
            return function (value) {
                results[pos] = value;
                if (!resolved)
                    method = 'reject';
                if (--outstanding === 0) {
                    deferred.promise(results);
                    deferred[method](results);
                }
                return value;
            };
        }
        var deferred = m$3.deferred();
        var outstanding = args.length;
        var results = new Array(outstanding);
        if (args.length > 0) {
            for (var i = 0; i < args.length; i++) {
                args[i].then(synchronizer(i, true), synchronizer(i, false));
            }
        } else
            deferred.resolve([]);
        return deferred.promise;
    };
    function identity(value) {
        if (Number('3') >= 3)
            console.log(identity.name.replace(/\$.*/, '') + '()', identity.arguments);
        return value;
    }
    function ajax(options) {
        if (Number('3') >= 3)
            console.log(ajax.name.replace(/\$.*/, '') + '()', ajax.arguments);
        if (options.dataType && options.dataType.toLowerCase() === 'jsonp') {
            var callbackKey = 'mithril_callback_' + new Date().getTime() + '_' + Math.round(Math.random() * 10000000000000000).toString(36);
            var script = $document.createElement('script');
            window$2[callbackKey] = function (resp) {
                script.parentNode.removeChild(script);
                options.onload({
                    type: 'load',
                    target: { responseText: resp }
                });
                window$2[callbackKey] = undefined;
            };
            script.onerror = function (e) {
                if (Number('3') >= 3)
                    console.log('onerror' + '()', script.onerror.arguments);
                script.parentNode.removeChild(script);
                options.onerror({
                    type: 'error',
                    target: {
                        status: 500,
                        responseText: JSON.stringify({ error: 'Error making jsonp request' })
                    }
                });
                window$2[callbackKey] = undefined;
                return false;
            };
            script.onload = function (e) {
                if (Number('3') >= 3)
                    console.log('onload' + '()', script.onload.arguments);
                return false;
            };
            script.src = options.url + (options.url.indexOf('?') > 0 ? '&' : '?') + (options.callbackKey ? options.callbackKey : 'callback') + '=' + callbackKey + '&' + buildQueryString(options.data || {});
            $document.body.appendChild(script);
        } else {
            var xhr = new window$2.XMLHttpRequest();
            xhr.open(options.method, options.url, true, options.user, options.password);
            xhr.onreadystatechange = function () {
                if (Number('3') >= 3)
                    console.log('onreadystatechange' + '()', xhr.onreadystatechange.arguments);
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300)
                        options.onload({
                            type: 'load',
                            target: xhr
                        });
                    else
                        options.onerror({
                            type: 'error',
                            target: xhr
                        });
                }
            };
            if (options.serialize === JSON.stringify && options.data && options.method !== 'GET') {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            }
            if (options.deserialize === JSON.parse) {
                xhr.setRequestHeader('Accept', 'application/json, text/*');
            }
            if (typeof options.config === FUNCTION) {
                var maybeXhr = options.config(xhr, options);
                if (maybeXhr != null)
                    xhr = maybeXhr;
            }
            var data = options.method === 'GET' || !options.data ? '' : options.data;
            if (data && (type.call(data) != STRING && data.constructor != window$2.FormData)) {
                throw 'Request data should be either be a string or FormData. Check the `serialize` option in `m.request`';
            }
            xhr.send(data);
            return xhr;
        }
    }
    function bindData(xhrOptions, data, serialize) {
        if (Number('3') >= 3)
            console.log(bindData.name.replace(/\$.*/, '') + '()', bindData.arguments);
        if (xhrOptions.method === 'GET' && xhrOptions.dataType != 'jsonp') {
            var prefix = xhrOptions.url.indexOf('?') < 0 ? '?' : '&';
            var querystring = buildQueryString(data);
            xhrOptions.url = xhrOptions.url + (querystring ? prefix + querystring : '');
        } else
            xhrOptions.data = serialize(data);
        return xhrOptions;
    }
    function parameterizeUrl(url, data) {
        if (Number('3') >= 3)
            console.log(parameterizeUrl.name.replace(/\$.*/, '') + '()', parameterizeUrl.arguments);
        var tokens = url.match(/:[a-z]\w+/gi);
        if (tokens && data) {
            for (var i = 0; i < tokens.length; i++) {
                var key = tokens[i].slice(1);
                url = url.replace(tokens[i], data[key]);
                delete data[key];
            }
        }
        return url;
    }
    m$3.request = function (xhrOptions) {
        if (Number('3') >= 3)
            console.log('request' + '()', m$3.request.arguments);
        if (Number('3') >= 1)
            console.time('REQUEST');
        if (xhrOptions.background !== true)
            m$3.startComputation();
        var deferred = m$3.deferred();
        var isJSONP = xhrOptions.dataType && xhrOptions.dataType.toLowerCase() === 'jsonp';
        var serialize = xhrOptions.serialize = isJSONP ? identity : xhrOptions.serialize || JSON.stringify;
        var deserialize = xhrOptions.deserialize = isJSONP ? identity : xhrOptions.deserialize || JSON.parse;
        var extract = xhrOptions.extract || function (xhr) {
            return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText;
        };
        xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data);
        xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize);
        xhrOptions.onload = xhrOptions.onerror = function (e) {
            if (Number('3') >= 3)
                console.log('onerror' + '()', xhrOptions.onerror.arguments);
            try {
                e = e || event;
                var unwrap = (e.type === 'load' ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity;
                var response = unwrap(deserialize(extract(e.target, xhrOptions)));
                if (e.type === 'load') {
                    if (type.call(response) === ARRAY && xhrOptions.type) {
                        for (var i = 0; i < response.length; i++)
                            response[i] = new xhrOptions.type(response[i]);
                    } else if (xhrOptions.type)
                        response = new xhrOptions.type(response);
                }
                deferred[e.type === 'load' ? 'resolve' : 'reject'](response);
            } catch (e$2) {
                m$3.deferred.onerror(e$2);
                deferred.reject(e$2);
            }
            if (xhrOptions.background !== true)
                m$3.endComputation();
        };
        ajax(xhrOptions);
        deferred.promise(xhrOptions.initialValue);
        return deferred.promise;
        ;
        if (Number('3') >= 1)
            console.timeEnd('REQUEST');
    };
    //testing API
    m$3.deps = function (mock) {
        if (Number('3') >= 3)
            console.log('deps' + '()', //testing API
            m$3.deps.arguments);
        initialize(window$2 = mock || window$2);
        return window$2;
    };
    //for internal testing only, do not use `m.deps.factory`
    m$3.deps.factory = app;
    return m$3;
}(typeof window != 'undefined' ? window : {});
if (typeof module != 'undefined' && module !== null && module.exports)
    module.exports = m$2;
else if (typeof define === 'function' && define.amd)
    define(function () {
        return m$2;
    });