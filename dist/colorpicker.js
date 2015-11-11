(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Toast UI Colorpicker
 * @version 1.0.0
 */
/* eslint vars-on-top:0, strict:0 */
require('tui-code-snippet');

/** @namespace tui.component */
tui.util.defineNamespace('tui.component.colorpicker', {
    domutil: require('./src/js/core/domutil'),
    domevent: require('./src/js/core/domevent'),
    Collection: require('./src/js/core/collection'),
    View: require('./src/js/core/view'),
    Drag: require('./src/js/core/drag'),

    create: require('./src/js/factory'),
    Palette: require('./src/js/palette'),
    Slider: require('./src/js/slider'),
    colorutil: require('./src/js/colorutil'),
    svgvml: require('./src/js/svgvml')
});


},{"./src/js/colorutil":3,"./src/js/core/collection":4,"./src/js/core/domevent":5,"./src/js/core/domutil":6,"./src/js/core/drag":7,"./src/js/core/view":8,"./src/js/factory":9,"./src/js/palette":11,"./src/js/slider":12,"./src/js/svgvml":13,"tui-code-snippet":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/**
 * @fileoverview Utility methods to manipulate colors
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var hexRX = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;

var colorutil = {
    /**
     * pad left zero characters.
     * @param {number} number number value to pad zero.
     * @param {number} length pad length to want.
     * @returns {string} padded string.
     */
    leadingZero: function(number, length) {
        var zero = '',
            i = 0;

        if ((number + '').length > length) {
            return number + '';
        }

        for (; i < (length - 1); i += 1) {
            zero += '0';
        }

        return (zero + number).slice(length * -1);
    },

    /**
     * Check validate of hex string value is RGB
     * @param {string} str - rgb hex string
     * @returns {boolean} return true when supplied str is valid RGB hex string
     */
    isValidRGB: function(str) {
        return hexRX.test(str);
    },

    /**
     * Convert color hex string to rgb number array
     * @param {string} hexStr - hex string
     * @return {number[]} rgb numbers
     */
    hexToRGB: function(hexStr) {
        var r, g, b;

        if (!colorutil.isValidRGB(hexStr)) {
            return false;
        }

        hexStr = hexStr.substring(1);

        r = parseInt(hexStr.substr(0, 2), 16);
        g = parseInt(hexStr.substr(2, 2), 16);
        b = parseInt(hexStr.substr(4, 2), 16);

        return [r, g, b];
    },

    
    /**
     * Convert rgb number to hex string
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     * @returns {string|boolean} return false when supplied rgb number is not valid. otherwise, converted hex string
     */
    rgbToHEX: function(r, g, b) {
        var hexStr = '#' + 
            colorutil.leadingZero(r.toString(16), 2) + 
            colorutil.leadingZero(g.toString(16), 2) +
            colorutil.leadingZero(b.toString(16), 2);
        
        if (colorutil.isValidRGB(hexStr)) {
            return hexStr;
        }

        return false;
    },

    /**
     * Convert rgb number to HSV value
     * @param {number} r - red
     * @param {number} g - green
     * @param {number} b - blue
     * @return {number[]} hsv value
     */
    rgbToHSV: function(r, g, b) {
        var max, min, h, s, v, d;

        r /= 255;
        g /= 255;
        b /= 255;
        max = Math.max(r, g, b);
        min = Math.min(r, g, b);
        v = max;
        d = max - min;
        s = max === 0 ? 0 : (d / max);

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                // no default
            }
            h /= 6;
        }

        return [
            Math.round(h * 360), 
            Math.round(s * 100),
            Math.round(v * 100)
        ];
    },

    /**
     * Convert HSV number to RGB
     * @param {number} h - hue
     * @param {number} s - saturation
     * @param {number} v - value
     * @returns {number[]} rgb value
     */
    hsvToRGB: function(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t;
        
        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v));
        
        s /= 100;
        v /= 100;
        
        if (s === 0) {
            // Achromatic (grey)
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        
        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            default: r = v; g = p; b = q; break;
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
};

module.exports = colorutil;


},{}],4:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Common collections.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util,
    forEachProp = util.forEachOwnProperties,
    forEachArr = util.forEachArray,
    isFunc = util.isFunction,
    isObj = util.isObject;

var aps = Array.prototype.slice;

/**
 * Common collection.
 *
 * It need function for get model's unique id.
 *
 * if the function is not supplied then it use default function {@link Collection#getItemID}
 * @constructor
 * @param {function} [getItemIDFn] function for get model's id.
 */
function Collection(getItemIDFn) {
    /**
     * @type {object.<string, *>}
     */
    this.items = {};

    /**
     * @type {number}
     */
    this.length = 0;

    if (isFunc(getItemIDFn)) {
        /**
         * @type {function}
         */
        this.getItemID = getItemIDFn;
    }
}

/**********
 * static props
 **********/

/**
 * Combind supplied function filters and condition.
 * @param {...function} filters - function filters
 * @returns {function} combined filter
 */
Collection.and = function(filters) {
    var cnt;

    filters = aps.call(arguments);
    cnt = filters.length;

    return function(item) {
        var i = 0;

        for (; i < cnt; i += 1) {
            if (!filters[i].call(null, item)) {
                return false;
            }
        }
        
        return true;
    };
};

/**
 * Combine multiple function filters with OR clause.
 * @param {...function} filters - function filters
 * @returns {function} combined filter
 */
Collection.or = function(filters) {
    var cnt;

    filters = aps.call(arguments);
    cnt = filters.length;

    return function(item) {
        var i = 1,
            result = filters[0].call(null, item);

        for (; i < cnt; i += 1) {
            result = (result || filters[i].call(null, item));
        }

        return result;
    };
};

/**
 * Merge several collections.
 *
 * You can\'t merge collections different _getEventID functions. Take case of use.
 * @param {...Collection} collections collection arguments to merge
 * @returns {Collection} merged collection.
 */
Collection.merge = function(collections) {    // eslint-disable-line
    var cols = aps.call(arguments),
        newItems = {},
        merged = new Collection(cols[0].getItemID),
        extend = util.extend;

    forEachArr(cols, function(col) {
        extend(newItems, col.items);
    });

    merged.items = newItems;
    merged.length = util.keys(merged.items).length;

    return merged;
};

/**********
 * prototype props
 **********/

/**
 * get model's unique id.
 * @param {object} item model instance.
 * @returns {number} model unique id.
 */
Collection.prototype.getItemID = function(item) {
    return item._id + '';
};

/**
 * add models.
 * @param {...*} item models to add this collection.
 */
Collection.prototype.add = function(item) {
    var id,
        ownItems;

    if (arguments.length > 1) {
        forEachArr(aps.call(arguments), function(o) {
            this.add(o);
        }, this);

        return;
    }

    id = this.getItemID(item);
    ownItems = this.items;

    if (!ownItems[id]) {
        this.length += 1;
    }
    ownItems[id] = item;
};

/**
 * remove models.
 * @param {...(object|string|number)} id model instance or unique id to delete.
 * @returns {array} deleted model list.
 */
Collection.prototype.remove = function(id) {
    var removed = [],
        ownItems,
        itemToRemove;

    if (!this.length) {
        return removed;
    }

    if (arguments.length > 1) {
        removed = util.map(aps.call(arguments), function(id) {
            return this.remove(id);
        }, this);

        return removed;
    }

    ownItems = this.items;

    if (isObj(id)) {
        id = this.getItemID(id);
    }

    if (!ownItems[id]) {
        return removed;
    }

    this.length -= 1;
    itemToRemove = ownItems[id];
    delete ownItems[id];

    return itemToRemove;
};

/**
 * remove all models in collection.
 */
Collection.prototype.clear = function() {
    this.items = {};
    this.length = 0;
};

/**
 * check collection has specific model.
 * @param {(object|string|number|function)} id model instance or id or filter function to check
 * @returns {boolean} is has model?
 */
Collection.prototype.has = function(id) {
    var isFilter,
        has;

    if (!this.length) {
        return false;
    }

    isFilter = isFunc(id);
    has = false;

    if (isFilter) {
        this.each(function(item) {
            if (id(item) === true) {
                has = true;
                return false;
            }
        });
    } else {
        id = isObj(id) ? this.getItemID(id) : id;
        has = util.isExisty(this.items[id]);
    }

    return has;
};

/**
 * invoke callback when model exist in collection.
 * @param {(string|number)} id model unique id.
 * @param {function} fn the callback.
 * @param {*} [context] callback context.
 */
Collection.prototype.doWhenHas = function(id, fn, context) {
    var item = this.items[id];

    if (!util.isExisty(item)) {
        return;
    }

    fn.call(context || this, item);
};

/**
 * Search model. and return new collection.
 * @param {function} filter filter function.
 * @returns {Collection} new collection with filtered models.
 * @example
 * collection.find(function(item) {
 *     return item.edited === true;
 * });
 *
 * function filter1(item) {
 *     return item.edited === false;
 * }
 *
 * function filter2(item) {
 *     return item.disabled === false;
 * }
 *
 * collection.find(Collection.and(filter1, filter2));
 *
 * collection.find(Collection.or(filter1, filter2));
 */
Collection.prototype.find = function(filter) {
    var result = new Collection();

    if (this.hasOwnProperty('getItemID')) {
        result.getItemID = this.getItemID;
    }

    this.each(function(item) {
        if (filter(item) === true) {
            result.add(item);
        }
    });

    return result;
};

/**
 * Group element by specific key values.
 *
 * if key parameter is function then invoke it and use returned value.
 * @param {(string|number|function|array)} key key property or getter function. if string[] supplied, create each collection before grouping.
 * @param {function} [groupFunc] - function that return each group's key
 * @returns {object.<string, Collection>} grouped object
 * @example
 * 
 * // pass `string`, `number`, `boolean` type value then group by property value.
 * collection.groupBy('gender');    // group by 'gender' property value.
 * collection.groupBy(50);          // group by '50' property value.
 * 
 * // pass `function` then group by return value. each invocation `function` is called with `(item)`.
 * collection.groupBy(function(item) {
 *     if (item.score > 60) {
 *         return 'pass';
 *     }
 *     return 'fail';
 * });
 *
 * // pass `array` with first arguments then create each collection before grouping.
 * collection.groupBy(['go', 'ruby', 'javascript']);
 * // result: { 'go': empty Collection, 'ruby': empty Collection, 'javascript': empty Collection }
 *
 * // can pass `function` with `array` then group each elements.
 * collection.groupBy(['go', 'ruby', 'javascript'], function(item) {
 *     if (item.isFast) {
 *         return 'go';
 *     }
 *
 *     return item.name;
 * });
 */
Collection.prototype.groupBy = function(key, groupFunc) {
    var result = {},
        collection,
        baseValue,
        isFunc = util.isFunction,
        keyIsFunc = isFunc(key),
        getItemIDFn = this.getItemID;

    if (util.isArray(key)) {
        util.forEachArray(key, function(k) {
            result[k + ''] = new Collection(getItemIDFn);
        });

        if (!groupFunc) {
            return result;
        }

        key = groupFunc;
        keyIsFunc = true;
    }

    this.each(function(item) {
        if (keyIsFunc) {
            baseValue = key(item);
        } else {
            baseValue = item[key];

            if (isFunc(baseValue)) {
                baseValue = baseValue.apply(item);
            }
        }

        collection = result[baseValue];

        if (!collection) {
            collection = result[baseValue] = new Collection(getItemIDFn);
        }

        collection.add(item);
    });

    return result;
};

/**
 * Return single item in collection.
 *
 * Returned item is inserted in this collection firstly.
 * @returns {object} item.
 */
Collection.prototype.single = function() {
    var result;

    this.each(function(item) {
        result = item;
        return false;
    }, this);

    return result;
};

/**
 * sort a basis of supplied compare function.
 * @param {function} compareFunction compareFunction
 * @returns {array} sorted array.
 */
Collection.prototype.sort = function(compareFunction) {
    var arr = [];

    this.each(function(item) {
        arr.push(item);
    });

    if (isFunc(compareFunction)) {
        arr = arr.sort(compareFunction);
    }

    return arr;
};

/**
 * iterate each model element.
 *
 * when iteratee return false then break the loop.
 * @param {function} iteratee iteratee(item, index, items)
 * @param {*} [context] context
 */
Collection.prototype.each = function(iteratee, context) {
    forEachProp(this.items, iteratee, context || this);
};

/**
 * return new array with collection items.
 * @returns {array} new array.
 */
Collection.prototype.toArray = function() {
    if (!this.length) {
        return [];
    }

    return util.map(this.items, function(item) {
        return item;
    });
};

module.exports = Collection;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Utility module for handling DOM events.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util,
    browser = util.browser,
    eventKey = '_evt',
    DRAG = {
        START: ['touchstart', 'mousedown'],
        END: {
            mousedown: 'mouseup',
            touchstart: 'touchend',
            pointerdown: 'touchend',
            MSPointerDown: 'touchend'
        },
        MOVE: {
            mousedown: 'mousemove',
            touchstart: 'touchmove',
            pointerdown: 'touchmove',
            MSPointerDown: 'touchmove'
        }
    };

var domevent = {
    /**
     * Bind dom events.
     * @param {HTMLElement} obj HTMLElement to bind events.
     * @param {(string|object)} types Space splitted events names or eventName:handler object.
     * @param {*} fn handler function or context for handler method.
     * @param {*} [context] context object for handler method.
     */
    on: function(obj, types, fn, context) {
        if (util.isString(types)) {
            util.forEach(types.split(' '), function(type) {
                domevent._on(obj, type, fn, context);
            });

            return;
        }

        util.forEachOwnProperties(types, function(handler, type) {
            domevent._on(obj, type, handler, fn);
        });
    },

    /**
     * DOM event binding.
     * @param {HTMLElement} obj HTMLElement to bind events.
     * @param {String} type The name of events.
     * @param {*} fn handler function
     * @param {*} [context] context object for handler method.
     * @private
     */
    _on: function(obj, type, fn, context) {
        var id,
            handler,
            originHandler;

        id = type + util.stamp(fn) + (context ? '_' + util.stamp(context) : '');

        if (obj[eventKey] && obj[eventKey][id]) {
            return;
        }

        handler = function(e) {
            fn.call(context || obj, e || window.event);
        };

        originHandler = handler;

        if ('addEventListener' in obj) {
            if (type === 'mouseenter' || type === 'mouseleave') {
                handler = function(e) {
                    e = e || window.event;
                    if (!domevent._checkMouse(obj, e)) {
                        return;
                    }
                    originHandler(e);
                };
                obj.addEventListener((type === 'mouseenter') ?
                    'mouseover' : 'mouseout', handler, false);
            } else {
                if (type === 'mousewheel') {
                    obj.addEventListener('DOMMouseScroll', handler, false);
                }

                obj.addEventListener(type, handler, false);
            }
        } else if ('attachEvent' in obj) {
            obj.attachEvent('on' + type, handler);
        }

        obj[eventKey] = obj[eventKey] || {};
        obj[eventKey][id] = handler;
    },

    /**
     * Unbind DOM Event handler.
     * @param {HTMLElement} obj HTMLElement to unbind.
     * @param {(string|object)} types Space splitted events names or eventName:handler object.
     * @param {*} fn handler function or context for handler method.
     * @param {*} [context] context object for handler method.
     */
    off: function(obj, types, fn, context) {
        if (util.isString(types)) {
            util.forEach(types.split(' '), function(type) {
                domevent._off(obj, type, fn, context);
            });

            return;
        }

        util.forEachOwnProperties(types, function(handler, type) {
            domevent._off(obj, type, handler, fn);
        });
    },

    /**
     * Unbind DOM event handler.
     * @param {HTMLElement} obj HTMLElement to unbind.
     * @param {String} type The name of event to unbind.
     * @param {function()} fn Event handler that supplied when binding.
     * @param {*} context context object that supplied when binding.
     * @private
     */
    _off: function(obj, type, fn, context) {
        var id = type + util.stamp(fn) + (context ? '_' + util.stamp(context) : ''),
            handler = obj[eventKey] && obj[eventKey][id];

        if (!handler) {
            return;
        }

        if ('removeEventListener' in obj) {
            if (type === 'mouseenter' || type === 'mouseleave') {
                obj.removeEventListener((type === 'mouseenter') ?
                    'mouseover' : 'mouseout', handler, false);
            } else {
                if (type === 'mousewheel') {
                    obj.removeEventListener('DOMMouseScroll', handler, false);
                }

                obj.removeEventListener(type, handler, false);
            }
        } else if ('detachEvent' in obj) {
            try {
                obj.detachEvent('on' + type, handler);
            } catch (e) {}    //eslint-disable-line
        }

        delete obj[eventKey][id];

        if (util.keys(obj[eventKey]).length) {
            return;
        }

        // throw exception when deleting host object's property in below IE8
        if (util.browser.msie && util.browser.version < 9) {
            obj[eventKey] = null;
            return;
        }

        delete obj[eventKey];
    },

    /**
     * Bind DOM event. this event will unbind after invokes.
     * @param {HTMLElement} obj HTMLElement to bind events.
     * @param {(string|object)} types Space splitted events names or eventName:handler object.
     * @param {*} fn handler function or context for handler method.
     * @param {*} [context] context object for handler method.
     */
    once: function(obj, types, fn, context) {
        var that = this;

        if (util.isObject(types)) {
            util.forEachOwnProperties(types, function(handler, type) {
                domevent.once(obj, type, handler, fn);
            });
            return;
        }

        function onceHandler() {
            fn.apply(context || obj, arguments);
            that._off(obj, types, onceHandler, context);
        }

        domevent.on(obj, types, onceHandler, context);
    },

    /**
     * Cancel event bubbling.
     * @param {Event} e Event object.
     */
    stopPropagation: function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },

    /**
     * Cancel browser default actions.
     * @param {Event} e Event object.
     */
    preventDefault: function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },

    /**
     * Syntatic sugar of stopPropagation and preventDefault
     * @param {Event} e Event object.
     */
    stop: function(e) {
        domevent.preventDefault(e);
        domevent.stopPropagation(e);
    },

    /**
     * Stop scroll events.
     * @param {HTMLElement} el HTML element to prevent scroll.
     */
    disableScrollPropagation: function(el) {
        domevent.on(el, 'mousewheel MozMousePixelScroll', domevent.stopPropagation);
    },

    /**
     * Stop all events related with click.
     * @param {HTMLElement} el HTML element to prevent all event related with click.
     */
    disableClickPropagation: function(el) {
        domevent.on(el, DRAG.START.join(' ') + ' click dblclick', domevent.stopPropagation);
    },

    /**
     * Get mouse position from mouse event.
     *
     * If supplied relatveElement parameter then return relative position based on element.
     * @param {Event} mouseEvent Mouse event object
     * @param {HTMLElement} relativeElement HTML element that calculate relative position.
     * @returns {number[]} mouse position.
     */
    getMousePosition: function(mouseEvent, relativeElement) {
        var rect;

        if (!relativeElement) {
            return [mouseEvent.clientX, mouseEvent.clientY];
        }

        rect = relativeElement.getBoundingClientRect();

        return [
            mouseEvent.clientX - rect.left - relativeElement.clientLeft,
            mouseEvent.clientY - rect.top - relativeElement.clientTop
        ];
    },

    /**
     * Normalize mouse wheel event that different each browsers.
     * @param {MouseEvent} e Mouse wheel event.
     * @returns {Number} delta
     */
    getWheelDelta: function(e) {
        var delta = 0;

        if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
        }

        if (e.detail) {
            delta = -e.detail / 3;
        }

        return delta;
    },

    /**
     * prevent firing mouseleave event when mouse entered child elements.
     * @param {HTMLElement} el HTML element
     * @param {MouseEvent} e Mouse event
     * @returns {Boolean} leave?
     * @private
     */
    _checkMouse: function(el, e) {
        var related = e.relatedTarget;

        if (!related) {
            return true;
        }

        try {
            while (related && (related !== el)) {
                related = related.parentNode;
            }
        } catch (err) {
            return false;
        }

        return (related !== el);
    },

    /**
     * Trigger specific events to html element.
     * @param {HTMLElement} obj HTMLElement
     * @param {string} type Event type name
     * @param {object} [eventData] Event data
     */
    trigger: function(obj, type, eventData) {
        var rMouseEvent = /(mouse|click)/;
        if (util.isUndefined(eventData) && rMouseEvent.exec(type)) {
            eventData = domevent.mouseEvent(type);
        }

        if (obj.dispatchEvent) {
            obj.dispatchEvent(eventData);
        } else if (obj.fireEvent) {
            obj.fireEvent('on' + type, eventData);
        }
    },

    /**
     * Create virtual mouse event.
     *
     * Tested at
     *
     * - IE7 ~ IE11
     * - Chrome
     * - Firefox
     * - Safari
     * @param {string} type Event type
     * @param {object} [eventObj] Event data
     * @returns {MouseEvent} Virtual mouse event.
     */
    mouseEvent: function(type, eventObj) {
        var evt,
            e;

        e = util.extend({
            bubbles: true,
            cancelable: (type !== 'mousemove'),
            view: window,
            wheelDelta: 0,
            detail: 0,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            relatedTarget: undefined  // eslint-disable-line
        }, eventObj);

        // prevent throw error when inserting wheelDelta property to mouse event on below IE8
        if (browser.msie && browser.version < 9) {
            delete e.wheelDelta;
        }

        if (typeof document.createEvent === 'function') {
            evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(type,
                e.bubbles, e.cancelable, e.view, e.detail,
                e.screenX, e.screenY, e.clientX, e.clientY,
                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                e.button, document.body.parentNode
            );
        } else if (document.createEventObject) {
            evt = document.createEventObject();

            util.forEach(e, function(value, propName) {
                evt[propName] = value;
            }, this);
            evt.button = {0: 1, 1: 4, 2: 2}[evt.button] || evt.button;
        }
        return evt;
    },

    /**
     * Normalize mouse event's button attributes.
     *
     * Can detect which button is clicked by this method.
     *
     * Meaning of return numbers
     *
     * - 0: primary mouse button
     * - 1: wheel button or center button
     * - 2: secondary mouse button
     * @param {MouseEvent} mouseEvent - The mouse event object want to know.
     * @returns {number} - The value of meaning which button is clicked?
     */
    getMouseButton: function(mouseEvent) {
        var button,
            primary = '0,1,3,5,7',
            secondary = '2,6',
            wheel = '4';

        /* istanbul ignore else */
        if (document.implementation.hasFeature('MouseEvents', '2.0')) {
            return mouseEvent.button;
        }

        button = mouseEvent.button + '';
        if (~primary.indexOf(button)) {
            return 0;
        } else if (~secondary.indexOf(button)) {
            return 2;
        } else if (~wheel.indexOf(button)) {
            return 1;
        }
    }
};

module.exports = domevent;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Utility modules for manipulate DOM elements.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var domevent = require('./domevent');
var Collection = require('./collection');

var util = global.tui.util,
    posKey = '_pos',
    domutil;

var CSS_AUTO_REGEX = /^auto$|^$|%/;

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

domutil = {
    /**
     * Create DOM element and return it.
     * @param {string} tagName Tag name to append.
     * @param {HTMLElement} [container] HTML element will be parent to created element.
     * if not supplied, will use **document.body**
     * @param {string} [className] Design class names to appling created element.
     * @returns {HTMLElement} HTML element created.
     */
    appendHTMLElement: function(tagName, container, className) {
        var el;

        className = className || '';

        el = document.createElement(tagName);
        el.className = className;

        if (container) {
            container.appendChild(el);
        } else {
            document.body.appendChild(el);
        }

        return el;
    },

    /**
     * Remove element from parent node.
     * @param {HTMLElement} el - element to remove.
     */
    remove: function(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    },

    /**
     * Get element by id
     * @param {string} id element id attribute
     * @returns {HTMLElement} element
     */
    get: function(id) {
        return document.getElementById(id);
    },

    /**
     * Check supplied element is matched selector.
     * @param {HTMLElement} el - element to check
     * @param {string} selector - selector string to check
     * @return {boolean} match?
     */
    _matcher: function(el, selector) {
        var cssClassSelector = /^\./,
            idSelector = /^#/;

        if (cssClassSelector.test(selector)) {
            return domutil.hasClass(el, selector.replace('.', ''));
        } else if (idSelector.test(selector)) {
            return el.id === selector.replace('#', '');
        }

        return el.nodeName.toLowerCase() === selector.toLowerCase();
    },

    /**
     * Find DOM element by specific selectors.
     * below three selector only supported.
     *
     * 1. css selector
     * 2. id selector
     * 3. nodeName selector
     * @param {string} selector selector
     * @param {(HTMLElement|string)} [root] You can assign root element to find. if not supplied, document.body will use.
     * @param {boolean|function} [multiple=false] - set true then return all elements that meet condition, if set function then use it filter function.
     * @returns {HTMLElement} HTML element finded.
     */
    find: function(selector, root, multiple) {
        var result = [],
            found = false,
            isFirst = util.isUndefined(multiple) || multiple === false,
            isFilter = util.isFunction(multiple);

        if (util.isString(root)) {
            root = domutil.get(root);
        }
        
        root = root || window.document.body;

        function recurse(el, selector) {
            var childNodes = el.childNodes,
                i = 0,
                len = childNodes.length,
                cursor;

            for (; i < len; i += 1) {
                cursor = childNodes[i];

                if (cursor.nodeName === '#text') {
                    continue;
                }

                if (domutil._matcher(cursor, selector)) {
                    if ((isFilter && multiple(cursor)) || !isFilter) {
                        result.push(cursor);
                    }

                    if (isFirst) {
                        found = true;
                        break;
                    }
                } else if (cursor.childNodes.length > 0) {
                    recurse(cursor, selector);
                    if (found) {
                        break;
                    }
                }
            }
        }

        recurse(root, selector);

        return isFirst ? (result[0] || null) : result;
    },

    /**
     * Find parent element recursively.
     * @param {HTMLElement} el - base element to start find.
     * @param {string} selector - selector string for find
     * @returns {HTMLElement} - element finded or undefined.
     */
    closest: function(el, selector) {
        var parent = el.parentNode;

        if (domutil._matcher(el, selector)) {
            return el;
        }

        while (parent && parent !== window.document.body) {
            if (domutil._matcher(parent, selector)) {
                return parent;
            }

            parent = parent.parentNode;
        }
    },

    /**
     * Return texts inside element.
     * @param {HTMLElement} el target element
     * @return {string} text inside node
     */
    text: function(el) {
        var ret = '',
            i = 0,
            nodeType = el.nodeType;

        if (nodeType) {
            if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // nodes that available contain other nodes
                if (typeof el.textContent === 'string') {
                    return el.textContent;
                }

                for (el = el.firstChild; el; el = el.nextSibling) {
                    ret += domutil.text(el);
                }
            } else if (nodeType === 3 || nodeType === 4) {
                // TEXT, CDATA SECTION
                return el.nodeValue;
            }
        } else {
            for (; el[i]; i += 1) {
                ret += domutil.text(el[i]);
            }
        }
        return ret;
    },

    /**
     * Set data attribute to target element
     * @param {HTMLElement} el - element to set data attribute
     * @param {string} key - key
     * @param {string|number} data - data value
     */
    setData: function(el, key, data) {
        if ('dataset' in el) {
            el.dataset[key] = data;
            return;
        }

        el.setAttribute('data-' + key, data);
    },

    /**
     * Get data value from data-attribute
     * @param {HTMLElement} el - target element
     * @param {string} key - key
     * @returns {string} value
     */
    getData: function(el, key) {
        if ('dataset' in el) {
            return el.dataset[key];
        }

        return el.getAttribute('data-' + key);
    },

    /**
     * Check element has specific design class name.
     * @param {HTMLElement} el target element
     * @param {string} name css class
     * @returns {boolean} return true when element has that css class name
     */
    hasClass: function(el, name) {
        var className;

        if (!util.isUndefined(el.classList)) {
            return el.classList.contains(name);
        }

        className = domutil.getClass(el);

        return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
    },

    /**
     * Add design class to HTML element.
     * @param {HTMLElement} el target element
     * @param {string} name css class name
     */
    addClass: function(el, name) {
        var className;

        if (!util.isUndefined(el.classList)) {
            util.forEachArray(name.split(' '), function(value) {
                el.classList.add(value);
            });
        } else if (!domutil.hasClass(el, name)) {
            className = domutil.getClass(el);
            domutil.setClass(el, (className ? className + ' ' : '') + name);
        }
    },

    /**
     *
     * Overwrite design class to HTML element.
     * @param {HTMLElement} el target element
     * @param {string} name css class name
     */
    setClass: function(el, name) {
        if (util.isUndefined(el.className.baseVal)) {
            el.className = name;
        } else {
            el.className.baseVal = name;
        }
    },

    /**
     * Element에 cssClass속성을 제거하는 메서드
     * Remove specific design class from HTML element.
     * @param {HTMLElement} el target element
     * @param {string} name class name to remove
     */
    removeClass: function(el, name) {
        var removed = '';

        if (!util.isUndefined(el.classList)) {
            el.classList.remove(name);
        } else {
            removed = (' ' + domutil.getClass(el) + ' ').replace(' ' + name + ' ', ' ');
            domutil.setClass(el, trim(removed));
        }
    },

    /**
     * Get HTML element's design classes.
     * @param {HTMLElement} el target element
     * @returns {string} element css class name
     */
    getClass: function(el) {
        if (!el || !el.className) {
            return '';
        }

        return util.isUndefined(el.className.baseVal) ? el.className : el.className.baseVal;
    },

    /**
     * Get specific CSS style value from HTML element.
     * @param {HTMLElement} el target element
     * @param {string} style css attribute name
     * @returns {(string|null)} css style value
     */
    getStyle: function(el, style) {
        var value = el.style[style] || (el.currentStyle && el.currentStyle[style]),
            css;

        if ((!value || value === 'auto') && document.defaultView) {
            css = document.defaultView.getComputedStyle(el, null);
            value = css ? css[style] : null;
        }

        return value === 'auto' ? null : value;
    },

    /**
     * get element's computed style values.
     *
     * in lower IE8. use polyfill function that return object. it has only one function 'getPropertyValue'
     * @param {HTMLElement} el - element want to get style.
     * @returns {object} virtual CSSStyleDeclaration object.
     */
    getComputedStyle: function(el) {
        var defaultView = document.defaultView;

        if (!defaultView || !defaultView.getComputedStyle) {
            return {
                getPropertyValue: function(prop) {
                    var re = /(\-([a-z]){1})/g;
                    if (prop === 'float') {
                        prop = 'styleFloat';
                    }

                    if (re.test(prop)) {
                        prop = prop.replace(re, function () {
                            return arguments[2].toUpperCase();
                        });
                    }

                    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                }
            };
        }

        return document.defaultView.getComputedStyle(el);
    },

    /**
     * Set position CSS style.
     * @param {HTMLElement} el target element
     * @param {number} [x=0] left pixel value.
     * @param {number} [y=0] top pixel value.
     */
    setPosition: function(el, x, y) {
        x = util.isUndefined(x) ? 0 : x;
        y = util.isUndefined(y) ? 0 : y;

        el[posKey] = [x, y];

        el.style.left = x + 'px';
        el.style.top = y + 'px';
    },

    /**
     * Get position from HTML element.
     * @param {HTMLElement} el target element
     * @param {boolean} [clear=false] clear cache before calculating position.
     * @returns {number[]} point
     */
    getPosition: function(el, clear) {
        var left,
            top,
            bound;

        if (clear) {
            el[posKey] = null;
        }

        if (el[posKey]) {
            return el[posKey];
        }

        left = 0;
        top = 0;

        if ((CSS_AUTO_REGEX.test(el.style.left) || CSS_AUTO_REGEX.test(el.style.top)) &&
            'getBoundingClientRect' in el) {
            // 엘리먼트의 left또는 top이 'auto'일 때 수단
            bound = el.getBoundingClientRect();

            left = bound.left;
            top = bound.top;
        } else {
            left = parseFloat(el.style.left || 0);
            top = parseFloat(el.style.top || 0);
        }

        return [left, top];
    },

    /**
     * Return element's size
     * @param {HTMLElement} el target element
     * @return {number[]} width, height
     */
    getSize: function(el) {
        var bound,
            width = domutil.getStyle(el, 'width'),
            height = domutil.getStyle(el, 'height');

        if ((CSS_AUTO_REGEX.test(width) || CSS_AUTO_REGEX.test(height)) &&
            'getBoundingClientRect' in el) {
            bound = el.getBoundingClientRect();
            width = bound.width;
            height = bound.height;
        } else {
            width = parseFloat(width || 0);
            height = parseFloat(height || 0);
        }

        return [width, height];
    },

    /**
     * Check specific CSS style is available.
     * @param {array} props property name to testing
     * @return {(string|boolean)} return true when property is available
     * @example
     * var props = ['transform', '-webkit-transform'];
     * domutil.testProp(props);    // 'transform'
     */
    testProp: function(props) {
        var style = document.documentElement.style,
            i = 0,
            len = props.length;

        for (; i < len; i += 1) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    },

    /**
     * Get form data
     * @param {HTMLFormElement} formElement - form element to extract data
     * @returns {object} form data
     */
    getFormData: function(formElement) {
        var groupedByName = new Collection(function() { return this.length; }),
            noDisabledFilter = function(el) { return !el.disabled; },
            output = {};
            
        groupedByName.add.apply(
            groupedByName, 
            domutil.find('input', formElement, noDisabledFilter)
                .concat(domutil.find('select', formElement, noDisabledFilter))
                .concat(domutil.find('textarea', formElement, noDisabledFilter))
        );

        groupedByName = groupedByName.groupBy(function(el) {
            return el && el.getAttribute('name') || '_other';
        });

        util.forEach(groupedByName, function(elements, name) {
            if (name === '_other') {
                return;
            }

            elements.each(function(el) {
                var nodeName = el.nodeName.toLowerCase(),
                    type = el.type,
                    result = [];

                if (type === 'radio') {
                    result = [elements.find(function(el) { return el.checked; }).toArray().pop()];
                } else if (type === 'checkbox') {
                    result = elements.find(function(el) { return el.checked; }).toArray();
                } else if (nodeName === 'select') {
                    elements.find(function(el) { return !!el.childNodes.length; })
                        .each(function(el) {
                            result = result.concat(domutil.find('option', el, function(opt) {
                                return opt.selected;
                            }));
                        });
                } else {
                    result = elements.find(function(el) { return el.value !== ''; }).toArray();
                }

                result = util.map(result, function(el) { return el.value; });

                if (!result.length) {
                    result = '';
                } else if (result.length === 1) {
                    result = result[0];
                }

                output[name] = result;
            });
        });

        return output;
    }
};

/*eslint-disable*/
var userSelectProperty = domutil.testProp([
    'userSelect', 
    'WebkitUserSelect', 
    'OUserSelect', 
    'MozUserSelect', 
    'msUserSelect'
]);
var supportSelectStart = 'onselectstart' in document;
var prevSelectStyle = '';
/*eslint-enable*/

/**
 * Disable browser's text selection behaviors.
 * @method
 */
domutil.disableTextSelection = (function() {
    if (supportSelectStart) {
        return function() {
            domevent.on(window, 'selectstart', domevent.preventDefault);
        };
    }

    return function() {
        var style = document.documentElement.style;
        prevSelectStyle = style[userSelectProperty];
        style[userSelectProperty] = 'none';
    };
})();

/**
 * Enable browser's text selection behaviors.
 * @method
 */
domutil.enableTextSelection = (function() {
    if (supportSelectStart) {
        return function() {
            domevent.off(window, 'selectstart', domevent.preventDefault);
        };
    }

    return function() {
        document.documentElement.style[userSelectProperty] = prevSelectStyle;
    };
})();

/**
 * Disable browser's image drag behaviors.
 */
domutil.disableImageDrag = function() {
    domevent.on(window, 'dragstart', domevent.preventDefault);
};

/**
 * Enable browser's image drag behaviors.
 */
domutil.enableImageDrag = function() {
    domevent.off(window, 'dragstart', domevent.preventDefault);
};

module.exports = domutil;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection":4,"./domevent":5}],7:[function(require,module,exports){
(function (global){
/**
 * @fileoverview General drag handler
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./domutil');
var domevent = require('./domevent');

/**
 * @constructor
 * @mixes CustomEvents
 * @param {object} options - options for drag handler
 * @param {number} [options.distance=10] - distance in pixels after mouse must move before dragging should start
 * @param {HTMLElement} container - container element to bind drag events
 */
function Drag(options, container) {
    domevent.on(container, 'mousedown', this._onMouseDown, this);

    this.options = util.extend({
        distance: 10
    }, options);

    /**
     * @type {HTMLElement}
     */
    this.container = container;

    /**
     * @type {boolean}
     */
    this._isMoved = false;

    /**
     * dragging distance in pixel between mousedown and firing dragStart events
     * @type {number}
     */
    this._distance = 0;

    /**
     * @type {boolean}
     */
    this._dragStartFired = false;

    /**
     * @type {object}
     */
    this._dragStartEventData = null;
}

/**
 * Destroy method.
 */
Drag.prototype.destroy = function() {
    domevent.off(this.container, 'mousedown', this._onMouseDown, this);

    this.options = this.container = this._isMoved = this._distance =
        this._dragStartFired = this._dragStartEventData = null;
};

/**
 * Toggle events for mouse dragging.
 * @param {boolean} toBind - bind events related with dragging when supplied "true"
 */
Drag.prototype._toggleDragEvent = function(toBind) {
    var container = this.container,
        domMethod,
        method;

    if (toBind) {
        domMethod = 'on';
        method = 'disable';
    } else {
        domMethod = 'off';
        method = 'enable';
    }

    domutil[method + 'TextSelection'](container);
    domutil[method + 'ImageDrag'](container);
    domevent[domMethod](global.document, {
        mousemove: this._onMouseMove,
        mouseup: this._onMouseUp
    }, this);
};

/**
 * Normalize mouse event object.
 * @param {MouseEvent} mouseEvent - mouse event object.
 * @returns {object} normalized mouse event data.
 */
Drag.prototype._getEventData = function(mouseEvent) {
    return {
        target: mouseEvent.target || mouseEvent.srcElement,
        originEvent: mouseEvent
    };
};

/**
 * MouseDown DOM event handler.
 * @param {MouseEvent} mouseDownEvent MouseDown event object.
 */
Drag.prototype._onMouseDown = function(mouseDownEvent) {
    // only primary button can start drag.
    if (domevent.getMouseButton(mouseDownEvent) !== 0) {
        return;
    }

    this._distance = 0;
    this._dragStartFired = false;
    this._dragStartEventData = this._getEventData(mouseDownEvent);

    this._toggleDragEvent(true);
};

/**
 * MouseMove DOM event handler.
 * @emits Drag#drag
 * @emits Drag#dragStart
 * @param {MouseEvent} mouseMoveEvent MouseMove event object.
 */
Drag.prototype._onMouseMove = function(mouseMoveEvent) {
    var distance = this.options.distance;
    // prevent automatic scrolling.
    domevent.preventDefault(mouseMoveEvent);

    this._isMoved = true;

    if (this._distance < distance) {
        this._distance += 1;
        return;
    }

    if (!this._dragStartFired) {
        this._dragStartFired = true;

        /**
         * Drag starts events. cancelable.
         * @event Drag#dragStart
         * @type {object}
         * @property {HTMLElement} target - target element in this event.
         * @property {MouseEvent} originEvent - original mouse event object.
         */
        if (!this.invoke('dragStart', this._dragStartEventData)) {
            this._toggleDragEvent(false);
            return;
        }
    }

    /**
     * Events while dragging.
     * @event Drag#drag
     * @type {object}
     * @property {HTMLElement} target - target element in this event.
     * @property {MouseEvent} originEvent - original mouse event object.
     */
    this.fire('drag', this._getEventData(mouseMoveEvent));
};

/**
 * MouseUp DOM event handler.
 * @param {MouseEvent} mouseUpEvent MouseUp event object.
 * @emits Drag#dragEnd
 * @emits Drag#click
 */
Drag.prototype._onMouseUp = function(mouseUpEvent) {
    this._toggleDragEvent(false);

    // emit "click" event when not emitted drag event between mousedown and mouseup.
    if (this._isMoved) {
        this._isMoved = false;

        /**
         * Drag end events.
         * @event Drag#dragEnd
         * @type {MouseEvent}
         * @property {HTMLElement} target - target element in this event.
         * @property {MouseEvent} originEvent - original mouse event object.
         */
        this.fire('dragEnd', this._getEventData(mouseUpEvent));
        return;
    }

    /**
     * Click events.
     * @event Drag#click
     * @type {MouseEvent}
     * @property {HTMLElement} target - target element in this event.
     * @property {MouseEvent} originEvent - original mouse event object.
     */
    this.fire('click', this._getEventData(mouseUpEvent));
};

util.CustomEvents.mixin(Drag);

module.exports = Drag;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./domevent":5,"./domutil":6}],8:[function(require,module,exports){
(function (global){
/**
 * @fileoverview The base class of views.
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./domutil');
var Collection = require('./collection');

/**
 * Base class of views.
 *
 * All views create own container element inside supplied container element.
 * @constructor
 * @param {options} options The object for describe view's specs.
 * @param {HTMLElement} container Default container element for view. you can use this element for this.container syntax.
 */
function View(options, container) {
    var id = util.stamp(this);

    options = options || {};

    if (util.isUndefined(container)) {
        container = domutil.appendHTMLElement('div');
    }

    domutil.addClass(container, 'tui-view-' + id);

    /**
     * unique id
     * @type {number}
     */
    this.id = id;

    /**
     * base element of view.
     * @type {HTMLDIVElement}
     */
    this.container = container;

    /*eslint-disable*/
    /**
     * child views.
     * @type {Collection}
     */
    this.childs = new Collection(function(view) {
        return util.stamp(view);
    });
    /*eslint-enable*/

    /**
     * parent view instance.
     * @type {View}
     */
    this.parent = null;
}

/**
 * Add child views.
 * @param {View} view The view instance to add.
 * @param {function} [fn] Function for invoke before add. parent view class is supplied first arguments.
 */
View.prototype.addChild = function(view, fn) {
    if (fn) {
        fn.call(view, this);
    }
    // add parent view
    view.parent = this;

    this.childs.add(view);
};

/**
 * Remove added child view.
 * @param {(number|View)} id View id or instance itself to remove.
 * @param {function} [fn] Function for invoke before remove. parent view class is supplied first arguments.
 */
View.prototype.removeChild = function(id, fn) {
    var view = util.isNumber(id) ? this.childs.items[id] : id;

    id = util.stamp(view);

    if (fn) {
        fn.call(view, this);
    }

    this.childs.remove(id);
};

/**
 * Render view recursively.
 */
View.prototype.render = function() {
    this.childs.each(function(childView) {
        childView.render();
    });
};

/**
 * Invoke function recursively.
 * @param {function} fn - function to invoke child view recursively
 * @param {boolean} [skipThis=false] - set true then skip invoke with this(root) view.
 */
View.prototype.recursive = function(fn, skipThis) {
    if (!util.isFunction(fn)) {
        return;
    }

    if (!skipThis) {
        fn(this);
    }

    this.childs.each(function(childView) {
        childView.recursive(fn);
    });
};

/**
 * Resize view recursively to parent.
 */
View.prototype.resize = function() {
    var args = Array.prototype.slice.call(arguments),
        parent = this.parent;

    while (parent) {
        if (util.isFunction(parent._onResize)) {
            parent._onResize.apply(parent, args);
        }

        parent = parent.parent;
    }
};

/**
 * Invoking method before destroying.
 */
View.prototype._beforeDestroy = function() {};

/**
 * Clear properties
 */
View.prototype._destroy = function() {
    this._beforeDestroy();
    this.childs.clear();
    this.container.innerHTML = '';

    this.id = this.parent = this.childs = this.container = null;
};

/*eslint-disable*/
/**
 * Destroy child view recursively.
 */
View.prototype.destroy = function(isChildView) {
    this.childs.each(function(childView) {
        childView.destroy(true);
        childView._destroy();
    });

    if (isChildView) {
        return;
    }

    this._destroy();
};
/*eslint-enable*/

/**
 * Calculate view's container element bound.
 * @returns {object} The bound of container element.
 */
View.prototype.getViewBound = function() {
    var container = this.container,
        position = domutil.getPosition(container),
        size = domutil.getSize(container);

    return {
        x: position[0],
        y: position[1],
        width: size[0],
        height: size[1]
    };
};

module.exports = View;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./collection":4,"./domutil":6}],9:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Colorpicker factory module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var colorutil = require('./colorutil');
var Layout = require('./layout');
var Palette = require('./palette');
var Slider = require('./slider');

function throwError(msg) {
    alert(msg);
}

/**
 * @constructor
 * @mixes CustomEvents
 * @param {object} options - options for colorpicker component
 *  @param {HTMLDivElement} options.container - container element
 *  @param {string} [options.color='#ffffff'] - default selected color
 *  @param {string[]} [options.preset] - color preset for palette (use base16 palette if not supplied)
 *  @param {string} [options.cssPrefix='tui-colorpicker-'] - css prefix text for each child elements
 *  @param {string} [options.detailTxt='Detail'] - text for detail button.
 * @example
 * var colorpicker = tui.component.colorpicker({
 *   container: document.getElementById('colorpicker')
 * });
 *
 * colorpicker.getColor();    // '#ffffff'
 */
function Colorpicker(options) {
    var layout;

    if (!(this instanceof Colorpicker)) {
        return new Colorpicker(options);
    }
    /**
     * Option object
     * @type {object}
     */
    options = this.options = util.extend({
        container: null,
        color: '#f8f8f8',
        preset: [
            '#181818',
            '#282828',
            '#383838',
            '#585858',
            '#b8b8b8',
            '#d8d8d8',
            '#e8e8e8',
            '#f8f8f8',
            '#ab4642',
            '#dc9656',
            '#f7ca88',
            '#a1b56c',
            '#86c1b9',
            '#7cafc2',
            '#ba8baf',
            '#a16946'
        ],
        cssPrefix: 'tui-colorpicker-',
        detailTxt: 'Detail'
    }, options);

    if (!options.container) {
        throwError('Colorpicker(): need container option.');
        return;
    }

    /**********
     * Create layout view
     **********/

    /**
     * @type {Layout}
     */
    layout = this.layout = new Layout(options, options.container);

    /**********
     * Create palette view
     **********/
    this.palette = new Palette(options, layout.container);
    this.palette.on({
        '_selectColor': this._onSelectColorInPalette,
        '_toggleSlider': this._onToggleSlider
    }, this);

    /**********
     * Create slider view
     **********/
    this.slider = new Slider(options, layout.container);
    this.slider.on('_selectColor', this._onSelectColorInSlider, this);

    /**********
     * Add child views
     **********/
    layout.addChild(this.palette);
    layout.addChild(this.slider);

    this.render(options.color);
}

/**
 * Handler method for Palette#_selectColor event
 * @private
 * @fires Colorpicker#selectColor
 * @param {object} selectColorEventData - event data
 */
Colorpicker.prototype._onSelectColorInPalette = function(selectColorEventData) {
    var color = selectColorEventData.color,
        opt = this.options;

    if (!colorutil.isValidRGB(color)) {
        this.render();
        return;
    }

    if (opt.color === color) {
        return;
    }

    opt.color = color;
    this.render(color);

    /**
     * @event Colorpicker#selectColor
     * @type {object}
     * @property {string} color - selected color (hex string)
     */
    this.fire('selectColor', {
        color: color
    });
};

/**
 * Handler method for Palette#_toggleSlider event
 * @private
 */
Colorpicker.prototype._onToggleSlider = function() {
    this.slider.toggle(!this.slider.isVisible());
};


/**
 * Handler method for Slider#_selectColor event
 * @private
 * @fires Colorpicker#selectColor
 * @param {object} selectColorEventData - event data
 */
Colorpicker.prototype._onSelectColorInSlider = function(selectColorEventData) {
    var color = selectColorEventData.color,
        opt = this.options;

    if (opt.color === color) {
        return;
    }

    opt.color = color;
    this.palette.render(color);

    /**
     * @event Colorpicker#selectColor
     * @type {object}
     * @property {string} color - selected color (hex string)
     */
    this.fire('selectColor', {
        color: color
    });
};

/**********
 * PUBLIC API
 **********/

/**
 * Set colorpicker current color
 * @param {string} hexStr - hex formatted color string
 */
Colorpicker.prototype.setColor = function(hexStr) {
    if (!colorutil.isValidRGB(hexStr)) {
        throwError('Colorpicker#setColor(): need valid hex string color value');
    }

    this.options.color = hexStr;
    this.render(hexStr);
};

/**
 * Get colorpicker current color
 * @returns {string} hex string formatted color
 */
Colorpicker.prototype.getColor = function() {
    return this.options.color;
};

/**
 * Toggle colorpicker container element
 * @param {boolean} [isShow=true] - true when reveal colorpicker
 */
Colorpicker.prototype.toggle = function(isShow) {
    this.layout.container.style.display = !!isShow ? 'block' : 'none';
};

/**
 * Render colorpicker
 * @param {string} [color] - selected color
 */
Colorpicker.prototype.render = function(color) {
    this.layout.render(color || this.options.color);
};

/**
 * Destroy colorpicker component
 */
Colorpicker.prototype.destroy = function() {
    this.layout.destroy();
    this.options.container.innerHTML = '';

    this.layout = this.slider = this.palette =
        this.options = null;
};

util.CustomEvents.mixin(Colorpicker);

module.exports = Colorpicker;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./colorutil":3,"./layout":10,"./palette":11,"./slider":12}],10:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Colorpicker layout module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var domutil = require('./core/domutil');
var View = require('./core/view');

/**
 * @constructor
 * @extends {View}
 * @param {object} options - option object
 *  @param {string} options.cssPrefix - css prefix for each child elements
 * @param {HTMLDivElement} container - container
 */
function Layout(options, container) {
    /**
     * option object
     * @type {object}
     */
    this.options = util.extend({
        cssPrefix: 'tui-colorpicker-'
    }, options);

    container = domutil.appendHTMLElement(
        'div',
        container,
        this.options.cssPrefix + 'container'
    );

    View.call(this, options, container);

    this.render();
}

util.inherit(Layout, View);

/**
 * @override
 * @param {string} [color] - selected color
 */
Layout.prototype.render = function(color) {
    this.recursive(function(view) {
        view.render(color);
    }, true);
};

module.exports = Layout;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./core/domutil":6,"./core/view":8}],11:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Color palette view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var domutil = require('./core/domutil');
var domevent = require('./core/domevent');
var View = require('./core/view');
var tmpl = require('../template/palette');

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for color palette view
 *  @param {string[]} options.preset - color list
 * @param {HTMLDivElement} container - container element
 */
function Palette(options, container) {
    /**
     * option object
     * @type {object}
     */
    this.options = util.extend({
        cssPrefix: 'tui-colorpicker-',
        preset: [
            '#181818',
            '#282828',
            '#383838',
            '#585858',
            '#B8B8B8',
            '#D8D8D8',
            '#E8E8E8',
            '#F8F8F8',
            '#AB4642',
            '#DC9656',
            '#F7CA88',
            '#A1B56C',
            '#86C1B9',
            '#7CAFC2',
            '#BA8BAF',
            '#A16946'
        ],
        detailTxt: 'Detail'
    }, options);

    container = domutil.appendHTMLElement(
        'div',
        container,
        this.options.cssPrefix + 'palette-container'
    );

    View.call(this, options, container);
}

util.inherit(Palette, View);

/**
 * Mouse click event handler
 * @fires Palette#_selectColor
 * @fires Palette#_toggleSlider
 * @param {MouseEvent} clickEvent - mouse event object
 */
Palette.prototype._onClick = function(clickEvent) {
    var options = this.options,
        target = clickEvent.srcElement || clickEvent.target,
        eventData = {};

    if (domutil.hasClass(target, options.cssPrefix + 'palette-button')) {
        eventData.color = target.value;

        /**
         * @event Palette#_selectColor
         * @type {object}
         * @property {string} color - selected color value
         */
        this.fire('_selectColor', eventData);
        return;
    }

    if (domutil.hasClass(target, options.cssPrefix + 'palette-toggle-slider')) {
        /**
         * @event Palette#_toggleSlider
         */
        this.fire('_toggleSlider');
    }
};

/**
 * Textbox change event handler
 * @fires Palette#_selectColor
 * @param {Event} changeEvent - change event object
 */
Palette.prototype._onChange = function(changeEvent) {
    var options = this.options,
        target = changeEvent.srcElement || changeEvent.target,
        eventData = {};

    if (domutil.hasClass(target, options.cssPrefix + 'palette-hex')) {
        eventData.color = target.value;

        /**
         * @event Palette#_selectColor
         * @type {object}
         * @property {string} color - selected color value
         */
        this.fire('_selectColor', eventData);
        return;
    }
};

/**
 * Invoke before destory
 * @override
 */
Palette.prototype._beforeDestroy = function() {
    this._toggleEvent(false);
};

/**
 * Toggle view DOM events
 * @param {boolean} [onOff=false] - true to bind event.
 */
Palette.prototype._toggleEvent = function(onOff) {
    var options = this.options,
        container = this.container,
        method = domevent[!!onOff ? 'on' : 'off'],
        hexTextBox;

    method(container, 'click', this._onClick, this);

    hexTextBox = domutil.find('.' + options.cssPrefix + 'palette-hex', container);

    if (hexTextBox) {
        method(hexTextBox, 'change', this._onChange, this);
    }
};

/**
 * Render palette
 * @override
 */
Palette.prototype.render = function(color) {
    var options = this.options,
        html = '';

    this._toggleEvent(false);

    html = tmpl.layout.replace('{{colorList}}', util.map(options.preset, function(_color) {
        var itemHtml = tmpl.item.replace(/{{color}}/g, _color);
        itemHtml = itemHtml.replace('{{selected}}', _color === color ?  (' ' + options.cssPrefix + 'selected') : ''); 

        return itemHtml;
    }).join(''));

    html = html.replace(/{{cssPrefix}}/g, options.cssPrefix)
        .replace('{{detailTxt}}', options.detailTxt)
        .replace(/{{color}}/g, color);

    this.container.innerHTML = html;

    this._toggleEvent(true);
};

util.CustomEvents.mixin(Palette);

module.exports = Palette;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../template/palette":14,"./core/domevent":5,"./core/domutil":6,"./core/view":8}],12:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Slider view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./core/domutil');
var domevent = require('./core/domevent');
var svgvml = require('./svgvml');
var colorutil = require('./colorutil');
var View = require('./core/view');
var Drag = require('./core/drag');
var tmpl = require('../template/slider');

// Limitation position of point element inside of colorslider and hue bar
// Minimum value can to be negative because that using color point of handle element is center point. not left, top point.
var COLORSLIDER_POS_LIMIT_RANGE = [-7, 112];
var HUEBAR_POS_LIMIT_RANGE = [-3, 115];
var HUE_WHEEL_MAX = 359.99;

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for view
 *  @param {string} options.cssPrefix - design css prefix
 * @param {HTMLElement} container - container element
 */
function Slider(options, container) {
    container = domutil.appendHTMLElement('div', container, options.cssPrefix + 'slider-container');
    container.style.display = 'none';

    View.call(this, options, container);

    /**
     * @type {object}
     */
    this.options = util.extend({
        color: '#f8f8f8',
        cssPrefix: 'tui-colorpicker-'
    }, options);

    /**
     * Cache immutable data in click, drag events.
     *
     * (i.e. is event related with colorslider? or huebar?)
     * @type {object}
     * @property {boolean} isColorSlider
     * @property {number[]} containerSize
     */
    this._dragDataCache = {};

    /**
     * Color slider handle element
     * @type {SVG|VML}
     */
    this.sliderHandleElement = null;

    /**
     * hue bar handle element
     * @type {SVG|VML}
     */
    this.huebarHandleElement = null;

    /**
     * Element that render base color in colorslider part
     * @type {SVG|VML}
     */
    this.baseColorElement = null;

    /**
     * @type {Drag}
     */
    this.drag = new Drag({
        distance: 0
    }, container);
    
    // bind drag events
    this.drag.on({
        'dragStart': this._onDragStart,
        'drag': this._onDrag,
        'dragEnd': this._onDragEnd,
        'click': this._onClick
    }, this);
}

util.inherit(Slider, View);

/**
 * @override
 */
Slider.prototype._beforeDestroy = function() {
    this.drag.off();

    this.drag = this.options = this._dragDataCache =
        this.sliderHandleElement = this.huebarHandleElement =
        this.baseColorElement = null;
};

/**
 * Toggle slider view
 * @param {boolean} onOff - set true then reveal slider view
 */
Slider.prototype.toggle = function(onOff) {
    this.container.style.display = !!onOff ? 'block' : 'none';
};

/**
 * Get slider display status
 * @returns {boolean} return true when slider is visible
 */
Slider.prototype.isVisible = function() {
    return this.container.style.display === 'block';
};

/**
 * Render slider view
 * @override
 * @param {string} colorStr - hex string color from parent view (Layout)
 */
Slider.prototype.render = function(colorStr) {
    var that = this,
        container = that.container,
        options = that.options,
        html = tmpl.layout,
        rgb,
        hsv;

    html = html.replace(/{{slider}}/, tmpl.slider);
    html = html.replace(/{{huebar}}/, tmpl.huebar);
    html = html.replace(/{{cssPrefix}}/g, options.cssPrefix);

    that.container.innerHTML = html;

    that.sliderHandleElement = domutil.find('.' + options.cssPrefix + 'slider-handle', container);
    that.huebarHandleElement = domutil.find('.' + options.cssPrefix + 'huebar-handle', container);
    that.baseColorElement = domutil.find('.' + options.cssPrefix + 'slider-basecolor', container);

    rgb = colorutil.hexToRGB(colorStr);
    hsv = colorutil.rgbToHSV.apply(null, rgb);

    this.moveHue(hsv[0], true)
    this.moveSaturationAndValue(hsv[1], hsv[2], true);
};

/**
 * Move colorslider by newLeft(X), newTop(Y) value
 * @private
 * @param {number} newLeft - left pixel value to move handle
 * @param {number} newTop - top pixel value to move handle
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype._moveColorSliderHandle = function(newLeft, newTop, silent) {
    var handle = this.sliderHandleElement,
        handleColor;

    // Check position limitation.
    newTop = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newTop);
    newTop = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newTop);
    newLeft = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newLeft);
    newLeft = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newLeft);

    svgvml.setTranslateXY(handle, newLeft, newTop);

    handleColor = newTop > 50 ? 'white' : 'black';
    svgvml.setStrokeColor(handle, handleColor);

    if (!silent) {
        this.fire('_selectColor', {
            color: colorutil.rgbToHEX.apply(null, this.getRGB())
        });
    }
};

/**
 * Move colorslider by supplied saturation and values.
 *
 * The movement of color slider handle follow HSV cylinder model. {@link https://en.wikipedia.org/wiki/HSL_and_HSV}
 * @param {number} saturation - the percent of saturation (0% ~ 100%)
 * @param {number} value - the percent of saturation (0% ~ 100%)
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype.moveSaturationAndValue = function(saturation, value, silent) {
    var absMin, maxValue,
        newLeft, newTop;

    saturation = saturation || 0;
    value = value || 0;

    absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]);
    maxValue = COLORSLIDER_POS_LIMIT_RANGE[1];

    // subtract absMin value because current color position is not left, top of handle element.
    // The saturation. from left 0 to right 100
    newLeft = ((saturation * maxValue) / 100) - absMin;
    // The Value. from top 100 to bottom 0. that why newTop subtract by maxValue.
    newTop = (maxValue - ((value * maxValue) / 100)) - absMin;

    this._moveColorSliderHandle(newLeft, newTop, silent);
};

/**
 * Move color slider handle to supplied position
 *
 * The number of X, Y must be related value from color slider container
 * @private
 * @param {number} x - the pixel value to move handle 
 * @param {number} y - the pixel value to move handle
 */
Slider.prototype._moveColorSliderByPosition = function(x, y) {
    var offset = COLORSLIDER_POS_LIMIT_RANGE[0];
    this._moveColorSliderHandle(x + offset, y + offset);
};

/**
 * Get saturation and value value.
 * @returns {number[]} saturation and value
 */
Slider.prototype.getSaturationAndValue = function() {
    var absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]),
        maxValue = absMin + COLORSLIDER_POS_LIMIT_RANGE[1],
        position = svgvml.getTranslateXY(this.sliderHandleElement), 
        saturation, value;

    saturation = ((position[1] + absMin) / maxValue) * 100;
    // The value of HSV color model is inverted. top 100 ~ bottom 0. so subtract by 100
    value = 100 - (((position[0] + absMin) / maxValue) * 100);

    return [saturation, value];
};

/**
 * Move hue handle supplied pixel value
 * @private
 * @param {number} newTop - pixel to move hue handle
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype._moveHueHandle = function(newTop, silent) {
    var hueHandleElement = this.huebarHandleElement,
        baseColorElement = this.baseColorElement,
        newGradientColor,
        hexStr;

    newTop = Math.max(HUEBAR_POS_LIMIT_RANGE[0], newTop);
    newTop = Math.min(HUEBAR_POS_LIMIT_RANGE[1], newTop);

    svgvml.setTranslateY(hueHandleElement, newTop);

    newGradientColor = colorutil.hsvToRGB(this.getHue(), 100, 100);
    hexStr = colorutil.rgbToHEX.apply(null, newGradientColor);

    svgvml.setGradientColorStop(baseColorElement, hexStr);

    if (!silent) {
        this.fire('_selectColor', {
            color: colorutil.rgbToHEX.apply(null, this.getRGB()) 
        });
    }
};

/**
 * Move hue bar handle by supplied degree
 * @param {number} degree - (0 ~ 359.9 degree)
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype.moveHue = function(degree, silent) {
    var newTop = 0,
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    degree = degree || 0;
    newTop = ((maxValue * degree) / HUE_WHEEL_MAX) - absMin;

    this._moveHueHandle(newTop, silent);
};

/**
 * Move hue bar handle by supplied percent
 * @private
 * @param {number} y - pixel value to move hue handle
 */
Slider.prototype._moveHueByPosition = function(y) {
    var offset = HUEBAR_POS_LIMIT_RANGE[0];

    this._moveHueHandle(y + offset);
};

/**
 * Get huebar handle position by color degree
 * @returns {number} degree (0 ~ 359.9 degree)
 */
Slider.prototype.getHue = function() {
    var handle = this.huebarHandleElement,
        position = svgvml.getTranslateXY(handle),
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    // maxValue : 359.99 = pos.y : x
    return ((position[0] + absMin) * HUE_WHEEL_MAX) / maxValue;
};

/**
 * Get HSV value from slider
 * @returns {number[]} hsv values
 */
Slider.prototype.getHSV = function() {
    var sv = this.getSaturationAndValue(),
        h = this.getHue();

    return [h].concat(sv);
};

/**
 * Get RGB value from slider
 * @returns {number[]} RGB value
 */
Slider.prototype.getRGB = function() {
    return colorutil.hsvToRGB.apply(null, this.getHSV());
};

/**********
 * Drag event handler
 **********/

/**
 * Cache immutable data when dragging or click view
 * @param {object} event - Click, DragStart event.
 * @returns {object} cached data.
 */
Slider.prototype._prepareColorSliderForMouseEvent = function(event) {
    var options = this.options,
        sliderPart = domutil.closest(event.target, '.' + options.cssPrefix + 'slider-part'),
        cache;

    cache = this._dragDataCache = {
        isColorSlider: domutil.hasClass(sliderPart, options.cssPrefix + 'slider-left'),
        parentElement: sliderPart
    };
    
    return cache;
};

/**
 * Click event handler
 * @param {object} clickEvent - Click event from Drag module
 */
Slider.prototype._onClick = function(clickEvent) {
    var cache = this._prepareColorSliderForMouseEvent(clickEvent),
        mousePos = domevent.getMousePosition(clickEvent.originEvent, cache.parentElement);

    if (cache.isColorSlider) {
        this._moveColorSliderByPosition(mousePos[0], mousePos[1]);
    } else {
        this._moveHueByPosition(mousePos[1]);
    }

    this._dragDataCache = null;
};

/**
 * DragStart event handler
 * @param {object} dragStartEvent - dragStart event data from Drag#dragStart
 */
Slider.prototype._onDragStart = function(dragStartEvent) {
    this._prepareColorSliderForMouseEvent(dragStartEvent);
};

/**
 * Drag event handler
 * @param {Drag#drag} dragEvent - drag event data
 */
Slider.prototype._onDrag = function(dragEvent) {
    var cache = this._dragDataCache,
        mousePos = domevent.getMousePosition(dragEvent.originEvent, cache.parentElement);

    if (cache.isColorSlider) {
        this._moveColorSliderByPosition(mousePos[0], mousePos[1]);
    } else {
        this._moveHueByPosition(mousePos[1]);
    }
};

/**
 * Drag#dragEnd event handler
 */
Slider.prototype._onDragEnd = function() {
    this._dragDataCache = null;
};

util.CustomEvents.mixin(Slider);

module.exports = Slider;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../template/slider":15,"./colorutil":3,"./core/domevent":5,"./core/domutil":6,"./core/drag":7,"./core/view":8,"./svgvml":13}],13:[function(require,module,exports){
(function (global){
/**
 * @fileoverview module for manipulate SVG or VML object
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var PARSE_TRANSLATE_NUM_REGEX = /[\.\-0-9]+/g;
var SVG_HUE_HANDLE_RIGHT_POS = -6;

/* istanbul ignore next */
var svgvml = {
    /**
     * Return true when browser is below IE8.
     * @returns {boolean} is old browser?
     */
    isOldBrowser: function() {
        var _isOldBrowser = svgvml._isOldBrowser;

        if (!util.isExisty(_isOldBrowser)) {
            svgvml._isOldBrowser = _isOldBrowser = util.browser.msie && util.browser.version < 9;
        }

        return _isOldBrowser;
    },

    /**
     * Get translate transform value
     * @param {SVG|VML} obj - svg or vml object that want to know translate x, y
     * @returns {number[]} translated coordinates [x, y]
     */
    getTranslateXY: function(obj) {
        var temp;

        if (svgvml.isOldBrowser()) {
            temp = obj.style;
            return [parseFloat(temp.top), parseFloat(temp.left)];
        }

        temp = obj.getAttribute('transform');

        if (!temp) {
            return [0, 0];
        }
        
        temp = temp.match(PARSE_TRANSLATE_NUM_REGEX);

        // need caution for difference of VML, SVG coordinates system.
        // translate command need X coords in first parameter. but VML is use CSS coordinate system(top, left)
        return [parseFloat(temp[1]), parseFloat(temp[0])];
    },

    /**
     * Set translate transform value
     * @param {SVG|VML} obj - SVG or VML object to setting translate transform.
     * @param {number} x - translate X value
     * @param {number} y - translate Y value
     */
    setTranslateXY: function(obj, x, y) {
        if (svgvml.isOldBrowser()) {
            obj.style.left = x + 'px';
            obj.style.top = y + 'px';
        } else {
            obj.setAttribute('transform', 'translate(' + x + ',' + y + ')');
        }
    },

    /**
     * Set translate only Y value
     * @param {SVG|VML} obj - SVG or VML object to setting translate transform.
     * @param {number} y - translate Y value
     */
    setTranslateY: function(obj, y) {
        if (svgvml.isOldBrowser()) {
            obj.style.top = y + 'px';
        } else {
            obj.setAttribute('transform', 'translate(' + SVG_HUE_HANDLE_RIGHT_POS + ',' + y + ')');
        }
    },

    /**
     * Set stroke color to SVG or VML object
     * @param {SVG|VML} obj - SVG or VML object to setting stroke color
     * @param {string} colorStr - color string
     */
    setStrokeColor: function(obj, colorStr) {
        if (svgvml.isOldBrowser()) {
            obj.strokecolor = colorStr;
        } else {
            obj.setAttribute('stroke', colorStr);
        }
    },

    /**
     * Set gradient stop color to SVG, VML object.
     * @param {SVG|VML} obj - SVG, VML object to applying gradient stop color
     * @param {string} colorStr - color string
     */
    setGradientColorStop: function(obj, colorStr) {
        if (svgvml.isOldBrowser()) {
            obj.color = colorStr;
        } else {
            obj.setAttribute('stop-color', colorStr);
        }
    }

};

module.exports = svgvml;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],14:[function(require,module,exports){
/**
 * @fileoverview Palette view template
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var layout = [
'<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>',
'<div class="{{cssPrefix}}clearfix" style="overflow:hidden">',
    '<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />',
    '<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />',
    '<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',
'</div>'].join('\n');

var item = '<li><input class="{{cssPrefix}}palette-button{{selected}}" type="button" style="background-color:{{color}};color:{{color}}" title="{{color}}" value="{{color}}" /></li>';

module.exports = {
    layout: layout,
    item: item
};

},{}],15:[function(require,module,exports){
(function (global){
/**
 * @fileoverview Slider template
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;

var layout = [
'<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>',
'<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'
].join('\n');

var SVGSlider = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',
    '<defs>',
        '<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">',
            '<stop offset="0%" stop-color="rgb(255,255,255)" />',
            '<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />',
        '</linearGradient>',
        '<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">',
            '<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />',
            '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',
        '</linearGradient>',
    '</defs>',
    '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>',
    '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>',
    '<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',
'</svg>'].join('\n');

var VMLSlider = ['<div class="{{cssPrefix}}vml-slider">',
    '<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
      '<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />',
    '</v:rect>',
    '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
        '<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />',
    '</v:rect>',
    '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"' +
        'path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />',
'</div>'].join('\n');

var SVGHuebar = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',
    '<defs>',
        '<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">',
            '<stop offset="0%" stop-color="rgb(255,0,0)" />',
            '<stop offset="16.666%" stop-color="rgb(255,255,0)" />',
            '<stop offset="33.333%" stop-color="rgb(0,255,0)" />',
            '<stop offset="50%" stop-color="rgb(0,255,255)" />',
            '<stop offset="66.666%" stop-color="rgb(0,0,255)" />',
            '<stop offset="83.333%" stop-color="rgb(255,0,255)" />',
            '<stop offset="100%" stop-color="rgb(255,0,0)" />',
        '</linearGradient>',
    '</defs>',
    '<rect width="18px" height="100%" fill="url(#g)"></rect>',
    '<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />',
'</svg>'].join('\n');

var VMLHuebar = ['<div class="{{cssPrefix}}vml-huebar">',
    '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">',
        '<v:fill type="gradient" method="none" colors="' +
        '0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)' +
        '" angle="180" class="{{cssPrefix}}vml" />',
    '</v:rect>',
    '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"' + 
        'path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />',
'</div>'].join('\n');

var isOldBrowser = util.browser.msie && (util.browser.version < 9);

if (isOldBrowser) {
    global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
}

module.exports = {
    layout: layout,
    slider: isOldBrowser ? VMLSlider : SVGSlider,
    huebar: isOldBrowser ? VMLHuebar : SVGHuebar
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiLCJzcmMvanMvY29sb3J1dGlsLmpzIiwic3JjL2pzL2NvcmUvY29sbGVjdGlvbi5qcyIsInNyYy9qcy9jb3JlL2RvbWV2ZW50LmpzIiwic3JjL2pzL2NvcmUvZG9tdXRpbC5qcyIsInNyYy9qcy9jb3JlL2RyYWcuanMiLCJzcmMvanMvY29yZS92aWV3LmpzIiwic3JjL2pzL2ZhY3RvcnkuanMiLCJzcmMvanMvbGF5b3V0LmpzIiwic3JjL2pzL3BhbGV0dGUuanMiLCJzcmMvanMvc2xpZGVyLmpzIiwic3JjL2pzL3N2Z3ZtbC5qcyIsInNyYy90ZW1wbGF0ZS9wYWxldHRlLmpzIiwic3JjL3RlbXBsYXRlL3NsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMxYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDamtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM5WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRvYXN0IFVJIENvbG9ycGlja2VyXG4gKiBAdmVyc2lvbiAxLjAuMFxuICovXG4vKiBlc2xpbnQgdmFycy1vbi10b3A6MCwgc3RyaWN0OjAgKi9cbnJlcXVpcmUoJ3R1aS1jb2RlLXNuaXBwZXQnKTtcblxuLyoqIEBuYW1lc3BhY2UgdHVpLmNvbXBvbmVudCAqL1xudHVpLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCd0dWkuY29tcG9uZW50LmNvbG9ycGlja2VyJywge1xuICAgIGRvbXV0aWw6IHJlcXVpcmUoJy4vc3JjL2pzL2NvcmUvZG9tdXRpbCcpLFxuICAgIGRvbWV2ZW50OiByZXF1aXJlKCcuL3NyYy9qcy9jb3JlL2RvbWV2ZW50JyksXG4gICAgQ29sbGVjdGlvbjogcmVxdWlyZSgnLi9zcmMvanMvY29yZS9jb2xsZWN0aW9uJyksXG4gICAgVmlldzogcmVxdWlyZSgnLi9zcmMvanMvY29yZS92aWV3JyksXG4gICAgRHJhZzogcmVxdWlyZSgnLi9zcmMvanMvY29yZS9kcmFnJyksXG5cbiAgICBjcmVhdGU6IHJlcXVpcmUoJy4vc3JjL2pzL2ZhY3RvcnknKSxcbiAgICBQYWxldHRlOiByZXF1aXJlKCcuL3NyYy9qcy9wYWxldHRlJyksXG4gICAgU2xpZGVyOiByZXF1aXJlKCcuL3NyYy9qcy9zbGlkZXInKSxcbiAgICBjb2xvcnV0aWw6IHJlcXVpcmUoJy4vc3JjL2pzL2NvbG9ydXRpbCcpLFxuICAgIHN2Z3ZtbDogcmVxdWlyZSgnLi9zcmMvanMvc3Zndm1sJylcbn0pO1xuXG4iLCIiLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbGl0eSBtZXRob2RzIHRvIG1hbmlwdWxhdGUgY29sb3JzXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaGV4UlggPSAvKF4jWzAtOUEtRl17Nn0kKXwoXiNbMC05QS1GXXszfSQpL2k7XG5cbnZhciBjb2xvcnV0aWwgPSB7XG4gICAgLyoqXG4gICAgICogcGFkIGxlZnQgemVybyBjaGFyYWN0ZXJzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgbnVtYmVyIHZhbHVlIHRvIHBhZCB6ZXJvLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggcGFkIGxlbmd0aCB0byB3YW50LlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHBhZGRlZCBzdHJpbmcuXG4gICAgICovXG4gICAgbGVhZGluZ1plcm86IGZ1bmN0aW9uKG51bWJlciwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB6ZXJvID0gJycsXG4gICAgICAgICAgICBpID0gMDtcblxuICAgICAgICBpZiAoKG51bWJlciArICcnKS5sZW5ndGggPiBsZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgKGxlbmd0aCAtIDEpOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHplcm8gKz0gJzAnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh6ZXJvICsgbnVtYmVyKS5zbGljZShsZW5ndGggKiAtMSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHZhbGlkYXRlIG9mIGhleCBzdHJpbmcgdmFsdWUgaXMgUkdCXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHJnYiBoZXggc3RyaW5nXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIHdoZW4gc3VwcGxpZWQgc3RyIGlzIHZhbGlkIFJHQiBoZXggc3RyaW5nXG4gICAgICovXG4gICAgaXNWYWxpZFJHQjogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHJldHVybiBoZXhSWC50ZXN0KHN0cik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgY29sb3IgaGV4IHN0cmluZyB0byByZ2IgbnVtYmVyIGFycmF5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciAtIGhleCBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX0gcmdiIG51bWJlcnNcbiAgICAgKi9cbiAgICBoZXhUb1JHQjogZnVuY3Rpb24oaGV4U3RyKSB7XG4gICAgICAgIHZhciByLCBnLCBiO1xuXG4gICAgICAgIGlmICghY29sb3J1dGlsLmlzVmFsaWRSR0IoaGV4U3RyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaGV4U3RyID0gaGV4U3RyLnN1YnN0cmluZygxKTtcblxuICAgICAgICByID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cigwLCAyKSwgMTYpO1xuICAgICAgICBnID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cigyLCAyKSwgMTYpO1xuICAgICAgICBiID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cig0LCAyKSwgMTYpO1xuXG4gICAgICAgIHJldHVybiBbciwgZywgYl07XG4gICAgfSxcblxuICAgIFxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgcmdiIG51bWJlciB0byBoZXggc3RyaW5nXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSByZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIGdyZWVuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGIgLSBibHVlXG4gICAgICogQHJldHVybnMge3N0cmluZ3xib29sZWFufSByZXR1cm4gZmFsc2Ugd2hlbiBzdXBwbGllZCByZ2IgbnVtYmVyIGlzIG5vdCB2YWxpZC4gb3RoZXJ3aXNlLCBjb252ZXJ0ZWQgaGV4IHN0cmluZ1xuICAgICAqL1xuICAgIHJnYlRvSEVYOiBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgICAgIHZhciBoZXhTdHIgPSAnIycgKyBcbiAgICAgICAgICAgIGNvbG9ydXRpbC5sZWFkaW5nWmVybyhyLnRvU3RyaW5nKDE2KSwgMikgKyBcbiAgICAgICAgICAgIGNvbG9ydXRpbC5sZWFkaW5nWmVybyhnLnRvU3RyaW5nKDE2KSwgMikgK1xuICAgICAgICAgICAgY29sb3J1dGlsLmxlYWRpbmdaZXJvKGIudG9TdHJpbmcoMTYpLCAyKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjb2xvcnV0aWwuaXNWYWxpZFJHQihoZXhTdHIpKSB7XG4gICAgICAgICAgICByZXR1cm4gaGV4U3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IHJnYiBudW1iZXIgdG8gSFNWIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSByZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIGdyZWVuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGIgLSBibHVlXG4gICAgICogQHJldHVybiB7bnVtYmVyW119IGhzdiB2YWx1ZVxuICAgICAqL1xuICAgIHJnYlRvSFNWOiBmdW5jdGlvbihyLCBnLCBiKSB7XG4gICAgICAgIHZhciBtYXgsIG1pbiwgaCwgcywgdiwgZDtcblxuICAgICAgICByIC89IDI1NTtcbiAgICAgICAgZyAvPSAyNTU7XG4gICAgICAgIGIgLz0gMjU1O1xuICAgICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgICAgIHYgPSBtYXg7XG4gICAgICAgIGQgPSBtYXggLSBtaW47XG4gICAgICAgIHMgPSBtYXggPT09IDAgPyAwIDogKGQgLyBtYXgpO1xuXG4gICAgICAgIGlmIChtYXggPT09IG1pbikge1xuICAgICAgICAgICAgaCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKG1heCkge1xuICAgICAgICAgICAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgLy8gbm8gZGVmYXVsdFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaCAvPSA2O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIE1hdGgucm91bmQoaCAqIDM2MCksIFxuICAgICAgICAgICAgTWF0aC5yb3VuZChzICogMTAwKSxcbiAgICAgICAgICAgIE1hdGgucm91bmQodiAqIDEwMClcbiAgICAgICAgXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCBIU1YgbnVtYmVyIHRvIFJHQlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIC0gaHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHMgLSBzYXR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHYgLSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gcmdiIHZhbHVlXG4gICAgICovXG4gICAgaHN2VG9SR0I6IGZ1bmN0aW9uKGgsIHMsIHYpIHtcbiAgICAgICAgdmFyIHIsIGcsIGI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgZiwgcCwgcSwgdDtcbiAgICAgICAgXG4gICAgICAgIGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigzNjAsIGgpKTtcbiAgICAgICAgcyA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgcykpO1xuICAgICAgICB2ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCB2KSk7XG4gICAgICAgIFxuICAgICAgICBzIC89IDEwMDtcbiAgICAgICAgdiAvPSAxMDA7XG4gICAgICAgIFxuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgICAgLy8gQWNocm9tYXRpYyAoZ3JleSlcbiAgICAgICAgICAgIHIgPSBnID0gYiA9IHY7XG4gICAgICAgICAgICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBoIC89IDYwOyAvLyBzZWN0b3IgMCB0byA1XG4gICAgICAgIGkgPSBNYXRoLmZsb29yKGgpO1xuICAgICAgICBmID0gaCAtIGk7IC8vIGZhY3RvcmlhbCBwYXJ0IG9mIGhcbiAgICAgICAgcCA9IHYgKiAoMSAtIHMpO1xuICAgICAgICBxID0gdiAqICgxIC0gcyAqIGYpO1xuICAgICAgICB0ID0gdiAqICgxIC0gcyAqICgxIC0gZikpO1xuXG4gICAgICAgIHN3aXRjaCAoaSkge1xuICAgICAgICAgICAgY2FzZSAwOiByID0gdjsgZyA9IHQ7IGIgPSBwOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogciA9IHE7IGcgPSB2OyBiID0gcDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHIgPSBwOyBnID0gdjsgYiA9IHQ7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiByID0gcDsgZyA9IHE7IGIgPSB2OyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDogciA9IHQ7IGcgPSBwOyBiID0gdjsgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiByID0gdjsgZyA9IHA7IGIgPSBxOyBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpXTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbG9ydXRpbDtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbW1vbiBjb2xsZWN0aW9ucy5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsLFxuICAgIGZvckVhY2hQcm9wID0gdXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyxcbiAgICBmb3JFYWNoQXJyID0gdXRpbC5mb3JFYWNoQXJyYXksXG4gICAgaXNGdW5jID0gdXRpbC5pc0Z1bmN0aW9uLFxuICAgIGlzT2JqID0gdXRpbC5pc09iamVjdDtcblxudmFyIGFwcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuLyoqXG4gKiBDb21tb24gY29sbGVjdGlvbi5cbiAqXG4gKiBJdCBuZWVkIGZ1bmN0aW9uIGZvciBnZXQgbW9kZWwncyB1bmlxdWUgaWQuXG4gKlxuICogaWYgdGhlIGZ1bmN0aW9uIGlzIG5vdCBzdXBwbGllZCB0aGVuIGl0IHVzZSBkZWZhdWx0IGZ1bmN0aW9uIHtAbGluayBDb2xsZWN0aW9uI2dldEl0ZW1JRH1cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldEl0ZW1JREZuXSBmdW5jdGlvbiBmb3IgZ2V0IG1vZGVsJ3MgaWQuXG4gKi9cbmZ1bmN0aW9uIENvbGxlY3Rpb24oZ2V0SXRlbUlERm4pIHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7b2JqZWN0LjxzdHJpbmcsICo+fVxuICAgICAqL1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sZW5ndGggPSAwO1xuXG4gICAgaWYgKGlzRnVuYyhnZXRJdGVtSURGbikpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtmdW5jdGlvbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZ2V0SXRlbUlEID0gZ2V0SXRlbUlERm47XG4gICAgfVxufVxuXG4vKioqKioqKioqKlxuICogc3RhdGljIHByb3BzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBDb21iaW5kIHN1cHBsaWVkIGZ1bmN0aW9uIGZpbHRlcnMgYW5kIGNvbmRpdGlvbi5cbiAqIEBwYXJhbSB7Li4uZnVuY3Rpb259IGZpbHRlcnMgLSBmdW5jdGlvbiBmaWx0ZXJzXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IGNvbWJpbmVkIGZpbHRlclxuICovXG5Db2xsZWN0aW9uLmFuZCA9IGZ1bmN0aW9uKGZpbHRlcnMpIHtcbiAgICB2YXIgY250O1xuXG4gICAgZmlsdGVycyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgY250ID0gZmlsdGVycy5sZW5ndGg7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgaSA9IDA7XG5cbiAgICAgICAgZm9yICg7IGkgPCBjbnQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKCFmaWx0ZXJzW2ldLmNhbGwobnVsbCwgaXRlbSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIENvbWJpbmUgbXVsdGlwbGUgZnVuY3Rpb24gZmlsdGVycyB3aXRoIE9SIGNsYXVzZS5cbiAqIEBwYXJhbSB7Li4uZnVuY3Rpb259IGZpbHRlcnMgLSBmdW5jdGlvbiBmaWx0ZXJzXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IGNvbWJpbmVkIGZpbHRlclxuICovXG5Db2xsZWN0aW9uLm9yID0gZnVuY3Rpb24oZmlsdGVycykge1xuICAgIHZhciBjbnQ7XG5cbiAgICBmaWx0ZXJzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICBjbnQgPSBmaWx0ZXJzLmxlbmd0aDtcblxuICAgIHJldHVybiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBpID0gMSxcbiAgICAgICAgICAgIHJlc3VsdCA9IGZpbHRlcnNbMF0uY2FsbChudWxsLCBpdGVtKTtcblxuICAgICAgICBmb3IgKDsgaSA8IGNudDsgaSArPSAxKSB7XG4gICAgICAgICAgICByZXN1bHQgPSAocmVzdWx0IHx8IGZpbHRlcnNbaV0uY2FsbChudWxsLCBpdGVtKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG59O1xuXG4vKipcbiAqIE1lcmdlIHNldmVyYWwgY29sbGVjdGlvbnMuXG4gKlxuICogWW91IGNhblxcJ3QgbWVyZ2UgY29sbGVjdGlvbnMgZGlmZmVyZW50IF9nZXRFdmVudElEIGZ1bmN0aW9ucy4gVGFrZSBjYXNlIG9mIHVzZS5cbiAqIEBwYXJhbSB7Li4uQ29sbGVjdGlvbn0gY29sbGVjdGlvbnMgY29sbGVjdGlvbiBhcmd1bWVudHMgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufSBtZXJnZWQgY29sbGVjdGlvbi5cbiAqL1xuQ29sbGVjdGlvbi5tZXJnZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb25zKSB7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB2YXIgY29scyA9IGFwcy5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgIG5ld0l0ZW1zID0ge30sXG4gICAgICAgIG1lcmdlZCA9IG5ldyBDb2xsZWN0aW9uKGNvbHNbMF0uZ2V0SXRlbUlEKSxcbiAgICAgICAgZXh0ZW5kID0gdXRpbC5leHRlbmQ7XG5cbiAgICBmb3JFYWNoQXJyKGNvbHMsIGZ1bmN0aW9uKGNvbCkge1xuICAgICAgICBleHRlbmQobmV3SXRlbXMsIGNvbC5pdGVtcyk7XG4gICAgfSk7XG5cbiAgICBtZXJnZWQuaXRlbXMgPSBuZXdJdGVtcztcbiAgICBtZXJnZWQubGVuZ3RoID0gdXRpbC5rZXlzKG1lcmdlZC5pdGVtcykubGVuZ3RoO1xuXG4gICAgcmV0dXJuIG1lcmdlZDtcbn07XG5cbi8qKioqKioqKioqXG4gKiBwcm90b3R5cGUgcHJvcHNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIGdldCBtb2RlbCdzIHVuaXF1ZSBpZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtIG1vZGVsIGluc3RhbmNlLlxuICogQHJldHVybnMge251bWJlcn0gbW9kZWwgdW5pcXVlIGlkLlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5nZXRJdGVtSUQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0uX2lkICsgJyc7XG59O1xuXG4vKipcbiAqIGFkZCBtb2RlbHMuXG4gKiBAcGFyYW0gey4uLip9IGl0ZW0gbW9kZWxzIHRvIGFkZCB0aGlzIGNvbGxlY3Rpb24uXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaWQsXG4gICAgICAgIG93bkl0ZW1zO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvckVhY2hBcnIoYXBzLmNhbGwoYXJndW1lbnRzKSwgZnVuY3Rpb24obykge1xuICAgICAgICAgICAgdGhpcy5hZGQobyk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZCA9IHRoaXMuZ2V0SXRlbUlEKGl0ZW0pO1xuICAgIG93bkl0ZW1zID0gdGhpcy5pdGVtcztcblxuICAgIGlmICghb3duSXRlbXNbaWRdKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoICs9IDE7XG4gICAgfVxuICAgIG93bkl0ZW1zW2lkXSA9IGl0ZW07XG59O1xuXG4vKipcbiAqIHJlbW92ZSBtb2RlbHMuXG4gKiBAcGFyYW0gey4uLihvYmplY3R8c3RyaW5nfG51bWJlcil9IGlkIG1vZGVsIGluc3RhbmNlIG9yIHVuaXF1ZSBpZCB0byBkZWxldGUuXG4gKiBAcmV0dXJucyB7YXJyYXl9IGRlbGV0ZWQgbW9kZWwgbGlzdC5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IFtdLFxuICAgICAgICBvd25JdGVtcyxcbiAgICAgICAgaXRlbVRvUmVtb3ZlO1xuXG4gICAgaWYgKCF0aGlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmVtb3ZlZCA9IHV0aWwubWFwKGFwcy5jYWxsKGFyZ3VtZW50cyksIGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmUoaWQpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9XG5cbiAgICBvd25JdGVtcyA9IHRoaXMuaXRlbXM7XG5cbiAgICBpZiAoaXNPYmooaWQpKSB7XG4gICAgICAgIGlkID0gdGhpcy5nZXRJdGVtSUQoaWQpO1xuICAgIH1cblxuICAgIGlmICghb3duSXRlbXNbaWRdKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIHRoaXMubGVuZ3RoIC09IDE7XG4gICAgaXRlbVRvUmVtb3ZlID0gb3duSXRlbXNbaWRdO1xuICAgIGRlbGV0ZSBvd25JdGVtc1tpZF07XG5cbiAgICByZXR1cm4gaXRlbVRvUmVtb3ZlO1xufTtcblxuLyoqXG4gKiByZW1vdmUgYWxsIG1vZGVscyBpbiBjb2xsZWN0aW9uLlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG59O1xuXG4vKipcbiAqIGNoZWNrIGNvbGxlY3Rpb24gaGFzIHNwZWNpZmljIG1vZGVsLlxuICogQHBhcmFtIHsob2JqZWN0fHN0cmluZ3xudW1iZXJ8ZnVuY3Rpb24pfSBpZCBtb2RlbCBpbnN0YW5jZSBvciBpZCBvciBmaWx0ZXIgZnVuY3Rpb24gdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSBpcyBoYXMgbW9kZWw/XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGlzRmlsdGVyLFxuICAgICAgICBoYXM7XG5cbiAgICBpZiAoIXRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpc0ZpbHRlciA9IGlzRnVuYyhpZCk7XG4gICAgaGFzID0gZmFsc2U7XG5cbiAgICBpZiAoaXNGaWx0ZXIpIHtcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpZChpdGVtKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGhhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZCA9IGlzT2JqKGlkKSA/IHRoaXMuZ2V0SXRlbUlEKGlkKSA6IGlkO1xuICAgICAgICBoYXMgPSB1dGlsLmlzRXhpc3R5KHRoaXMuaXRlbXNbaWRdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzO1xufTtcblxuLyoqXG4gKiBpbnZva2UgY2FsbGJhY2sgd2hlbiBtb2RlbCBleGlzdCBpbiBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGlkIG1vZGVsIHVuaXF1ZSBpZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIHRoZSBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNhbGxiYWNrIGNvbnRleHQuXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmRvV2hlbkhhcyA9IGZ1bmN0aW9uKGlkLCBmbiwgY29udGV4dCkge1xuICAgIHZhciBpdGVtID0gdGhpcy5pdGVtc1tpZF07XG5cbiAgICBpZiAoIXV0aWwuaXNFeGlzdHkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZuLmNhbGwoY29udGV4dCB8fCB0aGlzLCBpdGVtKTtcbn07XG5cbi8qKlxuICogU2VhcmNoIG1vZGVsLiBhbmQgcmV0dXJuIG5ldyBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZmlsdGVyIGZpbHRlciBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtDb2xsZWN0aW9ufSBuZXcgY29sbGVjdGlvbiB3aXRoIGZpbHRlcmVkIG1vZGVscy5cbiAqIEBleGFtcGxlXG4gKiBjb2xsZWN0aW9uLmZpbmQoZnVuY3Rpb24oaXRlbSkge1xuICogICAgIHJldHVybiBpdGVtLmVkaXRlZCA9PT0gdHJ1ZTtcbiAqIH0pO1xuICpcbiAqIGZ1bmN0aW9uIGZpbHRlcjEoaXRlbSkge1xuICogICAgIHJldHVybiBpdGVtLmVkaXRlZCA9PT0gZmFsc2U7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gZmlsdGVyMihpdGVtKSB7XG4gKiAgICAgcmV0dXJuIGl0ZW0uZGlzYWJsZWQgPT09IGZhbHNlO1xuICogfVxuICpcbiAqIGNvbGxlY3Rpb24uZmluZChDb2xsZWN0aW9uLmFuZChmaWx0ZXIxLCBmaWx0ZXIyKSk7XG4gKlxuICogY29sbGVjdGlvbi5maW5kKENvbGxlY3Rpb24ub3IoZmlsdGVyMSwgZmlsdGVyMikpO1xuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDb2xsZWN0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnZ2V0SXRlbUlEJykpIHtcbiAgICAgICAgcmVzdWx0LmdldEl0ZW1JRCA9IHRoaXMuZ2V0SXRlbUlEO1xuICAgIH1cblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGlmIChmaWx0ZXIoaXRlbSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJlc3VsdC5hZGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEdyb3VwIGVsZW1lbnQgYnkgc3BlY2lmaWMga2V5IHZhbHVlcy5cbiAqXG4gKiBpZiBrZXkgcGFyYW1ldGVyIGlzIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IGFuZCB1c2UgcmV0dXJuZWQgdmFsdWUuXG4gKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyfGZ1bmN0aW9ufGFycmF5KX0ga2V5IGtleSBwcm9wZXJ0eSBvciBnZXR0ZXIgZnVuY3Rpb24uIGlmIHN0cmluZ1tdIHN1cHBsaWVkLCBjcmVhdGUgZWFjaCBjb2xsZWN0aW9uIGJlZm9yZSBncm91cGluZy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtncm91cEZ1bmNdIC0gZnVuY3Rpb24gdGhhdCByZXR1cm4gZWFjaCBncm91cCdzIGtleVxuICogQHJldHVybnMge29iamVjdC48c3RyaW5nLCBDb2xsZWN0aW9uPn0gZ3JvdXBlZCBvYmplY3RcbiAqIEBleGFtcGxlXG4gKiBcbiAqIC8vIHBhc3MgYHN0cmluZ2AsIGBudW1iZXJgLCBgYm9vbGVhbmAgdHlwZSB2YWx1ZSB0aGVuIGdyb3VwIGJ5IHByb3BlcnR5IHZhbHVlLlxuICogY29sbGVjdGlvbi5ncm91cEJ5KCdnZW5kZXInKTsgICAgLy8gZ3JvdXAgYnkgJ2dlbmRlcicgcHJvcGVydHkgdmFsdWUuXG4gKiBjb2xsZWN0aW9uLmdyb3VwQnkoNTApOyAgICAgICAgICAvLyBncm91cCBieSAnNTAnIHByb3BlcnR5IHZhbHVlLlxuICogXG4gKiAvLyBwYXNzIGBmdW5jdGlvbmAgdGhlbiBncm91cCBieSByZXR1cm4gdmFsdWUuIGVhY2ggaW52b2NhdGlvbiBgZnVuY3Rpb25gIGlzIGNhbGxlZCB3aXRoIGAoaXRlbSlgLlxuICogY29sbGVjdGlvbi5ncm91cEJ5KGZ1bmN0aW9uKGl0ZW0pIHtcbiAqICAgICBpZiAoaXRlbS5zY29yZSA+IDYwKSB7XG4gKiAgICAgICAgIHJldHVybiAncGFzcyc7XG4gKiAgICAgfVxuICogICAgIHJldHVybiAnZmFpbCc7XG4gKiB9KTtcbiAqXG4gKiAvLyBwYXNzIGBhcnJheWAgd2l0aCBmaXJzdCBhcmd1bWVudHMgdGhlbiBjcmVhdGUgZWFjaCBjb2xsZWN0aW9uIGJlZm9yZSBncm91cGluZy5cbiAqIGNvbGxlY3Rpb24uZ3JvdXBCeShbJ2dvJywgJ3J1YnknLCAnamF2YXNjcmlwdCddKTtcbiAqIC8vIHJlc3VsdDogeyAnZ28nOiBlbXB0eSBDb2xsZWN0aW9uLCAncnVieSc6IGVtcHR5IENvbGxlY3Rpb24sICdqYXZhc2NyaXB0JzogZW1wdHkgQ29sbGVjdGlvbiB9XG4gKlxuICogLy8gY2FuIHBhc3MgYGZ1bmN0aW9uYCB3aXRoIGBhcnJheWAgdGhlbiBncm91cCBlYWNoIGVsZW1lbnRzLlxuICogY29sbGVjdGlvbi5ncm91cEJ5KFsnZ28nLCAncnVieScsICdqYXZhc2NyaXB0J10sIGZ1bmN0aW9uKGl0ZW0pIHtcbiAqICAgICBpZiAoaXRlbS5pc0Zhc3QpIHtcbiAqICAgICAgICAgcmV0dXJuICdnbyc7XG4gKiAgICAgfVxuICpcbiAqICAgICByZXR1cm4gaXRlbS5uYW1lO1xuICogfSk7XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdyb3VwQnkgPSBmdW5jdGlvbihrZXksIGdyb3VwRnVuYykge1xuICAgIHZhciByZXN1bHQgPSB7fSxcbiAgICAgICAgY29sbGVjdGlvbixcbiAgICAgICAgYmFzZVZhbHVlLFxuICAgICAgICBpc0Z1bmMgPSB1dGlsLmlzRnVuY3Rpb24sXG4gICAgICAgIGtleUlzRnVuYyA9IGlzRnVuYyhrZXkpLFxuICAgICAgICBnZXRJdGVtSURGbiA9IHRoaXMuZ2V0SXRlbUlEO1xuXG4gICAgaWYgKHV0aWwuaXNBcnJheShrZXkpKSB7XG4gICAgICAgIHV0aWwuZm9yRWFjaEFycmF5KGtleSwgZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgcmVzdWx0W2sgKyAnJ10gPSBuZXcgQ29sbGVjdGlvbihnZXRJdGVtSURGbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZ3JvdXBGdW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAga2V5ID0gZ3JvdXBGdW5jO1xuICAgICAgICBrZXlJc0Z1bmMgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGlmIChrZXlJc0Z1bmMpIHtcbiAgICAgICAgICAgIGJhc2VWYWx1ZSA9IGtleShpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJhc2VWYWx1ZSA9IGl0ZW1ba2V5XTtcblxuICAgICAgICAgICAgaWYgKGlzRnVuYyhiYXNlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgYmFzZVZhbHVlID0gYmFzZVZhbHVlLmFwcGx5KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29sbGVjdGlvbiA9IHJlc3VsdFtiYXNlVmFsdWVdO1xuXG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgY29sbGVjdGlvbiA9IHJlc3VsdFtiYXNlVmFsdWVdID0gbmV3IENvbGxlY3Rpb24oZ2V0SXRlbUlERm4pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29sbGVjdGlvbi5hZGQoaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gc2luZ2xlIGl0ZW0gaW4gY29sbGVjdGlvbi5cbiAqXG4gKiBSZXR1cm5lZCBpdGVtIGlzIGluc2VydGVkIGluIHRoaXMgY29sbGVjdGlvbiBmaXJzdGx5LlxuICogQHJldHVybnMge29iamVjdH0gaXRlbS5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuc2luZ2xlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdDtcblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJlc3VsdCA9IGl0ZW07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIHNvcnQgYSBiYXNpcyBvZiBzdXBwbGllZCBjb21wYXJlIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcGFyZUZ1bmN0aW9uIGNvbXBhcmVGdW5jdGlvblxuICogQHJldHVybnMge2FycmF5fSBzb3J0ZWQgYXJyYXkuXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJlRnVuY3Rpb24pIHtcbiAgICB2YXIgYXJyID0gW107XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBhcnIucHVzaChpdGVtKTtcbiAgICB9KTtcblxuICAgIGlmIChpc0Z1bmMoY29tcGFyZUZ1bmN0aW9uKSkge1xuICAgICAgICBhcnIgPSBhcnIuc29ydChjb21wYXJlRnVuY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG59O1xuXG4vKipcbiAqIGl0ZXJhdGUgZWFjaCBtb2RlbCBlbGVtZW50LlxuICpcbiAqIHdoZW4gaXRlcmF0ZWUgcmV0dXJuIGZhbHNlIHRoZW4gYnJlYWsgdGhlIGxvb3AuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSBpdGVyYXRlZShpdGVtLCBpbmRleCwgaXRlbXMpXG4gKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjb250ZXh0XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGZvckVhY2hQcm9wKHRoaXMuaXRlbXMsIGl0ZXJhdGVlLCBjb250ZXh0IHx8IHRoaXMpO1xufTtcblxuLyoqXG4gKiByZXR1cm4gbmV3IGFycmF5IHdpdGggY29sbGVjdGlvbiBpdGVtcy5cbiAqIEByZXR1cm5zIHthcnJheX0gbmV3IGFycmF5LlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHV0aWwubWFwKHRoaXMuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb247XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBVdGlsaXR5IG1vZHVsZSBmb3IgaGFuZGxpbmcgRE9NIGV2ZW50cy5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsLFxuICAgIGJyb3dzZXIgPSB1dGlsLmJyb3dzZXIsXG4gICAgZXZlbnRLZXkgPSAnX2V2dCcsXG4gICAgRFJBRyA9IHtcbiAgICAgICAgU1RBUlQ6IFsndG91Y2hzdGFydCcsICdtb3VzZWRvd24nXSxcbiAgICAgICAgRU5EOiB7XG4gICAgICAgICAgICBtb3VzZWRvd246ICdtb3VzZXVwJyxcbiAgICAgICAgICAgIHRvdWNoc3RhcnQ6ICd0b3VjaGVuZCcsXG4gICAgICAgICAgICBwb2ludGVyZG93bjogJ3RvdWNoZW5kJyxcbiAgICAgICAgICAgIE1TUG9pbnRlckRvd246ICd0b3VjaGVuZCdcbiAgICAgICAgfSxcbiAgICAgICAgTU9WRToge1xuICAgICAgICAgICAgbW91c2Vkb3duOiAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAgIHRvdWNoc3RhcnQ6ICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgcG9pbnRlcmRvd246ICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgTVNQb2ludGVyRG93bjogJ3RvdWNobW92ZSdcbiAgICAgICAgfVxuICAgIH07XG5cbnZhciBkb21ldmVudCA9IHtcbiAgICAvKipcbiAgICAgKiBCaW5kIGRvbSBldmVudHMuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50IHRvIGJpbmQgZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSB0eXBlcyBTcGFjZSBzcGxpdHRlZCBldmVudHMgbmFtZXMgb3IgZXZlbnROYW1lOmhhbmRsZXIgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Kn0gZm4gaGFuZGxlciBmdW5jdGlvbiBvciBjb250ZXh0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjb250ZXh0IG9iamVjdCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKG9iaiwgdHlwZXMsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKHR5cGVzKSkge1xuICAgICAgICAgICAgdXRpbC5mb3JFYWNoKHR5cGVzLnNwbGl0KCcgJyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBkb21ldmVudC5fb24ob2JqLCB0eXBlLCBmbiwgY29udGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyh0eXBlcywgZnVuY3Rpb24oaGFuZGxlciwgdHlwZSkge1xuICAgICAgICAgICAgZG9tZXZlbnQuX29uKG9iaiwgdHlwZSwgaGFuZGxlciwgZm4pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRE9NIGV2ZW50IGJpbmRpbmcuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50IHRvIGJpbmQgZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBuYW1lIG9mIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0geyp9IGZuIGhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjb250ZXh0IG9iamVjdCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb246IGZ1bmN0aW9uKG9iaiwgdHlwZSwgZm4sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGlkLFxuICAgICAgICAgICAgaGFuZGxlcixcbiAgICAgICAgICAgIG9yaWdpbkhhbmRsZXI7XG5cbiAgICAgICAgaWQgPSB0eXBlICsgdXRpbC5zdGFtcChmbikgKyAoY29udGV4dCA/ICdfJyArIHV0aWwuc3RhbXAoY29udGV4dCkgOiAnJyk7XG5cbiAgICAgICAgaWYgKG9ialtldmVudEtleV0gJiYgb2JqW2V2ZW50S2V5XVtpZF0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBmbi5jYWxsKGNvbnRleHQgfHwgb2JqLCBlIHx8IHdpbmRvdy5ldmVudCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgb3JpZ2luSGFuZGxlciA9IGhhbmRsZXI7XG5cbiAgICAgICAgaWYgKCdhZGRFdmVudExpc3RlbmVyJyBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnbW91c2VlbnRlcicgfHwgdHlwZSA9PT0gJ21vdXNlbGVhdmUnKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvbWV2ZW50Ll9jaGVja01vdXNlKG9iaiwgZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5IYW5kbGVyKGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIoKHR5cGUgPT09ICdtb3VzZWVudGVyJykgP1xuICAgICAgICAgICAgICAgICAgICAnbW91c2VvdmVyJyA6ICdtb3VzZW91dCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb3VzZXdoZWVsJykge1xuICAgICAgICAgICAgICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCdhdHRhY2hFdmVudCcgaW4gb2JqKSB7XG4gICAgICAgICAgICBvYmouYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqW2V2ZW50S2V5XSA9IG9ialtldmVudEtleV0gfHwge307XG4gICAgICAgIG9ialtldmVudEtleV1baWRdID0gaGFuZGxlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5iaW5kIERPTSBFdmVudCBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudCB0byB1bmJpbmQuXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfG9iamVjdCl9IHR5cGVzIFNwYWNlIHNwbGl0dGVkIGV2ZW50cyBuYW1lcyBvciBldmVudE5hbWU6aGFuZGxlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHsqfSBmbiBoYW5kbGVyIGZ1bmN0aW9uIG9yIGNvbnRleHQgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNvbnRleHQgb2JqZWN0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKG9iaiwgdHlwZXMsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKHR5cGVzKSkge1xuICAgICAgICAgICAgdXRpbC5mb3JFYWNoKHR5cGVzLnNwbGl0KCcgJyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBkb21ldmVudC5fb2ZmKG9iaiwgdHlwZSwgZm4sIGNvbnRleHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuZm9yRWFjaE93blByb3BlcnRpZXModHlwZXMsIGZ1bmN0aW9uKGhhbmRsZXIsIHR5cGUpIHtcbiAgICAgICAgICAgIGRvbWV2ZW50Ll9vZmYob2JqLCB0eXBlLCBoYW5kbGVyLCBmbik7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmJpbmQgRE9NIGV2ZW50IGhhbmRsZXIuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50IHRvIHVuYmluZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiBldmVudCB0byB1bmJpbmQuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbigpfSBmbiBFdmVudCBoYW5kbGVyIHRoYXQgc3VwcGxpZWQgd2hlbiBiaW5kaW5nLlxuICAgICAqIEBwYXJhbSB7Kn0gY29udGV4dCBjb250ZXh0IG9iamVjdCB0aGF0IHN1cHBsaWVkIHdoZW4gYmluZGluZy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vZmY6IGZ1bmN0aW9uKG9iaiwgdHlwZSwgZm4sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGlkID0gdHlwZSArIHV0aWwuc3RhbXAoZm4pICsgKGNvbnRleHQgPyAnXycgKyB1dGlsLnN0YW1wKGNvbnRleHQpIDogJycpLFxuICAgICAgICAgICAgaGFuZGxlciA9IG9ialtldmVudEtleV0gJiYgb2JqW2V2ZW50S2V5XVtpZF07XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoJ3JlbW92ZUV2ZW50TGlzdGVuZXInIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb3VzZWVudGVyJyB8fCB0eXBlID09PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgICAgICBvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcigodHlwZSA9PT0gJ21vdXNlZW50ZXInKSA/XG4gICAgICAgICAgICAgICAgICAgICdtb3VzZW92ZXInIDogJ21vdXNlb3V0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ21vdXNld2hlZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2RldGFjaEV2ZW50JyBpbiBvYmopIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2JqLmRldGFjaEV2ZW50KCdvbicgKyB0eXBlLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHt9ICAgIC8vZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG9ialtldmVudEtleV1baWRdO1xuXG4gICAgICAgIGlmICh1dGlsLmtleXMob2JqW2V2ZW50S2V5XSkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aHJvdyBleGNlcHRpb24gd2hlbiBkZWxldGluZyBob3N0IG9iamVjdCdzIHByb3BlcnR5IGluIGJlbG93IElFOFxuICAgICAgICBpZiAodXRpbC5icm93c2VyLm1zaWUgJiYgdXRpbC5icm93c2VyLnZlcnNpb24gPCA5KSB7XG4gICAgICAgICAgICBvYmpbZXZlbnRLZXldID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBvYmpbZXZlbnRLZXldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBCaW5kIERPTSBldmVudC4gdGhpcyBldmVudCB3aWxsIHVuYmluZCBhZnRlciBpbnZva2VzLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudCB0byBiaW5kIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KX0gdHlwZXMgU3BhY2Ugc3BsaXR0ZWQgZXZlbnRzIG5hbWVzIG9yIGV2ZW50TmFtZTpoYW5kbGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0geyp9IGZuIGhhbmRsZXIgZnVuY3Rpb24gb3IgY29udGV4dCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICogQHBhcmFtIHsqfSBbY29udGV4dF0gY29udGV4dCBvYmplY3QgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqL1xuICAgIG9uY2U6IGZ1bmN0aW9uKG9iaiwgdHlwZXMsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAodXRpbC5pc09iamVjdCh0eXBlcykpIHtcbiAgICAgICAgICAgIHV0aWwuZm9yRWFjaE93blByb3BlcnRpZXModHlwZXMsIGZ1bmN0aW9uKGhhbmRsZXIsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICBkb21ldmVudC5vbmNlKG9iaiwgdHlwZSwgaGFuZGxlciwgZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBvbmNlSGFuZGxlcigpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQgfHwgb2JqLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhhdC5fb2ZmKG9iaiwgdHlwZXMsIG9uY2VIYW5kbGVyLCBjb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvbWV2ZW50Lm9uKG9iaiwgdHlwZXMsIG9uY2VIYW5kbGVyLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FuY2VsIGV2ZW50IGJ1YmJsaW5nLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FuY2VsIGJyb3dzZXIgZGVmYXVsdCBhY3Rpb25zLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3ludGF0aWMgc3VnYXIgb2Ygc3RvcFByb3BhZ2F0aW9uIGFuZCBwcmV2ZW50RGVmYXVsdFxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRXZlbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZG9tZXZlbnQucHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgIGRvbWV2ZW50LnN0b3BQcm9wYWdhdGlvbihlKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBzY3JvbGwgZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEhUTUwgZWxlbWVudCB0byBwcmV2ZW50IHNjcm9sbC5cbiAgICAgKi9cbiAgICBkaXNhYmxlU2Nyb2xsUHJvcGFnYXRpb246IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGRvbWV2ZW50Lm9uKGVsLCAnbW91c2V3aGVlbCBNb3pNb3VzZVBpeGVsU2Nyb2xsJywgZG9tZXZlbnQuc3RvcFByb3BhZ2F0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBhbGwgZXZlbnRzIHJlbGF0ZWQgd2l0aCBjbGljay5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBIVE1MIGVsZW1lbnQgdG8gcHJldmVudCBhbGwgZXZlbnQgcmVsYXRlZCB3aXRoIGNsaWNrLlxuICAgICAqL1xuICAgIGRpc2FibGVDbGlja1Byb3BhZ2F0aW9uOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBkb21ldmVudC5vbihlbCwgRFJBRy5TVEFSVC5qb2luKCcgJykgKyAnIGNsaWNrIGRibGNsaWNrJywgZG9tZXZlbnQuc3RvcFByb3BhZ2F0aW9uKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG1vdXNlIHBvc2l0aW9uIGZyb20gbW91c2UgZXZlbnQuXG4gICAgICpcbiAgICAgKiBJZiBzdXBwbGllZCByZWxhdHZlRWxlbWVudCBwYXJhbWV0ZXIgdGhlbiByZXR1cm4gcmVsYXRpdmUgcG9zaXRpb24gYmFzZWQgb24gZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBtb3VzZUV2ZW50IE1vdXNlIGV2ZW50IG9iamVjdFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJlbGF0aXZlRWxlbWVudCBIVE1MIGVsZW1lbnQgdGhhdCBjYWxjdWxhdGUgcmVsYXRpdmUgcG9zaXRpb24uXG4gICAgICogQHJldHVybnMge251bWJlcltdfSBtb3VzZSBwb3NpdGlvbi5cbiAgICAgKi9cbiAgICBnZXRNb3VzZVBvc2l0aW9uOiBmdW5jdGlvbihtb3VzZUV2ZW50LCByZWxhdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3Q7XG5cbiAgICAgICAgaWYgKCFyZWxhdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbbW91c2VFdmVudC5jbGllbnRYLCBtb3VzZUV2ZW50LmNsaWVudFldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVjdCA9IHJlbGF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbW91c2VFdmVudC5jbGllbnRYIC0gcmVjdC5sZWZ0IC0gcmVsYXRpdmVFbGVtZW50LmNsaWVudExlZnQsXG4gICAgICAgICAgICBtb3VzZUV2ZW50LmNsaWVudFkgLSByZWN0LnRvcCAtIHJlbGF0aXZlRWxlbWVudC5jbGllbnRUb3BcbiAgICAgICAgXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplIG1vdXNlIHdoZWVsIGV2ZW50IHRoYXQgZGlmZmVyZW50IGVhY2ggYnJvd3NlcnMuXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBlIE1vdXNlIHdoZWVsIGV2ZW50LlxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRlbHRhXG4gICAgICovXG4gICAgZ2V0V2hlZWxEZWx0YTogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgZGVsdGEgPSAwO1xuXG4gICAgICAgIGlmIChlLndoZWVsRGVsdGEpIHtcbiAgICAgICAgICAgIGRlbHRhID0gZS53aGVlbERlbHRhIC8gMTIwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUuZGV0YWlsKSB7XG4gICAgICAgICAgICBkZWx0YSA9IC1lLmRldGFpbCAvIDM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVsdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHByZXZlbnQgZmlyaW5nIG1vdXNlbGVhdmUgZXZlbnQgd2hlbiBtb3VzZSBlbnRlcmVkIGNoaWxkIGVsZW1lbnRzLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEhUTUwgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZSBNb3VzZSBldmVudFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBsZWF2ZT9cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jaGVja01vdXNlOiBmdW5jdGlvbihlbCwgZSkge1xuICAgICAgICB2YXIgcmVsYXRlZCA9IGUucmVsYXRlZFRhcmdldDtcblxuICAgICAgICBpZiAoIXJlbGF0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlIChyZWxhdGVkICYmIChyZWxhdGVkICE9PSBlbCkpIHtcbiAgICAgICAgICAgICAgICByZWxhdGVkID0gcmVsYXRlZC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAocmVsYXRlZCAhPT0gZWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUcmlnZ2VyIHNwZWNpZmljIGV2ZW50cyB0byBodG1sIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRXZlbnQgdHlwZSBuYW1lXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtldmVudERhdGFdIEV2ZW50IGRhdGFcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiBmdW5jdGlvbihvYmosIHR5cGUsIGV2ZW50RGF0YSkge1xuICAgICAgICB2YXIgck1vdXNlRXZlbnQgPSAvKG1vdXNlfGNsaWNrKS87XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGV2ZW50RGF0YSkgJiYgck1vdXNlRXZlbnQuZXhlYyh0eXBlKSkge1xuICAgICAgICAgICAgZXZlbnREYXRhID0gZG9tZXZlbnQubW91c2VFdmVudCh0eXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmouZGlzcGF0Y2hFdmVudCkge1xuICAgICAgICAgICAgb2JqLmRpc3BhdGNoRXZlbnQoZXZlbnREYXRhKTtcbiAgICAgICAgfSBlbHNlIGlmIChvYmouZmlyZUV2ZW50KSB7XG4gICAgICAgICAgICBvYmouZmlyZUV2ZW50KCdvbicgKyB0eXBlLCBldmVudERhdGEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSB2aXJ0dWFsIG1vdXNlIGV2ZW50LlxuICAgICAqXG4gICAgICogVGVzdGVkIGF0XG4gICAgICpcbiAgICAgKiAtIElFNyB+IElFMTFcbiAgICAgKiAtIENocm9tZVxuICAgICAqIC0gRmlyZWZveFxuICAgICAqIC0gU2FmYXJpXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZXZlbnRPYmpdIEV2ZW50IGRhdGFcbiAgICAgKiBAcmV0dXJucyB7TW91c2VFdmVudH0gVmlydHVhbCBtb3VzZSBldmVudC5cbiAgICAgKi9cbiAgICBtb3VzZUV2ZW50OiBmdW5jdGlvbih0eXBlLCBldmVudE9iaikge1xuICAgICAgICB2YXIgZXZ0LFxuICAgICAgICAgICAgZTtcblxuICAgICAgICBlID0gdXRpbC5leHRlbmQoe1xuICAgICAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgICAgIGNhbmNlbGFibGU6ICh0eXBlICE9PSAnbW91c2Vtb3ZlJyksXG4gICAgICAgICAgICB2aWV3OiB3aW5kb3csXG4gICAgICAgICAgICB3aGVlbERlbHRhOiAwLFxuICAgICAgICAgICAgZGV0YWlsOiAwLFxuICAgICAgICAgICAgc2NyZWVuWDogMCxcbiAgICAgICAgICAgIHNjcmVlblk6IDAsXG4gICAgICAgICAgICBjbGllbnRYOiAwLFxuICAgICAgICAgICAgY2xpZW50WTogMCxcbiAgICAgICAgICAgIGN0cmxLZXk6IGZhbHNlLFxuICAgICAgICAgICAgYWx0S2V5OiBmYWxzZSxcbiAgICAgICAgICAgIHNoaWZ0S2V5OiBmYWxzZSxcbiAgICAgICAgICAgIG1ldGFLZXk6IGZhbHNlLFxuICAgICAgICAgICAgYnV0dG9uOiAwLFxuICAgICAgICAgICAgcmVsYXRlZFRhcmdldDogdW5kZWZpbmVkICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH0sIGV2ZW50T2JqKTtcblxuICAgICAgICAvLyBwcmV2ZW50IHRocm93IGVycm9yIHdoZW4gaW5zZXJ0aW5nIHdoZWVsRGVsdGEgcHJvcGVydHkgdG8gbW91c2UgZXZlbnQgb24gYmVsb3cgSUU4XG4gICAgICAgIGlmIChicm93c2VyLm1zaWUgJiYgYnJvd3Nlci52ZXJzaW9uIDwgOSkge1xuICAgICAgICAgICAgZGVsZXRlIGUud2hlZWxEZWx0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRXZlbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdNb3VzZUV2ZW50cycpO1xuICAgICAgICAgICAgZXZ0LmluaXRNb3VzZUV2ZW50KHR5cGUsXG4gICAgICAgICAgICAgICAgZS5idWJibGVzLCBlLmNhbmNlbGFibGUsIGUudmlldywgZS5kZXRhaWwsXG4gICAgICAgICAgICAgICAgZS5zY3JlZW5YLCBlLnNjcmVlblksIGUuY2xpZW50WCwgZS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGUuY3RybEtleSwgZS5hbHRLZXksIGUuc2hpZnRLZXksIGUubWV0YUtleSxcbiAgICAgICAgICAgICAgICBlLmJ1dHRvbiwgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KSB7XG4gICAgICAgICAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuXG4gICAgICAgICAgICB1dGlsLmZvckVhY2goZSwgZnVuY3Rpb24odmFsdWUsIHByb3BOYW1lKSB7XG4gICAgICAgICAgICAgICAgZXZ0W3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICBldnQuYnV0dG9uID0gezA6IDEsIDE6IDQsIDI6IDJ9W2V2dC5idXR0b25dIHx8IGV2dC5idXR0b247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGV2dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTm9ybWFsaXplIG1vdXNlIGV2ZW50J3MgYnV0dG9uIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBDYW4gZGV0ZWN0IHdoaWNoIGJ1dHRvbiBpcyBjbGlja2VkIGJ5IHRoaXMgbWV0aG9kLlxuICAgICAqXG4gICAgICogTWVhbmluZyBvZiByZXR1cm4gbnVtYmVyc1xuICAgICAqXG4gICAgICogLSAwOiBwcmltYXJ5IG1vdXNlIGJ1dHRvblxuICAgICAqIC0gMTogd2hlZWwgYnV0dG9uIG9yIGNlbnRlciBidXR0b25cbiAgICAgKiAtIDI6IHNlY29uZGFyeSBtb3VzZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IG1vdXNlRXZlbnQgLSBUaGUgbW91c2UgZXZlbnQgb2JqZWN0IHdhbnQgdG8ga25vdy5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSAtIFRoZSB2YWx1ZSBvZiBtZWFuaW5nIHdoaWNoIGJ1dHRvbiBpcyBjbGlja2VkP1xuICAgICAqL1xuICAgIGdldE1vdXNlQnV0dG9uOiBmdW5jdGlvbihtb3VzZUV2ZW50KSB7XG4gICAgICAgIHZhciBidXR0b24sXG4gICAgICAgICAgICBwcmltYXJ5ID0gJzAsMSwzLDUsNycsXG4gICAgICAgICAgICBzZWNvbmRhcnkgPSAnMiw2JyxcbiAgICAgICAgICAgIHdoZWVsID0gJzQnO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5oYXNGZWF0dXJlKCdNb3VzZUV2ZW50cycsICcyLjAnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vdXNlRXZlbnQuYnV0dG9uO1xuICAgICAgICB9XG5cbiAgICAgICAgYnV0dG9uID0gbW91c2VFdmVudC5idXR0b24gKyAnJztcbiAgICAgICAgaWYgKH5wcmltYXJ5LmluZGV4T2YoYnV0dG9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSBpZiAofnNlY29uZGFyeS5pbmRleE9mKGJ1dHRvbikpIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9IGVsc2UgaWYgKH53aGVlbC5pbmRleE9mKGJ1dHRvbikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkb21ldmVudDtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFV0aWxpdHkgbW9kdWxlcyBmb3IgbWFuaXB1bGF0ZSBET00gZWxlbWVudHMuXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9tZXZlbnQgPSByZXF1aXJlKCcuL2RvbWV2ZW50Jyk7XG52YXIgQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbicpO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbCxcbiAgICBwb3NLZXkgPSAnX3BvcycsXG4gICAgZG9tdXRpbDtcblxudmFyIENTU19BVVRPX1JFR0VYID0gL15hdXRvJHxeJHwlLztcblxuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xufVxuXG5kb211dGlsID0ge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBET00gZWxlbWVudCBhbmQgcmV0dXJuIGl0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YWdOYW1lIFRhZyBuYW1lIHRvIGFwcGVuZC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBbY29udGFpbmVyXSBIVE1MIGVsZW1lbnQgd2lsbCBiZSBwYXJlbnQgdG8gY3JlYXRlZCBlbGVtZW50LlxuICAgICAqIGlmIG5vdCBzdXBwbGllZCwgd2lsbCB1c2UgKipkb2N1bWVudC5ib2R5KipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2NsYXNzTmFtZV0gRGVzaWduIGNsYXNzIG5hbWVzIHRvIGFwcGxpbmcgY3JlYXRlZCBlbGVtZW50LlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gSFRNTCBlbGVtZW50IGNyZWF0ZWQuXG4gICAgICovXG4gICAgYXBwZW5kSFRNTEVsZW1lbnQ6IGZ1bmN0aW9uKHRhZ05hbWUsIGNvbnRhaW5lciwgY2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciBlbDtcblxuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgfHwgJyc7XG5cbiAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG5cbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgZWxlbWVudCBmcm9tIHBhcmVudCBub2RlLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZWxlbWVudCB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoZWwgJiYgZWwucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGVsZW1lbnQgYnkgaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgZWxlbWVudCBpZCBhdHRyaWJ1dGVcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHN1cHBsaWVkIGVsZW1lbnQgaXMgbWF0Y2hlZCBzZWxlY3Rvci5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIGVsZW1lbnQgdG8gY2hlY2tcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBzZWxlY3RvciBzdHJpbmcgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBtYXRjaD9cbiAgICAgKi9cbiAgICBfbWF0Y2hlcjogZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciBjc3NDbGFzc1NlbGVjdG9yID0gL15cXC4vLFxuICAgICAgICAgICAgaWRTZWxlY3RvciA9IC9eIy87XG5cbiAgICAgICAgaWYgKGNzc0NsYXNzU2VsZWN0b3IudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBkb211dGlsLmhhc0NsYXNzKGVsLCBzZWxlY3Rvci5yZXBsYWNlKCcuJywgJycpKTtcbiAgICAgICAgfSBlbHNlIGlmIChpZFNlbGVjdG9yLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuaWQgPT09IHNlbGVjdG9yLnJlcGxhY2UoJyMnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gc2VsZWN0b3IudG9Mb3dlckNhc2UoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmluZCBET00gZWxlbWVudCBieSBzcGVjaWZpYyBzZWxlY3RvcnMuXG4gICAgICogYmVsb3cgdGhyZWUgc2VsZWN0b3Igb25seSBzdXBwb3J0ZWQuXG4gICAgICpcbiAgICAgKiAxLiBjc3Mgc2VsZWN0b3JcbiAgICAgKiAyLiBpZCBzZWxlY3RvclxuICAgICAqIDMuIG5vZGVOYW1lIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHsoSFRNTEVsZW1lbnR8c3RyaW5nKX0gW3Jvb3RdIFlvdSBjYW4gYXNzaWduIHJvb3QgZWxlbWVudCB0byBmaW5kLiBpZiBub3Qgc3VwcGxpZWQsIGRvY3VtZW50LmJvZHkgd2lsbCB1c2UuXG4gICAgICogQHBhcmFtIHtib29sZWFufGZ1bmN0aW9ufSBbbXVsdGlwbGU9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiByZXR1cm4gYWxsIGVsZW1lbnRzIHRoYXQgbWVldCBjb25kaXRpb24sIGlmIHNldCBmdW5jdGlvbiB0aGVuIHVzZSBpdCBmaWx0ZXIgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSBIVE1MIGVsZW1lbnQgZmluZGVkLlxuICAgICAqL1xuICAgIGZpbmQ6IGZ1bmN0aW9uKHNlbGVjdG9yLCByb290LCBtdWx0aXBsZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgICAgICBmb3VuZCA9IGZhbHNlLFxuICAgICAgICAgICAgaXNGaXJzdCA9IHV0aWwuaXNVbmRlZmluZWQobXVsdGlwbGUpIHx8IG11bHRpcGxlID09PSBmYWxzZSxcbiAgICAgICAgICAgIGlzRmlsdGVyID0gdXRpbC5pc0Z1bmN0aW9uKG11bHRpcGxlKTtcblxuICAgICAgICBpZiAodXRpbC5pc1N0cmluZyhyb290KSkge1xuICAgICAgICAgICAgcm9vdCA9IGRvbXV0aWwuZ2V0KHJvb3QpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByb290ID0gcm9vdCB8fCB3aW5kb3cuZG9jdW1lbnQuYm9keTtcblxuICAgICAgICBmdW5jdGlvbiByZWN1cnNlKGVsLCBzZWxlY3Rvcikge1xuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSBlbC5jaGlsZE5vZGVzLFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIGxlbiA9IGNoaWxkTm9kZXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGN1cnNvcjtcblxuICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGN1cnNvciA9IGNoaWxkTm9kZXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoY3Vyc29yLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChkb211dGlsLl9tYXRjaGVyKGN1cnNvciwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoaXNGaWx0ZXIgJiYgbXVsdGlwbGUoY3Vyc29yKSkgfHwgIWlzRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXJzb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRmlyc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJzb3IuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2UoY3Vyc29yLCBzZWxlY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZWN1cnNlKHJvb3QsIHNlbGVjdG9yKTtcblxuICAgICAgICByZXR1cm4gaXNGaXJzdCA/IChyZXN1bHRbMF0gfHwgbnVsbCkgOiByZXN1bHQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgcGFyZW50IGVsZW1lbnQgcmVjdXJzaXZlbHkuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBiYXNlIGVsZW1lbnQgdG8gc3RhcnQgZmluZC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3IgLSBzZWxlY3RvciBzdHJpbmcgZm9yIGZpbmRcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IC0gZWxlbWVudCBmaW5kZWQgb3IgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIGNsb3Nlc3Q6IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgcGFyZW50ID0gZWwucGFyZW50Tm9kZTtcblxuICAgICAgICBpZiAoZG9tdXRpbC5fbWF0Y2hlcihlbCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gd2luZG93LmRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICAgIGlmIChkb211dGlsLl9tYXRjaGVyKHBhcmVudCwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRleHRzIGluc2lkZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHJldHVybiB7c3RyaW5nfSB0ZXh0IGluc2lkZSBub2RlXG4gICAgICovXG4gICAgdGV4dDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIHJldCA9ICcnLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBub2RlVHlwZSA9IGVsLm5vZGVUeXBlO1xuXG4gICAgICAgIGlmIChub2RlVHlwZSkge1xuICAgICAgICAgICAgaWYgKG5vZGVUeXBlID09PSAxIHx8IG5vZGVUeXBlID09PSA5IHx8IG5vZGVUeXBlID09PSAxMSkge1xuICAgICAgICAgICAgICAgIC8vIG5vZGVzIHRoYXQgYXZhaWxhYmxlIGNvbnRhaW4gb3RoZXIgbm9kZXNcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVsLnRleHRDb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZm9yIChlbCA9IGVsLmZpcnN0Q2hpbGQ7IGVsOyBlbCA9IGVsLm5leHRTaWJsaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCArPSBkb211dGlsLnRleHQoZWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICAvLyBURVhULCBDREFUQSBTRUNUSU9OXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoOyBlbFtpXTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0ICs9IGRvbXV0aWwudGV4dChlbFtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRhdGEgYXR0cmlidXRlIHRvIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBlbGVtZW50IHRvIHNldCBkYXRhIGF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBrZXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xudW1iZXJ9IGRhdGEgLSBkYXRhIHZhbHVlXG4gICAgICovXG4gICAgc2V0RGF0YTogZnVuY3Rpb24oZWwsIGtleSwgZGF0YSkge1xuICAgICAgICBpZiAoJ2RhdGFzZXQnIGluIGVsKSB7XG4gICAgICAgICAgICBlbC5kYXRhc2V0W2tleV0gPSBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXksIGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZGF0YSB2YWx1ZSBmcm9tIGRhdGEtYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKGVsLCBrZXkpIHtcbiAgICAgICAgaWYgKCdkYXRhc2V0JyBpbiBlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmRhdGFzZXRba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGVsZW1lbnQgaGFzIHNwZWNpZmljIGRlc2lnbiBjbGFzcyBuYW1lLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgY3NzIGNsYXNzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIHdoZW4gZWxlbWVudCBoYXMgdGhhdCBjc3MgY2xhc3MgbmFtZVxuICAgICAqL1xuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihlbCwgbmFtZSkge1xuICAgICAgICB2YXIgY2xhc3NOYW1lO1xuXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChlbC5jbGFzc0xpc3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xhc3NOYW1lID0gZG9tdXRpbC5nZXRDbGFzcyhlbCk7XG5cbiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZS5sZW5ndGggPiAwICYmIG5ldyBSZWdFeHAoJyhefFxcXFxzKScgKyBuYW1lICsgJyhcXFxcc3wkKScpLnRlc3QoY2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQWRkIGRlc2lnbiBjbGFzcyB0byBIVE1MIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBjc3MgY2xhc3MgbmFtZVxuICAgICAqL1xuICAgIGFkZENsYXNzOiBmdW5jdGlvbihlbCwgbmFtZSkge1xuICAgICAgICB2YXIgY2xhc3NOYW1lO1xuXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChlbC5jbGFzc0xpc3QpKSB7XG4gICAgICAgICAgICB1dGlsLmZvckVhY2hBcnJheShuYW1lLnNwbGl0KCcgJyksIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCh2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghZG9tdXRpbC5oYXNDbGFzcyhlbCwgbmFtZSkpIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IGRvbXV0aWwuZ2V0Q2xhc3MoZWwpO1xuICAgICAgICAgICAgZG9tdXRpbC5zZXRDbGFzcyhlbCwgKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSArICcgJyA6ICcnKSArIG5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogT3ZlcndyaXRlIGRlc2lnbiBjbGFzcyB0byBIVE1MIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBjc3MgY2xhc3MgbmFtZVxuICAgICAqL1xuICAgIHNldENsYXNzOiBmdW5jdGlvbihlbCwgbmFtZSkge1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChlbC5jbGFzc05hbWUuYmFzZVZhbCkpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IG5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUuYmFzZVZhbCA9IG5hbWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRWxlbWVudOyXkCBjc3NDbGFzc+yGjeyEseydhCDsoJzqsbDtlZjripQg66mU7ISc65OcXG4gICAgICogUmVtb3ZlIHNwZWNpZmljIGRlc2lnbiBjbGFzcyBmcm9tIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGNsYXNzIG5hbWUgdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsLCBuYW1lKSB7XG4gICAgICAgIHZhciByZW1vdmVkID0gJyc7XG5cbiAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGVsLmNsYXNzTGlzdCkpIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVkID0gKCcgJyArIGRvbXV0aWwuZ2V0Q2xhc3MoZWwpICsgJyAnKS5yZXBsYWNlKCcgJyArIG5hbWUgKyAnICcsICcgJyk7XG4gICAgICAgICAgICBkb211dGlsLnNldENsYXNzKGVsLCB0cmltKHJlbW92ZWQpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgSFRNTCBlbGVtZW50J3MgZGVzaWduIGNsYXNzZXMuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBlbGVtZW50IGNzcyBjbGFzcyBuYW1lXG4gICAgICovXG4gICAgZ2V0Q2xhc3M6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmICghZWwgfHwgIWVsLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHV0aWwuaXNVbmRlZmluZWQoZWwuY2xhc3NOYW1lLmJhc2VWYWwpID8gZWwuY2xhc3NOYW1lIDogZWwuY2xhc3NOYW1lLmJhc2VWYWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBzcGVjaWZpYyBDU1Mgc3R5bGUgdmFsdWUgZnJvbSBIVE1MIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3R5bGUgY3NzIGF0dHJpYnV0ZSBuYW1lXG4gICAgICogQHJldHVybnMgeyhzdHJpbmd8bnVsbCl9IGNzcyBzdHlsZSB2YWx1ZVxuICAgICAqL1xuICAgIGdldFN0eWxlOiBmdW5jdGlvbihlbCwgc3R5bGUpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gZWwuc3R5bGVbc3R5bGVdIHx8IChlbC5jdXJyZW50U3R5bGUgJiYgZWwuY3VycmVudFN0eWxlW3N0eWxlXSksXG4gICAgICAgICAgICBjc3M7XG5cbiAgICAgICAgaWYgKCghdmFsdWUgfHwgdmFsdWUgPT09ICdhdXRvJykgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcpIHtcbiAgICAgICAgICAgIGNzcyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWwsIG51bGwpO1xuICAgICAgICAgICAgdmFsdWUgPSBjc3MgPyBjc3Nbc3R5bGVdIDogbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gJ2F1dG8nID8gbnVsbCA6IHZhbHVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBnZXQgZWxlbWVudCdzIGNvbXB1dGVkIHN0eWxlIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIGluIGxvd2VyIElFOC4gdXNlIHBvbHlmaWxsIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIG9iamVjdC4gaXQgaGFzIG9ubHkgb25lIGZ1bmN0aW9uICdnZXRQcm9wZXJ0eVZhbHVlJ1xuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZWxlbWVudCB3YW50IHRvIGdldCBzdHlsZS5cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB2aXJ0dWFsIENTU1N0eWxlRGVjbGFyYXRpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIGdldENvbXB1dGVkU3R5bGU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBkZWZhdWx0VmlldyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3O1xuXG4gICAgICAgIGlmICghZGVmYXVsdFZpZXcgfHwgIWRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmUgPSAvKFxcLShbYS16XSl7MX0pL2c7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSAnZmxvYXQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gJ3N0eWxlRmxvYXQnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLnRlc3QocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBwcm9wLnJlcGxhY2UocmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5jdXJyZW50U3R5bGVbcHJvcF0gPyBlbC5jdXJyZW50U3R5bGVbcHJvcF0gOiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwb3NpdGlvbiBDU1Mgc3R5bGUuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF0gbGVmdCBwaXhlbCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF0gdG9wIHBpeGVsIHZhbHVlLlxuICAgICAqL1xuICAgIHNldFBvc2l0aW9uOiBmdW5jdGlvbihlbCwgeCwgeSkge1xuICAgICAgICB4ID0gdXRpbC5pc1VuZGVmaW5lZCh4KSA/IDAgOiB4O1xuICAgICAgICB5ID0gdXRpbC5pc1VuZGVmaW5lZCh5KSA/IDAgOiB5O1xuXG4gICAgICAgIGVsW3Bvc0tleV0gPSBbeCwgeV07XG5cbiAgICAgICAgZWwuc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgICBlbC5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHBvc2l0aW9uIGZyb20gSFRNTCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY2xlYXI9ZmFsc2VdIGNsZWFyIGNhY2hlIGJlZm9yZSBjYWxjdWxhdGluZyBwb3NpdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IHBvaW50XG4gICAgICovXG4gICAgZ2V0UG9zaXRpb246IGZ1bmN0aW9uKGVsLCBjbGVhcikge1xuICAgICAgICB2YXIgbGVmdCxcbiAgICAgICAgICAgIHRvcCxcbiAgICAgICAgICAgIGJvdW5kO1xuXG4gICAgICAgIGlmIChjbGVhcikge1xuICAgICAgICAgICAgZWxbcG9zS2V5XSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxbcG9zS2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsW3Bvc0tleV07XG4gICAgICAgIH1cblxuICAgICAgICBsZWZ0ID0gMDtcbiAgICAgICAgdG9wID0gMDtcblxuICAgICAgICBpZiAoKENTU19BVVRPX1JFR0VYLnRlc3QoZWwuc3R5bGUubGVmdCkgfHwgQ1NTX0FVVE9fUkVHRVgudGVzdChlbC5zdHlsZS50b3ApKSAmJlxuICAgICAgICAgICAgJ2dldEJvdW5kaW5nQ2xpZW50UmVjdCcgaW4gZWwpIHtcbiAgICAgICAgICAgIC8vIOyXmOumrOuovO2KuOydmCBsZWZ065iQ64qUIHRvcOydtCAnYXV0byfsnbwg65WMIOyImOuLqFxuICAgICAgICAgICAgYm91bmQgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgbGVmdCA9IGJvdW5kLmxlZnQ7XG4gICAgICAgICAgICB0b3AgPSBib3VuZC50b3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZWZ0ID0gcGFyc2VGbG9hdChlbC5zdHlsZS5sZWZ0IHx8IDApO1xuICAgICAgICAgICAgdG9wID0gcGFyc2VGbG9hdChlbC5zdHlsZS50b3AgfHwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW2xlZnQsIHRvcF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBlbGVtZW50J3Mgc2l6ZVxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHJldHVybiB7bnVtYmVyW119IHdpZHRoLCBoZWlnaHRcbiAgICAgKi9cbiAgICBnZXRTaXplOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgYm91bmQsXG4gICAgICAgICAgICB3aWR0aCA9IGRvbXV0aWwuZ2V0U3R5bGUoZWwsICd3aWR0aCcpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gZG9tdXRpbC5nZXRTdHlsZShlbCwgJ2hlaWdodCcpO1xuXG4gICAgICAgIGlmICgoQ1NTX0FVVE9fUkVHRVgudGVzdCh3aWR0aCkgfHwgQ1NTX0FVVE9fUkVHRVgudGVzdChoZWlnaHQpKSAmJlxuICAgICAgICAgICAgJ2dldEJvdW5kaW5nQ2xpZW50UmVjdCcgaW4gZWwpIHtcbiAgICAgICAgICAgIGJvdW5kID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB3aWR0aCA9IGJvdW5kLndpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gYm91bmQuaGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2lkdGggPSBwYXJzZUZsb2F0KHdpZHRoIHx8IDApO1xuICAgICAgICAgICAgaGVpZ2h0ID0gcGFyc2VGbG9hdChoZWlnaHQgfHwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBzcGVjaWZpYyBDU1Mgc3R5bGUgaXMgYXZhaWxhYmxlLlxuICAgICAqIEBwYXJhbSB7YXJyYXl9IHByb3BzIHByb3BlcnR5IG5hbWUgdG8gdGVzdGluZ1xuICAgICAqIEByZXR1cm4geyhzdHJpbmd8Ym9vbGVhbil9IHJldHVybiB0cnVlIHdoZW4gcHJvcGVydHkgaXMgYXZhaWxhYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgcHJvcHMgPSBbJ3RyYW5zZm9ybScsICctd2Via2l0LXRyYW5zZm9ybSddO1xuICAgICAqIGRvbXV0aWwudGVzdFByb3AocHJvcHMpOyAgICAvLyAndHJhbnNmb3JtJ1xuICAgICAqL1xuICAgIHRlc3RQcm9wOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUsXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIGxlbiA9IHByb3BzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAocHJvcHNbaV0gaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZm9ybSBkYXRhXG4gICAgICogQHBhcmFtIHtIVE1MRm9ybUVsZW1lbnR9IGZvcm1FbGVtZW50IC0gZm9ybSBlbGVtZW50IHRvIGV4dHJhY3QgZGF0YVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IGZvcm0gZGF0YVxuICAgICAqL1xuICAgIGdldEZvcm1EYXRhOiBmdW5jdGlvbihmb3JtRWxlbWVudCkge1xuICAgICAgICB2YXIgZ3JvdXBlZEJ5TmFtZSA9IG5ldyBDb2xsZWN0aW9uKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5sZW5ndGg7IH0pLFxuICAgICAgICAgICAgbm9EaXNhYmxlZEZpbHRlciA9IGZ1bmN0aW9uKGVsKSB7IHJldHVybiAhZWwuZGlzYWJsZWQ7IH0sXG4gICAgICAgICAgICBvdXRwdXQgPSB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBncm91cGVkQnlOYW1lLmFkZC5hcHBseShcbiAgICAgICAgICAgIGdyb3VwZWRCeU5hbWUsIFxuICAgICAgICAgICAgZG9tdXRpbC5maW5kKCdpbnB1dCcsIGZvcm1FbGVtZW50LCBub0Rpc2FibGVkRmlsdGVyKVxuICAgICAgICAgICAgICAgIC5jb25jYXQoZG9tdXRpbC5maW5kKCdzZWxlY3QnLCBmb3JtRWxlbWVudCwgbm9EaXNhYmxlZEZpbHRlcikpXG4gICAgICAgICAgICAgICAgLmNvbmNhdChkb211dGlsLmZpbmQoJ3RleHRhcmVhJywgZm9ybUVsZW1lbnQsIG5vRGlzYWJsZWRGaWx0ZXIpKVxuICAgICAgICApO1xuXG4gICAgICAgIGdyb3VwZWRCeU5hbWUgPSBncm91cGVkQnlOYW1lLmdyb3VwQnkoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbCAmJiBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCAnX290aGVyJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoKGdyb3VwZWRCeU5hbWUsIGZ1bmN0aW9uKGVsZW1lbnRzLCBuYW1lKSB7XG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ19vdGhlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICB0eXBlID0gZWwudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBbZWxlbWVudHMuZmluZChmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwuY2hlY2tlZDsgfSkudG9BcnJheSgpLnBvcCgpXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwuY2hlY2tlZDsgfSkudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZU5hbWUgPT09ICdzZWxlY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLmZpbmQoZnVuY3Rpb24oZWwpIHsgcmV0dXJuICEhZWwuY2hpbGROb2Rlcy5sZW5ndGg7IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoZG9tdXRpbC5maW5kKCdvcHRpb24nLCBlbCwgZnVuY3Rpb24ob3B0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHQuc2VsZWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZWxlbWVudHMuZmluZChmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwudmFsdWUgIT09ICcnOyB9KS50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdXRpbC5tYXAocmVzdWx0LCBmdW5jdGlvbihlbCkgeyByZXR1cm4gZWwudmFsdWU7IH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHRbMF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb3V0cHV0W25hbWVdID0gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfVxufTtcblxuLyplc2xpbnQtZGlzYWJsZSovXG52YXIgdXNlclNlbGVjdFByb3BlcnR5ID0gZG9tdXRpbC50ZXN0UHJvcChbXG4gICAgJ3VzZXJTZWxlY3QnLCBcbiAgICAnV2Via2l0VXNlclNlbGVjdCcsIFxuICAgICdPVXNlclNlbGVjdCcsIFxuICAgICdNb3pVc2VyU2VsZWN0JywgXG4gICAgJ21zVXNlclNlbGVjdCdcbl0pO1xudmFyIHN1cHBvcnRTZWxlY3RTdGFydCA9ICdvbnNlbGVjdHN0YXJ0JyBpbiBkb2N1bWVudDtcbnZhciBwcmV2U2VsZWN0U3R5bGUgPSAnJztcbi8qZXNsaW50LWVuYWJsZSovXG5cbi8qKlxuICogRGlzYWJsZSBicm93c2VyJ3MgdGV4dCBzZWxlY3Rpb24gYmVoYXZpb3JzLlxuICogQG1ldGhvZFxuICovXG5kb211dGlsLmRpc2FibGVUZXh0U2VsZWN0aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdXBwb3J0U2VsZWN0U3RhcnQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZG9tZXZlbnQub24od2luZG93LCAnc2VsZWN0c3RhcnQnLCBkb21ldmVudC5wcmV2ZW50RGVmYXVsdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGU7XG4gICAgICAgIHByZXZTZWxlY3RTdHlsZSA9IHN0eWxlW3VzZXJTZWxlY3RQcm9wZXJ0eV07XG4gICAgICAgIHN0eWxlW3VzZXJTZWxlY3RQcm9wZXJ0eV0gPSAnbm9uZSc7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogRW5hYmxlIGJyb3dzZXIncyB0ZXh0IHNlbGVjdGlvbiBiZWhhdmlvcnMuXG4gKiBAbWV0aG9kXG4gKi9cbmRvbXV0aWwuZW5hYmxlVGV4dFNlbGVjdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgICBpZiAoc3VwcG9ydFNlbGVjdFN0YXJ0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvbWV2ZW50Lm9mZih3aW5kb3csICdzZWxlY3RzdGFydCcsIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZVt1c2VyU2VsZWN0UHJvcGVydHldID0gcHJldlNlbGVjdFN0eWxlO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIERpc2FibGUgYnJvd3NlcidzIGltYWdlIGRyYWcgYmVoYXZpb3JzLlxuICovXG5kb211dGlsLmRpc2FibGVJbWFnZURyYWcgPSBmdW5jdGlvbigpIHtcbiAgICBkb21ldmVudC5vbih3aW5kb3csICdkcmFnc3RhcnQnLCBkb21ldmVudC5wcmV2ZW50RGVmYXVsdCk7XG59O1xuXG4vKipcbiAqIEVuYWJsZSBicm93c2VyJ3MgaW1hZ2UgZHJhZyBiZWhhdmlvcnMuXG4gKi9cbmRvbXV0aWwuZW5hYmxlSW1hZ2VEcmFnID0gZnVuY3Rpb24oKSB7XG4gICAgZG9tZXZlbnQub2ZmKHdpbmRvdywgJ2RyYWdzdGFydCcsIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tdXRpbDtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEdlbmVyYWwgZHJhZyBoYW5kbGVyXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBkb211dGlsID0gcmVxdWlyZSgnLi9kb211dGlsJyk7XG52YXIgZG9tZXZlbnQgPSByZXF1aXJlKCcuL2RvbWV2ZW50Jyk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgQ3VzdG9tRXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGRyYWcgaGFuZGxlclxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLmRpc3RhbmNlPTEwXSAtIGRpc3RhbmNlIGluIHBpeGVscyBhZnRlciBtb3VzZSBtdXN0IG1vdmUgYmVmb3JlIGRyYWdnaW5nIHNob3VsZCBzdGFydFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gY29udGFpbmVyIGVsZW1lbnQgdG8gYmluZCBkcmFnIGV2ZW50c1xuICovXG5mdW5jdGlvbiBEcmFnKG9wdGlvbnMsIGNvbnRhaW5lcikge1xuICAgIGRvbWV2ZW50Lm9uKGNvbnRhaW5lciwgJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2VEb3duLCB0aGlzKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgZGlzdGFuY2U6IDEwXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9pc01vdmVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBkcmFnZ2luZyBkaXN0YW5jZSBpbiBwaXhlbCBiZXR3ZWVuIG1vdXNlZG93biBhbmQgZmlyaW5nIGRyYWdTdGFydCBldmVudHNcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX2Rpc3RhbmNlID0gMDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2RyYWdTdGFydEZpcmVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX2RyYWdTdGFydEV2ZW50RGF0YSA9IG51bGw7XG59XG5cbi8qKlxuICogRGVzdHJveSBtZXRob2QuXG4gKi9cbkRyYWcucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICBkb21ldmVudC5vZmYodGhpcy5jb250YWluZXIsICdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgdGhpcyk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLmNvbnRhaW5lciA9IHRoaXMuX2lzTW92ZWQgPSB0aGlzLl9kaXN0YW5jZSA9XG4gICAgICAgIHRoaXMuX2RyYWdTdGFydEZpcmVkID0gdGhpcy5fZHJhZ1N0YXJ0RXZlbnREYXRhID0gbnVsbDtcbn07XG5cbi8qKlxuICogVG9nZ2xlIGV2ZW50cyBmb3IgbW91c2UgZHJhZ2dpbmcuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHRvQmluZCAtIGJpbmQgZXZlbnRzIHJlbGF0ZWQgd2l0aCBkcmFnZ2luZyB3aGVuIHN1cHBsaWVkIFwidHJ1ZVwiXG4gKi9cbkRyYWcucHJvdG90eXBlLl90b2dnbGVEcmFnRXZlbnQgPSBmdW5jdGlvbih0b0JpbmQpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgIGRvbU1ldGhvZCxcbiAgICAgICAgbWV0aG9kO1xuXG4gICAgaWYgKHRvQmluZCkge1xuICAgICAgICBkb21NZXRob2QgPSAnb24nO1xuICAgICAgICBtZXRob2QgPSAnZGlzYWJsZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZG9tTWV0aG9kID0gJ29mZic7XG4gICAgICAgIG1ldGhvZCA9ICdlbmFibGUnO1xuICAgIH1cblxuICAgIGRvbXV0aWxbbWV0aG9kICsgJ1RleHRTZWxlY3Rpb24nXShjb250YWluZXIpO1xuICAgIGRvbXV0aWxbbWV0aG9kICsgJ0ltYWdlRHJhZyddKGNvbnRhaW5lcik7XG4gICAgZG9tZXZlbnRbZG9tTWV0aG9kXShnbG9iYWwuZG9jdW1lbnQsIHtcbiAgICAgICAgbW91c2Vtb3ZlOiB0aGlzLl9vbk1vdXNlTW92ZSxcbiAgICAgICAgbW91c2V1cDogdGhpcy5fb25Nb3VzZVVwXG4gICAgfSwgdGhpcyk7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSBtb3VzZSBldmVudCBvYmplY3QuXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IG1vdXNlRXZlbnQgLSBtb3VzZSBldmVudCBvYmplY3QuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBub3JtYWxpemVkIG1vdXNlIGV2ZW50IGRhdGEuXG4gKi9cbkRyYWcucHJvdG90eXBlLl9nZXRFdmVudERhdGEgPSBmdW5jdGlvbihtb3VzZUV2ZW50KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiBtb3VzZUV2ZW50LnRhcmdldCB8fCBtb3VzZUV2ZW50LnNyY0VsZW1lbnQsXG4gICAgICAgIG9yaWdpbkV2ZW50OiBtb3VzZUV2ZW50XG4gICAgfTtcbn07XG5cbi8qKlxuICogTW91c2VEb3duIERPTSBldmVudCBoYW5kbGVyLlxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBtb3VzZURvd25FdmVudCBNb3VzZURvd24gZXZlbnQgb2JqZWN0LlxuICovXG5EcmFnLnByb3RvdHlwZS5fb25Nb3VzZURvd24gPSBmdW5jdGlvbihtb3VzZURvd25FdmVudCkge1xuICAgIC8vIG9ubHkgcHJpbWFyeSBidXR0b24gY2FuIHN0YXJ0IGRyYWcuXG4gICAgaWYgKGRvbWV2ZW50LmdldE1vdXNlQnV0dG9uKG1vdXNlRG93bkV2ZW50KSAhPT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZGlzdGFuY2UgPSAwO1xuICAgIHRoaXMuX2RyYWdTdGFydEZpcmVkID0gZmFsc2U7XG4gICAgdGhpcy5fZHJhZ1N0YXJ0RXZlbnREYXRhID0gdGhpcy5fZ2V0RXZlbnREYXRhKG1vdXNlRG93bkV2ZW50KTtcblxuICAgIHRoaXMuX3RvZ2dsZURyYWdFdmVudCh0cnVlKTtcbn07XG5cbi8qKlxuICogTW91c2VNb3ZlIERPTSBldmVudCBoYW5kbGVyLlxuICogQGVtaXRzIERyYWcjZHJhZ1xuICogQGVtaXRzIERyYWcjZHJhZ1N0YXJ0XG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IG1vdXNlTW92ZUV2ZW50IE1vdXNlTW92ZSBldmVudCBvYmplY3QuXG4gKi9cbkRyYWcucHJvdG90eXBlLl9vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKG1vdXNlTW92ZUV2ZW50KSB7XG4gICAgdmFyIGRpc3RhbmNlID0gdGhpcy5vcHRpb25zLmRpc3RhbmNlO1xuICAgIC8vIHByZXZlbnQgYXV0b21hdGljIHNjcm9sbGluZy5cbiAgICBkb21ldmVudC5wcmV2ZW50RGVmYXVsdChtb3VzZU1vdmVFdmVudCk7XG5cbiAgICB0aGlzLl9pc01vdmVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9kaXN0YW5jZSA8IGRpc3RhbmNlKSB7XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlICs9IDE7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2RyYWdTdGFydEZpcmVkKSB7XG4gICAgICAgIHRoaXMuX2RyYWdTdGFydEZpcmVkID0gdHJ1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhZyBzdGFydHMgZXZlbnRzLiBjYW5jZWxhYmxlLlxuICAgICAgICAgKiBAZXZlbnQgRHJhZyNkcmFnU3RhcnRcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0IC0gdGFyZ2V0IGVsZW1lbnQgaW4gdGhpcyBldmVudC5cbiAgICAgICAgICogQHByb3BlcnR5IHtNb3VzZUV2ZW50fSBvcmlnaW5FdmVudCAtIG9yaWdpbmFsIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIGlmICghdGhpcy5pbnZva2UoJ2RyYWdTdGFydCcsIHRoaXMuX2RyYWdTdGFydEV2ZW50RGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMuX3RvZ2dsZURyYWdFdmVudChmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgd2hpbGUgZHJhZ2dpbmcuXG4gICAgICogQGV2ZW50IERyYWcjZHJhZ1xuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0IC0gdGFyZ2V0IGVsZW1lbnQgaW4gdGhpcyBldmVudC5cbiAgICAgKiBAcHJvcGVydHkge01vdXNlRXZlbnR9IG9yaWdpbkV2ZW50IC0gb3JpZ2luYWwgbW91c2UgZXZlbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIHRoaXMuZmlyZSgnZHJhZycsIHRoaXMuX2dldEV2ZW50RGF0YShtb3VzZU1vdmVFdmVudCkpO1xufTtcblxuLyoqXG4gKiBNb3VzZVVwIERPTSBldmVudCBoYW5kbGVyLlxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBtb3VzZVVwRXZlbnQgTW91c2VVcCBldmVudCBvYmplY3QuXG4gKiBAZW1pdHMgRHJhZyNkcmFnRW5kXG4gKiBAZW1pdHMgRHJhZyNjbGlja1xuICovXG5EcmFnLnByb3RvdHlwZS5fb25Nb3VzZVVwID0gZnVuY3Rpb24obW91c2VVcEV2ZW50KSB7XG4gICAgdGhpcy5fdG9nZ2xlRHJhZ0V2ZW50KGZhbHNlKTtcblxuICAgIC8vIGVtaXQgXCJjbGlja1wiIGV2ZW50IHdoZW4gbm90IGVtaXR0ZWQgZHJhZyBldmVudCBiZXR3ZWVuIG1vdXNlZG93biBhbmQgbW91c2V1cC5cbiAgICBpZiAodGhpcy5faXNNb3ZlZCkge1xuICAgICAgICB0aGlzLl9pc01vdmVkID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYWcgZW5kIGV2ZW50cy5cbiAgICAgICAgICogQGV2ZW50IERyYWcjZHJhZ0VuZFxuICAgICAgICAgKiBAdHlwZSB7TW91c2VFdmVudH1cbiAgICAgICAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0IC0gdGFyZ2V0IGVsZW1lbnQgaW4gdGhpcyBldmVudC5cbiAgICAgICAgICogQHByb3BlcnR5IHtNb3VzZUV2ZW50fSBvcmlnaW5FdmVudCAtIG9yaWdpbmFsIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlyZSgnZHJhZ0VuZCcsIHRoaXMuX2dldEV2ZW50RGF0YShtb3VzZVVwRXZlbnQpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsaWNrIGV2ZW50cy5cbiAgICAgKiBAZXZlbnQgRHJhZyNjbGlja1xuICAgICAqIEB0eXBlIHtNb3VzZUV2ZW50fVxuICAgICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIHRhcmdldCBlbGVtZW50IGluIHRoaXMgZXZlbnQuXG4gICAgICogQHByb3BlcnR5IHtNb3VzZUV2ZW50fSBvcmlnaW5FdmVudCAtIG9yaWdpbmFsIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICB0aGlzLmZpcmUoJ2NsaWNrJywgdGhpcy5fZ2V0RXZlbnREYXRhKG1vdXNlVXBFdmVudCkpO1xufTtcblxudXRpbC5DdXN0b21FdmVudHMubWl4aW4oRHJhZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRHJhZztcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRoZSBiYXNlIGNsYXNzIG9mIHZpZXdzLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgZG9tdXRpbCA9IHJlcXVpcmUoJy4vZG9tdXRpbCcpO1xudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb24nKTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIG9mIHZpZXdzLlxuICpcbiAqIEFsbCB2aWV3cyBjcmVhdGUgb3duIGNvbnRhaW5lciBlbGVtZW50IGluc2lkZSBzdXBwbGllZCBjb250YWluZXIgZWxlbWVudC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvcHRpb25zfSBvcHRpb25zIFRoZSBvYmplY3QgZm9yIGRlc2NyaWJlIHZpZXcncyBzcGVjcy5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBEZWZhdWx0IGNvbnRhaW5lciBlbGVtZW50IGZvciB2aWV3LiB5b3UgY2FuIHVzZSB0aGlzIGVsZW1lbnQgZm9yIHRoaXMuY29udGFpbmVyIHN5bnRheC5cbiAqL1xuZnVuY3Rpb24gVmlldyhvcHRpb25zLCBjb250YWluZXIpIHtcbiAgICB2YXIgaWQgPSB1dGlsLnN0YW1wKHRoaXMpO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChjb250YWluZXIpKSB7XG4gICAgICAgIGNvbnRhaW5lciA9IGRvbXV0aWwuYXBwZW5kSFRNTEVsZW1lbnQoJ2RpdicpO1xuICAgIH1cblxuICAgIGRvbXV0aWwuYWRkQ2xhc3MoY29udGFpbmVyLCAndHVpLXZpZXctJyArIGlkKTtcblxuICAgIC8qKlxuICAgICAqIHVuaXF1ZSBpZFxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogYmFzZSBlbGVtZW50IG9mIHZpZXcuXG4gICAgICogQHR5cGUge0hUTUxESVZFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXG4gICAgLyoqXG4gICAgICogY2hpbGQgdmlld3MuXG4gICAgICogQHR5cGUge0NvbGxlY3Rpb259XG4gICAgICovXG4gICAgdGhpcy5jaGlsZHMgPSBuZXcgQ29sbGVjdGlvbihmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgIHJldHVybiB1dGlsLnN0YW1wKHZpZXcpO1xuICAgIH0pO1xuICAgIC8qZXNsaW50LWVuYWJsZSovXG5cbiAgICAvKipcbiAgICAgKiBwYXJlbnQgdmlldyBpbnN0YW5jZS5cbiAgICAgKiBAdHlwZSB7Vmlld31cbiAgICAgKi9cbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG59XG5cbi8qKlxuICogQWRkIGNoaWxkIHZpZXdzLlxuICogQHBhcmFtIHtWaWV3fSB2aWV3IFRoZSB2aWV3IGluc3RhbmNlIHRvIGFkZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtmbl0gRnVuY3Rpb24gZm9yIGludm9rZSBiZWZvcmUgYWRkLiBwYXJlbnQgdmlldyBjbGFzcyBpcyBzdXBwbGllZCBmaXJzdCBhcmd1bWVudHMuXG4gKi9cblZpZXcucHJvdG90eXBlLmFkZENoaWxkID0gZnVuY3Rpb24odmlldywgZm4pIHtcbiAgICBpZiAoZm4pIHtcbiAgICAgICAgZm4uY2FsbCh2aWV3LCB0aGlzKTtcbiAgICB9XG4gICAgLy8gYWRkIHBhcmVudCB2aWV3XG4gICAgdmlldy5wYXJlbnQgPSB0aGlzO1xuXG4gICAgdGhpcy5jaGlsZHMuYWRkKHZpZXcpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgYWRkZWQgY2hpbGQgdmlldy5cbiAqIEBwYXJhbSB7KG51bWJlcnxWaWV3KX0gaWQgVmlldyBpZCBvciBpbnN0YW5jZSBpdHNlbGYgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2ZuXSBGdW5jdGlvbiBmb3IgaW52b2tlIGJlZm9yZSByZW1vdmUuIHBhcmVudCB2aWV3IGNsYXNzIGlzIHN1cHBsaWVkIGZpcnN0IGFyZ3VtZW50cy5cbiAqL1xuVmlldy5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbihpZCwgZm4pIHtcbiAgICB2YXIgdmlldyA9IHV0aWwuaXNOdW1iZXIoaWQpID8gdGhpcy5jaGlsZHMuaXRlbXNbaWRdIDogaWQ7XG5cbiAgICBpZCA9IHV0aWwuc3RhbXAodmlldyk7XG5cbiAgICBpZiAoZm4pIHtcbiAgICAgICAgZm4uY2FsbCh2aWV3LCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkcy5yZW1vdmUoaWQpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgdmlldyByZWN1cnNpdmVseS5cbiAqL1xuVmlldy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jaGlsZHMuZWFjaChmdW5jdGlvbihjaGlsZFZpZXcpIHtcbiAgICAgICAgY2hpbGRWaWV3LnJlbmRlcigpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBJbnZva2UgZnVuY3Rpb24gcmVjdXJzaXZlbHkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIGZ1bmN0aW9uIHRvIGludm9rZSBjaGlsZCB2aWV3IHJlY3Vyc2l2ZWx5XG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtza2lwVGhpcz1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIHNraXAgaW52b2tlIHdpdGggdGhpcyhyb290KSB2aWV3LlxuICovXG5WaWV3LnByb3RvdHlwZS5yZWN1cnNpdmUgPSBmdW5jdGlvbihmbiwgc2tpcFRoaXMpIHtcbiAgICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc2tpcFRoaXMpIHtcbiAgICAgICAgZm4odGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZHMuZWFjaChmdW5jdGlvbihjaGlsZFZpZXcpIHtcbiAgICAgICAgY2hpbGRWaWV3LnJlY3Vyc2l2ZShmbik7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFJlc2l6ZSB2aWV3IHJlY3Vyc2l2ZWx5IHRvIHBhcmVudC5cbiAqL1xuVmlldy5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLFxuICAgICAgICBwYXJlbnQgPSB0aGlzLnBhcmVudDtcblxuICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNGdW5jdGlvbihwYXJlbnQuX29uUmVzaXplKSkge1xuICAgICAgICAgICAgcGFyZW50Ll9vblJlc2l6ZS5hcHBseShwYXJlbnQsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICB9XG59O1xuXG4vKipcbiAqIEludm9raW5nIG1ldGhvZCBiZWZvcmUgZGVzdHJveWluZy5cbiAqL1xuVmlldy5wcm90b3R5cGUuX2JlZm9yZURlc3Ryb3kgPSBmdW5jdGlvbigpIHt9O1xuXG4vKipcbiAqIENsZWFyIHByb3BlcnRpZXNcbiAqL1xuVmlldy5wcm90b3R5cGUuX2Rlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9iZWZvcmVEZXN0cm95KCk7XG4gICAgdGhpcy5jaGlsZHMuY2xlYXIoKTtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIHRoaXMuaWQgPSB0aGlzLnBhcmVudCA9IHRoaXMuY2hpbGRzID0gdGhpcy5jb250YWluZXIgPSBudWxsO1xufTtcblxuLyplc2xpbnQtZGlzYWJsZSovXG4vKipcbiAqIERlc3Ryb3kgY2hpbGQgdmlldyByZWN1cnNpdmVseS5cbiAqL1xuVmlldy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKGlzQ2hpbGRWaWV3KSB7XG4gICAgdGhpcy5jaGlsZHMuZWFjaChmdW5jdGlvbihjaGlsZFZpZXcpIHtcbiAgICAgICAgY2hpbGRWaWV3LmRlc3Ryb3kodHJ1ZSk7XG4gICAgICAgIGNoaWxkVmlldy5fZGVzdHJveSgpO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzQ2hpbGRWaWV3KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9kZXN0cm95KCk7XG59O1xuLyplc2xpbnQtZW5hYmxlKi9cblxuLyoqXG4gKiBDYWxjdWxhdGUgdmlldydzIGNvbnRhaW5lciBlbGVtZW50IGJvdW5kLlxuICogQHJldHVybnMge29iamVjdH0gVGhlIGJvdW5kIG9mIGNvbnRhaW5lciBlbGVtZW50LlxuICovXG5WaWV3LnByb3RvdHlwZS5nZXRWaWV3Qm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgIHBvc2l0aW9uID0gZG9tdXRpbC5nZXRQb3NpdGlvbihjb250YWluZXIpLFxuICAgICAgICBzaXplID0gZG9tdXRpbC5nZXRTaXplKGNvbnRhaW5lcik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBwb3NpdGlvblswXSxcbiAgICAgICAgeTogcG9zaXRpb25bMV0sXG4gICAgICAgIHdpZHRoOiBzaXplWzBdLFxuICAgICAgICBoZWlnaHQ6IHNpemVbMV1cbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ29sb3JwaWNrZXIgZmFjdG9yeSBtb2R1bGVcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBjb2xvcnV0aWwgPSByZXF1aXJlKCcuL2NvbG9ydXRpbCcpO1xudmFyIExheW91dCA9IHJlcXVpcmUoJy4vbGF5b3V0Jyk7XG52YXIgUGFsZXR0ZSA9IHJlcXVpcmUoJy4vcGFsZXR0ZScpO1xudmFyIFNsaWRlciA9IHJlcXVpcmUoJy4vc2xpZGVyJyk7XG5cbmZ1bmN0aW9uIHRocm93RXJyb3IobXNnKSB7XG4gICAgYWxlcnQobXNnKTtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBDdXN0b21FdmVudHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgY29sb3JwaWNrZXIgY29tcG9uZW50XG4gKiAgQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gb3B0aW9ucy5jb250YWluZXIgLSBjb250YWluZXIgZWxlbWVudFxuICogIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nI2ZmZmZmZiddIC0gZGVmYXVsdCBzZWxlY3RlZCBjb2xvclxuICogIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLnByZXNldF0gLSBjb2xvciBwcmVzZXQgZm9yIHBhbGV0dGUgKHVzZSBiYXNlMTYgcGFsZXR0ZSBpZiBub3Qgc3VwcGxpZWQpXG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNzc1ByZWZpeD0ndHVpLWNvbG9ycGlja2VyLSddIC0gY3NzIHByZWZpeCB0ZXh0IGZvciBlYWNoIGNoaWxkIGVsZW1lbnRzXG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRldGFpbFR4dD0nRGV0YWlsJ10gLSB0ZXh0IGZvciBkZXRhaWwgYnV0dG9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBjb2xvcnBpY2tlciA9IHR1aS5jb21wb25lbnQuY29sb3JwaWNrZXIoe1xuICogICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvcnBpY2tlcicpXG4gKiB9KTtcbiAqXG4gKiBjb2xvcnBpY2tlci5nZXRDb2xvcigpOyAgICAvLyAnI2ZmZmZmZidcbiAqL1xuZnVuY3Rpb24gQ29sb3JwaWNrZXIob3B0aW9ucykge1xuICAgIHZhciBsYXlvdXQ7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29sb3JwaWNrZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3JwaWNrZXIob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE9wdGlvbiBvYmplY3RcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGNvbnRhaW5lcjogbnVsbCxcbiAgICAgICAgY29sb3I6ICcjZjhmOGY4JyxcbiAgICAgICAgcHJlc2V0OiBbXG4gICAgICAgICAgICAnIzE4MTgxOCcsXG4gICAgICAgICAgICAnIzI4MjgyOCcsXG4gICAgICAgICAgICAnIzM4MzgzOCcsXG4gICAgICAgICAgICAnIzU4NTg1OCcsXG4gICAgICAgICAgICAnI2I4YjhiOCcsXG4gICAgICAgICAgICAnI2Q4ZDhkOCcsXG4gICAgICAgICAgICAnI2U4ZThlOCcsXG4gICAgICAgICAgICAnI2Y4ZjhmOCcsXG4gICAgICAgICAgICAnI2FiNDY0MicsXG4gICAgICAgICAgICAnI2RjOTY1NicsXG4gICAgICAgICAgICAnI2Y3Y2E4OCcsXG4gICAgICAgICAgICAnI2ExYjU2YycsXG4gICAgICAgICAgICAnIzg2YzFiOScsXG4gICAgICAgICAgICAnIzdjYWZjMicsXG4gICAgICAgICAgICAnI2JhOGJhZicsXG4gICAgICAgICAgICAnI2ExNjk0NidcbiAgICAgICAgXSxcbiAgICAgICAgY3NzUHJlZml4OiAndHVpLWNvbG9ycGlja2VyLScsXG4gICAgICAgIGRldGFpbFR4dDogJ0RldGFpbCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgdGhyb3dFcnJvcignQ29sb3JwaWNrZXIoKTogbmVlZCBjb250YWluZXIgb3B0aW9uLicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBDcmVhdGUgbGF5b3V0IHZpZXdcbiAgICAgKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtMYXlvdXR9XG4gICAgICovXG4gICAgbGF5b3V0ID0gdGhpcy5sYXlvdXQgPSBuZXcgTGF5b3V0KG9wdGlvbnMsIG9wdGlvbnMuY29udGFpbmVyKTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogQ3JlYXRlIHBhbGV0dGUgdmlld1xuICAgICAqKioqKioqKioqL1xuICAgIHRoaXMucGFsZXR0ZSA9IG5ldyBQYWxldHRlKG9wdGlvbnMsIGxheW91dC5jb250YWluZXIpO1xuICAgIHRoaXMucGFsZXR0ZS5vbih7XG4gICAgICAgICdfc2VsZWN0Q29sb3InOiB0aGlzLl9vblNlbGVjdENvbG9ySW5QYWxldHRlLFxuICAgICAgICAnX3RvZ2dsZVNsaWRlcic6IHRoaXMuX29uVG9nZ2xlU2xpZGVyXG4gICAgfSwgdGhpcyk7XG5cbiAgICAvKioqKioqKioqKlxuICAgICAqIENyZWF0ZSBzbGlkZXIgdmlld1xuICAgICAqKioqKioqKioqL1xuICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcihvcHRpb25zLCBsYXlvdXQuY29udGFpbmVyKTtcbiAgICB0aGlzLnNsaWRlci5vbignX3NlbGVjdENvbG9yJywgdGhpcy5fb25TZWxlY3RDb2xvckluU2xpZGVyLCB0aGlzKTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogQWRkIGNoaWxkIHZpZXdzXG4gICAgICoqKioqKioqKiovXG4gICAgbGF5b3V0LmFkZENoaWxkKHRoaXMucGFsZXR0ZSk7XG4gICAgbGF5b3V0LmFkZENoaWxkKHRoaXMuc2xpZGVyKTtcblxuICAgIHRoaXMucmVuZGVyKG9wdGlvbnMuY29sb3IpO1xufVxuXG4vKipcbiAqIEhhbmRsZXIgbWV0aG9kIGZvciBQYWxldHRlI19zZWxlY3RDb2xvciBldmVudFxuICogQHByaXZhdGVcbiAqIEBmaXJlcyBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICogQHBhcmFtIHtvYmplY3R9IHNlbGVjdENvbG9yRXZlbnREYXRhIC0gZXZlbnQgZGF0YVxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuX29uU2VsZWN0Q29sb3JJblBhbGV0dGUgPSBmdW5jdGlvbihzZWxlY3RDb2xvckV2ZW50RGF0YSkge1xuICAgIHZhciBjb2xvciA9IHNlbGVjdENvbG9yRXZlbnREYXRhLmNvbG9yLFxuICAgICAgICBvcHQgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoIWNvbG9ydXRpbC5pc1ZhbGlkUkdCKGNvbG9yKSkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG9wdC5jb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdC5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMucmVuZGVyKGNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEBldmVudCBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbG9yIC0gc2VsZWN0ZWQgY29sb3IgKGhleCBzdHJpbmcpXG4gICAgICovXG4gICAgdGhpcy5maXJlKCdzZWxlY3RDb2xvcicsIHtcbiAgICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEhhbmRsZXIgbWV0aG9kIGZvciBQYWxldHRlI190b2dnbGVTbGlkZXIgZXZlbnRcbiAqIEBwcml2YXRlXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5fb25Ub2dnbGVTbGlkZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNsaWRlci50b2dnbGUoIXRoaXMuc2xpZGVyLmlzVmlzaWJsZSgpKTtcbn07XG5cblxuLyoqXG4gKiBIYW5kbGVyIG1ldGhvZCBmb3IgU2xpZGVyI19zZWxlY3RDb2xvciBldmVudFxuICogQHByaXZhdGVcbiAqIEBmaXJlcyBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICogQHBhcmFtIHtvYmplY3R9IHNlbGVjdENvbG9yRXZlbnREYXRhIC0gZXZlbnQgZGF0YVxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuX29uU2VsZWN0Q29sb3JJblNsaWRlciA9IGZ1bmN0aW9uKHNlbGVjdENvbG9yRXZlbnREYXRhKSB7XG4gICAgdmFyIGNvbG9yID0gc2VsZWN0Q29sb3JFdmVudERhdGEuY29sb3IsXG4gICAgICAgIG9wdCA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmIChvcHQuY29sb3IgPT09IGNvbG9yKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBvcHQuY29sb3IgPSBjb2xvcjtcbiAgICB0aGlzLnBhbGV0dGUucmVuZGVyKGNvbG9yKTtcblxuICAgIC8qKlxuICAgICAqIEBldmVudCBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbG9yIC0gc2VsZWN0ZWQgY29sb3IgKGhleCBzdHJpbmcpXG4gICAgICovXG4gICAgdGhpcy5maXJlKCdzZWxlY3RDb2xvcicsIHtcbiAgICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG59O1xuXG4vKioqKioqKioqKlxuICogUFVCTElDIEFQSVxuICoqKioqKioqKiovXG5cbi8qKlxuICogU2V0IGNvbG9ycGlja2VyIGN1cnJlbnQgY29sb3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHIgLSBoZXggZm9ybWF0dGVkIGNvbG9yIHN0cmluZ1xuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuc2V0Q29sb3IgPSBmdW5jdGlvbihoZXhTdHIpIHtcbiAgICBpZiAoIWNvbG9ydXRpbC5pc1ZhbGlkUkdCKGhleFN0cikpIHtcbiAgICAgICAgdGhyb3dFcnJvcignQ29sb3JwaWNrZXIjc2V0Q29sb3IoKTogbmVlZCB2YWxpZCBoZXggc3RyaW5nIGNvbG9yIHZhbHVlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zLmNvbG9yID0gaGV4U3RyO1xuICAgIHRoaXMucmVuZGVyKGhleFN0cik7XG59O1xuXG4vKipcbiAqIEdldCBjb2xvcnBpY2tlciBjdXJyZW50IGNvbG9yXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBoZXggc3RyaW5nIGZvcm1hdHRlZCBjb2xvclxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuZ2V0Q29sb3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgY29sb3JwaWNrZXIgY29udGFpbmVyIGVsZW1lbnRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2hvdz10cnVlXSAtIHRydWUgd2hlbiByZXZlYWwgY29sb3JwaWNrZXJcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGlzU2hvdykge1xuICAgIHRoaXMubGF5b3V0LmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gISFpc1Nob3cgPyAnYmxvY2snIDogJ25vbmUnO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgY29sb3JwaWNrZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29sb3JdIC0gc2VsZWN0ZWQgY29sb3JcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgdGhpcy5sYXlvdXQucmVuZGVyKGNvbG9yIHx8IHRoaXMub3B0aW9ucy5jb2xvcik7XG59O1xuXG4vKipcbiAqIERlc3Ryb3kgY29sb3JwaWNrZXIgY29tcG9uZW50XG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXlvdXQuZGVzdHJveSgpO1xuICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB0aGlzLmxheW91dCA9IHRoaXMuc2xpZGVyID0gdGhpcy5wYWxldHRlID1cbiAgICAgICAgdGhpcy5vcHRpb25zID0gbnVsbDtcbn07XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKENvbG9ycGlja2VyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcnBpY2tlcjtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbG9ycGlja2VyIGxheW91dCBtb2R1bGVcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBkb211dGlsID0gcmVxdWlyZSgnLi9jb3JlL2RvbXV0aWwnKTtcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi9jb3JlL3ZpZXcnKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIHtWaWV3fVxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb24gb2JqZWN0XG4gKiAgQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY3NzUHJlZml4IC0gY3NzIHByZWZpeCBmb3IgZWFjaCBjaGlsZCBlbGVtZW50c1xuICogQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gY29udGFpbmVyIC0gY29udGFpbmVyXG4gKi9cbmZ1bmN0aW9uIExheW91dChvcHRpb25zLCBjb250YWluZXIpIHtcbiAgICAvKipcbiAgICAgKiBvcHRpb24gb2JqZWN0XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGNzc1ByZWZpeDogJ3R1aS1jb2xvcnBpY2tlci0nXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBjb250YWluZXIgPSBkb211dGlsLmFwcGVuZEhUTUxFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICB0aGlzLm9wdGlvbnMuY3NzUHJlZml4ICsgJ2NvbnRhaW5lcidcbiAgICApO1xuXG4gICAgVmlldy5jYWxsKHRoaXMsIG9wdGlvbnMsIGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xufVxuXG51dGlsLmluaGVyaXQoTGF5b3V0LCBWaWV3KTtcblxuLyoqXG4gKiBAb3ZlcnJpZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29sb3JdIC0gc2VsZWN0ZWQgY29sb3JcbiAqL1xuTGF5b3V0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjb2xvcikge1xuICAgIHRoaXMucmVjdXJzaXZlKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgdmlldy5yZW5kZXIoY29sb3IpO1xuICAgIH0sIHRydWUpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMYXlvdXQ7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBDb2xvciBwYWxldHRlIHZpZXdcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBkb211dGlsID0gcmVxdWlyZSgnLi9jb3JlL2RvbXV0aWwnKTtcbnZhciBkb21ldmVudCA9IHJlcXVpcmUoJy4vY29yZS9kb21ldmVudCcpO1xudmFyIFZpZXcgPSByZXF1aXJlKCcuL2NvcmUvdmlldycpO1xudmFyIHRtcGwgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9wYWxldHRlJyk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7Vmlld31cbiAqIEBtaXhlcyBDdXN0b21FdmVudHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgY29sb3IgcGFsZXR0ZSB2aWV3XG4gKiAgQHBhcmFtIHtzdHJpbmdbXX0gb3B0aW9ucy5wcmVzZXQgLSBjb2xvciBsaXN0XG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBjb250YWluZXIgLSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBQYWxldHRlKG9wdGlvbnMsIGNvbnRhaW5lcikge1xuICAgIC8qKlxuICAgICAqIG9wdGlvbiBvYmplY3RcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgY3NzUHJlZml4OiAndHVpLWNvbG9ycGlja2VyLScsXG4gICAgICAgIHByZXNldDogW1xuICAgICAgICAgICAgJyMxODE4MTgnLFxuICAgICAgICAgICAgJyMyODI4MjgnLFxuICAgICAgICAgICAgJyMzODM4MzgnLFxuICAgICAgICAgICAgJyM1ODU4NTgnLFxuICAgICAgICAgICAgJyNCOEI4QjgnLFxuICAgICAgICAgICAgJyNEOEQ4RDgnLFxuICAgICAgICAgICAgJyNFOEU4RTgnLFxuICAgICAgICAgICAgJyNGOEY4RjgnLFxuICAgICAgICAgICAgJyNBQjQ2NDInLFxuICAgICAgICAgICAgJyNEQzk2NTYnLFxuICAgICAgICAgICAgJyNGN0NBODgnLFxuICAgICAgICAgICAgJyNBMUI1NkMnLFxuICAgICAgICAgICAgJyM4NkMxQjknLFxuICAgICAgICAgICAgJyM3Q0FGQzInLFxuICAgICAgICAgICAgJyNCQThCQUYnLFxuICAgICAgICAgICAgJyNBMTY5NDYnXG4gICAgICAgIF0sXG4gICAgICAgIGRldGFpbFR4dDogJ0RldGFpbCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGNvbnRhaW5lciA9IGRvbXV0aWwuYXBwZW5kSFRNTEVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIHRoaXMub3B0aW9ucy5jc3NQcmVmaXggKyAncGFsZXR0ZS1jb250YWluZXInXG4gICAgKTtcblxuICAgIFZpZXcuY2FsbCh0aGlzLCBvcHRpb25zLCBjb250YWluZXIpO1xufVxuXG51dGlsLmluaGVyaXQoUGFsZXR0ZSwgVmlldyk7XG5cbi8qKlxuICogTW91c2UgY2xpY2sgZXZlbnQgaGFuZGxlclxuICogQGZpcmVzIFBhbGV0dGUjX3NlbGVjdENvbG9yXG4gKiBAZmlyZXMgUGFsZXR0ZSNfdG9nZ2xlU2xpZGVyXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IGNsaWNrRXZlbnQgLSBtb3VzZSBldmVudCBvYmplY3RcbiAqL1xuUGFsZXR0ZS5wcm90b3R5cGUuX29uQ2xpY2sgPSBmdW5jdGlvbihjbGlja0V2ZW50KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHRhcmdldCA9IGNsaWNrRXZlbnQuc3JjRWxlbWVudCB8fCBjbGlja0V2ZW50LnRhcmdldCxcbiAgICAgICAgZXZlbnREYXRhID0ge307XG5cbiAgICBpZiAoZG9tdXRpbC5oYXNDbGFzcyh0YXJnZXQsIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3BhbGV0dGUtYnV0dG9uJykpIHtcbiAgICAgICAgZXZlbnREYXRhLmNvbG9yID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZXZlbnQgUGFsZXR0ZSNfc2VsZWN0Q29sb3JcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbG9yIC0gc2VsZWN0ZWQgY29sb3IgdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlyZSgnX3NlbGVjdENvbG9yJywgZXZlbnREYXRhKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChkb211dGlsLmhhc0NsYXNzKHRhcmdldCwgb3B0aW9ucy5jc3NQcmVmaXggKyAncGFsZXR0ZS10b2dnbGUtc2xpZGVyJykpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBldmVudCBQYWxldHRlI190b2dnbGVTbGlkZXJcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlyZSgnX3RvZ2dsZVNsaWRlcicpO1xuICAgIH1cbn07XG5cbi8qKlxuICogVGV4dGJveCBjaGFuZ2UgZXZlbnQgaGFuZGxlclxuICogQGZpcmVzIFBhbGV0dGUjX3NlbGVjdENvbG9yXG4gKiBAcGFyYW0ge0V2ZW50fSBjaGFuZ2VFdmVudCAtIGNoYW5nZSBldmVudCBvYmplY3RcbiAqL1xuUGFsZXR0ZS5wcm90b3R5cGUuX29uQ2hhbmdlID0gZnVuY3Rpb24oY2hhbmdlRXZlbnQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgdGFyZ2V0ID0gY2hhbmdlRXZlbnQuc3JjRWxlbWVudCB8fCBjaGFuZ2VFdmVudC50YXJnZXQsXG4gICAgICAgIGV2ZW50RGF0YSA9IHt9O1xuXG4gICAgaWYgKGRvbXV0aWwuaGFzQ2xhc3ModGFyZ2V0LCBvcHRpb25zLmNzc1ByZWZpeCArICdwYWxldHRlLWhleCcpKSB7XG4gICAgICAgIGV2ZW50RGF0YS5jb2xvciA9IHRhcmdldC52YWx1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGV2ZW50IFBhbGV0dGUjX3NlbGVjdENvbG9yXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjb2xvciAtIHNlbGVjdGVkIGNvbG9yIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpcmUoJ19zZWxlY3RDb2xvcicsIGV2ZW50RGF0YSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuXG4vKipcbiAqIEludm9rZSBiZWZvcmUgZGVzdG9yeVxuICogQG92ZXJyaWRlXG4gKi9cblBhbGV0dGUucHJvdG90eXBlLl9iZWZvcmVEZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fdG9nZ2xlRXZlbnQoZmFsc2UpO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgdmlldyBET00gZXZlbnRzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvbk9mZj1mYWxzZV0gLSB0cnVlIHRvIGJpbmQgZXZlbnQuXG4gKi9cblBhbGV0dGUucHJvdG90eXBlLl90b2dnbGVFdmVudCA9IGZ1bmN0aW9uKG9uT2ZmKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICBtZXRob2QgPSBkb21ldmVudFshIW9uT2ZmID8gJ29uJyA6ICdvZmYnXSxcbiAgICAgICAgaGV4VGV4dEJveDtcblxuICAgIG1ldGhvZChjb250YWluZXIsICdjbGljaycsIHRoaXMuX29uQ2xpY2ssIHRoaXMpO1xuXG4gICAgaGV4VGV4dEJveCA9IGRvbXV0aWwuZmluZCgnLicgKyBvcHRpb25zLmNzc1ByZWZpeCArICdwYWxldHRlLWhleCcsIGNvbnRhaW5lcik7XG5cbiAgICBpZiAoaGV4VGV4dEJveCkge1xuICAgICAgICBtZXRob2QoaGV4VGV4dEJveCwgJ2NoYW5nZScsIHRoaXMuX29uQ2hhbmdlLCB0aGlzKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJlbmRlciBwYWxldHRlXG4gKiBAb3ZlcnJpZGVcbiAqL1xuUGFsZXR0ZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sb3IpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgaHRtbCA9ICcnO1xuXG4gICAgdGhpcy5fdG9nZ2xlRXZlbnQoZmFsc2UpO1xuXG4gICAgaHRtbCA9IHRtcGwubGF5b3V0LnJlcGxhY2UoJ3t7Y29sb3JMaXN0fX0nLCB1dGlsLm1hcChvcHRpb25zLnByZXNldCwgZnVuY3Rpb24oX2NvbG9yKSB7XG4gICAgICAgIHZhciBpdGVtSHRtbCA9IHRtcGwuaXRlbS5yZXBsYWNlKC97e2NvbG9yfX0vZywgX2NvbG9yKTtcbiAgICAgICAgaXRlbUh0bWwgPSBpdGVtSHRtbC5yZXBsYWNlKCd7e3NlbGVjdGVkfX0nLCBfY29sb3IgPT09IGNvbG9yID8gICgnICcgKyBvcHRpb25zLmNzc1ByZWZpeCArICdzZWxlY3RlZCcpIDogJycpOyBcblxuICAgICAgICByZXR1cm4gaXRlbUh0bWw7XG4gICAgfSkuam9pbignJykpO1xuXG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgve3tjc3NQcmVmaXh9fS9nLCBvcHRpb25zLmNzc1ByZWZpeClcbiAgICAgICAgLnJlcGxhY2UoJ3t7ZGV0YWlsVHh0fX0nLCBvcHRpb25zLmRldGFpbFR4dClcbiAgICAgICAgLnJlcGxhY2UoL3t7Y29sb3J9fS9nLCBjb2xvcik7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgdGhpcy5fdG9nZ2xlRXZlbnQodHJ1ZSk7XG59O1xuXG51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihQYWxldHRlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYWxldHRlO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgU2xpZGVyIHZpZXdcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGRvbXV0aWwgPSByZXF1aXJlKCcuL2NvcmUvZG9tdXRpbCcpO1xudmFyIGRvbWV2ZW50ID0gcmVxdWlyZSgnLi9jb3JlL2RvbWV2ZW50Jyk7XG52YXIgc3Zndm1sID0gcmVxdWlyZSgnLi9zdmd2bWwnKTtcbnZhciBjb2xvcnV0aWwgPSByZXF1aXJlKCcuL2NvbG9ydXRpbCcpO1xudmFyIFZpZXcgPSByZXF1aXJlKCcuL2NvcmUvdmlldycpO1xudmFyIERyYWcgPSByZXF1aXJlKCcuL2NvcmUvZHJhZycpO1xudmFyIHRtcGwgPSByZXF1aXJlKCcuLi90ZW1wbGF0ZS9zbGlkZXInKTtcblxuLy8gTGltaXRhdGlvbiBwb3NpdGlvbiBvZiBwb2ludCBlbGVtZW50IGluc2lkZSBvZiBjb2xvcnNsaWRlciBhbmQgaHVlIGJhclxuLy8gTWluaW11bSB2YWx1ZSBjYW4gdG8gYmUgbmVnYXRpdmUgYmVjYXVzZSB0aGF0IHVzaW5nIGNvbG9yIHBvaW50IG9mIGhhbmRsZSBlbGVtZW50IGlzIGNlbnRlciBwb2ludC4gbm90IGxlZnQsIHRvcCBwb2ludC5cbnZhciBDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0UgPSBbLTcsIDExMl07XG52YXIgSFVFQkFSX1BPU19MSU1JVF9SQU5HRSA9IFstMywgMTE1XTtcbnZhciBIVUVfV0hFRUxfTUFYID0gMzU5Ljk5O1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge1ZpZXd9XG4gKiBAbWl4ZXMgQ3VzdG9tRXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIHZpZXdcbiAqICBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jc3NQcmVmaXggLSBkZXNpZ24gY3NzIHByZWZpeFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gU2xpZGVyKG9wdGlvbnMsIGNvbnRhaW5lcikge1xuICAgIGNvbnRhaW5lciA9IGRvbXV0aWwuYXBwZW5kSFRNTEVsZW1lbnQoJ2RpdicsIGNvbnRhaW5lciwgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2xpZGVyLWNvbnRhaW5lcicpO1xuICAgIGNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgVmlldy5jYWxsKHRoaXMsIG9wdGlvbnMsIGNvbnRhaW5lcik7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgY29sb3I6ICcjZjhmOGY4JyxcbiAgICAgICAgY3NzUHJlZml4OiAndHVpLWNvbG9ycGlja2VyLSdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIENhY2hlIGltbXV0YWJsZSBkYXRhIGluIGNsaWNrLCBkcmFnIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIChpLmUuIGlzIGV2ZW50IHJlbGF0ZWQgd2l0aCBjb2xvcnNsaWRlcj8gb3IgaHVlYmFyPylcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaXNDb2xvclNsaWRlclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyW119IGNvbnRhaW5lclNpemVcbiAgICAgKi9cbiAgICB0aGlzLl9kcmFnRGF0YUNhY2hlID0ge307XG5cbiAgICAvKipcbiAgICAgKiBDb2xvciBzbGlkZXIgaGFuZGxlIGVsZW1lbnRcbiAgICAgKiBAdHlwZSB7U1ZHfFZNTH1cbiAgICAgKi9cbiAgICB0aGlzLnNsaWRlckhhbmRsZUVsZW1lbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogaHVlIGJhciBoYW5kbGUgZWxlbWVudFxuICAgICAqIEB0eXBlIHtTVkd8Vk1MfVxuICAgICAqL1xuICAgIHRoaXMuaHVlYmFySGFuZGxlRWxlbWVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFbGVtZW50IHRoYXQgcmVuZGVyIGJhc2UgY29sb3IgaW4gY29sb3JzbGlkZXIgcGFydFxuICAgICAqIEB0eXBlIHtTVkd8Vk1MfVxuICAgICAqL1xuICAgIHRoaXMuYmFzZUNvbG9yRWxlbWVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7RHJhZ31cbiAgICAgKi9cbiAgICB0aGlzLmRyYWcgPSBuZXcgRHJhZyh7XG4gICAgICAgIGRpc3RhbmNlOiAwXG4gICAgfSwgY29udGFpbmVyKTtcbiAgICBcbiAgICAvLyBiaW5kIGRyYWcgZXZlbnRzXG4gICAgdGhpcy5kcmFnLm9uKHtcbiAgICAgICAgJ2RyYWdTdGFydCc6IHRoaXMuX29uRHJhZ1N0YXJ0LFxuICAgICAgICAnZHJhZyc6IHRoaXMuX29uRHJhZyxcbiAgICAgICAgJ2RyYWdFbmQnOiB0aGlzLl9vbkRyYWdFbmQsXG4gICAgICAgICdjbGljayc6IHRoaXMuX29uQ2xpY2tcbiAgICB9LCB0aGlzKTtcbn1cblxudXRpbC5pbmhlcml0KFNsaWRlciwgVmlldyk7XG5cbi8qKlxuICogQG92ZXJyaWRlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX2JlZm9yZURlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRyYWcub2ZmKCk7XG5cbiAgICB0aGlzLmRyYWcgPSB0aGlzLm9wdGlvbnMgPSB0aGlzLl9kcmFnRGF0YUNhY2hlID1cbiAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVFbGVtZW50ID0gdGhpcy5odWViYXJIYW5kbGVFbGVtZW50ID1cbiAgICAgICAgdGhpcy5iYXNlQ29sb3JFbGVtZW50ID0gbnVsbDtcbn07XG5cbi8qKlxuICogVG9nZ2xlIHNsaWRlciB2aWV3XG4gKiBAcGFyYW0ge2Jvb2xlYW59IG9uT2ZmIC0gc2V0IHRydWUgdGhlbiByZXZlYWwgc2xpZGVyIHZpZXdcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbihvbk9mZikge1xuICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAhIW9uT2ZmID8gJ2Jsb2NrJyA6ICdub25lJztcbn07XG5cbi8qKlxuICogR2V0IHNsaWRlciBkaXNwbGF5IHN0YXR1c1xuICogQHJldHVybnMge2Jvb2xlYW59IHJldHVybiB0cnVlIHdoZW4gc2xpZGVyIGlzIHZpc2libGVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5pc1Zpc2libGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJztcbn07XG5cbi8qKlxuICogUmVuZGVyIHNsaWRlciB2aWV3XG4gKiBAb3ZlcnJpZGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvclN0ciAtIGhleCBzdHJpbmcgY29sb3IgZnJvbSBwYXJlbnQgdmlldyAoTGF5b3V0KVxuICovXG5TbGlkZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbG9yU3RyKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICBjb250YWluZXIgPSB0aGF0LmNvbnRhaW5lcixcbiAgICAgICAgb3B0aW9ucyA9IHRoYXQub3B0aW9ucyxcbiAgICAgICAgaHRtbCA9IHRtcGwubGF5b3V0LFxuICAgICAgICByZ2IsXG4gICAgICAgIGhzdjtcblxuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL3t7c2xpZGVyfX0vLCB0bXBsLnNsaWRlcik7XG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgve3todWViYXJ9fS8sIHRtcGwuaHVlYmFyKTtcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC97e2Nzc1ByZWZpeH19L2csIG9wdGlvbnMuY3NzUHJlZml4KTtcblxuICAgIHRoYXQuY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICB0aGF0LnNsaWRlckhhbmRsZUVsZW1lbnQgPSBkb211dGlsLmZpbmQoJy4nICsgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2xpZGVyLWhhbmRsZScsIGNvbnRhaW5lcik7XG4gICAgdGhhdC5odWViYXJIYW5kbGVFbGVtZW50ID0gZG9tdXRpbC5maW5kKCcuJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ2h1ZWJhci1oYW5kbGUnLCBjb250YWluZXIpO1xuICAgIHRoYXQuYmFzZUNvbG9yRWxlbWVudCA9IGRvbXV0aWwuZmluZCgnLicgKyBvcHRpb25zLmNzc1ByZWZpeCArICdzbGlkZXItYmFzZWNvbG9yJywgY29udGFpbmVyKTtcblxuICAgIHJnYiA9IGNvbG9ydXRpbC5oZXhUb1JHQihjb2xvclN0cik7XG4gICAgaHN2ID0gY29sb3J1dGlsLnJnYlRvSFNWLmFwcGx5KG51bGwsIHJnYik7XG5cbiAgICB0aGlzLm1vdmVIdWUoaHN2WzBdLCB0cnVlKVxuICAgIHRoaXMubW92ZVNhdHVyYXRpb25BbmRWYWx1ZShoc3ZbMV0sIGhzdlsyXSwgdHJ1ZSk7XG59O1xuXG4vKipcbiAqIE1vdmUgY29sb3JzbGlkZXIgYnkgbmV3TGVmdChYKSwgbmV3VG9wKFkpIHZhbHVlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG5ld0xlZnQgLSBsZWZ0IHBpeGVsIHZhbHVlIHRvIG1vdmUgaGFuZGxlXG4gKiBAcGFyYW0ge251bWJlcn0gbmV3VG9wIC0gdG9wIHBpeGVsIHZhbHVlIHRvIG1vdmUgaGFuZGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzaWxlbnQ9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiBub3QgZmlyZSBjdXN0b20gZXZlbnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fbW92ZUNvbG9yU2xpZGVySGFuZGxlID0gZnVuY3Rpb24obmV3TGVmdCwgbmV3VG9wLCBzaWxlbnQpIHtcbiAgICB2YXIgaGFuZGxlID0gdGhpcy5zbGlkZXJIYW5kbGVFbGVtZW50LFxuICAgICAgICBoYW5kbGVDb2xvcjtcblxuICAgIC8vIENoZWNrIHBvc2l0aW9uIGxpbWl0YXRpb24uXG4gICAgbmV3VG9wID0gTWF0aC5tYXgoQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzBdLCBuZXdUb3ApO1xuICAgIG5ld1RvcCA9IE1hdGgubWluKENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVsxXSwgbmV3VG9wKTtcbiAgICBuZXdMZWZ0ID0gTWF0aC5tYXgoQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzBdLCBuZXdMZWZ0KTtcbiAgICBuZXdMZWZ0ID0gTWF0aC5taW4oQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzFdLCBuZXdMZWZ0KTtcblxuICAgIHN2Z3ZtbC5zZXRUcmFuc2xhdGVYWShoYW5kbGUsIG5ld0xlZnQsIG5ld1RvcCk7XG5cbiAgICBoYW5kbGVDb2xvciA9IG5ld1RvcCA+IDUwID8gJ3doaXRlJyA6ICdibGFjayc7XG4gICAgc3Zndm1sLnNldFN0cm9rZUNvbG9yKGhhbmRsZSwgaGFuZGxlQ29sb3IpO1xuXG4gICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgdGhpcy5maXJlKCdfc2VsZWN0Q29sb3InLCB7XG4gICAgICAgICAgICBjb2xvcjogY29sb3J1dGlsLnJnYlRvSEVYLmFwcGx5KG51bGwsIHRoaXMuZ2V0UkdCKCkpXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogTW92ZSBjb2xvcnNsaWRlciBieSBzdXBwbGllZCBzYXR1cmF0aW9uIGFuZCB2YWx1ZXMuXG4gKlxuICogVGhlIG1vdmVtZW50IG9mIGNvbG9yIHNsaWRlciBoYW5kbGUgZm9sbG93IEhTViBjeWxpbmRlciBtb2RlbC4ge0BsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hTTF9hbmRfSFNWfVxuICogQHBhcmFtIHtudW1iZXJ9IHNhdHVyYXRpb24gLSB0aGUgcGVyY2VudCBvZiBzYXR1cmF0aW9uICgwJSB+IDEwMCUpXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSB0aGUgcGVyY2VudCBvZiBzYXR1cmF0aW9uICgwJSB+IDEwMCUpXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzaWxlbnQ9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiBub3QgZmlyZSBjdXN0b20gZXZlbnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5tb3ZlU2F0dXJhdGlvbkFuZFZhbHVlID0gZnVuY3Rpb24oc2F0dXJhdGlvbiwgdmFsdWUsIHNpbGVudCkge1xuICAgIHZhciBhYnNNaW4sIG1heFZhbHVlLFxuICAgICAgICBuZXdMZWZ0LCBuZXdUb3A7XG5cbiAgICBzYXR1cmF0aW9uID0gc2F0dXJhdGlvbiB8fCAwO1xuICAgIHZhbHVlID0gdmFsdWUgfHwgMDtcblxuICAgIGFic01pbiA9IE1hdGguYWJzKENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVswXSk7XG4gICAgbWF4VmFsdWUgPSBDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMV07XG5cbiAgICAvLyBzdWJ0cmFjdCBhYnNNaW4gdmFsdWUgYmVjYXVzZSBjdXJyZW50IGNvbG9yIHBvc2l0aW9uIGlzIG5vdCBsZWZ0LCB0b3Agb2YgaGFuZGxlIGVsZW1lbnQuXG4gICAgLy8gVGhlIHNhdHVyYXRpb24uIGZyb20gbGVmdCAwIHRvIHJpZ2h0IDEwMFxuICAgIG5ld0xlZnQgPSAoKHNhdHVyYXRpb24gKiBtYXhWYWx1ZSkgLyAxMDApIC0gYWJzTWluO1xuICAgIC8vIFRoZSBWYWx1ZS4gZnJvbSB0b3AgMTAwIHRvIGJvdHRvbSAwLiB0aGF0IHdoeSBuZXdUb3Agc3VidHJhY3QgYnkgbWF4VmFsdWUuXG4gICAgbmV3VG9wID0gKG1heFZhbHVlIC0gKCh2YWx1ZSAqIG1heFZhbHVlKSAvIDEwMCkpIC0gYWJzTWluO1xuXG4gICAgdGhpcy5fbW92ZUNvbG9yU2xpZGVySGFuZGxlKG5ld0xlZnQsIG5ld1RvcCwgc2lsZW50KTtcbn07XG5cbi8qKlxuICogTW92ZSBjb2xvciBzbGlkZXIgaGFuZGxlIHRvIHN1cHBsaWVkIHBvc2l0aW9uXG4gKlxuICogVGhlIG51bWJlciBvZiBYLCBZIG11c3QgYmUgcmVsYXRlZCB2YWx1ZSBmcm9tIGNvbG9yIHNsaWRlciBjb250YWluZXJcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0geCAtIHRoZSBwaXhlbCB2YWx1ZSB0byBtb3ZlIGhhbmRsZSBcbiAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdGhlIHBpeGVsIHZhbHVlIHRvIG1vdmUgaGFuZGxlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX21vdmVDb2xvclNsaWRlckJ5UG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdmFyIG9mZnNldCA9IENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVswXTtcbiAgICB0aGlzLl9tb3ZlQ29sb3JTbGlkZXJIYW5kbGUoeCArIG9mZnNldCwgeSArIG9mZnNldCk7XG59O1xuXG4vKipcbiAqIEdldCBzYXR1cmF0aW9uIGFuZCB2YWx1ZSB2YWx1ZS5cbiAqIEByZXR1cm5zIHtudW1iZXJbXX0gc2F0dXJhdGlvbiBhbmQgdmFsdWVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nZXRTYXR1cmF0aW9uQW5kVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWJzTWluID0gTWF0aC5hYnMoQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzBdKSxcbiAgICAgICAgbWF4VmFsdWUgPSBhYnNNaW4gKyBDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMV0sXG4gICAgICAgIHBvc2l0aW9uID0gc3Zndm1sLmdldFRyYW5zbGF0ZVhZKHRoaXMuc2xpZGVySGFuZGxlRWxlbWVudCksIFxuICAgICAgICBzYXR1cmF0aW9uLCB2YWx1ZTtcblxuICAgIHNhdHVyYXRpb24gPSAoKHBvc2l0aW9uWzFdICsgYWJzTWluKSAvIG1heFZhbHVlKSAqIDEwMDtcbiAgICAvLyBUaGUgdmFsdWUgb2YgSFNWIGNvbG9yIG1vZGVsIGlzIGludmVydGVkLiB0b3AgMTAwIH4gYm90dG9tIDAuIHNvIHN1YnRyYWN0IGJ5IDEwMFxuICAgIHZhbHVlID0gMTAwIC0gKCgocG9zaXRpb25bMF0gKyBhYnNNaW4pIC8gbWF4VmFsdWUpICogMTAwKTtcblxuICAgIHJldHVybiBbc2F0dXJhdGlvbiwgdmFsdWVdO1xufTtcblxuLyoqXG4gKiBNb3ZlIGh1ZSBoYW5kbGUgc3VwcGxpZWQgcGl4ZWwgdmFsdWVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbmV3VG9wIC0gcGl4ZWwgdG8gbW92ZSBodWUgaGFuZGxlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzaWxlbnQ9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiBub3QgZmlyZSBjdXN0b20gZXZlbnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fbW92ZUh1ZUhhbmRsZSA9IGZ1bmN0aW9uKG5ld1RvcCwgc2lsZW50KSB7XG4gICAgdmFyIGh1ZUhhbmRsZUVsZW1lbnQgPSB0aGlzLmh1ZWJhckhhbmRsZUVsZW1lbnQsXG4gICAgICAgIGJhc2VDb2xvckVsZW1lbnQgPSB0aGlzLmJhc2VDb2xvckVsZW1lbnQsXG4gICAgICAgIG5ld0dyYWRpZW50Q29sb3IsXG4gICAgICAgIGhleFN0cjtcblxuICAgIG5ld1RvcCA9IE1hdGgubWF4KEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMF0sIG5ld1RvcCk7XG4gICAgbmV3VG9wID0gTWF0aC5taW4oSFVFQkFSX1BPU19MSU1JVF9SQU5HRVsxXSwgbmV3VG9wKTtcblxuICAgIHN2Z3ZtbC5zZXRUcmFuc2xhdGVZKGh1ZUhhbmRsZUVsZW1lbnQsIG5ld1RvcCk7XG5cbiAgICBuZXdHcmFkaWVudENvbG9yID0gY29sb3J1dGlsLmhzdlRvUkdCKHRoaXMuZ2V0SHVlKCksIDEwMCwgMTAwKTtcbiAgICBoZXhTdHIgPSBjb2xvcnV0aWwucmdiVG9IRVguYXBwbHkobnVsbCwgbmV3R3JhZGllbnRDb2xvcik7XG5cbiAgICBzdmd2bWwuc2V0R3JhZGllbnRDb2xvclN0b3AoYmFzZUNvbG9yRWxlbWVudCwgaGV4U3RyKTtcblxuICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRoaXMuZmlyZSgnX3NlbGVjdENvbG9yJywge1xuICAgICAgICAgICAgY29sb3I6IGNvbG9ydXRpbC5yZ2JUb0hFWC5hcHBseShudWxsLCB0aGlzLmdldFJHQigpKSBcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBNb3ZlIGh1ZSBiYXIgaGFuZGxlIGJ5IHN1cHBsaWVkIGRlZ3JlZVxuICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZSAtICgwIH4gMzU5LjkgZGVncmVlKVxuICogQHBhcmFtIHtib29sZWFufSBbc2lsZW50PWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gbm90IGZpcmUgY3VzdG9tIGV2ZW50XG4gKi9cblNsaWRlci5wcm90b3R5cGUubW92ZUh1ZSA9IGZ1bmN0aW9uKGRlZ3JlZSwgc2lsZW50KSB7XG4gICAgdmFyIG5ld1RvcCA9IDAsXG4gICAgICAgIGFic01pbiwgbWF4VmFsdWU7XG5cbiAgICBhYnNNaW4gPSBNYXRoLmFicyhIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzBdKTtcbiAgICBtYXhWYWx1ZSA9IGFic01pbiArIEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMV07XG5cbiAgICBkZWdyZWUgPSBkZWdyZWUgfHwgMDtcbiAgICBuZXdUb3AgPSAoKG1heFZhbHVlICogZGVncmVlKSAvIEhVRV9XSEVFTF9NQVgpIC0gYWJzTWluO1xuXG4gICAgdGhpcy5fbW92ZUh1ZUhhbmRsZShuZXdUb3AsIHNpbGVudCk7XG59O1xuXG4vKipcbiAqIE1vdmUgaHVlIGJhciBoYW5kbGUgYnkgc3VwcGxpZWQgcGVyY2VudFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gcGl4ZWwgdmFsdWUgdG8gbW92ZSBodWUgaGFuZGxlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX21vdmVIdWVCeVBvc2l0aW9uID0gZnVuY3Rpb24oeSkge1xuICAgIHZhciBvZmZzZXQgPSBIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzBdO1xuXG4gICAgdGhpcy5fbW92ZUh1ZUhhbmRsZSh5ICsgb2Zmc2V0KTtcbn07XG5cbi8qKlxuICogR2V0IGh1ZWJhciBoYW5kbGUgcG9zaXRpb24gYnkgY29sb3IgZGVncmVlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBkZWdyZWUgKDAgfiAzNTkuOSBkZWdyZWUpXG4gKi9cblNsaWRlci5wcm90b3R5cGUuZ2V0SHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhhbmRsZSA9IHRoaXMuaHVlYmFySGFuZGxlRWxlbWVudCxcbiAgICAgICAgcG9zaXRpb24gPSBzdmd2bWwuZ2V0VHJhbnNsYXRlWFkoaGFuZGxlKSxcbiAgICAgICAgYWJzTWluLCBtYXhWYWx1ZTtcblxuICAgIGFic01pbiA9IE1hdGguYWJzKEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMF0pO1xuICAgIG1heFZhbHVlID0gYWJzTWluICsgSFVFQkFSX1BPU19MSU1JVF9SQU5HRVsxXTtcblxuICAgIC8vIG1heFZhbHVlIDogMzU5Ljk5ID0gcG9zLnkgOiB4XG4gICAgcmV0dXJuICgocG9zaXRpb25bMF0gKyBhYnNNaW4pICogSFVFX1dIRUVMX01BWCkgLyBtYXhWYWx1ZTtcbn07XG5cbi8qKlxuICogR2V0IEhTViB2YWx1ZSBmcm9tIHNsaWRlclxuICogQHJldHVybnMge251bWJlcltdfSBoc3YgdmFsdWVzXG4gKi9cblNsaWRlci5wcm90b3R5cGUuZ2V0SFNWID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN2ID0gdGhpcy5nZXRTYXR1cmF0aW9uQW5kVmFsdWUoKSxcbiAgICAgICAgaCA9IHRoaXMuZ2V0SHVlKCk7XG5cbiAgICByZXR1cm4gW2hdLmNvbmNhdChzdik7XG59O1xuXG4vKipcbiAqIEdldCBSR0IgdmFsdWUgZnJvbSBzbGlkZXJcbiAqIEByZXR1cm5zIHtudW1iZXJbXX0gUkdCIHZhbHVlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuZ2V0UkdCID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNvbG9ydXRpbC5oc3ZUb1JHQi5hcHBseShudWxsLCB0aGlzLmdldEhTVigpKTtcbn07XG5cbi8qKioqKioqKioqXG4gKiBEcmFnIGV2ZW50IGhhbmRsZXJcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIENhY2hlIGltbXV0YWJsZSBkYXRhIHdoZW4gZHJhZ2dpbmcgb3IgY2xpY2sgdmlld1xuICogQHBhcmFtIHtvYmplY3R9IGV2ZW50IC0gQ2xpY2ssIERyYWdTdGFydCBldmVudC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IGNhY2hlZCBkYXRhLlxuICovXG5TbGlkZXIucHJvdG90eXBlLl9wcmVwYXJlQ29sb3JTbGlkZXJGb3JNb3VzZUV2ZW50ID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgc2xpZGVyUGFydCA9IGRvbXV0aWwuY2xvc2VzdChldmVudC50YXJnZXQsICcuJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NsaWRlci1wYXJ0JyksXG4gICAgICAgIGNhY2hlO1xuXG4gICAgY2FjaGUgPSB0aGlzLl9kcmFnRGF0YUNhY2hlID0ge1xuICAgICAgICBpc0NvbG9yU2xpZGVyOiBkb211dGlsLmhhc0NsYXNzKHNsaWRlclBhcnQsIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NsaWRlci1sZWZ0JyksXG4gICAgICAgIHBhcmVudEVsZW1lbnQ6IHNsaWRlclBhcnRcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBjYWNoZTtcbn07XG5cbi8qKlxuICogQ2xpY2sgZXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtvYmplY3R9IGNsaWNrRXZlbnQgLSBDbGljayBldmVudCBmcm9tIERyYWcgbW9kdWxlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX29uQ2xpY2sgPSBmdW5jdGlvbihjbGlja0V2ZW50KSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5fcHJlcGFyZUNvbG9yU2xpZGVyRm9yTW91c2VFdmVudChjbGlja0V2ZW50KSxcbiAgICAgICAgbW91c2VQb3MgPSBkb21ldmVudC5nZXRNb3VzZVBvc2l0aW9uKGNsaWNrRXZlbnQub3JpZ2luRXZlbnQsIGNhY2hlLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgaWYgKGNhY2hlLmlzQ29sb3JTbGlkZXIpIHtcbiAgICAgICAgdGhpcy5fbW92ZUNvbG9yU2xpZGVyQnlQb3NpdGlvbihtb3VzZVBvc1swXSwgbW91c2VQb3NbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vdmVIdWVCeVBvc2l0aW9uKG1vdXNlUG9zWzFdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kcmFnRGF0YUNhY2hlID0gbnVsbDtcbn07XG5cbi8qKlxuICogRHJhZ1N0YXJ0IGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBkcmFnU3RhcnRFdmVudCAtIGRyYWdTdGFydCBldmVudCBkYXRhIGZyb20gRHJhZyNkcmFnU3RhcnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fb25EcmFnU3RhcnQgPSBmdW5jdGlvbihkcmFnU3RhcnRFdmVudCkge1xuICAgIHRoaXMuX3ByZXBhcmVDb2xvclNsaWRlckZvck1vdXNlRXZlbnQoZHJhZ1N0YXJ0RXZlbnQpO1xufTtcblxuLyoqXG4gKiBEcmFnIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7RHJhZyNkcmFnfSBkcmFnRXZlbnQgLSBkcmFnIGV2ZW50IGRhdGFcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fb25EcmFnID0gZnVuY3Rpb24oZHJhZ0V2ZW50KSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5fZHJhZ0RhdGFDYWNoZSxcbiAgICAgICAgbW91c2VQb3MgPSBkb21ldmVudC5nZXRNb3VzZVBvc2l0aW9uKGRyYWdFdmVudC5vcmlnaW5FdmVudCwgY2FjaGUucGFyZW50RWxlbWVudCk7XG5cbiAgICBpZiAoY2FjaGUuaXNDb2xvclNsaWRlcikge1xuICAgICAgICB0aGlzLl9tb3ZlQ29sb3JTbGlkZXJCeVBvc2l0aW9uKG1vdXNlUG9zWzBdLCBtb3VzZVBvc1sxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW92ZUh1ZUJ5UG9zaXRpb24obW91c2VQb3NbMV0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogRHJhZyNkcmFnRW5kIGV2ZW50IGhhbmRsZXJcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fb25EcmFnRW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fZHJhZ0RhdGFDYWNoZSA9IG51bGw7XG59O1xuXG51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihTbGlkZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNsaWRlcjtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IG1vZHVsZSBmb3IgbWFuaXB1bGF0ZSBTVkcgb3IgVk1MIG9iamVjdFxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgUEFSU0VfVFJBTlNMQVRFX05VTV9SRUdFWCA9IC9bXFwuXFwtMC05XSsvZztcbnZhciBTVkdfSFVFX0hBTkRMRV9SSUdIVF9QT1MgPSAtNjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnZhciBzdmd2bWwgPSB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRydWUgd2hlbiBicm93c2VyIGlzIGJlbG93IElFOC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXMgb2xkIGJyb3dzZXI/XG4gICAgICovXG4gICAgaXNPbGRCcm93c2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9pc09sZEJyb3dzZXIgPSBzdmd2bWwuX2lzT2xkQnJvd3NlcjtcblxuICAgICAgICBpZiAoIXV0aWwuaXNFeGlzdHkoX2lzT2xkQnJvd3NlcikpIHtcbiAgICAgICAgICAgIHN2Z3ZtbC5faXNPbGRCcm93c2VyID0gX2lzT2xkQnJvd3NlciA9IHV0aWwuYnJvd3Nlci5tc2llICYmIHV0aWwuYnJvd3Nlci52ZXJzaW9uIDwgOTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfaXNPbGRCcm93c2VyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdHJhbnNsYXRlIHRyYW5zZm9ybSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7U1ZHfFZNTH0gb2JqIC0gc3ZnIG9yIHZtbCBvYmplY3QgdGhhdCB3YW50IHRvIGtub3cgdHJhbnNsYXRlIHgsIHlcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IHRyYW5zbGF0ZWQgY29vcmRpbmF0ZXMgW3gsIHldXG4gICAgICovXG4gICAgZ2V0VHJhbnNsYXRlWFk6IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgdGVtcDtcblxuICAgICAgICBpZiAoc3Zndm1sLmlzT2xkQnJvd3NlcigpKSB7XG4gICAgICAgICAgICB0ZW1wID0gb2JqLnN0eWxlO1xuICAgICAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHRlbXAudG9wKSwgcGFyc2VGbG9hdCh0ZW1wLmxlZnQpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlbXAgPSBvYmouZ2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nKTtcblxuICAgICAgICBpZiAoIXRlbXApIHtcbiAgICAgICAgICAgIHJldHVybiBbMCwgMF07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRlbXAgPSB0ZW1wLm1hdGNoKFBBUlNFX1RSQU5TTEFURV9OVU1fUkVHRVgpO1xuXG4gICAgICAgIC8vIG5lZWQgY2F1dGlvbiBmb3IgZGlmZmVyZW5jZSBvZiBWTUwsIFNWRyBjb29yZGluYXRlcyBzeXN0ZW0uXG4gICAgICAgIC8vIHRyYW5zbGF0ZSBjb21tYW5kIG5lZWQgWCBjb29yZHMgaW4gZmlyc3QgcGFyYW1ldGVyLiBidXQgVk1MIGlzIHVzZSBDU1MgY29vcmRpbmF0ZSBzeXN0ZW0odG9wLCBsZWZ0KVxuICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQodGVtcFsxXSksIHBhcnNlRmxvYXQodGVtcFswXSldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdHJhbnNsYXRlIHRyYW5zZm9ybSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7U1ZHfFZNTH0gb2JqIC0gU1ZHIG9yIFZNTCBvYmplY3QgdG8gc2V0dGluZyB0cmFuc2xhdGUgdHJhbnNmb3JtLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdHJhbnNsYXRlIFggdmFsdWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIHRyYW5zbGF0ZSBZIHZhbHVlXG4gICAgICovXG4gICAgc2V0VHJhbnNsYXRlWFk6IGZ1bmN0aW9uKG9iaiwgeCwgeSkge1xuICAgICAgICBpZiAoc3Zndm1sLmlzT2xkQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBvYmouc3R5bGUubGVmdCA9IHggKyAncHgnO1xuICAgICAgICAgICAgb2JqLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICcsJyArIHkgKyAnKScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0cmFuc2xhdGUgb25seSBZIHZhbHVlXG4gICAgICogQHBhcmFtIHtTVkd8Vk1MfSBvYmogLSBTVkcgb3IgVk1MIG9iamVjdCB0byBzZXR0aW5nIHRyYW5zbGF0ZSB0cmFuc2Zvcm0uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSB0cmFuc2xhdGUgWSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFRyYW5zbGF0ZVk6IGZ1bmN0aW9uKG9iaiwgeSkge1xuICAgICAgICBpZiAoc3Zndm1sLmlzT2xkQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBvYmouc3R5bGUudG9wID0geSArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBTVkdfSFVFX0hBTkRMRV9SSUdIVF9QT1MgKyAnLCcgKyB5ICsgJyknKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgc3Ryb2tlIGNvbG9yIHRvIFNWRyBvciBWTUwgb2JqZWN0XG4gICAgICogQHBhcmFtIHtTVkd8Vk1MfSBvYmogLSBTVkcgb3IgVk1MIG9iamVjdCB0byBzZXR0aW5nIHN0cm9rZSBjb2xvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvclN0ciAtIGNvbG9yIHN0cmluZ1xuICAgICAqL1xuICAgIHNldFN0cm9rZUNvbG9yOiBmdW5jdGlvbihvYmosIGNvbG9yU3RyKSB7XG4gICAgICAgIGlmIChzdmd2bWwuaXNPbGRCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIG9iai5zdHJva2Vjb2xvciA9IGNvbG9yU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnc3Ryb2tlJywgY29sb3JTdHIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBncmFkaWVudCBzdG9wIGNvbG9yIHRvIFNWRywgVk1MIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1NWR3xWTUx9IG9iaiAtIFNWRywgVk1MIG9iamVjdCB0byBhcHBseWluZyBncmFkaWVudCBzdG9wIGNvbG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yU3RyIC0gY29sb3Igc3RyaW5nXG4gICAgICovXG4gICAgc2V0R3JhZGllbnRDb2xvclN0b3A6IGZ1bmN0aW9uKG9iaiwgY29sb3JTdHIpIHtcbiAgICAgICAgaWYgKHN2Z3ZtbC5pc09sZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgb2JqLmNvbG9yID0gY29sb3JTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKCdzdG9wLWNvbG9yJywgY29sb3JTdHIpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN2Z3ZtbDtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFBhbGV0dGUgdmlldyB0ZW1wbGF0ZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGxheW91dCA9IFtcbic8dWwgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19Y2xlYXJmaXhcIj57e2NvbG9yTGlzdH19PC91bD4nLFxuJzxkaXYgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19Y2xlYXJmaXhcIiBzdHlsZT1cIm92ZXJmbG93OmhpZGRlblwiPicsXG4gICAgJzxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19cGFsZXR0ZS10b2dnbGUtc2xpZGVyXCIgdmFsdWU9XCJ7e2RldGFpbFR4dH19XCIgLz4nLFxuICAgICc8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX1wYWxldHRlLWhleFwiIHZhbHVlPVwie3tjb2xvcn19XCIgbWF4bGVuZ3RoPVwiN1wiIC8+JyxcbiAgICAnPHNwYW4gY2xhc3M9XCJ7e2Nzc1ByZWZpeH19cGFsZXR0ZS1wcmV2aWV3XCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnt7Y29sb3J9fTtjb2xvcjp7e2NvbG9yfX1cIj57e2NvbG9yfX08L3NwYW4+Jyxcbic8L2Rpdj4nXS5qb2luKCdcXG4nKTtcblxudmFyIGl0ZW0gPSAnPGxpPjxpbnB1dCBjbGFzcz1cInt7Y3NzUHJlZml4fX1wYWxldHRlLWJ1dHRvbnt7c2VsZWN0ZWR9fVwiIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6e3tjb2xvcn19O2NvbG9yOnt7Y29sb3J9fVwiIHRpdGxlPVwie3tjb2xvcn19XCIgdmFsdWU9XCJ7e2NvbG9yfX1cIiAvPjwvbGk+JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbGF5b3V0OiBsYXlvdXQsXG4gICAgaXRlbTogaXRlbVxufTtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBTbGlkZXIgdGVtcGxhdGVcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xuXG52YXIgbGF5b3V0ID0gW1xuJzxkaXYgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c2xpZGVyLWxlZnQge3tjc3NQcmVmaXh9fXNsaWRlci1wYXJ0XCI+e3tzbGlkZXJ9fTwvZGl2PicsXG4nPGRpdiBjbGFzcz1cInt7Y3NzUHJlZml4fX1zbGlkZXItcmlnaHQge3tjc3NQcmVmaXh9fXNsaWRlci1wYXJ0XCI+e3todWViYXJ9fTwvZGl2Pidcbl0uam9pbignXFxuJyk7XG5cbnZhciBTVkdTbGlkZXIgPSBbJzxzdmcgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c3ZnIHt7Y3NzUHJlZml4fX1zdmctc2xpZGVyXCI+JyxcbiAgICAnPGRlZnM+JyxcbiAgICAgICAgJzxsaW5lYXJHcmFkaWVudCBpZD1cInt7Y3NzUHJlZml4fX1zdmctZmlsbC1jb2xvclwiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIxMDAlXCIgeTI9XCIwJVwiPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwyNTUsMjU1KVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBjbGFzcz1cInt7Y3NzUHJlZml4fX1zbGlkZXItYmFzZWNvbG9yXCIgb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDAsMClcIiAvPicsXG4gICAgICAgICc8L2xpbmVhckdyYWRpZW50PicsXG4gICAgICAgICc8bGluZWFyR3JhZGllbnQgaWQ9XCJ7e2Nzc1ByZWZpeH19c3ZuLWZpbGwtYmxhY2tcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMCVcIiB5Mj1cIjEwMCVcIj4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjAlXCIgc3R5bGU9XCJzdG9wLWNvbG9yOnJnYigwLDAsMCk7c3RvcC1vcGFjaXR5OjBcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0eWxlPVwic3RvcC1jb2xvcjpyZ2IoMCwwLDApO3N0b3Atb3BhY2l0eToxXCIgLz4nLFxuICAgICAgICAnPC9saW5lYXJHcmFkaWVudD4nLFxuICAgICc8L2RlZnM+JyxcbiAgICAnPHJlY3Qgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbGw9XCJ1cmwoI3t7Y3NzUHJlZml4fX1zdmctZmlsbC1jb2xvcilcIj48L3JlY3Q+JyxcbiAgICAnPHJlY3Qgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbGw9XCJ1cmwoI3t7Y3NzUHJlZml4fX1zdm4tZmlsbC1ibGFjaylcIj48L3JlY3Q+JyxcbiAgICAnPHBhdGggdHJhbnNmb3JtPVwidHJhbnNsYXRlKDAsMClcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX1zbGlkZXItaGFuZGxlXCIgZD1cIk0wIDcuNSBMMTUgNy41IE03LjUgMTUgTDcuNSAwIE0yIDcgYTUuNSA1LjUgMCAxIDEgMCAxIFpcIiBzdHJva2U9XCJibGFja1wiIHN0cm9rZS13aWR0aD1cIjAuNzVcIiBmaWxsPVwibm9uZVwiIC8+Jyxcbic8L3N2Zz4nXS5qb2luKCdcXG4nKTtcblxudmFyIFZNTFNsaWRlciA9IFsnPGRpdiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwtc2xpZGVyXCI+JyxcbiAgICAnPHY6cmVjdCBzdHJva2Vjb2xvcj1cIm5vbmVcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fXZtbC1zbGlkZXItYmdcIj4nLFxuICAgICAgJzx2OmZpbGwgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX1zbGlkZXItYmFzZWNvbG9yXCIgdHlwZT1cImdyYWRpZW50XCIgbWV0aG9kPVwibm9uZVwiIGNvbG9yPVwiI2ZmMDAwMFwiIGNvbG9yMj1cIiNmZmZcIiBhbmdsZT1cIjkwXCIgLz4nLFxuICAgICc8L3Y6cmVjdD4nLFxuICAgICc8djpyZWN0IHN0cm9rZWNvbG9yPVwiI2NjY1wiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19dm1sLXNsaWRlci1iZ1wiPicsXG4gICAgICAgICc8djpmaWxsIHR5cGU9XCJncmFkaWVudFwiIG1ldGhvZD1cIm5vbmVcIiBjb2xvcj1cImJsYWNrXCIgY29sb3IyPVwid2hpdGVcIiBvOm9wYWNpdHkyPVwiMCVcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWxcIiAvPicsXG4gICAgJzwvdjpyZWN0PicsXG4gICAgJzx2OnNoYXBlIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19c2xpZGVyLWhhbmRsZVwiIGNvb3Jkc2l6ZT1cIjEgMVwiIHN0eWxlPVwid2lkdGg6MXB4O2hlaWdodDoxcHg7XCInICtcbiAgICAgICAgJ3BhdGg9XCJtIDAsNyBsIDE0LDcgbSA3LDE0IGwgNywwIGFyIDEyLDEyIDIsMiB6XCIgZmlsbGVkPVwiZmFsc2VcIiBzdHJva2VkPVwidHJ1ZVwiIC8+Jyxcbic8L2Rpdj4nXS5qb2luKCdcXG4nKTtcblxudmFyIFNWR0h1ZWJhciA9IFsnPHN2ZyBjbGFzcz1cInt7Y3NzUHJlZml4fX1zdmcge3tjc3NQcmVmaXh9fXN2Zy1odWViYXJcIj4nLFxuICAgICc8ZGVmcz4nLFxuICAgICAgICAnPGxpbmVhckdyYWRpZW50IGlkPVwiZ1wiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIwJVwiIHkyPVwiMTAwJVwiPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwwLDApXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjE2LjY2NiVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwyNTUsMClcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMzMuMzMzJVwiIHN0b3AtY29sb3I9XCJyZ2IoMCwyNTUsMClcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiNTAlXCIgc3RvcC1jb2xvcj1cInJnYigwLDI1NSwyNTUpXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjY2LjY2NiVcIiBzdG9wLWNvbG9yPVwicmdiKDAsMCwyNTUpXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjgzLjMzMyVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwwLDI1NSlcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDAsMClcIiAvPicsXG4gICAgICAgICc8L2xpbmVhckdyYWRpZW50PicsXG4gICAgJzwvZGVmcz4nLFxuICAgICc8cmVjdCB3aWR0aD1cIjE4cHhcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cInVybCgjZylcIj48L3JlY3Q+JyxcbiAgICAnPHBhdGggdHJhbnNmb3JtPVwidHJhbnNsYXRlKC02LC0zKVwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fWh1ZWJhci1oYW5kbGVcIiBkPVwiTTAgMCBMNCA0IEwwIDggTDAgMCBaXCIgZmlsbD1cImJsYWNrXCIgc3Ryb2tlPVwibm9uZVwiIC8+Jyxcbic8L3N2Zz4nXS5qb2luKCdcXG4nKTtcblxudmFyIFZNTEh1ZWJhciA9IFsnPGRpdiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwtaHVlYmFyXCI+JyxcbiAgICAnPHY6cmVjdCBzdHJva2Vjb2xvcj1cIiNjY2NcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fXZtbC1odWViYXItYmdcIj4nLFxuICAgICAgICAnPHY6ZmlsbCB0eXBlPVwiZ3JhZGllbnRcIiBtZXRob2Q9XCJub25lXCIgY29sb3JzPVwiJyArXG4gICAgICAgICcwJSByZ2IoMjU1LDAsMCksIDE2LjY2NiUgcmdiKDI1NSwyNTUsMCksIDMzLjMzMyUgcmdiKDAsMjU1LDApLCA1MCUgcmdiKDAsMjU1LDI1NSksIDY2LjY2NiUgcmdiKDAsMCwyNTUpLCA4My4zMzMlIHJnYigyNTUsMCwyNTUpLCAxMDAlIHJnYigyNTUsMCwwKScgK1xuICAgICAgICAnXCIgYW5nbGU9XCIxODBcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWxcIiAvPicsXG4gICAgJzwvdjpyZWN0PicsXG4gICAgJzx2OnNoYXBlIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19aHVlYmFyLWhhbmRsZVwiIGNvb3Jkc2l6ZT1cIjEgMVwiIHN0eWxlPVwid2lkdGg6MXB4O2hlaWdodDoxcHg7cG9zaXRpb246YWJzb2x1dGU7ei1pbmRleDoxO3JpZ2h0OjIycHg7dG9wOi0zcHg7XCInICsgXG4gICAgICAgICdwYXRoPVwibSAwLDAgbCA0LDQgbCAwLDggbCAwLDAgelwiIGZpbGxlZD1cInRydWVcIiBmaWxsY29sb3I9XCJibGFja1wiIHN0cm9rZWQ9XCJmYWxzZVwiIC8+Jyxcbic8L2Rpdj4nXS5qb2luKCdcXG4nKTtcblxudmFyIGlzT2xkQnJvd3NlciA9IHV0aWwuYnJvd3Nlci5tc2llICYmICh1dGlsLmJyb3dzZXIudmVyc2lvbiA8IDkpO1xuXG5pZiAoaXNPbGRCcm93c2VyKSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50Lm5hbWVzcGFjZXMuYWRkKCd2JywgJ3VybjpzY2hlbWFzLW1pY3Jvc29mdC1jb206dm1sJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGxheW91dDogbGF5b3V0LFxuICAgIHNsaWRlcjogaXNPbGRCcm93c2VyID8gVk1MU2xpZGVyIDogU1ZHU2xpZGVyLFxuICAgIGh1ZWJhcjogaXNPbGRCcm93c2VyID8gVk1MSHVlYmFyIDogU1ZHSHVlYmFyXG59O1xuIl19
