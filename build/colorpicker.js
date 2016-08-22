(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Toast UI Colorpicker
 * @version 1.0.2
 */
'use strict';
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


},{"./src/js/colorutil":2,"./src/js/core/collection":3,"./src/js/core/domevent":4,"./src/js/core/domutil":5,"./src/js/core/drag":6,"./src/js/core/view":7,"./src/js/factory":8,"./src/js/palette":10,"./src/js/slider":11,"./src/js/svgvml":12}],2:[function(require,module,exports){
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

    // @license RGB <-> HSV conversion utilities based off of http://www.cs.rit.edu/~ncs/color/t_convert.html

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


},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./collection":3,"./domevent":4}],6:[function(require,module,exports){
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

},{"./domevent":4,"./domutil":5}],7:[function(require,module,exports){
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

},{"./collection":3,"./domutil":5}],8:[function(require,module,exports){
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
    throw new Error(msg);
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

    /**
     * @api
     * @event Colorpicker#selectColor
     * @type {object}
     * @property {string} color - selected color (hex string)
     * @property {string} origin - flags for represent the source of event fires.
     */
    this.fire('selectColor', {
        color: color,
        origin: 'palette'
    });

    if (opt.color === color) {
        return;
    }

    opt.color = color;
    this.render(color);
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

    /**
     * @api
     * @event Colorpicker#selectColor
     * @type {object}
     * @property {string} color - selected color (hex string)
     * @property {string} origin - flags for represent the source of event fires.
     */
    this.fire('selectColor', {
        color: color,
        origin: 'slider'
    });

    if (opt.color === color) {
        return;
    }

    opt.color = color;
    this.palette.render(color);
};

/**********
 * PUBLIC API
 **********/

/**
 * Set color to colorpicker instance.<br>
 * The string parameter must be hex color value
 * @api
 * @param {string} hexStr - hex formatted color string
 * @example
 * colorPicker.setColor('#ffff00');
 */
Colorpicker.prototype.setColor = function(hexStr) {
    if (!colorutil.isValidRGB(hexStr)) {
        throwError('Colorpicker#setColor(): need valid hex string color value');
    }

    this.options.color = hexStr;
    this.render(hexStr);
};

/**
 * Get hex color string of current selected color in colorpicker instance.
 * @api
 * @returns {string} hex string formatted color
 * @example
 * colorPicker.setColor('#ffff00');
 * colorPicker.getColor(); // '#ffff00';
 */
Colorpicker.prototype.getColor = function() {
    return this.options.color;
};

/**
 * Toggle colorpicker element. set true then reveal colorpicker view.
 * @api
 * @param {boolean} [isShow=false] - A flag to show
 * @example
 * colorPicker.toggle(false); // hide
 * colorPicker.toggle(); // hide
 * colorPicker.toggle(true); // show
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
 * Destroy colorpicker instance.
 * @api
 * @example
 * colorPicker.destroy(); // DOM-element is removed
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

},{"./colorutil":2,"./layout":9,"./palette":10,"./slider":11}],9:[function(require,module,exports){
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

},{"./core/domutil":5,"./core/view":7}],10:[function(require,module,exports){
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

},{"../template/palette":13,"./core/domevent":4,"./core/domutil":5,"./core/view":7}],11:[function(require,module,exports){
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

},{"../template/slider":14,"./colorutil":2,"./core/domevent":4,"./core/domutil":5,"./core/drag":6,"./core/view":7,"./svgvml":12}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9jb2xvcnV0aWwuanMiLCJzcmMvanMvY29yZS9jb2xsZWN0aW9uLmpzIiwic3JjL2pzL2NvcmUvZG9tZXZlbnQuanMiLCJzcmMvanMvY29yZS9kb211dGlsLmpzIiwic3JjL2pzL2NvcmUvZHJhZy5qcyIsInNyYy9qcy9jb3JlL3ZpZXcuanMiLCJzcmMvanMvZmFjdG9yeS5qcyIsInNyYy9qcy9sYXlvdXQuanMiLCJzcmMvanMvcGFsZXR0ZS5qcyIsInNyYy9qcy9zbGlkZXIuanMiLCJzcmMvanMvc3Zndm1sLmpzIiwic3JjL3RlbXBsYXRlL3BhbGV0dGUuanMiLCJzcmMvdGVtcGxhdGUvc2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqa0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDelBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzlZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogVG9hc3QgVUkgQ29sb3JwaWNrZXJcbiAqIEB2ZXJzaW9uIDEuMC4yXG4gKi9cbid1c2Ugc3RyaWN0Jztcbi8qKiBAbmFtZXNwYWNlIHR1aS5jb21wb25lbnQgKi9cbnR1aS51dGlsLmRlZmluZU5hbWVzcGFjZSgndHVpLmNvbXBvbmVudC5jb2xvcnBpY2tlcicsIHtcbiAgICBkb211dGlsOiByZXF1aXJlKCcuL3NyYy9qcy9jb3JlL2RvbXV0aWwnKSxcbiAgICBkb21ldmVudDogcmVxdWlyZSgnLi9zcmMvanMvY29yZS9kb21ldmVudCcpLFxuICAgIENvbGxlY3Rpb246IHJlcXVpcmUoJy4vc3JjL2pzL2NvcmUvY29sbGVjdGlvbicpLFxuICAgIFZpZXc6IHJlcXVpcmUoJy4vc3JjL2pzL2NvcmUvdmlldycpLFxuICAgIERyYWc6IHJlcXVpcmUoJy4vc3JjL2pzL2NvcmUvZHJhZycpLFxuXG4gICAgY3JlYXRlOiByZXF1aXJlKCcuL3NyYy9qcy9mYWN0b3J5JyksXG4gICAgUGFsZXR0ZTogcmVxdWlyZSgnLi9zcmMvanMvcGFsZXR0ZScpLFxuICAgIFNsaWRlcjogcmVxdWlyZSgnLi9zcmMvanMvc2xpZGVyJyksXG4gICAgY29sb3J1dGlsOiByZXF1aXJlKCcuL3NyYy9qcy9jb2xvcnV0aWwnKSxcbiAgICBzdmd2bWw6IHJlcXVpcmUoJy4vc3JjL2pzL3N2Z3ZtbCcpXG59KTtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFV0aWxpdHkgbWV0aG9kcyB0byBtYW5pcHVsYXRlIGNvbG9yc1xuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGhleFJYID0gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pO1xuXG52YXIgY29sb3J1dGlsID0ge1xuICAgIC8qKlxuICAgICAqIHBhZCBsZWZ0IHplcm8gY2hhcmFjdGVycy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIG51bWJlciB2YWx1ZSB0byBwYWQgemVyby5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIHBhZCBsZW5ndGggdG8gd2FudC5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwYWRkZWQgc3RyaW5nLlxuICAgICAqL1xuICAgIGxlYWRpbmdaZXJvOiBmdW5jdGlvbihudW1iZXIsIGxlbmd0aCkge1xuICAgICAgICB2YXIgemVybyA9ICcnLFxuICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgaWYgKChudW1iZXIgKyAnJykubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgJyc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IChsZW5ndGggLSAxKTsgaSArPSAxKSB7XG4gICAgICAgICAgICB6ZXJvICs9ICcwJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoemVybyArIG51bWJlcikuc2xpY2UobGVuZ3RoICogLTEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB2YWxpZGF0ZSBvZiBoZXggc3RyaW5nIHZhbHVlIGlzIFJHQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSByZ2IgaGV4IHN0cmluZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB3aGVuIHN1cHBsaWVkIHN0ciBpcyB2YWxpZCBSR0IgaGV4IHN0cmluZ1xuICAgICAqL1xuICAgIGlzVmFsaWRSR0I6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICByZXR1cm4gaGV4UlgudGVzdChzdHIpO1xuICAgIH0sXG5cbiAgICAvLyBAbGljZW5zZSBSR0IgPC0+IEhTViBjb252ZXJzaW9uIHV0aWxpdGllcyBiYXNlZCBvZmYgb2YgaHR0cDovL3d3dy5jcy5yaXQuZWR1L35uY3MvY29sb3IvdF9jb252ZXJ0Lmh0bWxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgY29sb3IgaGV4IHN0cmluZyB0byByZ2IgbnVtYmVyIGFycmF5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciAtIGhleCBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX0gcmdiIG51bWJlcnNcbiAgICAgKi9cbiAgICBoZXhUb1JHQjogZnVuY3Rpb24oaGV4U3RyKSB7XG4gICAgICAgIHZhciByLCBnLCBiO1xuXG4gICAgICAgIGlmICghY29sb3J1dGlsLmlzVmFsaWRSR0IoaGV4U3RyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaGV4U3RyID0gaGV4U3RyLnN1YnN0cmluZygxKTtcblxuICAgICAgICByID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cigwLCAyKSwgMTYpO1xuICAgICAgICBnID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cigyLCAyKSwgMTYpO1xuICAgICAgICBiID0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cig0LCAyKSwgMTYpO1xuXG4gICAgICAgIHJldHVybiBbciwgZywgYl07XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCByZ2IgbnVtYmVyIHRvIGhleCBzdHJpbmdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gciAtIHJlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBnIC0gZ3JlZW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIGJsdWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfGJvb2xlYW59IHJldHVybiBmYWxzZSB3aGVuIHN1cHBsaWVkIHJnYiBudW1iZXIgaXMgbm90IHZhbGlkLiBvdGhlcndpc2UsIGNvbnZlcnRlZCBoZXggc3RyaW5nXG4gICAgICovXG4gICAgcmdiVG9IRVg6IGZ1bmN0aW9uKHIsIGcsIGIpIHtcbiAgICAgICAgdmFyIGhleFN0ciA9ICcjJyArXG4gICAgICAgICAgICBjb2xvcnV0aWwubGVhZGluZ1plcm8oci50b1N0cmluZygxNiksIDIpICtcbiAgICAgICAgICAgIGNvbG9ydXRpbC5sZWFkaW5nWmVybyhnLnRvU3RyaW5nKDE2KSwgMikgK1xuICAgICAgICAgICAgY29sb3J1dGlsLmxlYWRpbmdaZXJvKGIudG9TdHJpbmcoMTYpLCAyKTtcblxuICAgICAgICBpZiAoY29sb3J1dGlsLmlzVmFsaWRSR0IoaGV4U3RyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGhleFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCByZ2IgbnVtYmVyIHRvIEhTViB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gcmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBncmVlblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gYmx1ZVxuICAgICAqIEByZXR1cm4ge251bWJlcltdfSBoc3YgdmFsdWVcbiAgICAgKi9cbiAgICByZ2JUb0hTVjogZnVuY3Rpb24ociwgZywgYikge1xuICAgICAgICB2YXIgbWF4LCBtaW4sIGgsIHMsIHYsIGQ7XG5cbiAgICAgICAgciAvPSAyNTU7XG4gICAgICAgIGcgLz0gMjU1O1xuICAgICAgICBiIC89IDI1NTtcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgICAgICB2ID0gbWF4O1xuICAgICAgICBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbWF4ID09PSAwID8gMCA6IChkIC8gbWF4KTtcblxuICAgICAgICBpZiAobWF4ID09PSBtaW4pIHtcbiAgICAgICAgICAgIGggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChtYXgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vIG5vIGRlZmF1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGggLz0gNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBNYXRoLnJvdW5kKGggKiAzNjApLFxuICAgICAgICAgICAgTWF0aC5yb3VuZChzICogMTAwKSxcbiAgICAgICAgICAgIE1hdGgucm91bmQodiAqIDEwMClcbiAgICAgICAgXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCBIU1YgbnVtYmVyIHRvIFJHQlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoIC0gaHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHMgLSBzYXR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHYgLSB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gcmdiIHZhbHVlXG4gICAgICovXG4gICAgaHN2VG9SR0I6IGZ1bmN0aW9uKGgsIHMsIHYpIHtcbiAgICAgICAgdmFyIHIsIGcsIGI7XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgZiwgcCwgcSwgdDtcblxuICAgICAgICBoID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMzYwLCBoKSk7XG4gICAgICAgIHMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHMpKTtcbiAgICAgICAgdiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgdikpO1xuXG4gICAgICAgIHMgLz0gMTAwO1xuICAgICAgICB2IC89IDEwMDtcblxuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgICAgLy8gQWNocm9tYXRpYyAoZ3JleSlcbiAgICAgICAgICAgIHIgPSBnID0gYiA9IHY7XG4gICAgICAgICAgICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xuICAgICAgICB9XG5cbiAgICAgICAgaCAvPSA2MDsgLy8gc2VjdG9yIDAgdG8gNVxuICAgICAgICBpID0gTWF0aC5mbG9vcihoKTtcbiAgICAgICAgZiA9IGggLSBpOyAvLyBmYWN0b3JpYWwgcGFydCBvZiBoXG4gICAgICAgIHAgPSB2ICogKDEgLSBzKTtcbiAgICAgICAgcSA9IHYgKiAoMSAtIHMgKiBmKTtcbiAgICAgICAgdCA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcblxuICAgICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgICAgIGNhc2UgMDogciA9IHY7IGcgPSB0OyBiID0gcDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IHIgPSBxOyBnID0gdjsgYiA9IHA7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gcDsgZyA9IHY7IGIgPSB0OyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzogciA9IHA7IGcgPSBxOyBiID0gdjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6IHIgPSB0OyBnID0gcDsgYiA9IHY7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogciA9IHY7IGcgPSBwOyBiID0gcTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29sb3J1dGlsO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ29tbW9uIGNvbGxlY3Rpb25zLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWwsXG4gICAgZm9yRWFjaFByb3AgPSB1dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzLFxuICAgIGZvckVhY2hBcnIgPSB1dGlsLmZvckVhY2hBcnJheSxcbiAgICBpc0Z1bmMgPSB1dGlsLmlzRnVuY3Rpb24sXG4gICAgaXNPYmogPSB1dGlsLmlzT2JqZWN0O1xuXG52YXIgYXBzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4vKipcbiAqIENvbW1vbiBjb2xsZWN0aW9uLlxuICpcbiAqIEl0IG5lZWQgZnVuY3Rpb24gZm9yIGdldCBtb2RlbCdzIHVuaXF1ZSBpZC5cbiAqXG4gKiBpZiB0aGUgZnVuY3Rpb24gaXMgbm90IHN1cHBsaWVkIHRoZW4gaXQgdXNlIGRlZmF1bHQgZnVuY3Rpb24ge0BsaW5rIENvbGxlY3Rpb24jZ2V0SXRlbUlEfVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0SXRlbUlERm5dIGZ1bmN0aW9uIGZvciBnZXQgbW9kZWwncyBpZC5cbiAqL1xuZnVuY3Rpb24gQ29sbGVjdGlvbihnZXRJdGVtSURGbikge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtvYmplY3QuPHN0cmluZywgKj59XG4gICAgICovXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgICBpZiAoaXNGdW5jKGdldEl0ZW1JREZuKSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge2Z1bmN0aW9ufVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5nZXRJdGVtSUQgPSBnZXRJdGVtSURGbjtcbiAgICB9XG59XG5cbi8qKioqKioqKioqXG4gKiBzdGF0aWMgcHJvcHNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIENvbWJpbmQgc3VwcGxpZWQgZnVuY3Rpb24gZmlsdGVycyBhbmQgY29uZGl0aW9uLlxuICogQHBhcmFtIHsuLi5mdW5jdGlvbn0gZmlsdGVycyAtIGZ1bmN0aW9uIGZpbHRlcnNcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gY29tYmluZWQgZmlsdGVyXG4gKi9cbkNvbGxlY3Rpb24uYW5kID0gZnVuY3Rpb24oZmlsdGVycykge1xuICAgIHZhciBjbnQ7XG5cbiAgICBmaWx0ZXJzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcbiAgICBjbnQgPSBmaWx0ZXJzLmxlbmd0aDtcblxuICAgIHJldHVybiBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICBmb3IgKDsgaSA8IGNudDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoIWZpbHRlcnNbaV0uY2FsbChudWxsLCBpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbn07XG5cbi8qKlxuICogQ29tYmluZSBtdWx0aXBsZSBmdW5jdGlvbiBmaWx0ZXJzIHdpdGggT1IgY2xhdXNlLlxuICogQHBhcmFtIHsuLi5mdW5jdGlvbn0gZmlsdGVycyAtIGZ1bmN0aW9uIGZpbHRlcnNcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gY29tYmluZWQgZmlsdGVyXG4gKi9cbkNvbGxlY3Rpb24ub3IgPSBmdW5jdGlvbihmaWx0ZXJzKSB7XG4gICAgdmFyIGNudDtcblxuICAgIGZpbHRlcnMgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIGNudCA9IGZpbHRlcnMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIGkgPSAxLFxuICAgICAgICAgICAgcmVzdWx0ID0gZmlsdGVyc1swXS5jYWxsKG51bGwsIGl0ZW0pO1xuXG4gICAgICAgIGZvciAoOyBpIDwgY250OyBpICs9IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgfHwgZmlsdGVyc1tpXS5jYWxsKG51bGwsIGl0ZW0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn07XG5cbi8qKlxuICogTWVyZ2Ugc2V2ZXJhbCBjb2xsZWN0aW9ucy5cbiAqXG4gKiBZb3UgY2FuXFwndCBtZXJnZSBjb2xsZWN0aW9ucyBkaWZmZXJlbnQgX2dldEV2ZW50SUQgZnVuY3Rpb25zLiBUYWtlIGNhc2Ugb2YgdXNlLlxuICogQHBhcmFtIHsuLi5Db2xsZWN0aW9ufSBjb2xsZWN0aW9ucyBjb2xsZWN0aW9uIGFyZ3VtZW50cyB0byBtZXJnZVxuICogQHJldHVybnMge0NvbGxlY3Rpb259IG1lcmdlZCBjb2xsZWN0aW9uLlxuICovXG5Db2xsZWN0aW9uLm1lcmdlID0gZnVuY3Rpb24oY29sbGVjdGlvbnMpIHsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIHZhciBjb2xzID0gYXBzLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgbmV3SXRlbXMgPSB7fSxcbiAgICAgICAgbWVyZ2VkID0gbmV3IENvbGxlY3Rpb24oY29sc1swXS5nZXRJdGVtSUQpLFxuICAgICAgICBleHRlbmQgPSB1dGlsLmV4dGVuZDtcblxuICAgIGZvckVhY2hBcnIoY29scywgZnVuY3Rpb24oY29sKSB7XG4gICAgICAgIGV4dGVuZChuZXdJdGVtcywgY29sLml0ZW1zKTtcbiAgICB9KTtcblxuICAgIG1lcmdlZC5pdGVtcyA9IG5ld0l0ZW1zO1xuICAgIG1lcmdlZC5sZW5ndGggPSB1dGlsLmtleXMobWVyZ2VkLml0ZW1zKS5sZW5ndGg7XG5cbiAgICByZXR1cm4gbWVyZ2VkO1xufTtcblxuLyoqKioqKioqKipcbiAqIHByb3RvdHlwZSBwcm9wc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogZ2V0IG1vZGVsJ3MgdW5pcXVlIGlkLlxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gbW9kZWwgaW5zdGFuY2UuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBtb2RlbCB1bmlxdWUgaWQuXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmdldEl0ZW1JRCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5faWQgKyAnJztcbn07XG5cbi8qKlxuICogYWRkIG1vZGVscy5cbiAqIEBwYXJhbSB7Li4uKn0gaXRlbSBtb2RlbHMgdG8gYWRkIHRoaXMgY29sbGVjdGlvbi5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBpZCxcbiAgICAgICAgb3duSXRlbXM7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yRWFjaEFycihhcHMuY2FsbChhcmd1bWVudHMpLCBmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICB0aGlzLmFkZChvKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlkID0gdGhpcy5nZXRJdGVtSUQoaXRlbSk7XG4gICAgb3duSXRlbXMgPSB0aGlzLml0ZW1zO1xuXG4gICAgaWYgKCFvd25JdGVtc1tpZF0pIHtcbiAgICAgICAgdGhpcy5sZW5ndGggKz0gMTtcbiAgICB9XG4gICAgb3duSXRlbXNbaWRdID0gaXRlbTtcbn07XG5cbi8qKlxuICogcmVtb3ZlIG1vZGVscy5cbiAqIEBwYXJhbSB7Li4uKG9iamVjdHxzdHJpbmd8bnVtYmVyKX0gaWQgbW9kZWwgaW5zdGFuY2Ugb3IgdW5pcXVlIGlkIHRvIGRlbGV0ZS5cbiAqIEByZXR1cm5zIHthcnJheX0gZGVsZXRlZCBtb2RlbCBsaXN0LlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpZCkge1xuICAgIHZhciByZW1vdmVkID0gW10sXG4gICAgICAgIG93bkl0ZW1zLFxuICAgICAgICBpdGVtVG9SZW1vdmU7XG5cbiAgICBpZiAoIXRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICByZW1vdmVkID0gdXRpbC5tYXAoYXBzLmNhbGwoYXJndW1lbnRzKSwgZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbW92ZShpZCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiByZW1vdmVkO1xuICAgIH1cblxuICAgIG93bkl0ZW1zID0gdGhpcy5pdGVtcztcblxuICAgIGlmIChpc09iaihpZCkpIHtcbiAgICAgICAgaWQgPSB0aGlzLmdldEl0ZW1JRChpZCk7XG4gICAgfVxuXG4gICAgaWYgKCFvd25JdGVtc1tpZF0pIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5sZW5ndGggLT0gMTtcbiAgICBpdGVtVG9SZW1vdmUgPSBvd25JdGVtc1tpZF07XG4gICAgZGVsZXRlIG93bkl0ZW1zW2lkXTtcblxuICAgIHJldHVybiBpdGVtVG9SZW1vdmU7XG59O1xuXG4vKipcbiAqIHJlbW92ZSBhbGwgbW9kZWxzIGluIGNvbGxlY3Rpb24uXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuICAgIHRoaXMubGVuZ3RoID0gMDtcbn07XG5cbi8qKlxuICogY2hlY2sgY29sbGVjdGlvbiBoYXMgc3BlY2lmaWMgbW9kZWwuXG4gKiBAcGFyYW0geyhvYmplY3R8c3RyaW5nfG51bWJlcnxmdW5jdGlvbil9IGlkIG1vZGVsIGluc3RhbmNlIG9yIGlkIG9yIGZpbHRlciBmdW5jdGlvbiB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IGlzIGhhcyBtb2RlbD9cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oaWQpIHtcbiAgICB2YXIgaXNGaWx0ZXIsXG4gICAgICAgIGhhcztcblxuICAgIGlmICghdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRmlsdGVyID0gaXNGdW5jKGlkKTtcbiAgICBoYXMgPSBmYWxzZTtcblxuICAgIGlmIChpc0ZpbHRlcikge1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaWYgKGlkKGl0ZW0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaGFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlkID0gaXNPYmooaWQpID8gdGhpcy5nZXRJdGVtSUQoaWQpIDogaWQ7XG4gICAgICAgIGhhcyA9IHV0aWwuaXNFeGlzdHkodGhpcy5pdGVtc1tpZF0pO1xuICAgIH1cblxuICAgIHJldHVybiBoYXM7XG59O1xuXG4vKipcbiAqIGludm9rZSBjYWxsYmFjayB3aGVuIG1vZGVsIGV4aXN0IGluIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gaWQgbW9kZWwgdW5pcXVlIGlkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gdGhlIGNhbGxiYWNrLlxuICogQHBhcmFtIHsqfSBbY29udGV4dF0gY2FsbGJhY2sgY29udGV4dC5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZG9XaGVuSGFzID0gZnVuY3Rpb24oaWQsIGZuLCBjb250ZXh0KSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLml0ZW1zW2lkXTtcblxuICAgIGlmICghdXRpbC5pc0V4aXN0eShpdGVtKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm4uY2FsbChjb250ZXh0IHx8IHRoaXMsIGl0ZW0pO1xufTtcblxuLyoqXG4gKiBTZWFyY2ggbW9kZWwuIGFuZCByZXR1cm4gbmV3IGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmaWx0ZXIgZmlsdGVyIGZ1bmN0aW9uLlxuICogQHJldHVybnMge0NvbGxlY3Rpb259IG5ldyBjb2xsZWN0aW9uIHdpdGggZmlsdGVyZWQgbW9kZWxzLlxuICogQGV4YW1wbGVcbiAqIGNvbGxlY3Rpb24uZmluZChmdW5jdGlvbihpdGVtKSB7XG4gKiAgICAgcmV0dXJuIGl0ZW0uZWRpdGVkID09PSB0cnVlO1xuICogfSk7XG4gKlxuICogZnVuY3Rpb24gZmlsdGVyMShpdGVtKSB7XG4gKiAgICAgcmV0dXJuIGl0ZW0uZWRpdGVkID09PSBmYWxzZTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBmaWx0ZXIyKGl0ZW0pIHtcbiAqICAgICByZXR1cm4gaXRlbS5kaXNhYmxlZCA9PT0gZmFsc2U7XG4gKiB9XG4gKlxuICogY29sbGVjdGlvbi5maW5kKENvbGxlY3Rpb24uYW5kKGZpbHRlcjEsIGZpbHRlcjIpKTtcbiAqXG4gKiBjb2xsZWN0aW9uLmZpbmQoQ29sbGVjdGlvbi5vcihmaWx0ZXIxLCBmaWx0ZXIyKSk7XG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IENvbGxlY3Rpb24oKTtcblxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdnZXRJdGVtSUQnKSkge1xuICAgICAgICByZXN1bHQuZ2V0SXRlbUlEID0gdGhpcy5nZXRJdGVtSUQ7XG4gICAgfVxuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgaWYgKGZpbHRlcihpdGVtKSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmVzdWx0LmFkZChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogR3JvdXAgZWxlbWVudCBieSBzcGVjaWZpYyBrZXkgdmFsdWVzLlxuICpcbiAqIGlmIGtleSBwYXJhbWV0ZXIgaXMgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgYW5kIHVzZSByZXR1cm5lZCB2YWx1ZS5cbiAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8ZnVuY3Rpb258YXJyYXkpfSBrZXkga2V5IHByb3BlcnR5IG9yIGdldHRlciBmdW5jdGlvbi4gaWYgc3RyaW5nW10gc3VwcGxpZWQsIGNyZWF0ZSBlYWNoIGNvbGxlY3Rpb24gYmVmb3JlIGdyb3VwaW5nLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2dyb3VwRnVuY10gLSBmdW5jdGlvbiB0aGF0IHJldHVybiBlYWNoIGdyb3VwJ3Mga2V5XG4gKiBAcmV0dXJucyB7b2JqZWN0LjxzdHJpbmcsIENvbGxlY3Rpb24+fSBncm91cGVkIG9iamVjdFxuICogQGV4YW1wbGVcbiAqIFxuICogLy8gcGFzcyBgc3RyaW5nYCwgYG51bWJlcmAsIGBib29sZWFuYCB0eXBlIHZhbHVlIHRoZW4gZ3JvdXAgYnkgcHJvcGVydHkgdmFsdWUuXG4gKiBjb2xsZWN0aW9uLmdyb3VwQnkoJ2dlbmRlcicpOyAgICAvLyBncm91cCBieSAnZ2VuZGVyJyBwcm9wZXJ0eSB2YWx1ZS5cbiAqIGNvbGxlY3Rpb24uZ3JvdXBCeSg1MCk7ICAgICAgICAgIC8vIGdyb3VwIGJ5ICc1MCcgcHJvcGVydHkgdmFsdWUuXG4gKiBcbiAqIC8vIHBhc3MgYGZ1bmN0aW9uYCB0aGVuIGdyb3VwIGJ5IHJldHVybiB2YWx1ZS4gZWFjaCBpbnZvY2F0aW9uIGBmdW5jdGlvbmAgaXMgY2FsbGVkIHdpdGggYChpdGVtKWAuXG4gKiBjb2xsZWN0aW9uLmdyb3VwQnkoZnVuY3Rpb24oaXRlbSkge1xuICogICAgIGlmIChpdGVtLnNjb3JlID4gNjApIHtcbiAqICAgICAgICAgcmV0dXJuICdwYXNzJztcbiAqICAgICB9XG4gKiAgICAgcmV0dXJuICdmYWlsJztcbiAqIH0pO1xuICpcbiAqIC8vIHBhc3MgYGFycmF5YCB3aXRoIGZpcnN0IGFyZ3VtZW50cyB0aGVuIGNyZWF0ZSBlYWNoIGNvbGxlY3Rpb24gYmVmb3JlIGdyb3VwaW5nLlxuICogY29sbGVjdGlvbi5ncm91cEJ5KFsnZ28nLCAncnVieScsICdqYXZhc2NyaXB0J10pO1xuICogLy8gcmVzdWx0OiB7ICdnbyc6IGVtcHR5IENvbGxlY3Rpb24sICdydWJ5JzogZW1wdHkgQ29sbGVjdGlvbiwgJ2phdmFzY3JpcHQnOiBlbXB0eSBDb2xsZWN0aW9uIH1cbiAqXG4gKiAvLyBjYW4gcGFzcyBgZnVuY3Rpb25gIHdpdGggYGFycmF5YCB0aGVuIGdyb3VwIGVhY2ggZWxlbWVudHMuXG4gKiBjb2xsZWN0aW9uLmdyb3VwQnkoWydnbycsICdydWJ5JywgJ2phdmFzY3JpcHQnXSwgZnVuY3Rpb24oaXRlbSkge1xuICogICAgIGlmIChpdGVtLmlzRmFzdCkge1xuICogICAgICAgICByZXR1cm4gJ2dvJztcbiAqICAgICB9XG4gKlxuICogICAgIHJldHVybiBpdGVtLm5hbWU7XG4gKiB9KTtcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ3JvdXBCeSA9IGZ1bmN0aW9uKGtleSwgZ3JvdXBGdW5jKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICBiYXNlVmFsdWUsXG4gICAgICAgIGlzRnVuYyA9IHV0aWwuaXNGdW5jdGlvbixcbiAgICAgICAga2V5SXNGdW5jID0gaXNGdW5jKGtleSksXG4gICAgICAgIGdldEl0ZW1JREZuID0gdGhpcy5nZXRJdGVtSUQ7XG5cbiAgICBpZiAodXRpbC5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgdXRpbC5mb3JFYWNoQXJyYXkoa2V5LCBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICByZXN1bHRbayArICcnXSA9IG5ldyBDb2xsZWN0aW9uKGdldEl0ZW1JREZuKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFncm91cEZ1bmMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICBrZXkgPSBncm91cEZ1bmM7XG4gICAgICAgIGtleUlzRnVuYyA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgaWYgKGtleUlzRnVuYykge1xuICAgICAgICAgICAgYmFzZVZhbHVlID0ga2V5KGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFzZVZhbHVlID0gaXRlbVtrZXldO1xuXG4gICAgICAgICAgICBpZiAoaXNGdW5jKGJhc2VWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBiYXNlVmFsdWUgPSBiYXNlVmFsdWUuYXBwbHkoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb2xsZWN0aW9uID0gcmVzdWx0W2Jhc2VWYWx1ZV07XG5cbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uID0gcmVzdWx0W2Jhc2VWYWx1ZV0gPSBuZXcgQ29sbGVjdGlvbihnZXRJdGVtSURGbik7XG4gICAgICAgIH1cblxuICAgICAgICBjb2xsZWN0aW9uLmFkZChpdGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFJldHVybiBzaW5nbGUgaXRlbSBpbiBjb2xsZWN0aW9uLlxuICpcbiAqIFJldHVybmVkIGl0ZW0gaXMgaW5zZXJ0ZWQgaW4gdGhpcyBjb2xsZWN0aW9uIGZpcnN0bHkuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBpdGVtLlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5zaW5nbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0O1xuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmVzdWx0ID0gaXRlbTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogc29ydCBhIGJhc2lzIG9mIHN1cHBsaWVkIGNvbXBhcmUgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb21wYXJlRnVuY3Rpb24gY29tcGFyZUZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7YXJyYXl9IHNvcnRlZCBhcnJheS5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNvbXBhcmVGdW5jdGlvbikge1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIGFyci5wdXNoKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgaWYgKGlzRnVuYyhjb21wYXJlRnVuY3Rpb24pKSB7XG4gICAgICAgIGFyciA9IGFyci5zb3J0KGNvbXBhcmVGdW5jdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbn07XG5cbi8qKlxuICogaXRlcmF0ZSBlYWNoIG1vZGVsIGVsZW1lbnQuXG4gKlxuICogd2hlbiBpdGVyYXRlZSByZXR1cm4gZmFsc2UgdGhlbiBicmVhayB0aGUgbG9vcC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIGl0ZXJhdGVlKGl0ZW0sIGluZGV4LCBpdGVtcylcbiAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNvbnRleHRcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgZm9yRWFjaFByb3AodGhpcy5pdGVtcywgaXRlcmF0ZWUsIGNvbnRleHQgfHwgdGhpcyk7XG59O1xuXG4vKipcbiAqIHJldHVybiBuZXcgYXJyYXkgd2l0aCBjb2xsZWN0aW9uIGl0ZW1zLlxuICogQHJldHVybnMge2FycmF5fSBuZXcgYXJyYXkuXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnRvQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbC5tYXAodGhpcy5pdGVtcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sbGVjdGlvbjtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFV0aWxpdHkgbW9kdWxlIGZvciBoYW5kbGluZyBET00gZXZlbnRzLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWwsXG4gICAgYnJvd3NlciA9IHV0aWwuYnJvd3NlcixcbiAgICBldmVudEtleSA9ICdfZXZ0JyxcbiAgICBEUkFHID0ge1xuICAgICAgICBTVEFSVDogWyd0b3VjaHN0YXJ0JywgJ21vdXNlZG93biddLFxuICAgICAgICBFTkQ6IHtcbiAgICAgICAgICAgIG1vdXNlZG93bjogJ21vdXNldXAnLFxuICAgICAgICAgICAgdG91Y2hzdGFydDogJ3RvdWNoZW5kJyxcbiAgICAgICAgICAgIHBvaW50ZXJkb3duOiAndG91Y2hlbmQnLFxuICAgICAgICAgICAgTVNQb2ludGVyRG93bjogJ3RvdWNoZW5kJ1xuICAgICAgICB9LFxuICAgICAgICBNT1ZFOiB7XG4gICAgICAgICAgICBtb3VzZWRvd246ICdtb3VzZW1vdmUnLFxuICAgICAgICAgICAgdG91Y2hzdGFydDogJ3RvdWNobW92ZScsXG4gICAgICAgICAgICBwb2ludGVyZG93bjogJ3RvdWNobW92ZScsXG4gICAgICAgICAgICBNU1BvaW50ZXJEb3duOiAndG91Y2htb3ZlJ1xuICAgICAgICB9XG4gICAgfTtcblxudmFyIGRvbWV2ZW50ID0ge1xuICAgIC8qKlxuICAgICAqIEJpbmQgZG9tIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnQgdG8gYmluZCBldmVudHMuXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfG9iamVjdCl9IHR5cGVzIFNwYWNlIHNwbGl0dGVkIGV2ZW50cyBuYW1lcyBvciBldmVudE5hbWU6aGFuZGxlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHsqfSBmbiBoYW5kbGVyIGZ1bmN0aW9uIG9yIGNvbnRleHQgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNvbnRleHQgb2JqZWN0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKi9cbiAgICBvbjogZnVuY3Rpb24ob2JqLCB0eXBlcywgZm4sIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcodHlwZXMpKSB7XG4gICAgICAgICAgICB1dGlsLmZvckVhY2godHlwZXMuc3BsaXQoJyAnKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgIGRvbWV2ZW50Ll9vbihvYmosIHR5cGUsIGZuLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKHR5cGVzLCBmdW5jdGlvbihoYW5kbGVyLCB0eXBlKSB7XG4gICAgICAgICAgICBkb21ldmVudC5fb24ob2JqLCB0eXBlLCBoYW5kbGVyLCBmbik7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBET00gZXZlbnQgYmluZGluZy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnQgdG8gYmluZCBldmVudHMuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIG5hbWUgb2YgZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7Kn0gZm4gaGFuZGxlciBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNvbnRleHQgb2JqZWN0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9vbjogZnVuY3Rpb24ob2JqLCB0eXBlLCBmbiwgY29udGV4dCkge1xuICAgICAgICB2YXIgaWQsXG4gICAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgICAgb3JpZ2luSGFuZGxlcjtcblxuICAgICAgICBpZCA9IHR5cGUgKyB1dGlsLnN0YW1wKGZuKSArIChjb250ZXh0ID8gJ18nICsgdXRpbC5zdGFtcChjb250ZXh0KSA6ICcnKTtcblxuICAgICAgICBpZiAob2JqW2V2ZW50S2V5XSAmJiBvYmpbZXZlbnRLZXldW2lkXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGZuLmNhbGwoY29udGV4dCB8fCBvYmosIGUgfHwgd2luZG93LmV2ZW50KTtcbiAgICAgICAgfTtcblxuICAgICAgICBvcmlnaW5IYW5kbGVyID0gaGFuZGxlcjtcblxuICAgICAgICBpZiAoJ2FkZEV2ZW50TGlzdGVuZXInIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb3VzZWVudGVyJyB8fCB0eXBlID09PSAnbW91c2VsZWF2ZScpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZG9tZXZlbnQuX2NoZWNrTW91c2Uob2JqLCBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbkhhbmRsZXIoZSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcigodHlwZSA9PT0gJ21vdXNlZW50ZXInKSA/XG4gICAgICAgICAgICAgICAgICAgICdtb3VzZW92ZXInIDogJ21vdXNlb3V0JywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ21vdXNld2hlZWwnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2F0dGFjaEV2ZW50JyBpbiBvYmopIHtcbiAgICAgICAgICAgIG9iai5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBvYmpbZXZlbnRLZXldID0gb2JqW2V2ZW50S2V5XSB8fCB7fTtcbiAgICAgICAgb2JqW2V2ZW50S2V5XVtpZF0gPSBoYW5kbGVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmJpbmQgRE9NIEV2ZW50IGhhbmRsZXIuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50IHRvIHVuYmluZC5cbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KX0gdHlwZXMgU3BhY2Ugc3BsaXR0ZWQgZXZlbnRzIG5hbWVzIG9yIGV2ZW50TmFtZTpoYW5kbGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0geyp9IGZuIGhhbmRsZXIgZnVuY3Rpb24gb3IgY29udGV4dCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICogQHBhcmFtIHsqfSBbY29udGV4dF0gY29udGV4dCBvYmplY3QgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqL1xuICAgIG9mZjogZnVuY3Rpb24ob2JqLCB0eXBlcywgZm4sIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcodHlwZXMpKSB7XG4gICAgICAgICAgICB1dGlsLmZvckVhY2godHlwZXMuc3BsaXQoJyAnKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAgICAgICAgIGRvbWV2ZW50Ll9vZmYob2JqLCB0eXBlLCBmbiwgY29udGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyh0eXBlcywgZnVuY3Rpb24oaGFuZGxlciwgdHlwZSkge1xuICAgICAgICAgICAgZG9tZXZlbnQuX29mZihvYmosIHR5cGUsIGhhbmRsZXIsIGZuKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVuYmluZCBET00gZXZlbnQgaGFuZGxlci5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnQgdG8gdW5iaW5kLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFRoZSBuYW1lIG9mIGV2ZW50IHRvIHVuYmluZC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IGZuIEV2ZW50IGhhbmRsZXIgdGhhdCBzdXBwbGllZCB3aGVuIGJpbmRpbmcuXG4gICAgICogQHBhcmFtIHsqfSBjb250ZXh0IGNvbnRleHQgb2JqZWN0IHRoYXQgc3VwcGxpZWQgd2hlbiBiaW5kaW5nLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29mZjogZnVuY3Rpb24ob2JqLCB0eXBlLCBmbiwgY29udGV4dCkge1xuICAgICAgICB2YXIgaWQgPSB0eXBlICsgdXRpbC5zdGFtcChmbikgKyAoY29udGV4dCA/ICdfJyArIHV0aWwuc3RhbXAoY29udGV4dCkgOiAnJyksXG4gICAgICAgICAgICBoYW5kbGVyID0gb2JqW2V2ZW50S2V5XSAmJiBvYmpbZXZlbnRLZXldW2lkXTtcblxuICAgICAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgncmVtb3ZlRXZlbnRMaXN0ZW5lcicgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ21vdXNlZW50ZXInIHx8IHR5cGUgPT09ICdtb3VzZWxlYXZlJykge1xuICAgICAgICAgICAgICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKCh0eXBlID09PSAnbW91c2VlbnRlcicpID9cbiAgICAgICAgICAgICAgICAgICAgJ21vdXNlb3ZlcicgOiAnbW91c2VvdXQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbW91c2V3aGVlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iai5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnZGV0YWNoRXZlbnQnIGluIG9iaikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmouZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge30gICAgLy9lc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgb2JqW2V2ZW50S2V5XVtpZF07XG5cbiAgICAgICAgaWYgKHV0aWwua2V5cyhvYmpbZXZlbnRLZXldKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRocm93IGV4Y2VwdGlvbiB3aGVuIGRlbGV0aW5nIGhvc3Qgb2JqZWN0J3MgcHJvcGVydHkgaW4gYmVsb3cgSUU4XG4gICAgICAgIGlmICh1dGlsLmJyb3dzZXIubXNpZSAmJiB1dGlsLmJyb3dzZXIudmVyc2lvbiA8IDkpIHtcbiAgICAgICAgICAgIG9ialtldmVudEtleV0gPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG9ialtldmVudEtleV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEJpbmQgRE9NIGV2ZW50LiB0aGlzIGV2ZW50IHdpbGwgdW5iaW5kIGFmdGVyIGludm9rZXMuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gb2JqIEhUTUxFbGVtZW50IHRvIGJpbmQgZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSB0eXBlcyBTcGFjZSBzcGxpdHRlZCBldmVudHMgbmFtZXMgb3IgZXZlbnROYW1lOmhhbmRsZXIgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Kn0gZm4gaGFuZGxlciBmdW5jdGlvbiBvciBjb250ZXh0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjb250ZXh0IG9iamVjdCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICovXG4gICAgb25jZTogZnVuY3Rpb24ob2JqLCB0eXBlcywgZm4sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIGlmICh1dGlsLmlzT2JqZWN0KHR5cGVzKSkge1xuICAgICAgICAgICAgdXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyh0eXBlcywgZnVuY3Rpb24oaGFuZGxlciwgdHlwZSkge1xuICAgICAgICAgICAgICAgIGRvbWV2ZW50Lm9uY2Uob2JqLCB0eXBlLCBoYW5kbGVyLCBmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG9uY2VIYW5kbGVyKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkoY29udGV4dCB8fCBvYmosIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGF0Ll9vZmYob2JqLCB0eXBlcywgb25jZUhhbmRsZXIsIGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9tZXZlbnQub24ob2JqLCB0eXBlcywgb25jZUhhbmRsZXIsIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYW5jZWwgZXZlbnQgYnViYmxpbmcuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBFdmVudCBvYmplY3QuXG4gICAgICovXG4gICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGUuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYW5jZWwgYnJvd3NlciBkZWZhdWx0IGFjdGlvbnMuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBFdmVudCBvYmplY3QuXG4gICAgICovXG4gICAgcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTeW50YXRpYyBzdWdhciBvZiBzdG9wUHJvcGFnYXRpb24gYW5kIHByZXZlbnREZWZhdWx0XG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBFdmVudCBvYmplY3QuXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oZSkge1xuICAgICAgICBkb21ldmVudC5wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgZG9tZXZlbnQuc3RvcFByb3BhZ2F0aW9uKGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIHNjcm9sbCBldmVudHMuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgSFRNTCBlbGVtZW50IHRvIHByZXZlbnQgc2Nyb2xsLlxuICAgICAqL1xuICAgIGRpc2FibGVTY3JvbGxQcm9wYWdhdGlvbjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgZG9tZXZlbnQub24oZWwsICdtb3VzZXdoZWVsIE1vek1vdXNlUGl4ZWxTY3JvbGwnLCBkb21ldmVudC5zdG9wUHJvcGFnYXRpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGFsbCBldmVudHMgcmVsYXRlZCB3aXRoIGNsaWNrLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIEhUTUwgZWxlbWVudCB0byBwcmV2ZW50IGFsbCBldmVudCByZWxhdGVkIHdpdGggY2xpY2suXG4gICAgICovXG4gICAgZGlzYWJsZUNsaWNrUHJvcGFnYXRpb246IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGRvbWV2ZW50Lm9uKGVsLCBEUkFHLlNUQVJULmpvaW4oJyAnKSArICcgY2xpY2sgZGJsY2xpY2snLCBkb21ldmVudC5zdG9wUHJvcGFnYXRpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW91c2UgcG9zaXRpb24gZnJvbSBtb3VzZSBldmVudC5cbiAgICAgKlxuICAgICAqIElmIHN1cHBsaWVkIHJlbGF0dmVFbGVtZW50IHBhcmFtZXRlciB0aGVuIHJldHVybiByZWxhdGl2ZSBwb3NpdGlvbiBiYXNlZCBvbiBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IG1vdXNlRXZlbnQgTW91c2UgZXZlbnQgb2JqZWN0XG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcmVsYXRpdmVFbGVtZW50IEhUTUwgZWxlbWVudCB0aGF0IGNhbGN1bGF0ZSByZWxhdGl2ZSBwb3NpdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IG1vdXNlIHBvc2l0aW9uLlxuICAgICAqL1xuICAgIGdldE1vdXNlUG9zaXRpb246IGZ1bmN0aW9uKG1vdXNlRXZlbnQsIHJlbGF0aXZlRWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdDtcblxuICAgICAgICBpZiAoIXJlbGF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIFttb3VzZUV2ZW50LmNsaWVudFgsIG1vdXNlRXZlbnQuY2xpZW50WV07XG4gICAgICAgIH1cblxuICAgICAgICByZWN0ID0gcmVsYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtb3VzZUV2ZW50LmNsaWVudFggLSByZWN0LmxlZnQgLSByZWxhdGl2ZUVsZW1lbnQuY2xpZW50TGVmdCxcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuY2xpZW50WSAtIHJlY3QudG9wIC0gcmVsYXRpdmVFbGVtZW50LmNsaWVudFRvcFxuICAgICAgICBdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBOb3JtYWxpemUgbW91c2Ugd2hlZWwgZXZlbnQgdGhhdCBkaWZmZXJlbnQgZWFjaCBicm93c2Vycy5cbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGUgTW91c2Ugd2hlZWwgZXZlbnQuXG4gICAgICogQHJldHVybnMge051bWJlcn0gZGVsdGFcbiAgICAgKi9cbiAgICBnZXRXaGVlbERlbHRhOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBkZWx0YSA9IDA7XG5cbiAgICAgICAgaWYgKGUud2hlZWxEZWx0YSkge1xuICAgICAgICAgICAgZGVsdGEgPSBlLndoZWVsRGVsdGEgLyAxMjA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS5kZXRhaWwpIHtcbiAgICAgICAgICAgIGRlbHRhID0gLWUuZGV0YWlsIC8gMztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWx0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcHJldmVudCBmaXJpbmcgbW91c2VsZWF2ZSBldmVudCB3aGVuIG1vdXNlIGVudGVyZWQgY2hpbGQgZWxlbWVudHMuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgSFRNTCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBlIE1vdXNlIGV2ZW50XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IGxlYXZlP1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrTW91c2U6IGZ1bmN0aW9uKGVsLCBlKSB7XG4gICAgICAgIHZhciByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0O1xuXG4gICAgICAgIGlmICghcmVsYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2hpbGUgKHJlbGF0ZWQgJiYgKHJlbGF0ZWQgIT09IGVsKSkge1xuICAgICAgICAgICAgICAgIHJlbGF0ZWQgPSByZWxhdGVkLnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChyZWxhdGVkICE9PSBlbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRyaWdnZXIgc3BlY2lmaWMgZXZlbnRzIHRvIGh0bWwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBFdmVudCB0eXBlIG5hbWVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50RGF0YV0gRXZlbnQgZGF0YVxuICAgICAqL1xuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKG9iaiwgdHlwZSwgZXZlbnREYXRhKSB7XG4gICAgICAgIHZhciByTW91c2VFdmVudCA9IC8obW91c2V8Y2xpY2spLztcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZXZlbnREYXRhKSAmJiByTW91c2VFdmVudC5leGVjKHR5cGUpKSB7XG4gICAgICAgICAgICBldmVudERhdGEgPSBkb21ldmVudC5tb3VzZUV2ZW50KHR5cGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9iai5kaXNwYXRjaEV2ZW50KSB7XG4gICAgICAgICAgICBvYmouZGlzcGF0Y2hFdmVudChldmVudERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKG9iai5maXJlRXZlbnQpIHtcbiAgICAgICAgICAgIG9iai5maXJlRXZlbnQoJ29uJyArIHR5cGUsIGV2ZW50RGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIHZpcnR1YWwgbW91c2UgZXZlbnQuXG4gICAgICpcbiAgICAgKiBUZXN0ZWQgYXRcbiAgICAgKlxuICAgICAqIC0gSUU3IH4gSUUxMVxuICAgICAqIC0gQ2hyb21lXG4gICAgICogLSBGaXJlZm94XG4gICAgICogLSBTYWZhcmlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBFdmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtldmVudE9ial0gRXZlbnQgZGF0YVxuICAgICAqIEByZXR1cm5zIHtNb3VzZUV2ZW50fSBWaXJ0dWFsIG1vdXNlIGV2ZW50LlxuICAgICAqL1xuICAgIG1vdXNlRXZlbnQ6IGZ1bmN0aW9uKHR5cGUsIGV2ZW50T2JqKSB7XG4gICAgICAgIHZhciBldnQsXG4gICAgICAgICAgICBlO1xuXG4gICAgICAgIGUgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgY2FuY2VsYWJsZTogKHR5cGUgIT09ICdtb3VzZW1vdmUnKSxcbiAgICAgICAgICAgIHZpZXc6IHdpbmRvdyxcbiAgICAgICAgICAgIHdoZWVsRGVsdGE6IDAsXG4gICAgICAgICAgICBkZXRhaWw6IDAsXG4gICAgICAgICAgICBzY3JlZW5YOiAwLFxuICAgICAgICAgICAgc2NyZWVuWTogMCxcbiAgICAgICAgICAgIGNsaWVudFg6IDAsXG4gICAgICAgICAgICBjbGllbnRZOiAwLFxuICAgICAgICAgICAgY3RybEtleTogZmFsc2UsXG4gICAgICAgICAgICBhbHRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgbWV0YUtleTogZmFsc2UsXG4gICAgICAgICAgICBidXR0b246IDAsXG4gICAgICAgICAgICByZWxhdGVkVGFyZ2V0OiB1bmRlZmluZWQgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfSwgZXZlbnRPYmopO1xuXG4gICAgICAgIC8vIHByZXZlbnQgdGhyb3cgZXJyb3Igd2hlbiBpbnNlcnRpbmcgd2hlZWxEZWx0YSBwcm9wZXJ0eSB0byBtb3VzZSBldmVudCBvbiBiZWxvdyBJRThcbiAgICAgICAgaWYgKGJyb3dzZXIubXNpZSAmJiBicm93c2VyLnZlcnNpb24gPCA5KSB7XG4gICAgICAgICAgICBkZWxldGUgZS53aGVlbERlbHRhO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFdmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ01vdXNlRXZlbnRzJyk7XG4gICAgICAgICAgICBldnQuaW5pdE1vdXNlRXZlbnQodHlwZSxcbiAgICAgICAgICAgICAgICBlLmJ1YmJsZXMsIGUuY2FuY2VsYWJsZSwgZS52aWV3LCBlLmRldGFpbCxcbiAgICAgICAgICAgICAgICBlLnNjcmVlblgsIGUuc2NyZWVuWSwgZS5jbGllbnRYLCBlLmNsaWVudFksXG4gICAgICAgICAgICAgICAgZS5jdHJsS2V5LCBlLmFsdEtleSwgZS5zaGlmdEtleSwgZS5tZXRhS2V5LFxuICAgICAgICAgICAgICAgIGUuYnV0dG9uLCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QpIHtcbiAgICAgICAgICAgIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50T2JqZWN0KCk7XG5cbiAgICAgICAgICAgIHV0aWwuZm9yRWFjaChlLCBmdW5jdGlvbih2YWx1ZSwgcHJvcE5hbWUpIHtcbiAgICAgICAgICAgICAgICBldnRbcHJvcE5hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIGV2dC5idXR0b24gPSB7MDogMSwgMTogNCwgMjogMn1bZXZ0LmJ1dHRvbl0gfHwgZXZ0LmJ1dHRvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXZ0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBOb3JtYWxpemUgbW91c2UgZXZlbnQncyBidXR0b24gYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIENhbiBkZXRlY3Qgd2hpY2ggYnV0dG9uIGlzIGNsaWNrZWQgYnkgdGhpcyBtZXRob2QuXG4gICAgICpcbiAgICAgKiBNZWFuaW5nIG9mIHJldHVybiBudW1iZXJzXG4gICAgICpcbiAgICAgKiAtIDA6IHByaW1hcnkgbW91c2UgYnV0dG9uXG4gICAgICogLSAxOiB3aGVlbCBidXR0b24gb3IgY2VudGVyIGJ1dHRvblxuICAgICAqIC0gMjogc2Vjb25kYXJ5IG1vdXNlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gbW91c2VFdmVudCAtIFRoZSBtb3VzZSBldmVudCBvYmplY3Qgd2FudCB0byBrbm93LlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IC0gVGhlIHZhbHVlIG9mIG1lYW5pbmcgd2hpY2ggYnV0dG9uIGlzIGNsaWNrZWQ/XG4gICAgICovXG4gICAgZ2V0TW91c2VCdXR0b246IGZ1bmN0aW9uKG1vdXNlRXZlbnQpIHtcbiAgICAgICAgdmFyIGJ1dHRvbixcbiAgICAgICAgICAgIHByaW1hcnkgPSAnMCwxLDMsNSw3JyxcbiAgICAgICAgICAgIHNlY29uZGFyeSA9ICcyLDYnLFxuICAgICAgICAgICAgd2hlZWwgPSAnNCc7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoJ01vdXNlRXZlbnRzJywgJzIuMCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gbW91c2VFdmVudC5idXR0b247XG4gICAgICAgIH1cblxuICAgICAgICBidXR0b24gPSBtb3VzZUV2ZW50LmJ1dHRvbiArICcnO1xuICAgICAgICBpZiAofnByaW1hcnkuaW5kZXhPZihidXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIGlmICh+c2Vjb25kYXJ5LmluZGV4T2YoYnV0dG9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH0gZWxzZSBpZiAofndoZWVsLmluZGV4T2YoYnV0dG9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbWV2ZW50O1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbGl0eSBtb2R1bGVzIGZvciBtYW5pcHVsYXRlIERPTSBlbGVtZW50cy5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkb21ldmVudCA9IHJlcXVpcmUoJy4vZG9tZXZlbnQnKTtcbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uJyk7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsLFxuICAgIHBvc0tleSA9ICdfcG9zJyxcbiAgICBkb211dGlsO1xuXG52YXIgQ1NTX0FVVE9fUkVHRVggPSAvXmF1dG8kfF4kfCUvO1xuXG5mdW5jdGlvbiB0cmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XG59XG5cbmRvbXV0aWwgPSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIERPTSBlbGVtZW50IGFuZCByZXR1cm4gaXQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRhZ05hbWUgVGFnIG5hbWUgdG8gYXBwZW5kLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtjb250YWluZXJdIEhUTUwgZWxlbWVudCB3aWxsIGJlIHBhcmVudCB0byBjcmVhdGVkIGVsZW1lbnQuXG4gICAgICogaWYgbm90IHN1cHBsaWVkLCB3aWxsIHVzZSAqKmRvY3VtZW50LmJvZHkqKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbY2xhc3NOYW1lXSBEZXNpZ24gY2xhc3MgbmFtZXMgdG8gYXBwbGluZyBjcmVhdGVkIGVsZW1lbnQuXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSBIVE1MIGVsZW1lbnQgY3JlYXRlZC5cbiAgICAgKi9cbiAgICBhcHBlbmRIVE1MRWxlbWVudDogZnVuY3Rpb24odGFnTmFtZSwgY29udGFpbmVyLCBjbGFzc05hbWUpIHtcbiAgICAgICAgdmFyIGVsO1xuXG4gICAgICAgIGNsYXNzTmFtZSA9IGNsYXNzTmFtZSB8fCAnJztcblxuICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcblxuICAgICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBlbGVtZW50IGZyb20gcGFyZW50IG5vZGUuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBlbGVtZW50IHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbCAmJiBlbC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZWxlbWVudCBieSBpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBlbGVtZW50IGlkIGF0dHJpYnV0ZVxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgc3VwcGxpZWQgZWxlbWVudCBpcyBtYXRjaGVkIHNlbGVjdG9yLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZWxlbWVudCB0byBjaGVja1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIHNlbGVjdG9yIHN0cmluZyB0byBjaGVja1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IG1hdGNoP1xuICAgICAqL1xuICAgIF9tYXRjaGVyOiBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIGNzc0NsYXNzU2VsZWN0b3IgPSAvXlxcLi8sXG4gICAgICAgICAgICBpZFNlbGVjdG9yID0gL14jLztcblxuICAgICAgICBpZiAoY3NzQ2xhc3NTZWxlY3Rvci50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbXV0aWwuaGFzQ2xhc3MoZWwsIHNlbGVjdG9yLnJlcGxhY2UoJy4nLCAnJykpO1xuICAgICAgICB9IGVsc2UgaWYgKGlkU2VsZWN0b3IudGVzdChzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5pZCA9PT0gc2VsZWN0b3IucmVwbGFjZSgnIycsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBzZWxlY3Rvci50b0xvd2VyQ2FzZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIERPTSBlbGVtZW50IGJ5IHNwZWNpZmljIHNlbGVjdG9ycy5cbiAgICAgKiBiZWxvdyB0aHJlZSBzZWxlY3RvciBvbmx5IHN1cHBvcnRlZC5cbiAgICAgKlxuICAgICAqIDEuIGNzcyBzZWxlY3RvclxuICAgICAqIDIuIGlkIHNlbGVjdG9yXG4gICAgICogMy4gbm9kZU5hbWUgc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2VsZWN0b3Igc2VsZWN0b3JcbiAgICAgKiBAcGFyYW0geyhIVE1MRWxlbWVudHxzdHJpbmcpfSBbcm9vdF0gWW91IGNhbiBhc3NpZ24gcm9vdCBlbGVtZW50IHRvIGZpbmQuIGlmIG5vdCBzdXBwbGllZCwgZG9jdW1lbnQuYm9keSB3aWxsIHVzZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW58ZnVuY3Rpb259IFttdWx0aXBsZT1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIHJldHVybiBhbGwgZWxlbWVudHMgdGhhdCBtZWV0IGNvbmRpdGlvbiwgaWYgc2V0IGZ1bmN0aW9uIHRoZW4gdXNlIGl0IGZpbHRlciBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEhUTUwgZWxlbWVudCBmaW5kZWQuXG4gICAgICovXG4gICAgZmluZDogZnVuY3Rpb24oc2VsZWN0b3IsIHJvb3QsIG11bHRpcGxlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICAgIGZvdW5kID0gZmFsc2UsXG4gICAgICAgICAgICBpc0ZpcnN0ID0gdXRpbC5pc1VuZGVmaW5lZChtdWx0aXBsZSkgfHwgbXVsdGlwbGUgPT09IGZhbHNlLFxuICAgICAgICAgICAgaXNGaWx0ZXIgPSB1dGlsLmlzRnVuY3Rpb24obXVsdGlwbGUpO1xuXG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKHJvb3QpKSB7XG4gICAgICAgICAgICByb290ID0gZG9tdXRpbC5nZXQocm9vdCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJvb3QgPSByb290IHx8IHdpbmRvdy5kb2N1bWVudC5ib2R5O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2UoZWwsIHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGROb2RlcyA9IGVsLmNoaWxkTm9kZXMsXG4gICAgICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICAgICAgbGVuID0gY2hpbGROb2Rlcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgY3Vyc29yO1xuXG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29yID0gY2hpbGROb2Rlc1tpXTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJzb3Iubm9kZU5hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGRvbXV0aWwuX21hdGNoZXIoY3Vyc29yLCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChpc0ZpbHRlciAmJiBtdWx0aXBsZShjdXJzb3IpKSB8fCAhaXNGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnNvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnNvci5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjdXJzZShjdXJzb3IsIHNlbGVjdG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJlY3Vyc2Uocm9vdCwgc2VsZWN0b3IpO1xuXG4gICAgICAgIHJldHVybiBpc0ZpcnN0ID8gKHJlc3VsdFswXSB8fCBudWxsKSA6IHJlc3VsdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmluZCBwYXJlbnQgZWxlbWVudCByZWN1cnNpdmVseS5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIGJhc2UgZWxlbWVudCB0byBzdGFydCBmaW5kLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciAtIHNlbGVjdG9yIHN0cmluZyBmb3IgZmluZFxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gLSBlbGVtZW50IGZpbmRlZCBvciB1bmRlZmluZWQuXG4gICAgICovXG4gICAgY2xvc2VzdDogZnVuY3Rpb24oZWwsIHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuXG4gICAgICAgIGlmIChkb211dGlsLl9tYXRjaGVyKGVsLCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgcGFyZW50ICE9PSB3aW5kb3cuZG9jdW1lbnQuYm9keSkge1xuICAgICAgICAgICAgaWYgKGRvbXV0aWwuX21hdGNoZXIocGFyZW50LCBzZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGV4dHMgaW5zaWRlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IHRleHQgaW5zaWRlIG5vZGVcbiAgICAgKi9cbiAgICB0ZXh0OiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgcmV0ID0gJycsXG4gICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgIG5vZGVUeXBlID0gZWwubm9kZVR5cGU7XG5cbiAgICAgICAgaWYgKG5vZGVUeXBlKSB7XG4gICAgICAgICAgICBpZiAobm9kZVR5cGUgPT09IDEgfHwgbm9kZVR5cGUgPT09IDkgfHwgbm9kZVR5cGUgPT09IDExKSB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZXMgdGhhdCBhdmFpbGFibGUgY29udGFpbiBvdGhlciBub2Rlc1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZWwudGV4dENvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGVsID0gZWwuZmlyc3RDaGlsZDsgZWw7IGVsID0gZWwubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ICs9IGRvbXV0aWwudGV4dChlbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlVHlwZSA9PT0gMyB8fCBub2RlVHlwZSA9PT0gNCkge1xuICAgICAgICAgICAgICAgIC8vIFRFWFQsIENEQVRBIFNFQ1RJT05cbiAgICAgICAgICAgICAgICByZXR1cm4gZWwubm9kZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICg7IGVsW2ldOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICByZXQgKz0gZG9tdXRpbC50ZXh0KGVsW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGF0YSBhdHRyaWJ1dGUgdG8gdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIGVsZW1lbnQgdG8gc2V0IGRhdGEgYXR0cmlidXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIGtleVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gZGF0YSAtIGRhdGEgdmFsdWVcbiAgICAgKi9cbiAgICBzZXREYXRhOiBmdW5jdGlvbihlbCwga2V5LCBkYXRhKSB7XG4gICAgICAgIGlmICgnZGF0YXNldCcgaW4gZWwpIHtcbiAgICAgICAgICAgIGVsLmRhdGFzZXRba2V5XSA9IGRhdGE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtJyArIGtleSwgZGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkYXRhIHZhbHVlIGZyb20gZGF0YS1hdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIGtleVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IHZhbHVlXG4gICAgICovXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgICBpZiAoJ2RhdGFzZXQnIGluIGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwuZGF0YXNldFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgZWxlbWVudCBoYXMgc3BlY2lmaWMgZGVzaWduIGNsYXNzIG5hbWUuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBjc3MgY2xhc3NcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgd2hlbiBlbGVtZW50IGhhcyB0aGF0IGNzcyBjbGFzcyBuYW1lXG4gICAgICovXG4gICAgaGFzQ2xhc3M6IGZ1bmN0aW9uKGVsLCBuYW1lKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWU7XG5cbiAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGVsLmNsYXNzTGlzdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGFzc05hbWUgPSBkb211dGlsLmdldENsYXNzKGVsKTtcblxuICAgICAgICByZXR1cm4gY2xhc3NOYW1lLmxlbmd0aCA+IDAgJiYgbmV3IFJlZ0V4cCgnKF58XFxcXHMpJyArIG5hbWUgKyAnKFxcXFxzfCQpJykudGVzdChjbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGQgZGVzaWduIGNsYXNzIHRvIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGNzcyBjbGFzcyBuYW1lXG4gICAgICovXG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBuYW1lKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWU7XG5cbiAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGVsLmNsYXNzTGlzdCkpIHtcbiAgICAgICAgICAgIHV0aWwuZm9yRWFjaEFycmF5KG5hbWUuc3BsaXQoJyAnKSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCFkb211dGlsLmhhc0NsYXNzKGVsLCBuYW1lKSkge1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gZG9tdXRpbC5nZXRDbGFzcyhlbCk7XG4gICAgICAgICAgICBkb211dGlsLnNldENsYXNzKGVsLCAoY2xhc3NOYW1lID8gY2xhc3NOYW1lICsgJyAnIDogJycpICsgbmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBPdmVyd3JpdGUgZGVzaWduIGNsYXNzIHRvIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGNzcyBjbGFzcyBuYW1lXG4gICAgICovXG4gICAgc2V0Q2xhc3M6IGZ1bmN0aW9uKGVsLCBuYW1lKSB7XG4gICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGVsLmNsYXNzTmFtZS5iYXNlVmFsKSkge1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lID0gbmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZS5iYXNlVmFsID0gbmFtZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFbGVtZW507JeQIGNzc0NsYXNz7IaN7ISx7J2EIOygnOqxsO2VmOuKlCDrqZTshJzrk5xcbiAgICAgKiBSZW1vdmUgc3BlY2lmaWMgZGVzaWduIGNsYXNzIGZyb20gSFRNTCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgY2xhc3MgbmFtZSB0byByZW1vdmVcbiAgICAgKi9cbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICAgICAgdmFyIHJlbW92ZWQgPSAnJztcblxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQoZWwuY2xhc3NMaXN0KSkge1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlbW92ZWQgPSAoJyAnICsgZG9tdXRpbC5nZXRDbGFzcyhlbCkgKyAnICcpLnJlcGxhY2UoJyAnICsgbmFtZSArICcgJywgJyAnKTtcbiAgICAgICAgICAgIGRvbXV0aWwuc2V0Q2xhc3MoZWwsIHRyaW0ocmVtb3ZlZCkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBIVE1MIGVsZW1lbnQncyBkZXNpZ24gY2xhc3Nlcy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGVsZW1lbnQgY3NzIGNsYXNzIG5hbWVcbiAgICAgKi9cbiAgICBnZXRDbGFzczogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKCFlbCB8fCAhZWwuY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXRpbC5pc1VuZGVmaW5lZChlbC5jbGFzc05hbWUuYmFzZVZhbCkgPyBlbC5jbGFzc05hbWUgOiBlbC5jbGFzc05hbWUuYmFzZVZhbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHNwZWNpZmljIENTUyBzdHlsZSB2YWx1ZSBmcm9tIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHlsZSBjc3MgYXR0cmlidXRlIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7KHN0cmluZ3xudWxsKX0gY3NzIHN0eWxlIHZhbHVlXG4gICAgICovXG4gICAgZ2V0U3R5bGU6IGZ1bmN0aW9uKGVsLCBzdHlsZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBlbC5zdHlsZVtzdHlsZV0gfHwgKGVsLmN1cnJlbnRTdHlsZSAmJiBlbC5jdXJyZW50U3R5bGVbc3R5bGVdKSxcbiAgICAgICAgICAgIGNzcztcblxuICAgICAgICBpZiAoKCF2YWx1ZSB8fCB2YWx1ZSA9PT0gJ2F1dG8nKSAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldykge1xuICAgICAgICAgICAgY3NzID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbCwgbnVsbCk7XG4gICAgICAgICAgICB2YWx1ZSA9IGNzcyA/IGNzc1tzdHlsZV0gOiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSAnYXV0bycgPyBudWxsIDogdmFsdWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGdldCBlbGVtZW50J3MgY29tcHV0ZWQgc3R5bGUgdmFsdWVzLlxuICAgICAqXG4gICAgICogaW4gbG93ZXIgSUU4LiB1c2UgcG9seWZpbGwgZnVuY3Rpb24gdGhhdCByZXR1cm4gb2JqZWN0LiBpdCBoYXMgb25seSBvbmUgZnVuY3Rpb24gJ2dldFByb3BlcnR5VmFsdWUnXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBlbGVtZW50IHdhbnQgdG8gZ2V0IHN0eWxlLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHZpcnR1YWwgQ1NTU3R5bGVEZWNsYXJhdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgZ2V0Q29tcHV0ZWRTdHlsZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRWaWV3ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG5cbiAgICAgICAgaWYgKCFkZWZhdWx0VmlldyB8fCAhZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZSA9IC8oXFwtKFthLXpdKXsxfSkvZztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09ICdmbG9hdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSAnc3R5bGVGbG9hdCc7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocmUudGVzdChwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcCA9IHByb3AucmVwbGFjZShyZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA6IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBvc2l0aW9uIENTUyBzdHlsZS5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeD0wXSBsZWZ0IHBpeGVsIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeT0wXSB0b3AgcGl4ZWwgdmFsdWUuXG4gICAgICovXG4gICAgc2V0UG9zaXRpb246IGZ1bmN0aW9uKGVsLCB4LCB5KSB7XG4gICAgICAgIHggPSB1dGlsLmlzVW5kZWZpbmVkKHgpID8gMCA6IHg7XG4gICAgICAgIHkgPSB1dGlsLmlzVW5kZWZpbmVkKHkpID8gMCA6IHk7XG5cbiAgICAgICAgZWxbcG9zS2V5XSA9IFt4LCB5XTtcblxuICAgICAgICBlbC5zdHlsZS5sZWZ0ID0geCArICdweCc7XG4gICAgICAgIGVsLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcG9zaXRpb24gZnJvbSBIVE1MIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjbGVhcj1mYWxzZV0gY2xlYXIgY2FjaGUgYmVmb3JlIGNhbGN1bGF0aW5nIHBvc2l0aW9uLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gcG9pbnRcbiAgICAgKi9cbiAgICBnZXRQb3NpdGlvbjogZnVuY3Rpb24oZWwsIGNsZWFyKSB7XG4gICAgICAgIHZhciBsZWZ0LFxuICAgICAgICAgICAgdG9wLFxuICAgICAgICAgICAgYm91bmQ7XG5cbiAgICAgICAgaWYgKGNsZWFyKSB7XG4gICAgICAgICAgICBlbFtwb3NLZXldID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbFtwb3NLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxbcG9zS2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlZnQgPSAwO1xuICAgICAgICB0b3AgPSAwO1xuXG4gICAgICAgIGlmICgoQ1NTX0FVVE9fUkVHRVgudGVzdChlbC5zdHlsZS5sZWZ0KSB8fCBDU1NfQVVUT19SRUdFWC50ZXN0KGVsLnN0eWxlLnRvcCkpICYmXG4gICAgICAgICAgICAnZ2V0Qm91bmRpbmdDbGllbnRSZWN0JyBpbiBlbCkge1xuICAgICAgICAgICAgLy8g7JeY66as66i87Yq47J2YIGxlZnTrmJDripQgdG9w7J20ICdhdXRvJ+ydvCDrlYwg7IiY64uoXG4gICAgICAgICAgICBib3VuZCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICBsZWZ0ID0gYm91bmQubGVmdDtcbiAgICAgICAgICAgIHRvcCA9IGJvdW5kLnRvcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxlZnQgPSBwYXJzZUZsb2F0KGVsLnN0eWxlLmxlZnQgfHwgMCk7XG4gICAgICAgICAgICB0b3AgPSBwYXJzZUZsb2F0KGVsLnN0eWxlLnRvcCB8fCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbbGVmdCwgdG9wXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGVsZW1lbnQncyBzaXplXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJbXX0gd2lkdGgsIGhlaWdodFxuICAgICAqL1xuICAgIGdldFNpemU6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciBib3VuZCxcbiAgICAgICAgICAgIHdpZHRoID0gZG9tdXRpbC5nZXRTdHlsZShlbCwgJ3dpZHRoJyksXG4gICAgICAgICAgICBoZWlnaHQgPSBkb211dGlsLmdldFN0eWxlKGVsLCAnaGVpZ2h0Jyk7XG5cbiAgICAgICAgaWYgKChDU1NfQVVUT19SRUdFWC50ZXN0KHdpZHRoKSB8fCBDU1NfQVVUT19SRUdFWC50ZXN0KGhlaWdodCkpICYmXG4gICAgICAgICAgICAnZ2V0Qm91bmRpbmdDbGllbnRSZWN0JyBpbiBlbCkge1xuICAgICAgICAgICAgYm91bmQgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHdpZHRoID0gYm91bmQud2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSBib3VuZC5oZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IHBhcnNlRmxvYXQod2lkdGggfHwgMCk7XG4gICAgICAgICAgICBoZWlnaHQgPSBwYXJzZUZsb2F0KGhlaWdodCB8fCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbd2lkdGgsIGhlaWdodF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHNwZWNpZmljIENTUyBzdHlsZSBpcyBhdmFpbGFibGUuXG4gICAgICogQHBhcmFtIHthcnJheX0gcHJvcHMgcHJvcGVydHkgbmFtZSB0byB0ZXN0aW5nXG4gICAgICogQHJldHVybiB7KHN0cmluZ3xib29sZWFuKX0gcmV0dXJuIHRydWUgd2hlbiBwcm9wZXJ0eSBpcyBhdmFpbGFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBwcm9wcyA9IFsndHJhbnNmb3JtJywgJy13ZWJraXQtdHJhbnNmb3JtJ107XG4gICAgICogZG9tdXRpbC50ZXN0UHJvcChwcm9wcyk7ICAgIC8vICd0cmFuc2Zvcm0nXG4gICAgICovXG4gICAgdGVzdFByb3A6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tpXSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBmb3JtIGRhdGFcbiAgICAgKiBAcGFyYW0ge0hUTUxGb3JtRWxlbWVudH0gZm9ybUVsZW1lbnQgLSBmb3JtIGVsZW1lbnQgdG8gZXh0cmFjdCBkYXRhXG4gICAgICogQHJldHVybnMge29iamVjdH0gZm9ybSBkYXRhXG4gICAgICovXG4gICAgZ2V0Rm9ybURhdGE6IGZ1bmN0aW9uKGZvcm1FbGVtZW50KSB7XG4gICAgICAgIHZhciBncm91cGVkQnlOYW1lID0gbmV3IENvbGxlY3Rpb24oZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmxlbmd0aDsgfSksXG4gICAgICAgICAgICBub0Rpc2FibGVkRmlsdGVyID0gZnVuY3Rpb24oZWwpIHsgcmV0dXJuICFlbC5kaXNhYmxlZDsgfSxcbiAgICAgICAgICAgIG91dHB1dCA9IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIGdyb3VwZWRCeU5hbWUuYWRkLmFwcGx5KFxuICAgICAgICAgICAgZ3JvdXBlZEJ5TmFtZSwgXG4gICAgICAgICAgICBkb211dGlsLmZpbmQoJ2lucHV0JywgZm9ybUVsZW1lbnQsIG5vRGlzYWJsZWRGaWx0ZXIpXG4gICAgICAgICAgICAgICAgLmNvbmNhdChkb211dGlsLmZpbmQoJ3NlbGVjdCcsIGZvcm1FbGVtZW50LCBub0Rpc2FibGVkRmlsdGVyKSlcbiAgICAgICAgICAgICAgICAuY29uY2F0KGRvbXV0aWwuZmluZCgndGV4dGFyZWEnLCBmb3JtRWxlbWVudCwgbm9EaXNhYmxlZEZpbHRlcikpXG4gICAgICAgICk7XG5cbiAgICAgICAgZ3JvdXBlZEJ5TmFtZSA9IGdyb3VwZWRCeU5hbWUuZ3JvdXBCeShmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVsICYmIGVsLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8ICdfb3RoZXInO1xuICAgICAgICB9KTtcblxuICAgICAgICB1dGlsLmZvckVhY2goZ3JvdXBlZEJ5TmFtZSwgZnVuY3Rpb24oZWxlbWVudHMsIG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnX290aGVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlTmFtZSA9IGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgIHR5cGUgPSBlbC50eXBlLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAncmFkaW8nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtlbGVtZW50cy5maW5kKGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbC5jaGVja2VkOyB9KS50b0FycmF5KCkucG9wKCldO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NoZWNrYm94Jykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50cy5maW5kKGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbC5jaGVja2VkOyB9KS50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlTmFtZSA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZmluZChmdW5jdGlvbihlbCkgeyByZXR1cm4gISFlbC5jaGlsZE5vZGVzLmxlbmd0aDsgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChkb211dGlsLmZpbmQoJ29wdGlvbicsIGVsLCBmdW5jdGlvbihvcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdC5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBlbGVtZW50cy5maW5kKGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbC52YWx1ZSAhPT0gJyc7IH0pLnRvQXJyYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1dGlsLm1hcChyZXN1bHQsIGZ1bmN0aW9uKGVsKSB7IHJldHVybiBlbC52YWx1ZTsgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFswXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBvdXRwdXRbbmFtZV0gPSByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9XG59O1xuXG4vKmVzbGludC1kaXNhYmxlKi9cbnZhciB1c2VyU2VsZWN0UHJvcGVydHkgPSBkb211dGlsLnRlc3RQcm9wKFtcbiAgICAndXNlclNlbGVjdCcsIFxuICAgICdXZWJraXRVc2VyU2VsZWN0JywgXG4gICAgJ09Vc2VyU2VsZWN0JywgXG4gICAgJ01velVzZXJTZWxlY3QnLCBcbiAgICAnbXNVc2VyU2VsZWN0J1xuXSk7XG52YXIgc3VwcG9ydFNlbGVjdFN0YXJ0ID0gJ29uc2VsZWN0c3RhcnQnIGluIGRvY3VtZW50O1xudmFyIHByZXZTZWxlY3RTdHlsZSA9ICcnO1xuLyplc2xpbnQtZW5hYmxlKi9cblxuLyoqXG4gKiBEaXNhYmxlIGJyb3dzZXIncyB0ZXh0IHNlbGVjdGlvbiBiZWhhdmlvcnMuXG4gKiBAbWV0aG9kXG4gKi9cbmRvbXV0aWwuZGlzYWJsZVRleHRTZWxlY3Rpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN1cHBvcnRTZWxlY3RTdGFydCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb21ldmVudC5vbih3aW5kb3csICdzZWxlY3RzdGFydCcsIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZTtcbiAgICAgICAgcHJldlNlbGVjdFN0eWxlID0gc3R5bGVbdXNlclNlbGVjdFByb3BlcnR5XTtcbiAgICAgICAgc3R5bGVbdXNlclNlbGVjdFByb3BlcnR5XSA9ICdub25lJztcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBFbmFibGUgYnJvd3NlcidzIHRleHQgc2VsZWN0aW9uIGJlaGF2aW9ycy5cbiAqIEBtZXRob2RcbiAqL1xuZG9tdXRpbC5lbmFibGVUZXh0U2VsZWN0aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdXBwb3J0U2VsZWN0U3RhcnQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZG9tZXZlbnQub2ZmKHdpbmRvdywgJ3NlbGVjdHN0YXJ0JywgZG9tZXZlbnQucHJldmVudERlZmF1bHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlW3VzZXJTZWxlY3RQcm9wZXJ0eV0gPSBwcmV2U2VsZWN0U3R5bGU7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogRGlzYWJsZSBicm93c2VyJ3MgaW1hZ2UgZHJhZyBiZWhhdmlvcnMuXG4gKi9cbmRvbXV0aWwuZGlzYWJsZUltYWdlRHJhZyA9IGZ1bmN0aW9uKCkge1xuICAgIGRvbWV2ZW50Lm9uKHdpbmRvdywgJ2RyYWdzdGFydCcsIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KTtcbn07XG5cbi8qKlxuICogRW5hYmxlIGJyb3dzZXIncyBpbWFnZSBkcmFnIGJlaGF2aW9ycy5cbiAqL1xuZG9tdXRpbC5lbmFibGVJbWFnZURyYWcgPSBmdW5jdGlvbigpIHtcbiAgICBkb21ldmVudC5vZmYod2luZG93LCAnZHJhZ3N0YXJ0JywgZG9tZXZlbnQucHJldmVudERlZmF1bHQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkb211dGlsO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgR2VuZXJhbCBkcmFnIGhhbmRsZXJcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGRvbXV0aWwgPSByZXF1aXJlKCcuL2RvbXV0aWwnKTtcbnZhciBkb21ldmVudCA9IHJlcXVpcmUoJy4vZG9tZXZlbnQnKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBDdXN0b21FdmVudHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgZHJhZyBoYW5kbGVyXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMuZGlzdGFuY2U9MTBdIC0gZGlzdGFuY2UgaW4gcGl4ZWxzIGFmdGVyIG1vdXNlIG11c3QgbW92ZSBiZWZvcmUgZHJhZ2dpbmcgc2hvdWxkIHN0YXJ0XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBjb250YWluZXIgZWxlbWVudCB0byBiaW5kIGRyYWcgZXZlbnRzXG4gKi9cbmZ1bmN0aW9uIERyYWcob3B0aW9ucywgY29udGFpbmVyKSB7XG4gICAgZG9tZXZlbnQub24oY29udGFpbmVyLCAnbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24sIHRoaXMpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gdXRpbC5leHRlbmQoe1xuICAgICAgICBkaXN0YW5jZTogMTBcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2lzTW92ZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGRyYWdnaW5nIGRpc3RhbmNlIGluIHBpeGVsIGJldHdlZW4gbW91c2Vkb3duIGFuZCBmaXJpbmcgZHJhZ1N0YXJ0IGV2ZW50c1xuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fZGlzdGFuY2UgPSAwO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5fZHJhZ1N0YXJ0RmlyZWQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fZHJhZ1N0YXJ0RXZlbnREYXRhID0gbnVsbDtcbn1cblxuLyoqXG4gKiBEZXN0cm95IG1ldGhvZC5cbiAqL1xuRHJhZy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIGRvbWV2ZW50Lm9mZih0aGlzLmNvbnRhaW5lciwgJ21vdXNlZG93bicsIHRoaXMuX29uTW91c2VEb3duLCB0aGlzKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMuY29udGFpbmVyID0gdGhpcy5faXNNb3ZlZCA9IHRoaXMuX2Rpc3RhbmNlID1cbiAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0RmlyZWQgPSB0aGlzLl9kcmFnU3RhcnRFdmVudERhdGEgPSBudWxsO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgZXZlbnRzIGZvciBtb3VzZSBkcmFnZ2luZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9CaW5kIC0gYmluZCBldmVudHMgcmVsYXRlZCB3aXRoIGRyYWdnaW5nIHdoZW4gc3VwcGxpZWQgXCJ0cnVlXCJcbiAqL1xuRHJhZy5wcm90b3R5cGUuX3RvZ2dsZURyYWdFdmVudCA9IGZ1bmN0aW9uKHRvQmluZCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgZG9tTWV0aG9kLFxuICAgICAgICBtZXRob2Q7XG5cbiAgICBpZiAodG9CaW5kKSB7XG4gICAgICAgIGRvbU1ldGhvZCA9ICdvbic7XG4gICAgICAgIG1ldGhvZCA9ICdkaXNhYmxlJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb21NZXRob2QgPSAnb2ZmJztcbiAgICAgICAgbWV0aG9kID0gJ2VuYWJsZSc7XG4gICAgfVxuXG4gICAgZG9tdXRpbFttZXRob2QgKyAnVGV4dFNlbGVjdGlvbiddKGNvbnRhaW5lcik7XG4gICAgZG9tdXRpbFttZXRob2QgKyAnSW1hZ2VEcmFnJ10oY29udGFpbmVyKTtcbiAgICBkb21ldmVudFtkb21NZXRob2RdKGdsb2JhbC5kb2N1bWVudCwge1xuICAgICAgICBtb3VzZW1vdmU6IHRoaXMuX29uTW91c2VNb3ZlLFxuICAgICAgICBtb3VzZXVwOiB0aGlzLl9vbk1vdXNlVXBcbiAgICB9LCB0aGlzKTtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gbW91c2VFdmVudCAtIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IG5vcm1hbGl6ZWQgbW91c2UgZXZlbnQgZGF0YS5cbiAqL1xuRHJhZy5wcm90b3R5cGUuX2dldEV2ZW50RGF0YSA9IGZ1bmN0aW9uKG1vdXNlRXZlbnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IG1vdXNlRXZlbnQudGFyZ2V0IHx8IG1vdXNlRXZlbnQuc3JjRWxlbWVudCxcbiAgICAgICAgb3JpZ2luRXZlbnQ6IG1vdXNlRXZlbnRcbiAgICB9O1xufTtcblxuLyoqXG4gKiBNb3VzZURvd24gRE9NIGV2ZW50IGhhbmRsZXIuXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IG1vdXNlRG93bkV2ZW50IE1vdXNlRG93biBldmVudCBvYmplY3QuXG4gKi9cbkRyYWcucHJvdG90eXBlLl9vbk1vdXNlRG93biA9IGZ1bmN0aW9uKG1vdXNlRG93bkV2ZW50KSB7XG4gICAgLy8gb25seSBwcmltYXJ5IGJ1dHRvbiBjYW4gc3RhcnQgZHJhZy5cbiAgICBpZiAoZG9tZXZlbnQuZ2V0TW91c2VCdXR0b24obW91c2VEb3duRXZlbnQpICE9PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9kaXN0YW5jZSA9IDA7XG4gICAgdGhpcy5fZHJhZ1N0YXJ0RmlyZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9kcmFnU3RhcnRFdmVudERhdGEgPSB0aGlzLl9nZXRFdmVudERhdGEobW91c2VEb3duRXZlbnQpO1xuXG4gICAgdGhpcy5fdG9nZ2xlRHJhZ0V2ZW50KHRydWUpO1xufTtcblxuLyoqXG4gKiBNb3VzZU1vdmUgRE9NIGV2ZW50IGhhbmRsZXIuXG4gKiBAZW1pdHMgRHJhZyNkcmFnXG4gKiBAZW1pdHMgRHJhZyNkcmFnU3RhcnRcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gbW91c2VNb3ZlRXZlbnQgTW91c2VNb3ZlIGV2ZW50IG9iamVjdC5cbiAqL1xuRHJhZy5wcm90b3R5cGUuX29uTW91c2VNb3ZlID0gZnVuY3Rpb24obW91c2VNb3ZlRXZlbnQpIHtcbiAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLm9wdGlvbnMuZGlzdGFuY2U7XG4gICAgLy8gcHJldmVudCBhdXRvbWF0aWMgc2Nyb2xsaW5nLlxuICAgIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KG1vdXNlTW92ZUV2ZW50KTtcblxuICAgIHRoaXMuX2lzTW92ZWQgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMuX2Rpc3RhbmNlIDwgZGlzdGFuY2UpIHtcbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgKz0gMTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fZHJhZ1N0YXJ0RmlyZWQpIHtcbiAgICAgICAgdGhpcy5fZHJhZ1N0YXJ0RmlyZWQgPSB0cnVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmFnIHN0YXJ0cyBldmVudHMuIGNhbmNlbGFibGUuXG4gICAgICAgICAqIEBldmVudCBEcmFnI2RyYWdTdGFydFxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXQgLSB0YXJnZXQgZWxlbWVudCBpbiB0aGlzIGV2ZW50LlxuICAgICAgICAgKiBAcHJvcGVydHkge01vdXNlRXZlbnR9IG9yaWdpbkV2ZW50IC0gb3JpZ2luYWwgbW91c2UgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKCF0aGlzLmludm9rZSgnZHJhZ1N0YXJ0JywgdGhpcy5fZHJhZ1N0YXJ0RXZlbnREYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5fdG9nZ2xlRHJhZ0V2ZW50KGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB3aGlsZSBkcmFnZ2luZy5cbiAgICAgKiBAZXZlbnQgRHJhZyNkcmFnXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXQgLSB0YXJnZXQgZWxlbWVudCBpbiB0aGlzIGV2ZW50LlxuICAgICAqIEBwcm9wZXJ0eSB7TW91c2VFdmVudH0gb3JpZ2luRXZlbnQgLSBvcmlnaW5hbCBtb3VzZSBldmVudCBvYmplY3QuXG4gICAgICovXG4gICAgdGhpcy5maXJlKCdkcmFnJywgdGhpcy5fZ2V0RXZlbnREYXRhKG1vdXNlTW92ZUV2ZW50KSk7XG59O1xuXG4vKipcbiAqIE1vdXNlVXAgRE9NIGV2ZW50IGhhbmRsZXIuXG4gKiBAcGFyYW0ge01vdXNlRXZlbnR9IG1vdXNlVXBFdmVudCBNb3VzZVVwIGV2ZW50IG9iamVjdC5cbiAqIEBlbWl0cyBEcmFnI2RyYWdFbmRcbiAqIEBlbWl0cyBEcmFnI2NsaWNrXG4gKi9cbkRyYWcucHJvdG90eXBlLl9vbk1vdXNlVXAgPSBmdW5jdGlvbihtb3VzZVVwRXZlbnQpIHtcbiAgICB0aGlzLl90b2dnbGVEcmFnRXZlbnQoZmFsc2UpO1xuXG4gICAgLy8gZW1pdCBcImNsaWNrXCIgZXZlbnQgd2hlbiBub3QgZW1pdHRlZCBkcmFnIGV2ZW50IGJldHdlZW4gbW91c2Vkb3duIGFuZCBtb3VzZXVwLlxuICAgIGlmICh0aGlzLl9pc01vdmVkKSB7XG4gICAgICAgIHRoaXMuX2lzTW92ZWQgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRHJhZyBlbmQgZXZlbnRzLlxuICAgICAgICAgKiBAZXZlbnQgRHJhZyNkcmFnRW5kXG4gICAgICAgICAqIEB0eXBlIHtNb3VzZUV2ZW50fVxuICAgICAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXQgLSB0YXJnZXQgZWxlbWVudCBpbiB0aGlzIGV2ZW50LlxuICAgICAgICAgKiBAcHJvcGVydHkge01vdXNlRXZlbnR9IG9yaWdpbkV2ZW50IC0gb3JpZ2luYWwgbW91c2UgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJlKCdkcmFnRW5kJywgdGhpcy5fZ2V0RXZlbnREYXRhKG1vdXNlVXBFdmVudCkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xpY2sgZXZlbnRzLlxuICAgICAqIEBldmVudCBEcmFnI2NsaWNrXG4gICAgICogQHR5cGUge01vdXNlRXZlbnR9XG4gICAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gdGFyZ2V0IC0gdGFyZ2V0IGVsZW1lbnQgaW4gdGhpcyBldmVudC5cbiAgICAgKiBAcHJvcGVydHkge01vdXNlRXZlbnR9IG9yaWdpbkV2ZW50IC0gb3JpZ2luYWwgbW91c2UgZXZlbnQgb2JqZWN0LlxuICAgICAqL1xuICAgIHRoaXMuZmlyZSgnY2xpY2snLCB0aGlzLl9nZXRFdmVudERhdGEobW91c2VVcEV2ZW50KSk7XG59O1xuXG51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihEcmFnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEcmFnO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVGhlIGJhc2UgY2xhc3Mgb2Ygdmlld3MuXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBkb211dGlsID0gcmVxdWlyZSgnLi9kb211dGlsJyk7XG52YXIgQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4vY29sbGVjdGlvbicpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3Mgb2Ygdmlld3MuXG4gKlxuICogQWxsIHZpZXdzIGNyZWF0ZSBvd24gY29udGFpbmVyIGVsZW1lbnQgaW5zaWRlIHN1cHBsaWVkIGNvbnRhaW5lciBlbGVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge29wdGlvbnN9IG9wdGlvbnMgVGhlIG9iamVjdCBmb3IgZGVzY3JpYmUgdmlldydzIHNwZWNzLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIERlZmF1bHQgY29udGFpbmVyIGVsZW1lbnQgZm9yIHZpZXcuIHlvdSBjYW4gdXNlIHRoaXMgZWxlbWVudCBmb3IgdGhpcy5jb250YWluZXIgc3ludGF4LlxuICovXG5mdW5jdGlvbiBWaWV3KG9wdGlvbnMsIGNvbnRhaW5lcikge1xuICAgIHZhciBpZCA9IHV0aWwuc3RhbXAodGhpcyk7XG5cbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGNvbnRhaW5lcikpIHtcbiAgICAgICAgY29udGFpbmVyID0gZG9tdXRpbC5hcHBlbmRIVE1MRWxlbWVudCgnZGl2Jyk7XG4gICAgfVxuXG4gICAgZG9tdXRpbC5hZGRDbGFzcyhjb250YWluZXIsICd0dWktdmlldy0nICsgaWQpO1xuXG4gICAgLyoqXG4gICAgICogdW5pcXVlIGlkXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBiYXNlIGVsZW1lbnQgb2Ygdmlldy5cbiAgICAgKiBAdHlwZSB7SFRNTERJVkVsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICAvKmVzbGludC1kaXNhYmxlKi9cbiAgICAvKipcbiAgICAgKiBjaGlsZCB2aWV3cy5cbiAgICAgKiBAdHlwZSB7Q29sbGVjdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLmNoaWxkcyA9IG5ldyBDb2xsZWN0aW9uKGZ1bmN0aW9uKHZpZXcpIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuc3RhbXAodmlldyk7XG4gICAgfSk7XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cblxuICAgIC8qKlxuICAgICAqIHBhcmVudCB2aWV3IGluc3RhbmNlLlxuICAgICAqIEB0eXBlIHtWaWV3fVxuICAgICAqL1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbn1cblxuLyoqXG4gKiBBZGQgY2hpbGQgdmlld3MuXG4gKiBAcGFyYW0ge1ZpZXd9IHZpZXcgVGhlIHZpZXcgaW5zdGFuY2UgdG8gYWRkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2ZuXSBGdW5jdGlvbiBmb3IgaW52b2tlIGJlZm9yZSBhZGQuIHBhcmVudCB2aWV3IGNsYXNzIGlzIHN1cHBsaWVkIGZpcnN0IGFyZ3VtZW50cy5cbiAqL1xuVmlldy5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbih2aWV3LCBmbikge1xuICAgIGlmIChmbikge1xuICAgICAgICBmbi5jYWxsKHZpZXcsIHRoaXMpO1xuICAgIH1cbiAgICAvLyBhZGQgcGFyZW50IHZpZXdcbiAgICB2aWV3LnBhcmVudCA9IHRoaXM7XG5cbiAgICB0aGlzLmNoaWxkcy5hZGQodmlldyk7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhZGRlZCBjaGlsZCB2aWV3LlxuICogQHBhcmFtIHsobnVtYmVyfFZpZXcpfSBpZCBWaWV3IGlkIG9yIGluc3RhbmNlIGl0c2VsZiB0byByZW1vdmUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZm5dIEZ1bmN0aW9uIGZvciBpbnZva2UgYmVmb3JlIHJlbW92ZS4gcGFyZW50IHZpZXcgY2xhc3MgaXMgc3VwcGxpZWQgZmlyc3QgYXJndW1lbnRzLlxuICovXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVDaGlsZCA9IGZ1bmN0aW9uKGlkLCBmbikge1xuICAgIHZhciB2aWV3ID0gdXRpbC5pc051bWJlcihpZCkgPyB0aGlzLmNoaWxkcy5pdGVtc1tpZF0gOiBpZDtcblxuICAgIGlkID0gdXRpbC5zdGFtcCh2aWV3KTtcblxuICAgIGlmIChmbikge1xuICAgICAgICBmbi5jYWxsKHZpZXcsIHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGRzLnJlbW92ZShpZCk7XG59O1xuXG4vKipcbiAqIFJlbmRlciB2aWV3IHJlY3Vyc2l2ZWx5LlxuICovXG5WaWV3LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNoaWxkcy5lYWNoKGZ1bmN0aW9uKGNoaWxkVmlldykge1xuICAgICAgICBjaGlsZFZpZXcucmVuZGVyKCk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEludm9rZSBmdW5jdGlvbiByZWN1cnNpdmVseS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0gZnVuY3Rpb24gdG8gaW52b2tlIGNoaWxkIHZpZXcgcmVjdXJzaXZlbHlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NraXBUaGlzPWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gc2tpcCBpbnZva2Ugd2l0aCB0aGlzKHJvb3QpIHZpZXcuXG4gKi9cblZpZXcucHJvdG90eXBlLnJlY3Vyc2l2ZSA9IGZ1bmN0aW9uKGZuLCBza2lwVGhpcykge1xuICAgIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFza2lwVGhpcykge1xuICAgICAgICBmbih0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkcy5lYWNoKGZ1bmN0aW9uKGNoaWxkVmlldykge1xuICAgICAgICBjaGlsZFZpZXcucmVjdXJzaXZlKGZuKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmVzaXplIHZpZXcgcmVjdXJzaXZlbHkgdG8gcGFyZW50LlxuICovXG5WaWV3LnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgIHBhcmVudCA9IHRoaXMucGFyZW50O1xuXG4gICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBpZiAodXRpbC5pc0Z1bmN0aW9uKHBhcmVudC5fb25SZXNpemUpKSB7XG4gICAgICAgICAgICBwYXJlbnQuX29uUmVzaXplLmFwcGx5KHBhcmVudCwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgIH1cbn07XG5cbi8qKlxuICogSW52b2tpbmcgbWV0aG9kIGJlZm9yZSBkZXN0cm95aW5nLlxuICovXG5WaWV3LnByb3RvdHlwZS5fYmVmb3JlRGVzdHJveSA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogQ2xlYXIgcHJvcGVydGllc1xuICovXG5WaWV3LnByb3RvdHlwZS5fZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2JlZm9yZURlc3Ryb3koKTtcbiAgICB0aGlzLmNoaWxkcy5jbGVhcigpO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgdGhpcy5pZCA9IHRoaXMucGFyZW50ID0gdGhpcy5jaGlsZHMgPSB0aGlzLmNvbnRhaW5lciA9IG51bGw7XG59O1xuXG4vKmVzbGludC1kaXNhYmxlKi9cbi8qKlxuICogRGVzdHJveSBjaGlsZCB2aWV3IHJlY3Vyc2l2ZWx5LlxuICovXG5WaWV3LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oaXNDaGlsZFZpZXcpIHtcbiAgICB0aGlzLmNoaWxkcy5lYWNoKGZ1bmN0aW9uKGNoaWxkVmlldykge1xuICAgICAgICBjaGlsZFZpZXcuZGVzdHJveSh0cnVlKTtcbiAgICAgICAgY2hpbGRWaWV3Ll9kZXN0cm95KCk7XG4gICAgfSk7XG5cbiAgICBpZiAoaXNDaGlsZFZpZXcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2Rlc3Ryb3koKTtcbn07XG4vKmVzbGludC1lbmFibGUqL1xuXG4vKipcbiAqIENhbGN1bGF0ZSB2aWV3J3MgY29udGFpbmVyIGVsZW1lbnQgYm91bmQuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgYm91bmQgb2YgY29udGFpbmVyIGVsZW1lbnQuXG4gKi9cblZpZXcucHJvdG90eXBlLmdldFZpZXdCb3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgcG9zaXRpb24gPSBkb211dGlsLmdldFBvc2l0aW9uKGNvbnRhaW5lciksXG4gICAgICAgIHNpemUgPSBkb211dGlsLmdldFNpemUoY29udGFpbmVyKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHg6IHBvc2l0aW9uWzBdLFxuICAgICAgICB5OiBwb3NpdGlvblsxXSxcbiAgICAgICAgd2lkdGg6IHNpemVbMF0sXG4gICAgICAgIGhlaWdodDogc2l6ZVsxXVxuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBDb2xvcnBpY2tlciBmYWN0b3J5IG1vZHVsZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGNvbG9ydXRpbCA9IHJlcXVpcmUoJy4vY29sb3J1dGlsJyk7XG52YXIgTGF5b3V0ID0gcmVxdWlyZSgnLi9sYXlvdXQnKTtcbnZhciBQYWxldHRlID0gcmVxdWlyZSgnLi9wYWxldHRlJyk7XG52YXIgU2xpZGVyID0gcmVxdWlyZSgnLi9zbGlkZXInKTtcblxuZnVuY3Rpb24gdGhyb3dFcnJvcihtc2cpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBDdXN0b21FdmVudHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3IgY29sb3JwaWNrZXIgY29tcG9uZW50XG4gKiAgQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gb3B0aW9ucy5jb250YWluZXIgLSBjb250YWluZXIgZWxlbWVudFxuICogIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nI2ZmZmZmZiddIC0gZGVmYXVsdCBzZWxlY3RlZCBjb2xvclxuICogIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLnByZXNldF0gLSBjb2xvciBwcmVzZXQgZm9yIHBhbGV0dGUgKHVzZSBiYXNlMTYgcGFsZXR0ZSBpZiBub3Qgc3VwcGxpZWQpXG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNzc1ByZWZpeD0ndHVpLWNvbG9ycGlja2VyLSddIC0gY3NzIHByZWZpeCB0ZXh0IGZvciBlYWNoIGNoaWxkIGVsZW1lbnRzXG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmRldGFpbFR4dD0nRGV0YWlsJ10gLSB0ZXh0IGZvciBkZXRhaWwgYnV0dG9uLlxuICogQGV4YW1wbGVcbiAqIHZhciBjb2xvcnBpY2tlciA9IHR1aS5jb21wb25lbnQuY29sb3JwaWNrZXIoe1xuICogICBjb250YWluZXI6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb2xvcnBpY2tlcicpXG4gKiB9KTtcbiAqXG4gKiBjb2xvcnBpY2tlci5nZXRDb2xvcigpOyAgICAvLyAnI2ZmZmZmZidcbiAqL1xuZnVuY3Rpb24gQ29sb3JwaWNrZXIob3B0aW9ucykge1xuICAgIHZhciBsYXlvdXQ7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQ29sb3JwaWNrZXIpKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29sb3JwaWNrZXIob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE9wdGlvbiBvYmplY3RcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGNvbnRhaW5lcjogbnVsbCxcbiAgICAgICAgY29sb3I6ICcjZjhmOGY4JyxcbiAgICAgICAgcHJlc2V0OiBbXG4gICAgICAgICAgICAnIzE4MTgxOCcsXG4gICAgICAgICAgICAnIzI4MjgyOCcsXG4gICAgICAgICAgICAnIzM4MzgzOCcsXG4gICAgICAgICAgICAnIzU4NTg1OCcsXG4gICAgICAgICAgICAnI2I4YjhiOCcsXG4gICAgICAgICAgICAnI2Q4ZDhkOCcsXG4gICAgICAgICAgICAnI2U4ZThlOCcsXG4gICAgICAgICAgICAnI2Y4ZjhmOCcsXG4gICAgICAgICAgICAnI2FiNDY0MicsXG4gICAgICAgICAgICAnI2RjOTY1NicsXG4gICAgICAgICAgICAnI2Y3Y2E4OCcsXG4gICAgICAgICAgICAnI2ExYjU2YycsXG4gICAgICAgICAgICAnIzg2YzFiOScsXG4gICAgICAgICAgICAnIzdjYWZjMicsXG4gICAgICAgICAgICAnI2JhOGJhZicsXG4gICAgICAgICAgICAnI2ExNjk0NidcbiAgICAgICAgXSxcbiAgICAgICAgY3NzUHJlZml4OiAndHVpLWNvbG9ycGlja2VyLScsXG4gICAgICAgIGRldGFpbFR4dDogJ0RldGFpbCdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmICghb3B0aW9ucy5jb250YWluZXIpIHtcbiAgICAgICAgdGhyb3dFcnJvcignQ29sb3JwaWNrZXIoKTogbmVlZCBjb250YWluZXIgb3B0aW9uLicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBDcmVhdGUgbGF5b3V0IHZpZXdcbiAgICAgKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtMYXlvdXR9XG4gICAgICovXG4gICAgbGF5b3V0ID0gdGhpcy5sYXlvdXQgPSBuZXcgTGF5b3V0KG9wdGlvbnMsIG9wdGlvbnMuY29udGFpbmVyKTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogQ3JlYXRlIHBhbGV0dGUgdmlld1xuICAgICAqKioqKioqKioqL1xuICAgIHRoaXMucGFsZXR0ZSA9IG5ldyBQYWxldHRlKG9wdGlvbnMsIGxheW91dC5jb250YWluZXIpO1xuICAgIHRoaXMucGFsZXR0ZS5vbih7XG4gICAgICAgICdfc2VsZWN0Q29sb3InOiB0aGlzLl9vblNlbGVjdENvbG9ySW5QYWxldHRlLFxuICAgICAgICAnX3RvZ2dsZVNsaWRlcic6IHRoaXMuX29uVG9nZ2xlU2xpZGVyXG4gICAgfSwgdGhpcyk7XG5cbiAgICAvKioqKioqKioqKlxuICAgICAqIENyZWF0ZSBzbGlkZXIgdmlld1xuICAgICAqKioqKioqKioqL1xuICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcihvcHRpb25zLCBsYXlvdXQuY29udGFpbmVyKTtcbiAgICB0aGlzLnNsaWRlci5vbignX3NlbGVjdENvbG9yJywgdGhpcy5fb25TZWxlY3RDb2xvckluU2xpZGVyLCB0aGlzKTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogQWRkIGNoaWxkIHZpZXdzXG4gICAgICoqKioqKioqKiovXG4gICAgbGF5b3V0LmFkZENoaWxkKHRoaXMucGFsZXR0ZSk7XG4gICAgbGF5b3V0LmFkZENoaWxkKHRoaXMuc2xpZGVyKTtcblxuICAgIHRoaXMucmVuZGVyKG9wdGlvbnMuY29sb3IpO1xufVxuXG4vKipcbiAqIEhhbmRsZXIgbWV0aG9kIGZvciBQYWxldHRlI19zZWxlY3RDb2xvciBldmVudFxuICogQHByaXZhdGVcbiAqIEBmaXJlcyBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICogQHBhcmFtIHtvYmplY3R9IHNlbGVjdENvbG9yRXZlbnREYXRhIC0gZXZlbnQgZGF0YVxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuX29uU2VsZWN0Q29sb3JJblBhbGV0dGUgPSBmdW5jdGlvbihzZWxlY3RDb2xvckV2ZW50RGF0YSkge1xuICAgIHZhciBjb2xvciA9IHNlbGVjdENvbG9yRXZlbnREYXRhLmNvbG9yLFxuICAgICAgICBvcHQgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAoIWNvbG9ydXRpbC5pc1ZhbGlkUkdCKGNvbG9yKSkge1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGFwaVxuICAgICAqIEBldmVudCBDb2xvcnBpY2tlciNzZWxlY3RDb2xvclxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbG9yIC0gc2VsZWN0ZWQgY29sb3IgKGhleCBzdHJpbmcpXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IG9yaWdpbiAtIGZsYWdzIGZvciByZXByZXNlbnQgdGhlIHNvdXJjZSBvZiBldmVudCBmaXJlcy5cbiAgICAgKi9cbiAgICB0aGlzLmZpcmUoJ3NlbGVjdENvbG9yJywge1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIG9yaWdpbjogJ3BhbGV0dGUnXG4gICAgfSk7XG5cbiAgICBpZiAob3B0LmNvbG9yID09PSBjb2xvcikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3B0LmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy5yZW5kZXIoY29sb3IpO1xufTtcblxuLyoqXG4gKiBIYW5kbGVyIG1ldGhvZCBmb3IgUGFsZXR0ZSNfdG9nZ2xlU2xpZGVyIGV2ZW50XG4gKiBAcHJpdmF0ZVxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuX29uVG9nZ2xlU2xpZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbGlkZXIudG9nZ2xlKCF0aGlzLnNsaWRlci5pc1Zpc2libGUoKSk7XG59O1xuXG5cbi8qKlxuICogSGFuZGxlciBtZXRob2QgZm9yIFNsaWRlciNfc2VsZWN0Q29sb3IgZXZlbnRcbiAqIEBwcml2YXRlXG4gKiBAZmlyZXMgQ29sb3JwaWNrZXIjc2VsZWN0Q29sb3JcbiAqIEBwYXJhbSB7b2JqZWN0fSBzZWxlY3RDb2xvckV2ZW50RGF0YSAtIGV2ZW50IGRhdGFcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLl9vblNlbGVjdENvbG9ySW5TbGlkZXIgPSBmdW5jdGlvbihzZWxlY3RDb2xvckV2ZW50RGF0YSkge1xuICAgIHZhciBjb2xvciA9IHNlbGVjdENvbG9yRXZlbnREYXRhLmNvbG9yLFxuICAgICAgICBvcHQgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAvKipcbiAgICAgKiBAYXBpXG4gICAgICogQGV2ZW50IENvbG9ycGlja2VyI3NlbGVjdENvbG9yXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29sb3IgLSBzZWxlY3RlZCBjb2xvciAoaGV4IHN0cmluZylcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gb3JpZ2luIC0gZmxhZ3MgZm9yIHJlcHJlc2VudCB0aGUgc291cmNlIG9mIGV2ZW50IGZpcmVzLlxuICAgICAqL1xuICAgIHRoaXMuZmlyZSgnc2VsZWN0Q29sb3InLCB7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgb3JpZ2luOiAnc2xpZGVyJ1xuICAgIH0pO1xuXG4gICAgaWYgKG9wdC5jb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdC5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMucGFsZXR0ZS5yZW5kZXIoY29sb3IpO1xufTtcblxuLyoqKioqKioqKipcbiAqIFBVQkxJQyBBUElcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIFNldCBjb2xvciB0byBjb2xvcnBpY2tlciBpbnN0YW5jZS48YnI+XG4gKiBUaGUgc3RyaW5nIHBhcmFtZXRlciBtdXN0IGJlIGhleCBjb2xvciB2YWx1ZVxuICogQGFwaVxuICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciAtIGhleCBmb3JtYXR0ZWQgY29sb3Igc3RyaW5nXG4gKiBAZXhhbXBsZVxuICogY29sb3JQaWNrZXIuc2V0Q29sb3IoJyNmZmZmMDAnKTtcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLnNldENvbG9yID0gZnVuY3Rpb24oaGV4U3RyKSB7XG4gICAgaWYgKCFjb2xvcnV0aWwuaXNWYWxpZFJHQihoZXhTdHIpKSB7XG4gICAgICAgIHRocm93RXJyb3IoJ0NvbG9ycGlja2VyI3NldENvbG9yKCk6IG5lZWQgdmFsaWQgaGV4IHN0cmluZyBjb2xvciB2YWx1ZScpO1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucy5jb2xvciA9IGhleFN0cjtcbiAgICB0aGlzLnJlbmRlcihoZXhTdHIpO1xufTtcblxuLyoqXG4gKiBHZXQgaGV4IGNvbG9yIHN0cmluZyBvZiBjdXJyZW50IHNlbGVjdGVkIGNvbG9yIGluIGNvbG9ycGlja2VyIGluc3RhbmNlLlxuICogQGFwaVxuICogQHJldHVybnMge3N0cmluZ30gaGV4IHN0cmluZyBmb3JtYXR0ZWQgY29sb3JcbiAqIEBleGFtcGxlXG4gKiBjb2xvclBpY2tlci5zZXRDb2xvcignI2ZmZmYwMCcpO1xuICogY29sb3JQaWNrZXIuZ2V0Q29sb3IoKTsgLy8gJyNmZmZmMDAnO1xuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUuZ2V0Q29sb3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbG9yO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgY29sb3JwaWNrZXIgZWxlbWVudC4gc2V0IHRydWUgdGhlbiByZXZlYWwgY29sb3JwaWNrZXIgdmlldy5cbiAqIEBhcGlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU2hvdz1mYWxzZV0gLSBBIGZsYWcgdG8gc2hvd1xuICogQGV4YW1wbGVcbiAqIGNvbG9yUGlja2VyLnRvZ2dsZShmYWxzZSk7IC8vIGhpZGVcbiAqIGNvbG9yUGlja2VyLnRvZ2dsZSgpOyAvLyBoaWRlXG4gKiBjb2xvclBpY2tlci50b2dnbGUodHJ1ZSk7IC8vIHNob3dcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKGlzU2hvdykge1xuICAgIHRoaXMubGF5b3V0LmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gISFpc1Nob3cgPyAnYmxvY2snIDogJ25vbmUnO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgY29sb3JwaWNrZXJcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29sb3JdIC0gc2VsZWN0ZWQgY29sb3JcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgdGhpcy5sYXlvdXQucmVuZGVyKGNvbG9yIHx8IHRoaXMub3B0aW9ucy5jb2xvcik7XG59O1xuXG4vKipcbiAqIERlc3Ryb3kgY29sb3JwaWNrZXIgaW5zdGFuY2UuXG4gKiBAYXBpXG4gKiBAZXhhbXBsZVxuICogY29sb3JQaWNrZXIuZGVzdHJveSgpOyAvLyBET00tZWxlbWVudCBpcyByZW1vdmVkXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sYXlvdXQuZGVzdHJveSgpO1xuICAgIHRoaXMub3B0aW9ucy5jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB0aGlzLmxheW91dCA9IHRoaXMuc2xpZGVyID0gdGhpcy5wYWxldHRlID1cbiAgICAgICAgdGhpcy5vcHRpb25zID0gbnVsbDtcbn07XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKENvbG9ycGlja2VyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcnBpY2tlcjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBDb2xvcnBpY2tlciBsYXlvdXQgbW9kdWxlXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgZG9tdXRpbCA9IHJlcXVpcmUoJy4vY29yZS9kb211dGlsJyk7XG52YXIgVmlldyA9IHJlcXVpcmUoJy4vY29yZS92aWV3Jyk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7Vmlld31cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9uIG9iamVjdFxuICogIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNzc1ByZWZpeCAtIGNzcyBwcmVmaXggZm9yIGVhY2ggY2hpbGQgZWxlbWVudHNcbiAqIEBwYXJhbSB7SFRNTERpdkVsZW1lbnR9IGNvbnRhaW5lciAtIGNvbnRhaW5lclxuICovXG5mdW5jdGlvbiBMYXlvdXQob3B0aW9ucywgY29udGFpbmVyKSB7XG4gICAgLyoqXG4gICAgICogb3B0aW9uIG9iamVjdFxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gdXRpbC5leHRlbmQoe1xuICAgICAgICBjc3NQcmVmaXg6ICd0dWktY29sb3JwaWNrZXItJ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgY29udGFpbmVyID0gZG9tdXRpbC5hcHBlbmRIVE1MRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgdGhpcy5vcHRpb25zLmNzc1ByZWZpeCArICdjb250YWluZXInXG4gICAgKTtcblxuICAgIFZpZXcuY2FsbCh0aGlzLCBvcHRpb25zLCBjb250YWluZXIpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbn1cblxudXRpbC5pbmhlcml0KExheW91dCwgVmlldyk7XG5cbi8qKlxuICogQG92ZXJyaWRlXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvbG9yXSAtIHNlbGVjdGVkIGNvbG9yXG4gKi9cbkxheW91dC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sb3IpIHtcbiAgICB0aGlzLnJlY3Vyc2l2ZShmdW5jdGlvbih2aWV3KSB7XG4gICAgICAgIHZpZXcucmVuZGVyKGNvbG9yKTtcbiAgICB9LCB0cnVlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGF5b3V0O1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ29sb3IgcGFsZXR0ZSB2aWV3XG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgZG9tdXRpbCA9IHJlcXVpcmUoJy4vY29yZS9kb211dGlsJyk7XG52YXIgZG9tZXZlbnQgPSByZXF1aXJlKCcuL2NvcmUvZG9tZXZlbnQnKTtcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi9jb3JlL3ZpZXcnKTtcbnZhciB0bXBsID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvcGFsZXR0ZScpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge1ZpZXd9XG4gKiBAbWl4ZXMgQ3VzdG9tRXZlbnRzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbnMgZm9yIGNvbG9yIHBhbGV0dGUgdmlld1xuICogIEBwYXJhbSB7c3RyaW5nW119IG9wdGlvbnMucHJlc2V0IC0gY29sb3IgbGlzdFxuICogQHBhcmFtIHtIVE1MRGl2RWxlbWVudH0gY29udGFpbmVyIC0gY29udGFpbmVyIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gUGFsZXR0ZShvcHRpb25zLCBjb250YWluZXIpIHtcbiAgICAvKipcbiAgICAgKiBvcHRpb24gb2JqZWN0XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGNzc1ByZWZpeDogJ3R1aS1jb2xvcnBpY2tlci0nLFxuICAgICAgICBwcmVzZXQ6IFtcbiAgICAgICAgICAgICcjMTgxODE4JyxcbiAgICAgICAgICAgICcjMjgyODI4JyxcbiAgICAgICAgICAgICcjMzgzODM4JyxcbiAgICAgICAgICAgICcjNTg1ODU4JyxcbiAgICAgICAgICAgICcjQjhCOEI4JyxcbiAgICAgICAgICAgICcjRDhEOEQ4JyxcbiAgICAgICAgICAgICcjRThFOEU4JyxcbiAgICAgICAgICAgICcjRjhGOEY4JyxcbiAgICAgICAgICAgICcjQUI0NjQyJyxcbiAgICAgICAgICAgICcjREM5NjU2JyxcbiAgICAgICAgICAgICcjRjdDQTg4JyxcbiAgICAgICAgICAgICcjQTFCNTZDJyxcbiAgICAgICAgICAgICcjODZDMUI5JyxcbiAgICAgICAgICAgICcjN0NBRkMyJyxcbiAgICAgICAgICAgICcjQkE4QkFGJyxcbiAgICAgICAgICAgICcjQTE2OTQ2J1xuICAgICAgICBdLFxuICAgICAgICBkZXRhaWxUeHQ6ICdEZXRhaWwnXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBjb250YWluZXIgPSBkb211dGlsLmFwcGVuZEhUTUxFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICB0aGlzLm9wdGlvbnMuY3NzUHJlZml4ICsgJ3BhbGV0dGUtY29udGFpbmVyJ1xuICAgICk7XG5cbiAgICBWaWV3LmNhbGwodGhpcywgb3B0aW9ucywgY29udGFpbmVyKTtcbn1cblxudXRpbC5pbmhlcml0KFBhbGV0dGUsIFZpZXcpO1xuXG4vKipcbiAqIE1vdXNlIGNsaWNrIGV2ZW50IGhhbmRsZXJcbiAqIEBmaXJlcyBQYWxldHRlI19zZWxlY3RDb2xvclxuICogQGZpcmVzIFBhbGV0dGUjX3RvZ2dsZVNsaWRlclxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBjbGlja0V2ZW50IC0gbW91c2UgZXZlbnQgb2JqZWN0XG4gKi9cblBhbGV0dGUucHJvdG90eXBlLl9vbkNsaWNrID0gZnVuY3Rpb24oY2xpY2tFdmVudCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICB0YXJnZXQgPSBjbGlja0V2ZW50LnNyY0VsZW1lbnQgfHwgY2xpY2tFdmVudC50YXJnZXQsXG4gICAgICAgIGV2ZW50RGF0YSA9IHt9O1xuXG4gICAgaWYgKGRvbXV0aWwuaGFzQ2xhc3ModGFyZ2V0LCBvcHRpb25zLmNzc1ByZWZpeCArICdwYWxldHRlLWJ1dHRvbicpKSB7XG4gICAgICAgIGV2ZW50RGF0YS5jb2xvciA9IHRhcmdldC52YWx1ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQGV2ZW50IFBhbGV0dGUjX3NlbGVjdENvbG9yXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjb2xvciAtIHNlbGVjdGVkIGNvbG9yIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpcmUoJ19zZWxlY3RDb2xvcicsIGV2ZW50RGF0YSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZG9tdXRpbC5oYXNDbGFzcyh0YXJnZXQsIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3BhbGV0dGUtdG9nZ2xlLXNsaWRlcicpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZXZlbnQgUGFsZXR0ZSNfdG9nZ2xlU2xpZGVyXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpcmUoJ190b2dnbGVTbGlkZXInKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFRleHRib3ggY2hhbmdlIGV2ZW50IGhhbmRsZXJcbiAqIEBmaXJlcyBQYWxldHRlI19zZWxlY3RDb2xvclxuICogQHBhcmFtIHtFdmVudH0gY2hhbmdlRXZlbnQgLSBjaGFuZ2UgZXZlbnQgb2JqZWN0XG4gKi9cblBhbGV0dGUucHJvdG90eXBlLl9vbkNoYW5nZSA9IGZ1bmN0aW9uKGNoYW5nZUV2ZW50KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHRhcmdldCA9IGNoYW5nZUV2ZW50LnNyY0VsZW1lbnQgfHwgY2hhbmdlRXZlbnQudGFyZ2V0LFxuICAgICAgICBldmVudERhdGEgPSB7fTtcblxuICAgIGlmIChkb211dGlsLmhhc0NsYXNzKHRhcmdldCwgb3B0aW9ucy5jc3NQcmVmaXggKyAncGFsZXR0ZS1oZXgnKSkge1xuICAgICAgICBldmVudERhdGEuY29sb3IgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBldmVudCBQYWxldHRlI19zZWxlY3RDb2xvclxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29sb3IgLSBzZWxlY3RlZCBjb2xvciB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJlKCdfc2VsZWN0Q29sb3InLCBldmVudERhdGEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxuLyoqXG4gKiBJbnZva2UgYmVmb3JlIGRlc3RvcnlcbiAqIEBvdmVycmlkZVxuICovXG5QYWxldHRlLnByb3RvdHlwZS5fYmVmb3JlRGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3RvZ2dsZUV2ZW50KGZhbHNlKTtcbn07XG5cbi8qKlxuICogVG9nZ2xlIHZpZXcgRE9NIGV2ZW50c1xuICogQHBhcmFtIHtib29sZWFufSBbb25PZmY9ZmFsc2VdIC0gdHJ1ZSB0byBiaW5kIGV2ZW50LlxuICovXG5QYWxldHRlLnByb3RvdHlwZS5fdG9nZ2xlRXZlbnQgPSBmdW5jdGlvbihvbk9mZikge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcixcbiAgICAgICAgbWV0aG9kID0gZG9tZXZlbnRbISFvbk9mZiA/ICdvbicgOiAnb2ZmJ10sXG4gICAgICAgIGhleFRleHRCb3g7XG5cbiAgICBtZXRob2QoY29udGFpbmVyLCAnY2xpY2snLCB0aGlzLl9vbkNsaWNrLCB0aGlzKTtcblxuICAgIGhleFRleHRCb3ggPSBkb211dGlsLmZpbmQoJy4nICsgb3B0aW9ucy5jc3NQcmVmaXggKyAncGFsZXR0ZS1oZXgnLCBjb250YWluZXIpO1xuXG4gICAgaWYgKGhleFRleHRCb3gpIHtcbiAgICAgICAgbWV0aG9kKGhleFRleHRCb3gsICdjaGFuZ2UnLCB0aGlzLl9vbkNoYW5nZSwgdGhpcyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZW5kZXIgcGFsZXR0ZVxuICogQG92ZXJyaWRlXG4gKi9cblBhbGV0dGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGh0bWwgPSAnJztcblxuICAgIHRoaXMuX3RvZ2dsZUV2ZW50KGZhbHNlKTtcblxuICAgIGh0bWwgPSB0bXBsLmxheW91dC5yZXBsYWNlKCd7e2NvbG9yTGlzdH19JywgdXRpbC5tYXAob3B0aW9ucy5wcmVzZXQsIGZ1bmN0aW9uKF9jb2xvcikge1xuICAgICAgICB2YXIgaXRlbUh0bWwgPSB0bXBsLml0ZW0ucmVwbGFjZSgve3tjb2xvcn19L2csIF9jb2xvcik7XG4gICAgICAgIGl0ZW1IdG1sID0gaXRlbUh0bWwucmVwbGFjZSgne3tzZWxlY3RlZH19JywgX2NvbG9yID09PSBjb2xvciA/ICAoJyAnICsgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2VsZWN0ZWQnKSA6ICcnKTsgXG5cbiAgICAgICAgcmV0dXJuIGl0ZW1IdG1sO1xuICAgIH0pLmpvaW4oJycpKTtcblxuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL3t7Y3NzUHJlZml4fX0vZywgb3B0aW9ucy5jc3NQcmVmaXgpXG4gICAgICAgIC5yZXBsYWNlKCd7e2RldGFpbFR4dH19Jywgb3B0aW9ucy5kZXRhaWxUeHQpXG4gICAgICAgIC5yZXBsYWNlKC97e2NvbG9yfX0vZywgY29sb3IpO1xuXG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHRoaXMuX3RvZ2dsZUV2ZW50KHRydWUpO1xufTtcblxudXRpbC5DdXN0b21FdmVudHMubWl4aW4oUGFsZXR0ZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUGFsZXR0ZTtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNsaWRlciB2aWV3XG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBkb211dGlsID0gcmVxdWlyZSgnLi9jb3JlL2RvbXV0aWwnKTtcbnZhciBkb21ldmVudCA9IHJlcXVpcmUoJy4vY29yZS9kb21ldmVudCcpO1xudmFyIHN2Z3ZtbCA9IHJlcXVpcmUoJy4vc3Zndm1sJyk7XG52YXIgY29sb3J1dGlsID0gcmVxdWlyZSgnLi9jb2xvcnV0aWwnKTtcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi9jb3JlL3ZpZXcnKTtcbnZhciBEcmFnID0gcmVxdWlyZSgnLi9jb3JlL2RyYWcnKTtcbnZhciB0bXBsID0gcmVxdWlyZSgnLi4vdGVtcGxhdGUvc2xpZGVyJyk7XG5cbi8vIExpbWl0YXRpb24gcG9zaXRpb24gb2YgcG9pbnQgZWxlbWVudCBpbnNpZGUgb2YgY29sb3JzbGlkZXIgYW5kIGh1ZSBiYXJcbi8vIE1pbmltdW0gdmFsdWUgY2FuIHRvIGJlIG5lZ2F0aXZlIGJlY2F1c2UgdGhhdCB1c2luZyBjb2xvciBwb2ludCBvZiBoYW5kbGUgZWxlbWVudCBpcyBjZW50ZXIgcG9pbnQuIG5vdCBsZWZ0LCB0b3AgcG9pbnQuXG52YXIgQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFID0gWy03LCAxMTJdO1xudmFyIEhVRUJBUl9QT1NfTElNSVRfUkFOR0UgPSBbLTMsIDExNV07XG52YXIgSFVFX1dIRUVMX01BWCA9IDM1OS45OTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIHtWaWV3fVxuICogQG1peGVzIEN1c3RvbUV2ZW50c1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciB2aWV3XG4gKiAgQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuY3NzUHJlZml4IC0gZGVzaWduIGNzcyBwcmVmaXhcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIFNsaWRlcihvcHRpb25zLCBjb250YWluZXIpIHtcbiAgICBjb250YWluZXIgPSBkb211dGlsLmFwcGVuZEhUTUxFbGVtZW50KCdkaXYnLCBjb250YWluZXIsIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NsaWRlci1jb250YWluZXInKTtcbiAgICBjb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIFZpZXcuY2FsbCh0aGlzLCBvcHRpb25zLCBjb250YWluZXIpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGNvbG9yOiAnI2Y4ZjhmOCcsXG4gICAgICAgIGNzc1ByZWZpeDogJ3R1aS1jb2xvcnBpY2tlci0nXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBDYWNoZSBpbW11dGFibGUgZGF0YSBpbiBjbGljaywgZHJhZyBldmVudHMuXG4gICAgICpcbiAgICAgKiAoaS5lLiBpcyBldmVudCByZWxhdGVkIHdpdGggY29sb3JzbGlkZXI/IG9yIGh1ZWJhcj8pXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGlzQ29sb3JTbGlkZXJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcltdfSBjb250YWluZXJTaXplXG4gICAgICovXG4gICAgdGhpcy5fZHJhZ0RhdGFDYWNoZSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQ29sb3Igc2xpZGVyIGhhbmRsZSBlbGVtZW50XG4gICAgICogQHR5cGUge1NWR3xWTUx9XG4gICAgICovXG4gICAgdGhpcy5zbGlkZXJIYW5kbGVFbGVtZW50ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIGh1ZSBiYXIgaGFuZGxlIGVsZW1lbnRcbiAgICAgKiBAdHlwZSB7U1ZHfFZNTH1cbiAgICAgKi9cbiAgICB0aGlzLmh1ZWJhckhhbmRsZUVsZW1lbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRWxlbWVudCB0aGF0IHJlbmRlciBiYXNlIGNvbG9yIGluIGNvbG9yc2xpZGVyIHBhcnRcbiAgICAgKiBAdHlwZSB7U1ZHfFZNTH1cbiAgICAgKi9cbiAgICB0aGlzLmJhc2VDb2xvckVsZW1lbnQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0RyYWd9XG4gICAgICovXG4gICAgdGhpcy5kcmFnID0gbmV3IERyYWcoe1xuICAgICAgICBkaXN0YW5jZTogMFxuICAgIH0sIGNvbnRhaW5lcik7XG4gICAgXG4gICAgLy8gYmluZCBkcmFnIGV2ZW50c1xuICAgIHRoaXMuZHJhZy5vbih7XG4gICAgICAgICdkcmFnU3RhcnQnOiB0aGlzLl9vbkRyYWdTdGFydCxcbiAgICAgICAgJ2RyYWcnOiB0aGlzLl9vbkRyYWcsXG4gICAgICAgICdkcmFnRW5kJzogdGhpcy5fb25EcmFnRW5kLFxuICAgICAgICAnY2xpY2snOiB0aGlzLl9vbkNsaWNrXG4gICAgfSwgdGhpcyk7XG59XG5cbnV0aWwuaW5oZXJpdChTbGlkZXIsIFZpZXcpO1xuXG4vKipcbiAqIEBvdmVycmlkZVxuICovXG5TbGlkZXIucHJvdG90eXBlLl9iZWZvcmVEZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kcmFnLm9mZigpO1xuXG4gICAgdGhpcy5kcmFnID0gdGhpcy5vcHRpb25zID0gdGhpcy5fZHJhZ0RhdGFDYWNoZSA9XG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlRWxlbWVudCA9IHRoaXMuaHVlYmFySGFuZGxlRWxlbWVudCA9XG4gICAgICAgIHRoaXMuYmFzZUNvbG9yRWxlbWVudCA9IG51bGw7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSBzbGlkZXIgdmlld1xuICogQHBhcmFtIHtib29sZWFufSBvbk9mZiAtIHNldCB0cnVlIHRoZW4gcmV2ZWFsIHNsaWRlciB2aWV3XG4gKi9cblNsaWRlci5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24ob25PZmYpIHtcbiAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gISFvbk9mZiA/ICdibG9jaycgOiAnbm9uZSc7XG59O1xuXG4vKipcbiAqIEdldCBzbGlkZXIgZGlzcGxheSBzdGF0dXNcbiAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB3aGVuIHNsaWRlciBpcyB2aXNpYmxlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuaXNWaXNpYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPT09ICdibG9jayc7XG59O1xuXG4vKipcbiAqIFJlbmRlciBzbGlkZXIgdmlld1xuICogQG92ZXJyaWRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY29sb3JTdHIgLSBoZXggc3RyaW5nIGNvbG9yIGZyb20gcGFyZW50IHZpZXcgKExheW91dClcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjb2xvclN0cikge1xuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgY29udGFpbmVyID0gdGhhdC5jb250YWluZXIsXG4gICAgICAgIG9wdGlvbnMgPSB0aGF0Lm9wdGlvbnMsXG4gICAgICAgIGh0bWwgPSB0bXBsLmxheW91dCxcbiAgICAgICAgcmdiLFxuICAgICAgICBoc3Y7XG5cbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC97e3NsaWRlcn19LywgdG1wbC5zbGlkZXIpO1xuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL3t7aHVlYmFyfX0vLCB0bXBsLmh1ZWJhcik7XG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgve3tjc3NQcmVmaXh9fS9nLCBvcHRpb25zLmNzc1ByZWZpeCk7XG5cbiAgICB0aGF0LmNvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgdGhhdC5zbGlkZXJIYW5kbGVFbGVtZW50ID0gZG9tdXRpbC5maW5kKCcuJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NsaWRlci1oYW5kbGUnLCBjb250YWluZXIpO1xuICAgIHRoYXQuaHVlYmFySGFuZGxlRWxlbWVudCA9IGRvbXV0aWwuZmluZCgnLicgKyBvcHRpb25zLmNzc1ByZWZpeCArICdodWViYXItaGFuZGxlJywgY29udGFpbmVyKTtcbiAgICB0aGF0LmJhc2VDb2xvckVsZW1lbnQgPSBkb211dGlsLmZpbmQoJy4nICsgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2xpZGVyLWJhc2Vjb2xvcicsIGNvbnRhaW5lcik7XG5cbiAgICByZ2IgPSBjb2xvcnV0aWwuaGV4VG9SR0IoY29sb3JTdHIpO1xuICAgIGhzdiA9IGNvbG9ydXRpbC5yZ2JUb0hTVi5hcHBseShudWxsLCByZ2IpO1xuXG4gICAgdGhpcy5tb3ZlSHVlKGhzdlswXSwgdHJ1ZSlcbiAgICB0aGlzLm1vdmVTYXR1cmF0aW9uQW5kVmFsdWUoaHN2WzFdLCBoc3ZbMl0sIHRydWUpO1xufTtcblxuLyoqXG4gKiBNb3ZlIGNvbG9yc2xpZGVyIGJ5IG5ld0xlZnQoWCksIG5ld1RvcChZKSB2YWx1ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZXdMZWZ0IC0gbGVmdCBwaXhlbCB2YWx1ZSB0byBtb3ZlIGhhbmRsZVxuICogQHBhcmFtIHtudW1iZXJ9IG5ld1RvcCAtIHRvcCBwaXhlbCB2YWx1ZSB0byBtb3ZlIGhhbmRsZVxuICogQHBhcmFtIHtib29sZWFufSBbc2lsZW50PWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gbm90IGZpcmUgY3VzdG9tIGV2ZW50XG4gKi9cblNsaWRlci5wcm90b3R5cGUuX21vdmVDb2xvclNsaWRlckhhbmRsZSA9IGZ1bmN0aW9uKG5ld0xlZnQsIG5ld1RvcCwgc2lsZW50KSB7XG4gICAgdmFyIGhhbmRsZSA9IHRoaXMuc2xpZGVySGFuZGxlRWxlbWVudCxcbiAgICAgICAgaGFuZGxlQ29sb3I7XG5cbiAgICAvLyBDaGVjayBwb3NpdGlvbiBsaW1pdGF0aW9uLlxuICAgIG5ld1RvcCA9IE1hdGgubWF4KENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVswXSwgbmV3VG9wKTtcbiAgICBuZXdUb3AgPSBNYXRoLm1pbihDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMV0sIG5ld1RvcCk7XG4gICAgbmV3TGVmdCA9IE1hdGgubWF4KENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVswXSwgbmV3TGVmdCk7XG4gICAgbmV3TGVmdCA9IE1hdGgubWluKENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVsxXSwgbmV3TGVmdCk7XG5cbiAgICBzdmd2bWwuc2V0VHJhbnNsYXRlWFkoaGFuZGxlLCBuZXdMZWZ0LCBuZXdUb3ApO1xuXG4gICAgaGFuZGxlQ29sb3IgPSBuZXdUb3AgPiA1MCA/ICd3aGl0ZScgOiAnYmxhY2snO1xuICAgIHN2Z3ZtbC5zZXRTdHJva2VDb2xvcihoYW5kbGUsIGhhbmRsZUNvbG9yKTtcblxuICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIHRoaXMuZmlyZSgnX3NlbGVjdENvbG9yJywge1xuICAgICAgICAgICAgY29sb3I6IGNvbG9ydXRpbC5yZ2JUb0hFWC5hcHBseShudWxsLCB0aGlzLmdldFJHQigpKVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIE1vdmUgY29sb3JzbGlkZXIgYnkgc3VwcGxpZWQgc2F0dXJhdGlvbiBhbmQgdmFsdWVzLlxuICpcbiAqIFRoZSBtb3ZlbWVudCBvZiBjb2xvciBzbGlkZXIgaGFuZGxlIGZvbGxvdyBIU1YgY3lsaW5kZXIgbW9kZWwuIHtAbGluayBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9IU0xfYW5kX0hTVn1cbiAqIEBwYXJhbSB7bnVtYmVyfSBzYXR1cmF0aW9uIC0gdGhlIHBlcmNlbnQgb2Ygc2F0dXJhdGlvbiAoMCUgfiAxMDAlKVxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gdGhlIHBlcmNlbnQgb2Ygc2F0dXJhdGlvbiAoMCUgfiAxMDAlKVxuICogQHBhcmFtIHtib29sZWFufSBbc2lsZW50PWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gbm90IGZpcmUgY3VzdG9tIGV2ZW50XG4gKi9cblNsaWRlci5wcm90b3R5cGUubW92ZVNhdHVyYXRpb25BbmRWYWx1ZSA9IGZ1bmN0aW9uKHNhdHVyYXRpb24sIHZhbHVlLCBzaWxlbnQpIHtcbiAgICB2YXIgYWJzTWluLCBtYXhWYWx1ZSxcbiAgICAgICAgbmV3TGVmdCwgbmV3VG9wO1xuXG4gICAgc2F0dXJhdGlvbiA9IHNhdHVyYXRpb24gfHwgMDtcbiAgICB2YWx1ZSA9IHZhbHVlIHx8IDA7XG5cbiAgICBhYnNNaW4gPSBNYXRoLmFicyhDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMF0pO1xuICAgIG1heFZhbHVlID0gQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzFdO1xuXG4gICAgLy8gc3VidHJhY3QgYWJzTWluIHZhbHVlIGJlY2F1c2UgY3VycmVudCBjb2xvciBwb3NpdGlvbiBpcyBub3QgbGVmdCwgdG9wIG9mIGhhbmRsZSBlbGVtZW50LlxuICAgIC8vIFRoZSBzYXR1cmF0aW9uLiBmcm9tIGxlZnQgMCB0byByaWdodCAxMDBcbiAgICBuZXdMZWZ0ID0gKChzYXR1cmF0aW9uICogbWF4VmFsdWUpIC8gMTAwKSAtIGFic01pbjtcbiAgICAvLyBUaGUgVmFsdWUuIGZyb20gdG9wIDEwMCB0byBib3R0b20gMC4gdGhhdCB3aHkgbmV3VG9wIHN1YnRyYWN0IGJ5IG1heFZhbHVlLlxuICAgIG5ld1RvcCA9IChtYXhWYWx1ZSAtICgodmFsdWUgKiBtYXhWYWx1ZSkgLyAxMDApKSAtIGFic01pbjtcblxuICAgIHRoaXMuX21vdmVDb2xvclNsaWRlckhhbmRsZShuZXdMZWZ0LCBuZXdUb3AsIHNpbGVudCk7XG59O1xuXG4vKipcbiAqIE1vdmUgY29sb3Igc2xpZGVyIGhhbmRsZSB0byBzdXBwbGllZCBwb3NpdGlvblxuICpcbiAqIFRoZSBudW1iZXIgb2YgWCwgWSBtdXN0IGJlIHJlbGF0ZWQgdmFsdWUgZnJvbSBjb2xvciBzbGlkZXIgY29udGFpbmVyXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHggLSB0aGUgcGl4ZWwgdmFsdWUgdG8gbW92ZSBoYW5kbGUgXG4gKiBAcGFyYW0ge251bWJlcn0geSAtIHRoZSBwaXhlbCB2YWx1ZSB0byBtb3ZlIGhhbmRsZVxuICovXG5TbGlkZXIucHJvdG90eXBlLl9tb3ZlQ29sb3JTbGlkZXJCeVBvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHZhciBvZmZzZXQgPSBDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMF07XG4gICAgdGhpcy5fbW92ZUNvbG9yU2xpZGVySGFuZGxlKHggKyBvZmZzZXQsIHkgKyBvZmZzZXQpO1xufTtcblxuLyoqXG4gKiBHZXQgc2F0dXJhdGlvbiBhbmQgdmFsdWUgdmFsdWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyW119IHNhdHVyYXRpb24gYW5kIHZhbHVlXG4gKi9cblNsaWRlci5wcm90b3R5cGUuZ2V0U2F0dXJhdGlvbkFuZFZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFic01pbiA9IE1hdGguYWJzKENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVswXSksXG4gICAgICAgIG1heFZhbHVlID0gYWJzTWluICsgQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzFdLFxuICAgICAgICBwb3NpdGlvbiA9IHN2Z3ZtbC5nZXRUcmFuc2xhdGVYWSh0aGlzLnNsaWRlckhhbmRsZUVsZW1lbnQpLCBcbiAgICAgICAgc2F0dXJhdGlvbiwgdmFsdWU7XG5cbiAgICBzYXR1cmF0aW9uID0gKChwb3NpdGlvblsxXSArIGFic01pbikgLyBtYXhWYWx1ZSkgKiAxMDA7XG4gICAgLy8gVGhlIHZhbHVlIG9mIEhTViBjb2xvciBtb2RlbCBpcyBpbnZlcnRlZC4gdG9wIDEwMCB+IGJvdHRvbSAwLiBzbyBzdWJ0cmFjdCBieSAxMDBcbiAgICB2YWx1ZSA9IDEwMCAtICgoKHBvc2l0aW9uWzBdICsgYWJzTWluKSAvIG1heFZhbHVlKSAqIDEwMCk7XG5cbiAgICByZXR1cm4gW3NhdHVyYXRpb24sIHZhbHVlXTtcbn07XG5cbi8qKlxuICogTW92ZSBodWUgaGFuZGxlIHN1cHBsaWVkIHBpeGVsIHZhbHVlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG5ld1RvcCAtIHBpeGVsIHRvIG1vdmUgaHVlIGhhbmRsZVxuICogQHBhcmFtIHtib29sZWFufSBbc2lsZW50PWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gbm90IGZpcmUgY3VzdG9tIGV2ZW50XG4gKi9cblNsaWRlci5wcm90b3R5cGUuX21vdmVIdWVIYW5kbGUgPSBmdW5jdGlvbihuZXdUb3AsIHNpbGVudCkge1xuICAgIHZhciBodWVIYW5kbGVFbGVtZW50ID0gdGhpcy5odWViYXJIYW5kbGVFbGVtZW50LFxuICAgICAgICBiYXNlQ29sb3JFbGVtZW50ID0gdGhpcy5iYXNlQ29sb3JFbGVtZW50LFxuICAgICAgICBuZXdHcmFkaWVudENvbG9yLFxuICAgICAgICBoZXhTdHI7XG5cbiAgICBuZXdUb3AgPSBNYXRoLm1heChIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzBdLCBuZXdUb3ApO1xuICAgIG5ld1RvcCA9IE1hdGgubWluKEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMV0sIG5ld1RvcCk7XG5cbiAgICBzdmd2bWwuc2V0VHJhbnNsYXRlWShodWVIYW5kbGVFbGVtZW50LCBuZXdUb3ApO1xuXG4gICAgbmV3R3JhZGllbnRDb2xvciA9IGNvbG9ydXRpbC5oc3ZUb1JHQih0aGlzLmdldEh1ZSgpLCAxMDAsIDEwMCk7XG4gICAgaGV4U3RyID0gY29sb3J1dGlsLnJnYlRvSEVYLmFwcGx5KG51bGwsIG5ld0dyYWRpZW50Q29sb3IpO1xuXG4gICAgc3Zndm1sLnNldEdyYWRpZW50Q29sb3JTdG9wKGJhc2VDb2xvckVsZW1lbnQsIGhleFN0cik7XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICB0aGlzLmZpcmUoJ19zZWxlY3RDb2xvcicsIHtcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcnV0aWwucmdiVG9IRVguYXBwbHkobnVsbCwgdGhpcy5nZXRSR0IoKSkgXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogTW92ZSBodWUgYmFyIGhhbmRsZSBieSBzdXBwbGllZCBkZWdyZWVcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWUgLSAoMCB+IDM1OS45IGRlZ3JlZSlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbGVudD1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIG5vdCBmaXJlIGN1c3RvbSBldmVudFxuICovXG5TbGlkZXIucHJvdG90eXBlLm1vdmVIdWUgPSBmdW5jdGlvbihkZWdyZWUsIHNpbGVudCkge1xuICAgIHZhciBuZXdUb3AgPSAwLFxuICAgICAgICBhYnNNaW4sIG1heFZhbHVlO1xuXG4gICAgYWJzTWluID0gTWF0aC5hYnMoSFVFQkFSX1BPU19MSU1JVF9SQU5HRVswXSk7XG4gICAgbWF4VmFsdWUgPSBhYnNNaW4gKyBIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzFdO1xuXG4gICAgZGVncmVlID0gZGVncmVlIHx8IDA7XG4gICAgbmV3VG9wID0gKChtYXhWYWx1ZSAqIGRlZ3JlZSkgLyBIVUVfV0hFRUxfTUFYKSAtIGFic01pbjtcblxuICAgIHRoaXMuX21vdmVIdWVIYW5kbGUobmV3VG9wLCBzaWxlbnQpO1xufTtcblxuLyoqXG4gKiBNb3ZlIGh1ZSBiYXIgaGFuZGxlIGJ5IHN1cHBsaWVkIHBlcmNlbnRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0geSAtIHBpeGVsIHZhbHVlIHRvIG1vdmUgaHVlIGhhbmRsZVxuICovXG5TbGlkZXIucHJvdG90eXBlLl9tb3ZlSHVlQnlQb3NpdGlvbiA9IGZ1bmN0aW9uKHkpIHtcbiAgICB2YXIgb2Zmc2V0ID0gSFVFQkFSX1BPU19MSU1JVF9SQU5HRVswXTtcblxuICAgIHRoaXMuX21vdmVIdWVIYW5kbGUoeSArIG9mZnNldCk7XG59O1xuXG4vKipcbiAqIEdldCBodWViYXIgaGFuZGxlIHBvc2l0aW9uIGJ5IGNvbG9yIGRlZ3JlZVxuICogQHJldHVybnMge251bWJlcn0gZGVncmVlICgwIH4gMzU5LjkgZGVncmVlKVxuICovXG5TbGlkZXIucHJvdG90eXBlLmdldEh1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoYW5kbGUgPSB0aGlzLmh1ZWJhckhhbmRsZUVsZW1lbnQsXG4gICAgICAgIHBvc2l0aW9uID0gc3Zndm1sLmdldFRyYW5zbGF0ZVhZKGhhbmRsZSksXG4gICAgICAgIGFic01pbiwgbWF4VmFsdWU7XG5cbiAgICBhYnNNaW4gPSBNYXRoLmFicyhIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzBdKTtcbiAgICBtYXhWYWx1ZSA9IGFic01pbiArIEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMV07XG5cbiAgICAvLyBtYXhWYWx1ZSA6IDM1OS45OSA9IHBvcy55IDogeFxuICAgIHJldHVybiAoKHBvc2l0aW9uWzBdICsgYWJzTWluKSAqIEhVRV9XSEVFTF9NQVgpIC8gbWF4VmFsdWU7XG59O1xuXG4vKipcbiAqIEdldCBIU1YgdmFsdWUgZnJvbSBzbGlkZXJcbiAqIEByZXR1cm5zIHtudW1iZXJbXX0gaHN2IHZhbHVlc1xuICovXG5TbGlkZXIucHJvdG90eXBlLmdldEhTViA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdiA9IHRoaXMuZ2V0U2F0dXJhdGlvbkFuZFZhbHVlKCksXG4gICAgICAgIGggPSB0aGlzLmdldEh1ZSgpO1xuXG4gICAgcmV0dXJuIFtoXS5jb25jYXQoc3YpO1xufTtcblxuLyoqXG4gKiBHZXQgUkdCIHZhbHVlIGZyb20gc2xpZGVyXG4gKiBAcmV0dXJucyB7bnVtYmVyW119IFJHQiB2YWx1ZVxuICovXG5TbGlkZXIucHJvdG90eXBlLmdldFJHQiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjb2xvcnV0aWwuaHN2VG9SR0IuYXBwbHkobnVsbCwgdGhpcy5nZXRIU1YoKSk7XG59O1xuXG4vKioqKioqKioqKlxuICogRHJhZyBldmVudCBoYW5kbGVyXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBDYWNoZSBpbW11dGFibGUgZGF0YSB3aGVuIGRyYWdnaW5nIG9yIGNsaWNrIHZpZXdcbiAqIEBwYXJhbSB7b2JqZWN0fSBldmVudCAtIENsaWNrLCBEcmFnU3RhcnQgZXZlbnQuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBjYWNoZWQgZGF0YS5cbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fcHJlcGFyZUNvbG9yU2xpZGVyRm9yTW91c2VFdmVudCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIHNsaWRlclBhcnQgPSBkb211dGlsLmNsb3Nlc3QoZXZlbnQudGFyZ2V0LCAnLicgKyBvcHRpb25zLmNzc1ByZWZpeCArICdzbGlkZXItcGFydCcpLFxuICAgICAgICBjYWNoZTtcblxuICAgIGNhY2hlID0gdGhpcy5fZHJhZ0RhdGFDYWNoZSA9IHtcbiAgICAgICAgaXNDb2xvclNsaWRlcjogZG9tdXRpbC5oYXNDbGFzcyhzbGlkZXJQYXJ0LCBvcHRpb25zLmNzc1ByZWZpeCArICdzbGlkZXItbGVmdCcpLFxuICAgICAgICBwYXJlbnRFbGVtZW50OiBzbGlkZXJQYXJ0XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gY2FjaGU7XG59O1xuXG4vKipcbiAqIENsaWNrIGV2ZW50IGhhbmRsZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBjbGlja0V2ZW50IC0gQ2xpY2sgZXZlbnQgZnJvbSBEcmFnIG1vZHVsZVxuICovXG5TbGlkZXIucHJvdG90eXBlLl9vbkNsaWNrID0gZnVuY3Rpb24oY2xpY2tFdmVudCkge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuX3ByZXBhcmVDb2xvclNsaWRlckZvck1vdXNlRXZlbnQoY2xpY2tFdmVudCksXG4gICAgICAgIG1vdXNlUG9zID0gZG9tZXZlbnQuZ2V0TW91c2VQb3NpdGlvbihjbGlja0V2ZW50Lm9yaWdpbkV2ZW50LCBjYWNoZS5wYXJlbnRFbGVtZW50KTtcblxuICAgIGlmIChjYWNoZS5pc0NvbG9yU2xpZGVyKSB7XG4gICAgICAgIHRoaXMuX21vdmVDb2xvclNsaWRlckJ5UG9zaXRpb24obW91c2VQb3NbMF0sIG1vdXNlUG9zWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tb3ZlSHVlQnlQb3NpdGlvbihtb3VzZVBvc1sxXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZHJhZ0RhdGFDYWNoZSA9IG51bGw7XG59O1xuXG4vKipcbiAqIERyYWdTdGFydCBldmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge29iamVjdH0gZHJhZ1N0YXJ0RXZlbnQgLSBkcmFnU3RhcnQgZXZlbnQgZGF0YSBmcm9tIERyYWcjZHJhZ1N0YXJ0XG4gKi9cblNsaWRlci5wcm90b3R5cGUuX29uRHJhZ1N0YXJ0ID0gZnVuY3Rpb24oZHJhZ1N0YXJ0RXZlbnQpIHtcbiAgICB0aGlzLl9wcmVwYXJlQ29sb3JTbGlkZXJGb3JNb3VzZUV2ZW50KGRyYWdTdGFydEV2ZW50KTtcbn07XG5cbi8qKlxuICogRHJhZyBldmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge0RyYWcjZHJhZ30gZHJhZ0V2ZW50IC0gZHJhZyBldmVudCBkYXRhXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX29uRHJhZyA9IGZ1bmN0aW9uKGRyYWdFdmVudCkge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuX2RyYWdEYXRhQ2FjaGUsXG4gICAgICAgIG1vdXNlUG9zID0gZG9tZXZlbnQuZ2V0TW91c2VQb3NpdGlvbihkcmFnRXZlbnQub3JpZ2luRXZlbnQsIGNhY2hlLnBhcmVudEVsZW1lbnQpO1xuXG4gICAgaWYgKGNhY2hlLmlzQ29sb3JTbGlkZXIpIHtcbiAgICAgICAgdGhpcy5fbW92ZUNvbG9yU2xpZGVyQnlQb3NpdGlvbihtb3VzZVBvc1swXSwgbW91c2VQb3NbMV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX21vdmVIdWVCeVBvc2l0aW9uKG1vdXNlUG9zWzFdKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIERyYWcjZHJhZ0VuZCBldmVudCBoYW5kbGVyXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX29uRHJhZ0VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2RyYWdEYXRhQ2FjaGUgPSBudWxsO1xufTtcblxudXRpbC5DdXN0b21FdmVudHMubWl4aW4oU2xpZGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZXI7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBtb2R1bGUgZm9yIG1hbmlwdWxhdGUgU1ZHIG9yIFZNTCBvYmplY3RcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIFBBUlNFX1RSQU5TTEFURV9OVU1fUkVHRVggPSAvW1xcLlxcLTAtOV0rL2c7XG52YXIgU1ZHX0hVRV9IQU5ETEVfUklHSFRfUE9TID0gLTY7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG52YXIgc3Zndm1sID0ge1xuICAgIC8qKlxuICAgICAqIFJldHVybiB0cnVlIHdoZW4gYnJvd3NlciBpcyBiZWxvdyBJRTguXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IGlzIG9sZCBicm93c2VyP1xuICAgICAqL1xuICAgIGlzT2xkQnJvd3NlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfaXNPbGRCcm93c2VyID0gc3Zndm1sLl9pc09sZEJyb3dzZXI7XG5cbiAgICAgICAgaWYgKCF1dGlsLmlzRXhpc3R5KF9pc09sZEJyb3dzZXIpKSB7XG4gICAgICAgICAgICBzdmd2bWwuX2lzT2xkQnJvd3NlciA9IF9pc09sZEJyb3dzZXIgPSB1dGlsLmJyb3dzZXIubXNpZSAmJiB1dGlsLmJyb3dzZXIudmVyc2lvbiA8IDk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gX2lzT2xkQnJvd3NlcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHRyYW5zbGF0ZSB0cmFuc2Zvcm0gdmFsdWVcbiAgICAgKiBAcGFyYW0ge1NWR3xWTUx9IG9iaiAtIHN2ZyBvciB2bWwgb2JqZWN0IHRoYXQgd2FudCB0byBrbm93IHRyYW5zbGF0ZSB4LCB5XG4gICAgICogQHJldHVybnMge251bWJlcltdfSB0cmFuc2xhdGVkIGNvb3JkaW5hdGVzIFt4LCB5XVxuICAgICAqL1xuICAgIGdldFRyYW5zbGF0ZVhZOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgdmFyIHRlbXA7XG5cbiAgICAgICAgaWYgKHN2Z3ZtbC5pc09sZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgdGVtcCA9IG9iai5zdHlsZTtcbiAgICAgICAgICAgIHJldHVybiBbcGFyc2VGbG9hdCh0ZW1wLnRvcCksIHBhcnNlRmxvYXQodGVtcC5sZWZ0KV07XG4gICAgICAgIH1cblxuICAgICAgICB0ZW1wID0gb2JqLmdldEF0dHJpYnV0ZSgndHJhbnNmb3JtJyk7XG5cbiAgICAgICAgaWYgKCF0ZW1wKSB7XG4gICAgICAgICAgICByZXR1cm4gWzAsIDBdO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0ZW1wID0gdGVtcC5tYXRjaChQQVJTRV9UUkFOU0xBVEVfTlVNX1JFR0VYKTtcblxuICAgICAgICAvLyBuZWVkIGNhdXRpb24gZm9yIGRpZmZlcmVuY2Ugb2YgVk1MLCBTVkcgY29vcmRpbmF0ZXMgc3lzdGVtLlxuICAgICAgICAvLyB0cmFuc2xhdGUgY29tbWFuZCBuZWVkIFggY29vcmRzIGluIGZpcnN0IHBhcmFtZXRlci4gYnV0IFZNTCBpcyB1c2UgQ1NTIGNvb3JkaW5hdGUgc3lzdGVtKHRvcCwgbGVmdClcbiAgICAgICAgcmV0dXJuIFtwYXJzZUZsb2F0KHRlbXBbMV0pLCBwYXJzZUZsb2F0KHRlbXBbMF0pXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRyYW5zbGF0ZSB0cmFuc2Zvcm0gdmFsdWVcbiAgICAgKiBAcGFyYW0ge1NWR3xWTUx9IG9iaiAtIFNWRyBvciBWTUwgb2JqZWN0IHRvIHNldHRpbmcgdHJhbnNsYXRlIHRyYW5zZm9ybS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIHRyYW5zbGF0ZSBYIHZhbHVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSB0cmFuc2xhdGUgWSB2YWx1ZVxuICAgICAqL1xuICAgIHNldFRyYW5zbGF0ZVhZOiBmdW5jdGlvbihvYmosIHgsIHkpIHtcbiAgICAgICAgaWYgKHN2Z3ZtbC5pc09sZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgb2JqLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgICAgICAgIG9iai5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIHggKyAnLCcgKyB5ICsgJyknKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgdHJhbnNsYXRlIG9ubHkgWSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7U1ZHfFZNTH0gb2JqIC0gU1ZHIG9yIFZNTCBvYmplY3QgdG8gc2V0dGluZyB0cmFuc2xhdGUgdHJhbnNmb3JtLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdHJhbnNsYXRlIFkgdmFsdWVcbiAgICAgKi9cbiAgICBzZXRUcmFuc2xhdGVZOiBmdW5jdGlvbihvYmosIHkpIHtcbiAgICAgICAgaWYgKHN2Z3ZtbC5pc09sZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgb2JqLnN0eWxlLnRvcCA9IHkgKyAncHgnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgU1ZHX0hVRV9IQU5ETEVfUklHSFRfUE9TICsgJywnICsgeSArICcpJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHN0cm9rZSBjb2xvciB0byBTVkcgb3IgVk1MIG9iamVjdFxuICAgICAqIEBwYXJhbSB7U1ZHfFZNTH0gb2JqIC0gU1ZHIG9yIFZNTCBvYmplY3QgdG8gc2V0dGluZyBzdHJva2UgY29sb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3JTdHIgLSBjb2xvciBzdHJpbmdcbiAgICAgKi9cbiAgICBzZXRTdHJva2VDb2xvcjogZnVuY3Rpb24ob2JqLCBjb2xvclN0cikge1xuICAgICAgICBpZiAoc3Zndm1sLmlzT2xkQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBvYmouc3Ryb2tlY29sb3IgPSBjb2xvclN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsIGNvbG9yU3RyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZ3JhZGllbnQgc3RvcCBjb2xvciB0byBTVkcsIFZNTCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtTVkd8Vk1MfSBvYmogLSBTVkcsIFZNTCBvYmplY3QgdG8gYXBwbHlpbmcgZ3JhZGllbnQgc3RvcCBjb2xvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvclN0ciAtIGNvbG9yIHN0cmluZ1xuICAgICAqL1xuICAgIHNldEdyYWRpZW50Q29sb3JTdG9wOiBmdW5jdGlvbihvYmosIGNvbG9yU3RyKSB7XG4gICAgICAgIGlmIChzdmd2bWwuaXNPbGRCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIG9iai5jb2xvciA9IGNvbG9yU3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqLnNldEF0dHJpYnV0ZSgnc3RvcC1jb2xvcicsIGNvbG9yU3RyKTtcbiAgICAgICAgfVxuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdmd2bWw7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBQYWxldHRlIHZpZXcgdGVtcGxhdGVcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBsYXlvdXQgPSBbXG4nPHVsIGNsYXNzPVwie3tjc3NQcmVmaXh9fWNsZWFyZml4XCI+e3tjb2xvckxpc3R9fTwvdWw+Jyxcbic8ZGl2IGNsYXNzPVwie3tjc3NQcmVmaXh9fWNsZWFyZml4XCIgc3R5bGU9XCJvdmVyZmxvdzpoaWRkZW5cIj4nLFxuICAgICc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXBhbGV0dGUtdG9nZ2xlLXNsaWRlclwiIHZhbHVlPVwie3tkZXRhaWxUeHR9fVwiIC8+JyxcbiAgICAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19cGFsZXR0ZS1oZXhcIiB2YWx1ZT1cInt7Y29sb3J9fVwiIG1heGxlbmd0aD1cIjdcIiAvPicsXG4gICAgJzxzcGFuIGNsYXNzPVwie3tjc3NQcmVmaXh9fXBhbGV0dGUtcHJldmlld1wiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7e2NvbG9yfX07Y29sb3I6e3tjb2xvcn19XCI+e3tjb2xvcn19PC9zcGFuPicsXG4nPC9kaXY+J10uam9pbignXFxuJyk7XG5cbnZhciBpdGVtID0gJzxsaT48aW5wdXQgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19cGFsZXR0ZS1idXR0b257e3NlbGVjdGVkfX1cIiB0eXBlPVwiYnV0dG9uXCIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnt7Y29sb3J9fTtjb2xvcjp7e2NvbG9yfX1cIiB0aXRsZT1cInt7Y29sb3J9fVwiIHZhbHVlPVwie3tjb2xvcn19XCIgLz48L2xpPic7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGxheW91dDogbGF5b3V0LFxuICAgIGl0ZW06IGl0ZW1cbn07XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgU2xpZGVyIHRlbXBsYXRlXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcblxudmFyIGxheW91dCA9IFtcbic8ZGl2IGNsYXNzPVwie3tjc3NQcmVmaXh9fXNsaWRlci1sZWZ0IHt7Y3NzUHJlZml4fX1zbGlkZXItcGFydFwiPnt7c2xpZGVyfX08L2Rpdj4nLFxuJzxkaXYgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c2xpZGVyLXJpZ2h0IHt7Y3NzUHJlZml4fX1zbGlkZXItcGFydFwiPnt7aHVlYmFyfX08L2Rpdj4nXG5dLmpvaW4oJ1xcbicpO1xuXG52YXIgU1ZHU2xpZGVyID0gWyc8c3ZnIGNsYXNzPVwie3tjc3NQcmVmaXh9fXN2ZyB7e2Nzc1ByZWZpeH19c3ZnLXNsaWRlclwiPicsXG4gICAgJzxkZWZzPicsXG4gICAgICAgICc8bGluZWFyR3JhZGllbnQgaWQ9XCJ7e2Nzc1ByZWZpeH19c3ZnLWZpbGwtY29sb3JcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMTAwJVwiIHkyPVwiMCVcIj4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMjU1LDI1NSlcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3AgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c2xpZGVyLWJhc2Vjb2xvclwiIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwwLDApXCIgLz4nLFxuICAgICAgICAnPC9saW5lYXJHcmFkaWVudD4nLFxuICAgICAgICAnPGxpbmVhckdyYWRpZW50IGlkPVwie3tjc3NQcmVmaXh9fXN2bi1maWxsLWJsYWNrXCIgeDE9XCIwJVwiIHkxPVwiMCVcIiB4Mj1cIjAlXCIgeTI9XCIxMDAlXCI+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0eWxlPVwic3RvcC1jb2xvcjpyZ2IoMCwwLDApO3N0b3Atb3BhY2l0eTowXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdHlsZT1cInN0b3AtY29sb3I6cmdiKDAsMCwwKTtzdG9wLW9wYWNpdHk6MVwiIC8+JyxcbiAgICAgICAgJzwvbGluZWFyR3JhZGllbnQ+JyxcbiAgICAnPC9kZWZzPicsXG4gICAgJzxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwidXJsKCN7e2Nzc1ByZWZpeH19c3ZnLWZpbGwtY29sb3IpXCI+PC9yZWN0PicsXG4gICAgJzxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwidXJsKCN7e2Nzc1ByZWZpeH19c3ZuLWZpbGwtYmxhY2spXCI+PC9yZWN0PicsXG4gICAgJzxwYXRoIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgwLDApXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c2xpZGVyLWhhbmRsZVwiIGQ9XCJNMCA3LjUgTDE1IDcuNSBNNy41IDE1IEw3LjUgMCBNMiA3IGE1LjUgNS41IDAgMSAxIDAgMSBaXCIgc3Ryb2tlPVwiYmxhY2tcIiBzdHJva2Utd2lkdGg9XCIwLjc1XCIgZmlsbD1cIm5vbmVcIiAvPicsXG4nPC9zdmc+J10uam9pbignXFxuJyk7XG5cbnZhciBWTUxTbGlkZXIgPSBbJzxkaXYgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sLXNsaWRlclwiPicsXG4gICAgJzx2OnJlY3Qgc3Ryb2tlY29sb3I9XCJub25lXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX12bWwtc2xpZGVyLWJnXCI+JyxcbiAgICAgICc8djpmaWxsIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19c2xpZGVyLWJhc2Vjb2xvclwiIHR5cGU9XCJncmFkaWVudFwiIG1ldGhvZD1cIm5vbmVcIiBjb2xvcj1cIiNmZjAwMDBcIiBjb2xvcjI9XCIjZmZmXCIgYW5nbGU9XCI5MFwiIC8+JyxcbiAgICAnPC92OnJlY3Q+JyxcbiAgICAnPHY6cmVjdCBzdHJva2Vjb2xvcj1cIiNjY2NcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fXZtbC1zbGlkZXItYmdcIj4nLFxuICAgICAgICAnPHY6ZmlsbCB0eXBlPVwiZ3JhZGllbnRcIiBtZXRob2Q9XCJub25lXCIgY29sb3I9XCJibGFja1wiIGNvbG9yMj1cIndoaXRlXCIgbzpvcGFjaXR5Mj1cIjAlXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sXCIgLz4nLFxuICAgICc8L3Y6cmVjdD4nLFxuICAgICc8djpzaGFwZSBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fXNsaWRlci1oYW5kbGVcIiBjb29yZHNpemU9XCIxIDFcIiBzdHlsZT1cIndpZHRoOjFweDtoZWlnaHQ6MXB4O1wiJyArXG4gICAgICAgICdwYXRoPVwibSAwLDcgbCAxNCw3IG0gNywxNCBsIDcsMCBhciAxMiwxMiAyLDIgelwiIGZpbGxlZD1cImZhbHNlXCIgc3Ryb2tlZD1cInRydWVcIiAvPicsXG4nPC9kaXY+J10uam9pbignXFxuJyk7XG5cbnZhciBTVkdIdWViYXIgPSBbJzxzdmcgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19c3ZnIHt7Y3NzUHJlZml4fX1zdmctaHVlYmFyXCI+JyxcbiAgICAnPGRlZnM+JyxcbiAgICAgICAgJzxsaW5lYXJHcmFkaWVudCBpZD1cImdcIiB4MT1cIjAlXCIgeTE9XCIwJVwiIHgyPVwiMCVcIiB5Mj1cIjEwMCVcIj4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMCwwKVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIxNi42NjYlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMjU1LDApXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjMzLjMzMyVcIiBzdG9wLWNvbG9yPVwicmdiKDAsMjU1LDApXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjUwJVwiIHN0b3AtY29sb3I9XCJyZ2IoMCwyNTUsMjU1KVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCI2Ni42NjYlXCIgc3RvcC1jb2xvcj1cInJnYigwLDAsMjU1KVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCI4My4zMzMlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMCwyNTUpXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIG9mZnNldD1cIjEwMCVcIiBzdG9wLWNvbG9yPVwicmdiKDI1NSwwLDApXCIgLz4nLFxuICAgICAgICAnPC9saW5lYXJHcmFkaWVudD4nLFxuICAgICc8L2RlZnM+JyxcbiAgICAnPHJlY3Qgd2lkdGg9XCIxOHB4XCIgaGVpZ2h0PVwiMTAwJVwiIGZpbGw9XCJ1cmwoI2cpXCI+PC9yZWN0PicsXG4gICAgJzxwYXRoIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSgtNiwtMylcIiBjbGFzcz1cInt7Y3NzUHJlZml4fX1odWViYXItaGFuZGxlXCIgZD1cIk0wIDAgTDQgNCBMMCA4IEwwIDAgWlwiIGZpbGw9XCJibGFja1wiIHN0cm9rZT1cIm5vbmVcIiAvPicsXG4nPC9zdmc+J10uam9pbignXFxuJyk7XG5cbnZhciBWTUxIdWViYXIgPSBbJzxkaXYgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sLWh1ZWJhclwiPicsXG4gICAgJzx2OnJlY3Qgc3Ryb2tlY29sb3I9XCIjY2NjXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX12bWwtaHVlYmFyLWJnXCI+JyxcbiAgICAgICAgJzx2OmZpbGwgdHlwZT1cImdyYWRpZW50XCIgbWV0aG9kPVwibm9uZVwiIGNvbG9ycz1cIicgK1xuICAgICAgICAnMCUgcmdiKDI1NSwwLDApLCAxNi42NjYlIHJnYigyNTUsMjU1LDApLCAzMy4zMzMlIHJnYigwLDI1NSwwKSwgNTAlIHJnYigwLDI1NSwyNTUpLCA2Ni42NjYlIHJnYigwLDAsMjU1KSwgODMuMzMzJSByZ2IoMjU1LDAsMjU1KSwgMTAwJSByZ2IoMjU1LDAsMCknICtcbiAgICAgICAgJ1wiIGFuZ2xlPVwiMTgwXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sXCIgLz4nLFxuICAgICc8L3Y6cmVjdD4nLFxuICAgICc8djpzaGFwZSBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fWh1ZWJhci1oYW5kbGVcIiBjb29yZHNpemU9XCIxIDFcIiBzdHlsZT1cIndpZHRoOjFweDtoZWlnaHQ6MXB4O3Bvc2l0aW9uOmFic29sdXRlO3otaW5kZXg6MTtyaWdodDoyMnB4O3RvcDotM3B4O1wiJyArIFxuICAgICAgICAncGF0aD1cIm0gMCwwIGwgNCw0IGwgMCw4IGwgMCwwIHpcIiBmaWxsZWQ9XCJ0cnVlXCIgZmlsbGNvbG9yPVwiYmxhY2tcIiBzdHJva2VkPVwiZmFsc2VcIiAvPicsXG4nPC9kaXY+J10uam9pbignXFxuJyk7XG5cbnZhciBpc09sZEJyb3dzZXIgPSB1dGlsLmJyb3dzZXIubXNpZSAmJiAodXRpbC5icm93c2VyLnZlcnNpb24gPCA5KTtcblxuaWYgKGlzT2xkQnJvd3Nlcikge1xuICAgIGdsb2JhbC5kb2N1bWVudC5uYW1lc3BhY2VzLmFkZCgndicsICd1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOnZtbCcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBsYXlvdXQ6IGxheW91dCxcbiAgICBzbGlkZXI6IGlzT2xkQnJvd3NlciA/IFZNTFNsaWRlciA6IFNWR1NsaWRlcixcbiAgICBodWViYXI6IGlzT2xkQnJvd3NlciA/IFZNTEh1ZWJhciA6IFNWR0h1ZWJhclxufTtcbiJdfQ==
