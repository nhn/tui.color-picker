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
/*!code-snippet v1.0.4 | NHN Entertainment*/
/**********
 * array.js
 **********/

/**
 * @fileoverview This module has some functions for handling array.
 * @author NHN Ent.
 *         FE Development Team <jiung.kang@nhnent.com>
 * @dependency type.js
 */

(function(tui) {
    'use strict';
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    var aps = Array.prototype.slice;

    /**
     * Generate an integer Array containing an arithmetic progression.
     * @param {number} start
     * @param {number} stop
     * @param {number} step
     * @memberof tui.util
     * @returns {Array}
     * @example
     *
     *   var arr = tui.util.range(5);
     *   console.log(arr); // [0,1,2,3,4]
     *
     *   arr = tui.util.range(1, 5);
     *   console.log(arr); // [1,2,3,4]
     *
     *   arr = tui.util.range(2, 10, 2);
     *   console.log(arr); // [2,4,6,8]
     *
     *   arr = tui.util.range(10, 2, -2);
     *   console.log(arr); // [10,8,6,4]
     */
    var range = function(start, stop, step) {
        var arr = [],
            flag;

        if (tui.util.isUndefined(stop)) {
            stop = start || 0;
            start = 0;
        }

        step = step || 1;
        flag = step < 0 ? -1 : 1;
        stop *= flag;

        for(; start * flag < stop; start += step) {
            arr.push(start);
        }

        return arr;
    };

    /**
     * Zip together multiple lists into a single array
     * @param {...Array}
     * @memberof tui.util
     * @returns {Array}
     * @example
     *
     *   var result = tui.util.zip([1, 2, 3], ['a', 'b','c'], [true, false, true]);
     *
     *   console.log(result[0]); // [1, 'a', true]
     *   console.log(result[1]); // [2, 'b', false]
     *   console.log(result[2]); // [3, 'c', true]
     */
    var zip = function() {
        var arr2d = aps.call(arguments),
            result = [];

        tui.util.forEach(arr2d, function(arr) {
            tui.util.forEach(arr, function(value, index) {
                if (!result[index]) {
                    result[index] = [];
                }
                result[index].push(value);
            });
        });

        return result;
    };

    tui.util.range = range;
    tui.util.zip = zip;
})(window.tui);

/**********
 * browser.js
 **********/

/**
 * @fileoverview This module detects the kind of well-known browser and version.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @namespace tui.util
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * This object has an information that indicate the kind of browser.<br>
     * The list below is a detectable browser list.
     *  - ie7 ~ ie11
     *  - chrome
     *  - firefox
     *  - safari
     * @memberof tui.util
     * @example
     *  tui.util.browser.chrome === true;    // chrome
     *  tui.util.browser.firefox === true;    // firefox
     *  tui.util.browser.safari === true;    // safari
     *  tui.util.browser.msie === true;    // IE
     *  tui.util.browser.other === true;    // other browser
     *  tui.util.browser.version;    // browser version
     */
    var browser = {
        chrome: false,
        firefox: false,
        safari: false,
        msie: false,
        others: false,
        version: 0
    };

    var nav = window.navigator,
        appName = nav.appName.replace(/\s/g, '_'),
        userAgent = nav.userAgent;

    var rIE = /MSIE\s([0-9]+[.0-9]*)/,
        rIE11 = /Trident.*rv:11\./,
        versionRegex = {
            'firefox': /Firefox\/(\d+)\./,
            'chrome': /Chrome\/(\d+)\./,
            'safari': /Version\/([\d\.]+)\sSafari\/(\d+)/
        };

    var key, tmp;

    var detector = {
        'Microsoft_Internet_Explorer': function() {
            // ie8 ~ ie10
            browser.msie = true;
            browser.version = parseFloat(userAgent.match(rIE)[1]);
        },
        'Netscape': function() {
            var detected = false;

            if (rIE11.exec(userAgent)) {
                browser.msie = true;
                browser.version = 11;
            } else {
                for (key in versionRegex) {
                    if (versionRegex.hasOwnProperty(key)) {
                        tmp = userAgent.match(versionRegex[key]);
                        if (tmp && tmp.length > 1) {
                            browser[key] = detected = true;
                            browser.version = parseFloat(tmp[1] || 0);
                            break;
                        }
                    }
                }
            }
            if (!detected) {
                browser.others = true;
            }
        }
    };

    detector[appName]();
    tui.util.browser = browser;
})(window.tui);

/**********
 * collection.js
 **********/

/**
 * @fileoverview This module has some functions for handling object as collection.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js, object.js
 */

(function(tui) {
    'use strict';
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * This variable saves whether the 'indexOf' method is in Array.prototype or not.<br>
     * And it will be checked only once when the page is loaded.
     * @type {boolean}
     */
    var hasIndexOf = !!Array.prototype.indexOf;

    /**
     * Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.<br>
     * If the callback function returns false, the loop will be stopped.<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - The value of the element
     *  - The index of the element
     *  - The array(or Array-like object) being traversed
     * @param {Array} arr The array(or Array-like object) that will be traversed
     * @param {function} iteratee Callback function
     * @param {Object} [context] Context(this) of callback function
     * @memberof tui.util
     * @example
     *  var sum = 0;
     *
     *  forEachArray([1,2,3], function(value){
     *      sum += value;
     *   });
     *  alert(sum); // 6
     */
    function forEachArray(arr, iteratee, context) {
        var index = 0,
            len = arr.length;

        context = context || null;

        for (; index < len; index++) {
            if (iteratee.call(context, arr[index], index, arr) === false) {
                break;
            }
        }
    }


    /**
     * Execute the provided callback once for each property of object which actually exist.<br>
     * If the callback function returns false, the loop will be stopped.<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - The value of the property
     *  - The name of the property
     *  - The object being traversed
     * @param {Object} obj The object that will be traversed
     * @param {function} iteratee  Callback function
     * @param {Object} [context] Context(this) of callback function
     * @memberof tui.util
     * @example
     *  var sum = 0;
     *
     *  forEachOwnProperties({a:1,b:2,c:3}, function(value){
     *      sum += value;
     *  });
     *  alert(sum); // 6
     **/
    function forEachOwnProperties(obj, iteratee, context) {
        var key;

        context = context || null;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (iteratee.call(context, obj[key], key, obj) === false) {
                    break;
                }
            }
        }
    }

    /**
     * Execute the provided callback once for each property of object(or element of array) which actually exist.<br>
     * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).<br>
     * If the callback function returns false, the loop will be stopped.<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - The value of the property(or The value of the element)
     *  - The name of the property(or The index of the element)
     *  - The object being traversed
     * @param {Object} obj The object that will be traversed
     * @param {function} iteratee Callback function
     * @param {Object} [context] Context(this) of callback function
     * @memberof tui.util
     * @example
     *  //ex1
     *  var sum = 0;
     *
     *  forEach([1,2,3], function(value){
     *      sum += value;
     *  });
     *  alert(sum); // 6
     *
     *  //ex2 - In case of Array-like object
     *  function sum(){
     *      var factors = Array.prototype.slice.call(arguments);
     *      forEach(factors, function(value){
     *           //......
     *      });
     *  }
     */
    function forEach(obj, iteratee, context) {
        if (tui.util.isArray(obj)) {
            tui.util.forEachArray(obj, iteratee, context);
        } else {
            tui.util.forEachOwnProperties(obj, iteratee, context);
        }
    }

    /**
     * Execute the provided callback function once for each element in an array, in order, and constructs a new array from the results.<br>
     * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of forEach example)<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - The value of the property(or The value of the element)
     *  - The name of the property(or The index of the element)
     *  - The object being traversed
     * @param {Object} obj The object that will be traversed
     * @param {function} iteratee Callback function
     * @param {Object} [context] Context(this) of callback function
     * @returns {Array} A new array composed of returned values from callback function
     * @memberof tui.util
     * @example
     *  var result = map([0,1,2,3], function(value) {
     *      return value + 1;
     *  });
     *
     *  alert(result);  // 1,2,3,4
     */
    function map(obj, iteratee, context) {
        var resultArray = [];

        context = context || null;

        tui.util.forEach(obj, function() {
            resultArray.push(iteratee.apply(context, arguments));
        });

        return resultArray;
    }

    /**
     * Execute the callback function once for each element present in the array(or Array-like object or plain object).<br>
     * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of forEach example)<br>
     * Callback function(iteratee) is invoked with four arguments:
     *  - The previousValue
     *  - The currentValue
     *  - The index
     *  - The object being traversed
     * @param {Object} obj The object that will be traversed
     * @param {function} iteratee Callback function
     * @param {Object} [context] Context(this) of callback function
     * @returns {*} The result value
     * @memberof tui.util
     * @example
     *  var result = reduce([0,1,2,3], function(stored, value) {
     *      return stored + value;
     *  });
     *
     *  alert(result); // 6
     */
    function reduce(obj, iteratee, context) {
        var keys,
            index = 0,
            length,
            store;

        context = context || null;

        if (!tui.util.isArray(obj)) {
            keys = tui.util.keys(obj);
        }

        length = keys ? keys.length : obj.length;

        store = obj[keys ? keys[index++] : index++];

        for (; index < length; index++) {
            store = iteratee.call(context, store, obj[keys ? keys[index] : index]);
        }

        return store;
    }
    /**
     * Transform the Array-like object to Array.<br>
     * In low IE (below 8), Array.prototype.slice.call is not perfect. So, try-catch statement is used.
     * @param {*} arrayLike Array-like object
     * @return {Array} Array
     * @memberof tui.util
     * @example
     *  var arrayLike = {
     *      0: 'one',
     *      1: 'two',
     *      2: 'three',
     *      3: 'four',
     *      length: 4
     *  };
     *  var result = toArray(arrayLike);
     *
     *  alert(result instanceof Array); // true
     *  alert(result); // one,two,three,four
     */
    function toArray(arrayLike) {
        var arr;
        try {
            arr = Array.prototype.slice.call(arrayLike);
        } catch (e) {
            arr = [];
            forEachArray(arrayLike, function(value) {
                arr.push(value);
            });
        }
        return arr;
    }

    /**
     * Create a new array or plain object with all elements(or properties) that pass the test implemented by the provided function.<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - The value of the property(or The value of the element)
     *  - The name of the property(or The index of the element)
     *  - The object being traversed
     * @param {Object} obj Object(plain object or Array) that will be traversed
     * @param {function} iteratee Callback function
     * @param {Object} [context] Context(this) of callback function
     * @returns {Object} plain object or Array
     * @memberof tui.util
     * @example
     *  var result1 = filter([0,1,2,3], function(value) {
     *      return (value % 2 === 0);
     *  });
     *  alert(result1); // 0,2
     *
     *  var result2 = filter({a : 1, b: 2, c: 3}, function(value) {
     *      return (value % 2 !== 0);
     *  });
     *  alert(result2.a); // 1
     *  alert(result2.b); // undefined
     *  alert(result2.c); // 3
     */
    var filter = function(obj, iteratee, context) {
        var result,
            add;

        context = context || null;

        if (!tui.util.isObject(obj) || !tui.util.isFunction(iteratee)) {
            throw new Error('wrong parameter');
        }

        if (tui.util.isArray(obj)) {
            result = [];
            add = function(result, args) {
                result.push(args[0]);
            };
        } else {
            result = {};
            add = function(result, args) {
                result[args[1]] = args[0];
            };
        }

        tui.util.forEach(obj, function() {
            if (iteratee.apply(context, arguments)) {
                add(result, arguments);
            }
        }, context);

        return result;
    };

    /**
     * Returns the first index at which a given element can be found in the array from start index(default 0), or -1 if it is not present.<br>
     * It compares searchElement to elements of the Array using strict equality (the same method used by the ===, or triple-equals, operator).
     * @param {*} searchElement Element to locate in the array
     * @param {Array} array Array that will be traversed.
     * @param {number} startIndex Start index in array for searching (default 0)
     * @memberof tui.util
     * @return {number} the First index at which a given element, or -1 if it is not present
     * @example
     *
     *   var arr = ['one', 'two', 'three', 'four'],
     *       idx1,
     *       idx2;
     *
     *   idx1 = tui.util.inArray('one', arr, 3);
     *   alert(idx1); // -1
     *
     *   idx2 = tui.util.inArray('one', arr);
     *   alert(idx2); // 0
     */
    var inArray = function(searchElement, array, startIndex) {
        if (!tui.util.isArray(array)) {
            return -1;
        }

        if (hasIndexOf) {
            return Array.prototype.indexOf.call(array, searchElement, startIndex);
        }

        var i,
            length = array.length;

        // set startIndex
        if (tui.util.isUndefined(startIndex)) {
            startIndex = 0;
        } else if (startIndex >= length || startIndex < 0) {
            return -1;
        }

        // search
        for (i = startIndex; i < length; i++) {
            if (array[i] === searchElement) {
                return i;
            }
        }

        return -1;
    };

    /**
     * fetching a property
     * @param {Array} arr target collection
     * @param {String|Number} property property name
     * @memberof tui.util
     * @returns {Array}
     * @example
     *   var objArr = [
     *         {'abc': 1, 'def': 2, 'ghi': 3},
     *         {'abc': 4, 'def': 5, 'ghi': 6},
     *         {'abc': 7, 'def': 8, 'ghi': 9}
     *       ],
     *       arr2d = [
     *         [1, 2, 3],
     *         [4, 5, 6],
     *         [7, 8, 9]
     *       ],
     *       result;
     *
     *   result = tui.util.pluck(objArr, 'abc');
     *   console.log(result) // [1, 4, 7]
     *
     *   result = tui.util.pluck(arr2d, 2);
     *   console.log(result) // [3, 6, 9]
     */
    var pluck = function(arr, property) {
        var result = tui.util.map(arr, function(item) {
            return item[property];
        });
        return result;
    };

    tui.util.forEachOwnProperties = forEachOwnProperties;
    tui.util.forEachArray = forEachArray;
    tui.util.forEach = forEach;
    tui.util.toArray = toArray;
    tui.util.map = map;
    tui.util.reduce = reduce;
    tui.util.filter = filter;
    tui.util.inArray = inArray;
    tui.util.pluck = pluck;

})(window.tui);

/**********
 * customEvent.js
 **********/

/**
 * @fileoverview
 *  This module provides some functions for custom events.<br>
 *  And it is implemented in the observer design pattern.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js, collection.js object.js
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }

    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * A unit of event handler item.
     * @ignore
     * @typedef {Object} handlerItem
     * @property {function} fn - event handler
     * @property {*} ctx - context of event handler
     */

    /**
     * A data structure for storing handlerItems bound with a specific context
     *  and is a unit item of ctxEvents.<br>
     * Handlers in this item, will be executed with same event.
     * @ignore
     * @typedef {Object.<string, handlerItem>} ctxEventsItem
     * @example
     *  ctxEventsItem = {
     *      1_1: {
     *          fn: function(){...},
     *          ctx: context1
     *      },
     *      2_1: {
     *          fn: function(){...},
     *          ctx: context1
     *      }
     *  }
     */

    /**
     * A data structure for storing ctxEventsItem and length for each event(or event name).
     * @ignore
     * @typedef {Object.<string, (ctxEventsItem|number)>} ctxEvents
     * @example
     *  ctxEvents = {
     *      eventName1_idx: {
     *          1_1: {
     *              fn: function(){...},
     *              ctx: context1
     *          },
     *          2_1: {
     *              fn: function(){...},
     *              ctx: context1
     *          }
     *      },
     *      eventName1_len: 2,
     *      eventName2_idx: {
     *          3_2: {
     *              fn: function(){...},
     *              ctx: context2
     *          },
     *          4_2: {
     *              fn: function(){...},
     *              ctx: context2
     *          }
     *      },
     *      eventName2_len: 2
     *  };
     */


    /**
     * @constructor
     * @memberof tui.util
     */
    function CustomEvents() {
        /**
         * Caching a data structure that has normal event handlers which are not bound with a specific context.
         * @type {object.<string, handlerItem[]>}
         * @private
         */
        this._events = null;

        /**
         * Caching a {ctxEvents}
         * @type {ctxEvents}
         * @private
         */
        this._ctxEvents = null;
    }


    /**********
     * static
     **********/

    /**
     * Use for making a constructor to be able to do CustomEvent's functions.
     * @param {function} func - Constructor
     * @example
     *  function Model() {
     *      this.name = '';
     *  }
     *  tui.util.CustomEvents.mixin(Model);
     *
     *  var model = new Model();
     *  model.on('change', function() { this.name = 'model'; }, this);
     *  model.fire('change');
     *  alert(model.name); // 'model';
     */
    CustomEvents.mixin = function(func) {
        tui.util.extend(func.prototype, CustomEvents.prototype);
    };

    /**********
     * private
     **********/

    /**
     * Work similarly to Array.prototype.forEach(),
     *  however does Array.prototype.splice() additionally.<br>
     * Callback(iteratee) function is invoked with four arguments:
     *  - The value of the element
     *  - The index of the element
     *  - The array being traversed
     *  - A special callback function that decreases the length of array
     * @param {Array} arr - Array that will be traversed
     * @param {function} iteratee - Callback function
     */
    CustomEvents.prototype._forEachArraySplice = function(arr, iteratee) {
        var i,
            len,
            item,
            decrease = function() {
                arr.splice(i, 1);
                len -= 1;
                i -= 1;
            };

        if (!tui.util.isExisty(arr) || !tui.util.isArray(arr)) {
            return;
        }

        for (i = 0, len = arr.length; i < len; i++) {
            item = arr[i];

            if (iteratee(item, i, arr, decrease) === false) {
                return;
            }
        }
    };

    /**********
     * context event handler
     **********/

    /**
     * Execute the callback once for each ctxEventsItem.<br>
     * Callback function(iteratee) is invoked with three arguments:
     *  - {ctxEventsItem} A unit item of ctxEvents
     *  - {string} A key (ex - 'eventName_idx' or 'eventName_len')
     *  - {ctxEvents} A ctxEvents being traversed
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachCtxEvents = function(iteratee) {
        var events = this._ctxEvents;
        tui.util.forEachOwnProperties(events, iteratee);
    };

    /**
     * Execute the callback once
     *  for each handler item that is value of the key including a specific string(=id, arguments[1]).<br>
     * Callback function(iteratee) is invoked with two arguments:
     *  - handlerItem
     *  - handlerItemId
     * @param {ctxEventsItem} ctxEventsItem - A data structure storing handlerItems.
     * @param {string} id - An id of handler for searching
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachCtxHandlerItemByContainId = function(ctxEventsItem, id, iteratee) {
        tui.util.forEachOwnProperties(ctxEventsItem, function(handlerItem, handlerItemId) {
            if (handlerItemId.indexOf(id) > -1) {
                iteratee(handlerItem, handlerItemId);
            }
        });
    };

    /**
     * Execute the callback once
     *  for each case of when the provided handler(arguments[0]) is equal to a handler in ctxEventsItem.<br>
     * Callback function(iteratee) is invoked with four arguments:
     *  - handlerItem
     *  - handlerItemId
     *  - ctxEventsItem
     *  - eventKey, A Name of custom event (ex - 'eventName_idx')
     * @param {function} handler - Event handler
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachCtxEventByHandler = function(handler, iteratee) {
        var handlerId = tui.util.stamp(handler),
            eachById = this._eachCtxHandlerItemByContainId;

        this._eachCtxEvents(function(ctxEventsItem, eventKey) {
            eachById(ctxEventsItem, handlerId, function(handlerItem, handlerItemId) {
                iteratee(handlerItem, handlerItemId, ctxEventsItem, eventKey);
            });
        });
    };

    /**
     * Execute the callback once
     *  for each case of when the provided context(arguments[0]) is equal to a context in ctxEventsItem.<br>
     * Callback function(iteratee) is invoked with four arguments:
     *  - handlerItem
     *  - handlerItemId
     *  - ctxEventsItem
     *  - eventKey, A Name of custom event with postfix (ex - 'eventName_idx')
     * @param {*} context - Context for searching
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachCtxEventByContext = function(context, iteratee) {
        var contextId = tui.util.stamp(context),
            eachById = this._eachCtxHandlerItemByContainId;

        this._eachCtxEvents(function(ctxEventsItem, eventKey) {
            eachById(ctxEventsItem, contextId, function(handlerItem, handlerItemId) {
                iteratee(handlerItem, handlerItemId, ctxEventsItem, eventKey);
            });
        });
    };

    /**
     * Execute the callback once for each handler of ctxEventsItem of the provided eventName(arguments[0]).<br>
     * Callback function(iteratee) is invoked with four arguments:
     *  - handlerItem
     *  - handlerItemId
     *  - ctxEventsItem
     *  - eventKey, A Name of custom event with postfix (ex - 'eventName_idx')
     * @param {string} eventName - Custom event name
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachCtxEventByEventName = function(eventName, iteratee) {
        if (!this._ctxEvents) {
            return;
        }

        var key = this._getCtxKey(eventName),
            ctxEventsItem = this._ctxEvents[key],
            args;

        tui.util.forEachOwnProperties(ctxEventsItem, function() {
            args = Array.prototype.slice.call(arguments);
            args.push(key);
            iteratee.apply(null, args);
        });
    };

    /**********
     * normal event handler
     **********/

    /**
     * Execute the callback once
     *  for each handler in instance equal to the provided handler(arguments[0]).<br>
     * Callback function(iteratee) is invoked with five arguments:
     *  - handlerItem
     *  - index of handlerItem array
     *  - eventList by handler
     *  - eventKey, A Name of custom event with postfix (ex - 'eventName_idx')
     *  - decrease, A special callback function that decreases the length of array.
     * @param {function} handler - A handler for searching
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachEventByHandler = function(handler, iteratee) {
        var events = this._events,
            forEachArrayDecrease = this._forEachArraySplice,
            idx = 0;

        tui.util.forEachOwnProperties(events, function(eventList, eventKey) {
            forEachArrayDecrease(eventList, function(handlerItem, index, eventList, decrease) {
                if (handlerItem.fn === handler) {
                    iteratee(handlerItem, idx, eventList, eventKey, decrease);
                    idx += 1;
                }
            });
        });
    };

    /**
     * Execute the callback once for each handler of normal events of the provided eventName.<br>
     * Callback function(iteratee) is invoked with four arguments:
     *  - handler
     *  - index of handler-list
     *  - handler-list
     *  - decrease, A special callback function that decreases the length of array
     * @param {string} eventName - Custom event name
     * @param {function} iteratee - Callback function
     * @private
     */
    CustomEvents.prototype._eachEventByEventName = function(eventName, iteratee) {
        var events;

        if (!this._events) {
            return;
        }

        events = this._events[eventName];
        if (!tui.util.isExisty(events)) {
            return;
        }

        this._forEachArraySplice(events, iteratee);
    };

    /**
     * Return a new key for saving a handler with a context in event name.
     * @param {string} eventName A event name
     * @returns {string} Key
     * @private
     */
    CustomEvents.prototype._getCtxKey = function(eventName) {
        return eventName + '_idx';
    };

    /**
     * Return a new key for saving length of handlers in event name.
     * @param {string} eventName A event name
     * @returns {string} Key
     * @private
     */
    CustomEvents.prototype._getCtxLenKey = function(eventName) {
        return eventName + '_len';
    };

    /**
     * Return a new key for storing to ctxEventsItem.
     * @param {function} func A event handler
     * @param {*} ctx A context in handler
     * @returns {string} Key
     * @private
     */
    CustomEvents.prototype._getHandlerKey = function(func, ctx) {
        return tui.util.stamp(func) + '_' + tui.util.stamp(ctx);
    };


    /**
     * Set the length of handlers in ctxEventsItem.
     * @param {string} lenKey - A key for saving the length of handlers in `this._ctxEvents`
     * @param {number} change - A variation value of length
     * @private
     */
    CustomEvents.prototype._setCtxLen = function(lenKey, change) {
        var events = this._ctxEvents;

        if (!tui.util.isExisty(events[lenKey])) {
            events[lenKey] = 0;
        }

        events[lenKey] += change;
    };


    /**
     * Store a {handlerItem} to instance.
     * @param {string} eventName - Custom event name
     * @param {*} context - Context for binding
     * @param {function} handler - Handler function
     * @private
     */
    CustomEvents.prototype._addCtxEvent = function(eventName, context, handler) {
        var events = this._ctxEvents,
            key = this._getCtxKey(eventName),
            event;

        if (!tui.util.isExisty(events)) {
            events = this._ctxEvents = {};
        }

        event = events[key];
        if (!tui.util.isExisty(event)) {
            event = events[key] = {};
        }

        var lenKey = this._getCtxLenKey(eventName),
            handlerItemId = this._getHandlerKey(handler, context);

        event[handlerItemId] = {
            fn: handler,
            ctx: context
        };

        this._setCtxLen(lenKey, +1);
    };

    /**
     * Store a event handler without context to instance.
     * @param {string} eventName - Custom event name
     * @param {function} handler - Handler function
     * @private
     */
    CustomEvents.prototype._addNormalEvent = function(eventName, handler) {
        var events = this._events,
            event;

        if (!tui.util.isExisty(events)) {
            events = this._events = {};
        }

        event = events[eventName];
        if (!tui.util.isExisty(event)) {
            event = events[eventName] = [];
        }

        event.push({ fn: handler });
    };


    /**
     * Take the event handler off by handler(arguments[0])
     * @param {function} handler - Handler for offing
     * @private
     */
    CustomEvents.prototype._offByHandler = function(handler) {
        var ctxEvents = this._ctxEvents,
            lenKey;

        this._eachCtxEventByHandler(handler, function(handlerItem, hanId, ctxItems, eventKey) {
            lenKey = eventKey.replace('_idx', '_len');
            delete ctxItems[hanId];
            ctxEvents[lenKey] -= 1;
        });

        this._eachEventByHandler(handler, function(handlerItem, index, items, eventKey, decrease) {
            items.splice(index, 1);
            decrease();
        });
    };

    /**
     * Take the event handler off by context with event name
     * @param {*} context - Context
     * @param {(string|function)} [eventName] - Custom event name
     * @private
     */
    CustomEvents.prototype._offByContext = function(context, eventName) {
        var ctxEvents = this._ctxEvents,
            hasArgs = tui.util.isExisty(eventName),
            matchEventName,
            matchHandler,
            lenKey;

        this._eachCtxEventByContext(context, function(handlerItem, hanId, ctxItems, eventKey) {
            lenKey = eventKey.replace('_idx', '_len');

            matchEventName = hasArgs && tui.util.isString(eventName) && eventKey.indexOf(eventName) > -1;
            matchHandler = hasArgs && tui.util.isFunction(eventName) && handlerItem.fn === eventName;

            if (!hasArgs || (matchEventName || matchHandler)) {
                delete ctxItems[hanId];
                ctxEvents[lenKey] -= 1;
            }
        });
    };

    /**
     * Take the event handler off by event name with handler
     * @param {string} eventName - Custom event name
     * @param {function} [handler] - Event handler
     * @private
     */
    CustomEvents.prototype._offByEventName = function(eventName, handler) {
        var ctxEvents = this._ctxEvents,
            hasHandler = tui.util.isExisty(handler),
            lenKey;

        this._eachCtxEventByEventName(eventName, function(handlerItem, hanId, ctxItems, eventKey) {
            lenKey = eventKey.replace('_idx', '_len');
            if (!hasHandler || (hasHandler && handlerItem.fn === handler)) {
                delete ctxItems[hanId];
                ctxEvents[lenKey] -= 1;
            }
        });

        this._eachEventByEventName(eventName, function(handlerItem, index, items, decrease) {
            if (!hasHandler || (hasHandler && handlerItem.fn === handler)) {
                items.splice(index, 1);
                decrease();
            }
        });

    };

    /**********
     * public
     **********/

    /**
     * Attach the event handler with event name and context.
     * @param {(string|{name:string, handler:function})} eventName - Custom event name or an object {eventName: handler}
     * @param {(function|*)} [handler] - Handler function or context
     * @param {*} [context] - Context for binding
     * @example
     *  // 1. Basic
     *  customEvent.on('onload', handler);
     *
     *  // 2. With context
     *  customEvent.on('onload', handler, myObj);
     *
     *  // 3. Attach with an object
     *  customEvent.on({
     *    'play': handler,
     *    'pause': handler2
     *  });
     *
     *  // 4. Attach with an object with context
     *  customEvent.on({
     *    'play': handler
     *  }, myObj);
     */
    CustomEvents.prototype.on = function(eventName, handler, context) {
        var eventNameList;

        if (tui.util.isObject(eventName)) {
            // {eventName: handler}
            context = handler;
            tui.util.forEachOwnProperties(eventName, function(handler, name) {
                 this.on(name, handler, context);
            }, this);
            return;
        } else if (tui.util.isString(eventName) && eventName.indexOf(' ') > -1) {
            // processing of multiple events by split event name
            eventNameList = eventName.split(' ');
            tui.util.forEachArray(eventNameList, function(name) {
                this.on(name, handler, context);
            }, this);
            return;
        }

        var ctxId;

        if (tui.util.isExisty(context)) {
            ctxId = tui.util.stamp(context);
        }

        if (tui.util.isExisty(ctxId)) {
            this._addCtxEvent(eventName, context, handler);
        } else {
            this._addNormalEvent(eventName, handler);
        }
    };

    /**
     * Detach the event handler.
     * @param {(string|{name:string, handler:function})} eventName - Custom event name or an object {eventName: handler}
     * @param {function} [handler] Handler function
     * @example
     * // 1. off by context
     * customEvent.off(myObj);
     *
     * // 2. off by event name
     * customEvent.off('onload');
     *
     * // 3. off by handler
     * customEvent.off(handler);
     *
     * // 4. off by event name and handler
     * customEvent.off('play', handler);
     *
     * // 5. off by context and handler
     * customEvent.off(myObj, handler);
     *
     * // 6. off by context and event name
     * customEvent.off(myObj, 'onload');
     *
     * // 7. off by an Object.<string, function> that is {eventName: handler}
     * customEvent.off({
     *   'play': handler,
     *   'pause': handler2
     * });
     *
     * // 8. off the all events
     * customEvent.off();
     */
    CustomEvents.prototype.off = function(eventName, handler) {
        if (!arguments.length) {
            // 8. off the all events
            this._events = null;
            this._ctxEvents = null;
            return;
        }

        if (tui.util.isFunction(eventName)) {
            // 3. off by handler
            this._offByHandler(eventName);

        } else if (tui.util.isObject(eventName)) {
            if (tui.util.hasStamp(eventName)) {
                // 1, 5, 6 off by context
                this._offByContext(eventName, handler);
            } else {
                // 4. off by an Object.<string, function>
                tui.util.forEachOwnProperties(eventName, function(handler, name) {
                    this.off(name, handler);
                }, this);
            }

        } else {
            // 2, 4 off by event name
            this._offByEventName(eventName, handler);

        }
    };

    /**
     * Return a count of events registered.
     * @param {string} eventName - Custom event name
     * @returns {*}
     */
    CustomEvents.prototype.getListenerLength = function(eventName) {
        var ctxEvents = this._ctxEvents,
            events = this._events,
            existy = tui.util.isExisty,
            lenKey = this._getCtxLenKey(eventName);

        var normal = (existy(events) && tui.util.isArray(events[eventName])) ? events[eventName].length : 0,
            ctx = (existy(ctxEvents) && existy(ctxEvents[lenKey])) ? ctxEvents[lenKey] : 0;

        return normal + ctx;
    };

    /**
     * Return whether at least one of the handlers is registered in the given event name.
     * @param {string} eventName - Custom event name
     * @returns {boolean} Is there at least one handler in event name?
     */
    CustomEvents.prototype.hasListener = function(eventName) {
        return this.getListenerLength(eventName) > 0;
    };



    /**
     * Fire a event and returns the result of operation 'boolean AND' with all listener's results.<br>
     * So, It is different from {@link CustomEvents#fire}.<br>
     * In service code,
     *  use this as a before event in component level usually for notifying that the event is cancelable.
     * @param {string} eventName - Custom event name
     * @param {...*} data - Data for event
     * @returns {boolean} The result of operation 'boolean AND'
     * @example
     *  if (this.invoke('beforeZoom')) {    // check the result of 'beforeZoom'
     *      // if true,
     *      // doSomething
     *  }
     *
     *  // In service code,
     *  map.on({
     *      'beforeZoom': function() {
     *          if (that.disabled && this.getState()) {    // It should cancel the 'zoom' event by some conditions.
     *              return false;
     *          }
     *          return true;
     *      }
     *  });
     */
    CustomEvents.prototype.invoke = function(eventName, data) {
        if (!this.hasListener(eventName)) {
            return true;
        }

        var args = Array.prototype.slice.call(arguments, 1),
            self = this,
            result = true,
            existy = tui.util.isExisty;

        this._eachEventByEventName(eventName, function(item) {
            if (existy(item) && item.fn.apply(self, args) === false) {
                result = false;
            }
        });

        this._eachCtxEventByEventName(eventName, function(item) {
            if (existy(item) && item.fn.apply(item.ctx, args) === false) {
                result = false;
            }
        });

        return result;
    };

    /**
     * Fire a event by event name with data.
     * @param {string} eventName - Custom event name
     * @param {...*} data - Data for event
     * @return {Object} this
     * @example
     *  instance.on('move', function(direction) {
     *      var direction = direction;
     *  });
     *  instance.fire('move', 'left');
     */
    CustomEvents.prototype.fire = function(eventName, data) {
        this.invoke.apply(this, arguments);
        return this;
    };

    /**
     * Attach a one-shot event.
     * @param {(object|string)} eventName - Custom event name or an object {eventName: handler}
     * @param {function} fn - Handler function
     * @param {*} [context] - Context for binding
     */
    CustomEvents.prototype.once = function(eventName, fn, context) {
        var that = this;

        if (tui.util.isObject(eventName)) {
            tui.util.forEachOwnProperties(eventName, function(handler, eventName) {
                this.once(eventName, handler, fn);
            }, this);

            return;
        }

        function onceHandler() {
            fn.apply(context, arguments);
            that.off(eventName, onceHandler, context);
        }

        this.on(eventName, onceHandler, context);
    };

    tui.util.CustomEvents = CustomEvents;

})(window.tui);

/**********
 * defineClass.js
 **********/

/**
 * @fileoverview
 *  This module provides a function to make a constructor that can inherit from the other constructors like the CLASS easily.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency inheritance.js, object.js
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Help a constructor to be defined and to inherit from the other constructors
     * @param {*} [parent] Parent constructor
     * @param {Object} props Members of constructor
     *  @param {Function} props.init Initialization method
     *  @param {Object} [props.static] Static members of constructor
     * @returns {*} Constructor
     * @memberof tui.util
     * @example
     *  var Parent = defineClass({
     *      init: function() {
     *          this.name = 'made by def';
     *      },
     *      method: function() {
     *          //..can do something with this
     *      },
     *      static: {
     *          staticMethod: function() {
     *               //..do something
     *          }
     *      }
     *  });
     *
     *  var Child = defineClass(Parent, {
     *      method2: function() {}
     *  });
     *
     *  Parent.staticMethod();
     *
     *  var parentInstance = new Parent();
     *  console.log(parentInstance.name); //made by def
     *  parentInstance.staticMethod(); // Error
     *
     *  var childInstance = new Child();
     *  childInstance.method();
     *  childInstance.method2();
     */
    tui.util.defineClass = function(parent, props) {
        var obj;

        if (!props) {
            props = parent;
            parent = null;
        }

        obj = props.init || function(){};

        if(parent) {
            tui.util.inherit(obj, parent);
        }

        if (props.hasOwnProperty('static')) {
            tui.util.extend(obj, props.static);
            delete props.static;
        }

        tui.util.extend(obj.prototype, props);

        return obj;
    };

})(window.tui);

/**********
 * defineModule.js
 **********/

/**
 * @fileoverview Define module
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js, defineNamespace.js
 */
(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    var util = tui.util,
        INITIALIZATION_METHOD_NAME = 'initialize';

    /**
     * Define module
     * @param {string} namespace - Namespace of module
     * @param {Object} moduleDefinition - Object literal for module
     * @returns {Object} Defined module
     * @memberof tui.util
     * @example
     *     var myModule = tui.util.defineModule('modules.myModule', {
     *          name: 'john',
     *          message: '',
     *          initialize: function() {
     *              this.message = 'hello world';
     *          },
     *          getMessage: function() {
     *              return this.name + ': ' + this.message
     *          }
     *     });
     *
     *     console.log(myModule.getMessage());  // 'john: hello world';
     *     console.log(window.modules.myModule.getMessage());   // 'john: hello world';
     */
    function defineModule(namespace, moduleDefinition) {
        var base = moduleDefinition || {};

        if (util.isFunction(base[INITIALIZATION_METHOD_NAME])) {
            base[INITIALIZATION_METHOD_NAME]();
            delete base[INITIALIZATION_METHOD_NAME];
        }

        return util.defineNamespace(namespace, base, true);
    }
    tui.util.defineModule = defineModule;
})(window.tui);

/**********
 * defineNamespace.js
 **********/

/**
 * @fileoverview Define namespace
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency inheritance.js, object.js, collection.js
 */
(function(tui) {

    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Define namespace
     * @param {string} name - Module name
     * @param {(object|function)} props - A set of modules or one module
     * @param {boolean} isOverride flag - What if module already define, override or not
     * @returns {(object|function)} Defined namespace
     * @memberof tui.util
     * @example
     * var neComp = defineNamespace('ne.component');
     * neComp.listMenu = tui.util.defineClass({
     *      init: function() {
     *          // code
     *      }
     * });
     */
    var defineNamespace = function(name, props, isOverride) {
        var namespace,
            lastspace,
            result,
            module = getNamespace(name);

        if (!isOverride && isValidType(module)) {
            return module;
        }

        namespace = name.split('.');
        lastspace = namespace.pop();
        namespace.unshift(window);

        result = tui.util.reduce(namespace, function(obj, name) {
            obj[name] = obj[name] || {};
            return obj[name];
        });

        result[lastspace] = isValidType(props) ? props : {};

        return result[lastspace];

    };

    /**
     * Get namespace
     * @param {string} name - namespace
     * @returns {*}
     */
    var getNamespace = function(name) {
        var namespace,
            result;

        namespace = name.split('.');
        namespace.unshift(window);

        result = tui.util.reduce(namespace, function(obj, name) {
            return obj && obj[name];
        });
        return result;
    };

    /**
     * Check valid type
     * @param {*} module
     * @returns {boolean}
     */
    var isValidType = function(module) {
        return (tui.util.isObject(module) || tui.util.isFunction(module));
    };

    tui.util.defineNamespace = defineNamespace;

})(window.tui);

/**********
 * enum.js
 **********/

/**
 * @fileoverview This module provides a Enum Constructor.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type, collection.js
 */

(function(tui) {

'use strict';

/* istanbul ignore if */
if (!tui) {
    tui = window.tui = {};
}
if (!tui.util) {
    tui.util = window.tui.util = {};
}

/**
 * Check whether the defineProperty() method is supported.
 * @type {boolean}
 */
var isSupportDefinedProperty = (function () {
    try {
        Object.defineProperty({}, 'x', {});
        return true;
    } catch (e) {
        return false;
    }
}());

/**
 * A unique value of a constant.
 * @type {number}
 */
var enumValue = 0;

/**
 * Make a constant-list that has unique values.<br>
 * In modern browsers (except IE8 and lower),<br>
 *  a value defined once can not be changed.
 *
 * @param {...string | string[]} itemList Constant-list (An array of string is available)
 * @exports Enum
 * @constructor
 * @class
 * @memberof tui.util
 * @examples
 *  //create
 *  var MYENUM = new Enum('TYPE1', 'TYPE2');
 *  var MYENUM2 = new Enum(['TYPE1', 'TYPE2']);
 *
 *  //usage
 *  if (value === MYENUM.TYPE1) {
 *       ....
 *  }
 *
 *  //add (If a duplicate name is inputted, will be disregarded.)
 *  MYENUM.set('TYPE3', 'TYPE4');
 *
 *  //get name of a constant by a value
 *  MYENUM.getName(MYENUM.TYPE1); // 'TYPE1'이 리턴된다.
 *
 *  // In modern browsers (except IE8 and lower), a value can not be changed in constants.
 *  var originalValue = MYENUM.TYPE1;
 *  MYENUM.TYPE1 = 1234; // maybe TypeError
 *  MYENUM.TYPE1 === originalValue; // true
 *
 **/
function Enum(itemList) {
    if (itemList) {
        this.set.apply(this, arguments);
    }
}

/**
 * Define a constants-list
 * @param {...string| string[]} itemList Constant-list (An array of string is available)
 */
Enum.prototype.set = function(itemList) {
    var self = this;

    if (!tui.util.isArray(itemList)) {
        itemList = tui.util.toArray(arguments);
    }

    tui.util.forEach(itemList, function itemListIteratee(item) {
        self._addItem(item);
    });
};

/**
 * Return a key of the constant.
 * @param {number} value A value of the constant.
 * @returns {string|undefined} Key of the constant.
 */
Enum.prototype.getName = function(value) {
    var foundedKey,
        self = this;

    tui.util.forEach(this, function(itemValue, key) {
        if (self._isEnumItem(key) && value === itemValue) {
            foundedKey = key;
            return false;
        }
    });

    return foundedKey;
};

/**
 * Create a constant.
 * @private
 * @param {string} name Constant name. (It will be a key of a constant)
 */
Enum.prototype._addItem = function(name) {
    var value;

    if (!this.hasOwnProperty(name)) {
        value = this._makeEnumValue();

        if (isSupportDefinedProperty) {
            Object.defineProperty(this, name, {
                enumerable: true,
                configurable: false,
                writable: false,
                value: value
            });
        } else {
            this[name] = value;
        }
    }
};

/**
 * Return a unique value for assigning to a constant.
 * @private
 * @returns {number} A unique value
 */
Enum.prototype._makeEnumValue = function() {
    var value;

    value = enumValue;
    enumValue += 1;

    return value;
};

/**
 * Return whether a constant from the given key is in instance or not.
 * @param {string} key - A constant key
 * @returns {boolean} Result
 * @private
 */
Enum.prototype._isEnumItem = function(key) {
    return tui.util.isNumber(this[key]);
};

tui.util.Enum = Enum;

})(window.tui);

/**********
 * exMap.js
 **********/

/**
 * @fileoverview
 *  Implements the ExMap (Extended Map) object.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency Map.js, collection.js
 */

(function(tui) {
    'use strict';

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    // Caching tui.util for performance enhancing
    var util = tui.util,
        mapAPIsForRead = ['get', 'has', 'forEach', 'keys', 'values', 'entries'],
        mapAPIsForDelete = ['delete', 'clear'];

    /**
     * The ExMap object is Extended Version of the tui.util.Map object.<br>
     * and added some useful feature to make it easy to manage the Map object.
     * @constructor
     * @param {Array} initData - Array of key-value pairs (2-element Arrays).
     *      Each key-value pair will be added to the new Map
     * @memberof tui.util
     */
    function ExMap(initData) {
        this._map = new util.Map(initData);
        this.size = this._map.size;
    }

    util.forEachArray(mapAPIsForRead, function(name) {
        ExMap.prototype[name] = function() {
            return this._map[name].apply(this._map, arguments);
        };
    });

    util.forEachArray(mapAPIsForDelete, function(name) {
        ExMap.prototype[name] = function() {
            var result = this._map[name].apply(this._map, arguments);
            this.size = this._map.size;
            return result;
        };
    });

    ExMap.prototype.set = function() {
        this._map.set.apply(this._map, arguments);
        this.size = this._map.size;
        return this;
    };

    /**
     * Sets all of the key-value pairs in the specified object to the Map object.
     * @param  {Object} object - Plain object that has a key-value pair
     */
    ExMap.prototype.setObject = function(object) {
        util.forEachOwnProperties(object, function(value, key) {
            this.set(key, value);
        }, this);
    };

    /**
     * Removes the elements associated with keys in the specified array.
     * @param  {Array} keys - Array that contains keys of the element to remove
     */
    ExMap.prototype.deleteByKeys = function(keys) {
        util.forEachArray(keys, function(key) {
            this['delete'](key);
        }, this);
    };

    /**
     * Sets all of the key-value pairs in the specified Map object to this Map object.
     * @param  {Map} map - Map object to be merged into this Map object
     */
    ExMap.prototype.merge = function(map) {
        map.forEach(function(value, key) {
            this.set(key, value);
        }, this);
    };

    /**
     * Looks through each key-value pair in the map and returns the new ExMap object of
     * all key-value pairs that pass a truth test implemented by the provided function.
     * @param  {function} predicate - Function to test each key-value pair of the Map object.<br>
     *      Invoked with arguments (value, key). Return true to keep the element, false otherwise.
     * @return {ExMap} A new ExMap object
     */
    ExMap.prototype.filter = function(predicate) {
        var filtered = new ExMap();

        this.forEach(function(value, key) {
            if (predicate(value, key)) {
                filtered.set(key, value);
            }
        });

        return filtered;
    };

    util.ExMap = ExMap;
})(window.tui);

/**********
 * formatDate.js
 **********/

/**
 * @fileoverview This module has a function for date format.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js
 */

(function(tui) {
    'use strict';

    var tokens = /[\\]*YYYY|[\\]*YY|[\\]*MMMM|[\\]*MMM|[\\]*MM|[\\]*M|[\\]*DD|[\\]*D|[\\]*HH|[\\]*H|[\\]*A/gi,
        MONTH_STR = ["Invalid month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        MONTH_DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        replaceMap = {
            M: function(date) {
                return Number(date.month);
            },
            MM: function(date) {
                var month = date.month;
                return (Number(month) < 10) ? '0' + month : month;
            },
            MMM: function(date) {
                return MONTH_STR[Number(date.month)].substr(0, 3);
            },
            MMMM: function(date) {
                return MONTH_STR[Number(date.month)];
            },
            D: function(date) {
                return Number(date.date);
            },
            d: function(date) {
                return replaceMap.D(date);
            },
            DD: function(date) {
                var dayInMonth = date.date;
                return (Number(dayInMonth) < 10) ? '0' + dayInMonth : dayInMonth;
            },
            dd: function(date) {
                return replaceMap.DD(date);
            },
            YY: function(date) {
                return Number(date.year) % 100;
            },
            yy: function(date) {
                return replaceMap.YY(date);
            },
            YYYY: function(date) {
                var prefix = '20',
                    year = date.year;
                if (year > 69 && year < 100) {
                    prefix = '19';
                }
                return (Number(year) < 100) ? prefix + String(year) : year;
            },
            yyyy: function(date) {
                return replaceMap.YYYY(date);
            },
            A: function(date) {
                return date.meridian;
            },
            a: function(date) {
                return date.meridian.toLowerCase();
            },
            hh: function(date) {
                var hour = date.hour;
                return (Number(hour) < 10) ? '0' + hour : hour;
            },
            HH: function(date) {
                return replaceMap.hh(date);
            },
            h: function(date) {
                return String(Number(date.hour));
            },
            H: function(date) {
                return replaceMap.h(date);
            },
            m: function(date) {
                return String(Number(date.minute));
            },
            mm: function(date) {
                var minute = date.minute;
                return (Number(minute) < 10) ? '0' + minute : minute;
            }
        };

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Check whether the given variables are valid date or not.
     * @param {number} year - Year
     * @param {number} month - Month
     * @param {number} date - Day in month.
     * @returns {boolean} Is valid?
     */
    function isValidDate(year, month, date) {
        var isValidYear,
            isValidMonth,
            isValid,
            lastDayInMonth;

        year = Number(year);
        month = Number(month);
        date = Number(date);

        isValidYear = (year > -1 && year < 100) || (year > 1969) && (year < 2070);
        isValidMonth = (month > 0) && (month < 13);

        if (!isValidYear || !isValidMonth) {
            return false;
        }

        lastDayInMonth = MONTH_DAYS[month];
        if (month === 2 && year % 4 === 0) {
            if (year % 100 !== 0 || year % 400 === 0) {
                lastDayInMonth = 29;
            }
        }

        isValid = (date > 0) && (date <= lastDayInMonth);
        return isValid;
    }

    /**
     * Return a string that transformed from the given form and date.
     * @param {string} form - Date form
     * @param {Date|Object} date - Date object
     * @returns {boolean|string} A transformed string or false.
     * @memberOf tui.util
     * @example
     *  // key         | Shorthand
     *  // ------------|-----------------------
     *  // years       | YY / YYYY / yy / yyyy
     *  // months(n)   | M / MM
     *  // months(str) | MMM / MMMM
     *  // days        | D / DD / d / dd
     *  // hours       | H / HH / h / hh
     *  // minutes     | m / mm
     *  // AM/PM       | A / a
     *
     *  var dateStr1 = formatDate('yyyy-MM-dd', {
     *      year: 2014,
     *      month: 12,
     *      date: 12
     *  });
     *  alert(dateStr1); // '2014-12-12'
     *
     *  var dateStr2 = formatDate('MMM DD YYYY HH:mm', {
     *      year: 1999,
     *      month: 9,
     *      date: 9,
     *      hour: 0,
     *      minute: 2
     *  })
     *  alert(dateStr2); // 'Sep 09 1999 00:02'
     *
     *  var dt = new Date(2010, 2, 13),
     *      dateStr3 = formatDate('yyyy년 M월 dd일', dt);
     *
     *  alert(dateStr3); // '2010년 3월 13일'
     */
    function formatDate(form, date) {
        var meridian,
            nDate,
            resultStr;

        if (tui.util.isDate(date)) {
            nDate = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                date: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes()
            };
        } else {
            nDate = {
                year: date.year,
                month: date.month,
                date: date.date,
                hour: date.hour,
                minute: date.minute
            };
        }

        if (!isValidDate(nDate.year, nDate.month, nDate.date)) {
            return false;
        }

        nDate.meridian = '';
        if (/[^\\][aA]\b/g.test(form)) {
            meridian = (nDate.hour > 12) ? 'PM' : 'AM';
            nDate.hour %= 12;
            nDate.meridian = meridian;
        }

        resultStr = form.replace(tokens, function(key) {
            if (key.indexOf('\\') > -1) {
                return key.replace(/\\/g, '');
            } else {
                return replaceMap[key](nDate) || '';
            }
        });
        return resultStr;
    }

    tui.util.formatDate = formatDate;
})(window.tui);


/**********
 * func.js
 **********/

/**
 * @fileoverview This module provides a bind() function for context binding.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 */

(function(tui) {
    'use strict';

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Create a new function that, when called, has its this keyword set to the provided value.
     * @param {function} fn A original function before binding
     * @param {*} obj context of function in arguments[0]
     * @return {function()} A new bound function with context that is in arguments[1]
     * @memberof tui.util
     */
    function bind(fn, obj) {
        var slice = Array.prototype.slice;

        if (fn.bind) {
            return fn.bind.apply(fn, slice.call(arguments, 1));
        }

        /* istanbul ignore next */
        var args = slice.call(arguments, 2);

        /* istanbul ignore next */
        return function() {
            /* istanbul ignore next */
            return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
        };
    }

    tui.util.bind = bind;

})(window.tui);

/**********
 * hashMap.js
 **********/

/**
 * @fileoverview This module provides the HashMap constructor.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type, collection.js
 */

(function(tui) {
    'use strict';

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * All the data in hashMap begin with _MAPDATAPREFIX;
     * @type {string}
     * @private
     */
    var _MAPDATAPREFIX = 'å';

    /**
     * HashMap can handle the key-value pairs.<br>
     * Caution:<br>
     *  HashMap instance has a length property but is not an instance of Array.
     * @param {Object} [obj] A initial data for creation.
     * @constructor
     * @memberof tui.util
     * @example
     *  var hm = new tui.util.HashMap({
     *      'mydata': {
     *           'hello': 'imfine'
     *       },
     *      'what': 'time'
     *  });
     */
    function HashMap(obj) {
        /**
         * size
         * @type {number}
         */
        this.length = 0;

        if (obj) {
            this.setObject(obj);
        }
    }

    /**
     * Set a data from the given key with value or the given object.
     * @param {string|Object} key A string or object for key
     * @param {*} [value] A data
     * @example
     *  var hm = new HashMap();
     *
     *  hm.set('key', 'value');
     *  hm.set({
     *      'key1': 'data1',
     *      'key2': 'data2'
     *  });
     */
    HashMap.prototype.set = function(key, value) {
        if(arguments.length === 2) {
            this.setKeyValue(key, value);
        } else {
            this.setObject(key);
        }
    };

    /**
     * Set a data from the given key with value.
     * @param {string} key A string for key
     * @param {*} value A data
     * @example
     *  var hm = new HashMap();
     *  hm.setKeyValue('key', 'value');
     */
    HashMap.prototype.setKeyValue = function(key, value) {
        if (!this.has(key)) {
            this.length += 1;
        }
        this[this.encodeKey(key)] = value;
    };

    /**
     * Set a data from the given object.
     * @param {Object} obj A object for data
     * @example
     *  var hm = new HashMap();
     *
     *  hm.setObject({
     *      'key1': 'data1',
     *      'key2': 'data2'
     *  });
     */
    HashMap.prototype.setObject = function(obj) {
        var self = this;

        tui.util.forEachOwnProperties(obj, function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * Merge with the given another hashMap.
     * @param {HashMap} hashMap Another hashMap instance
     */
    HashMap.prototype.merge = function(hashMap) {
        var self = this;

        hashMap.each(function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * Encode the given key for hashMap.
     * @param {string} key A string for key
     * @returns {string} A encoded key
     * @private
     */
    HashMap.prototype.encodeKey = function(key) {
        return _MAPDATAPREFIX + key;
    };

    /**
     * Decode the given key in hashMap.
     * @param {string} key A string for key
     * @returns {string} A decoded key
     * @private
     */
    HashMap.prototype.decodeKey = function(key) {
        var decodedKey = key.split(_MAPDATAPREFIX);
        return decodedKey[decodedKey.length-1];
    };

    /**
     * Return the value from the given key.
     * @param {string} key A string for key
     * @returns {*} The value from a key
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.get('key') // value
     */
    HashMap.prototype.get = function(key) {
        return this[this.encodeKey(key)];
    };

    /**
     * Check the existence of a value from the key.
     * @param {string} key A string for key
     * @returns {boolean} Indicating whether a value exists or not.
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.has('key') // true
     */
    HashMap.prototype.has = function(key) {
        return this.hasOwnProperty(this.encodeKey(key));
    };

    /**
     * Remove a data(key-value pairs) from the given key or the given key-list.
     * @param {...string|string[]} key A string for key
     * @returns {string|string[]} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  //ex1
     *  hm.remove('key');
     *
     *  //ex2
     *  hm.remove('key', 'key2');
     *
     *  //ex3
     *  hm.remove(['key', 'key2']);
     */
    HashMap.prototype.remove = function(key) {
        if (arguments.length > 1) {
            key = tui.util.toArray(arguments);
        }

        return tui.util.isArray(key) ? this.removeByKeyArray(key) : this.removeByKey(key);
    };

    /**
     * Remove data(key-value pair) from the given key.
     * @param {string} key A string for key
     * @returns {*|null} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.removeByKey('key')
     */
    HashMap.prototype.removeByKey = function(key) {
        var data = this.has(key) ? this.get(key) : null;

        if (data !== null) {
            delete this[this.encodeKey(key)];
            this.length -= 1;
        }

        return data;
    };

    /**
     * Remove a data(key-value pairs) from the given key-list.
     * @param {string[]} keyArray An array of keys
     * @returns {string[]} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.removeByKeyArray(['key', 'key2']);
     */
    HashMap.prototype.removeByKeyArray = function(keyArray) {
        var data = [],
            self = this;

        tui.util.forEach(keyArray, function(key) {
            data.push(self.removeByKey(key));
        });

        return data;
    };

    /**
     * Remove all the data
     */
    HashMap.prototype.removeAll = function() {
        var self = this;

        this.each(function(value, key) {
            self.remove(key);
        });
    };

    /**
     * Execute the provided callback once for each all the data.
     * @param {Function} iteratee Callback function
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.each(function(value, key) {
     *      //do something...
     *  });
     */
    HashMap.prototype.each = function(iteratee) {
        var self = this,
            flag;

        tui.util.forEachOwnProperties(this, function(value, key) {
            if (key.charAt(0) === _MAPDATAPREFIX) {
                flag = iteratee(value, self.decodeKey(key));
            }

            if (flag === false) {
                return flag;
            }
        });
    };

    /**
     * Return the key-list stored.
     * @returns {Array} A key-list
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.keys();  //['key', 'key2');
     */
    HashMap.prototype.keys = function() {
        var keys = [],
            self = this;

        this.each(function(value, key) {
            keys.push(self.decodeKey(key));
        });

        return keys;
    };

    /**
     * Work similarly to Array.prototype.map().<br>
     * It executes the provided callback that checks conditions once for each element of hashMap,<br>
     *  and returns a new array having elements satisfying the conditions
     * @param {Function} condition A function that checks conditions
     * @returns {Array} A new array having elements satisfying the conditions
     * @example
     *  //ex1
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.find(function(value, key) {
     *      return key === 'key2';
     *  }); // ['value']
     *
     *  //ex2
     *  var hm = new HashMap({
     *      'myobj1': {
     *           visible: true
     *       },
     *      'mybobj2': {
     *           visible: false
     *       }
     *  });
     *
     *  hm.find(function(obj, key) {
     *      return obj.visible === true;
     *  }); // [{visible: true}];
     */
    HashMap.prototype.find = function(condition) {
        var founds = [];

        this.each(function(value, key) {
            if (condition(value, key)) {
                founds.push(value);
            }
        });

        return founds;
    };

    /**
     * Return a new Array having all values.
     * @returns {Array} A new array having all values
     */
    HashMap.prototype.toArray = function() {
        var result = [];

        this.each(function(v) {
            result.push(v);
        });

        return result;
    };

    tui.util.HashMap = HashMap;

})(window.tui);

/**********
 * inheritance.js
 **********/

/**
 * @fileoverview This module provides some simple function for inheritance.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }



    /**
     * Create a new object with the specified prototype object and properties.
     * @param {Object} obj This object will be a prototype of the newly-created object.
     * @return {Object}
     * @memberof tui.util
     */
    function createObject() {
        function F() {}

        return function(obj) {
            F.prototype = obj;
            return new F();
        };
    }

    /**
     * Provide a simple inheritance in prototype-oriented.
     * Caution :
     *  Don't overwrite the prototype of child constructor.
     *
     * @param {function} subType Child constructor
     * @param {function} superType Parent constructor
     * @memberof tui.util
     * @example
     *  // Parent constructor
     *  function Animal(leg) {
     *      this.leg = leg;
     *  }
     *
     *  Animal.prototype.growl = function() {
     *      // ...
     *  };
     *
     *  // Child constructor
     *  function Person(name) {
     *      this.name = name;
     *  }
     *
     *  // Inheritance
     *  core.inherit(Person, Animal);
     *
     *  // After this inheritance, please use only the extending of property.
     *  // Do not overwrite prototype.
     *  Person.prototype.walk = function(direction) {
     *      // ...
     *  };
     */
    function inherit(subType, superType) {
        var prototype = tui.util.createObject(superType.prototype);
        prototype.constructor = subType;
        subType.prototype = prototype;
    }

    tui.util.createObject = createObject();
    tui.util.inherit = inherit;

})(window.tui);

/**********
 * map.js
 **********/

/**
 * @fileoverview
 *  Implements the Map object.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js, collection.js
 */

(function(tui) {
    'use strict';

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }


    // Caching tui.util for performance enhancing
    var util = tui.util,

    /**
     * Using undefined for a key can be ambiguous if there's deleted item in the array,<br>
     * which is also undefined when accessed by index.<br>
     * So use this unique object as an undefined key to distinguish it from deleted keys.
     * @private
     * @constant
     */
    _KEY_FOR_UNDEFINED = {},

    /**
     * For using NaN as a key, use this unique object as a NaN key.<br>
     * This makes it easier and faster to compare an object with each keys in the array<br>
     * through no exceptional comapring for NaN.
     */
    _KEY_FOR_NAN = {};

    /**
     * Constructor of MapIterator<br>
     * Creates iterator object with new keyword.
     * @constructor
     * @param  {Array} keys - The array of keys in the map
     * @param  {function} valueGetter - Function that returns certain value,
     *      taking key and keyIndex as arguments.
     */
    function MapIterator(keys, valueGetter) {
        this._keys = keys;
        this._valueGetter = valueGetter;
        this._length = this._keys.length;
        this._index = -1;
        this._done = false;
    }

    /**
     * Implementation of Iterator protocol.
     * @return {{done: boolean, value: *}} Object that contains done(boolean) and value.
     */
    MapIterator.prototype.next = function() {
        var data = {};
        do {
           this._index += 1;
       } while (util.isUndefined(this._keys[this._index]) && this._index < this._length);

        if (this._index >= this._length) {
            data.done = true;
        } else {
            data.done = false;
            data.value = this._valueGetter(this._keys[this._index], this._index);
        }
        return data;
    };

    /**
     * The Map object implements the ES6 Map specification as closely as possible.<br>
     * For using objects and primitive values as keys, this object uses array internally.<br>
     * So if the key is not a string, get(), set(), has(), delete() will operates in O(n),<br>
     * and it can cause performance issues with a large dataset.
     *
     * Features listed below are not supported. (can't be implented without native support)
     * - Map object is iterable<br>
     * - Iterable object can be used as an argument of constructor
     *
     * If the browser supports full implementation of ES6 Map specification, native Map obejct
     * will be used internally.
     * @constructor
     * @param  {Array} initData - Array of key-value pairs (2-element Arrays).
     *      Each key-value pair will be added to the new Map
     * @memberof tui.util
     */
    function Map(initData) {
        this._valuesForString = {};
        this._valuesForIndex = {};
        this._keys = [];

        if (initData) {
            this._setInitData(initData);
        }

        this.size = 0;
    }

    /**
     * Add all elements in the initData to the Map object.
     * @private
     * @param  {Array} initData - Array of key-value pairs to add to the Map object
     */
    Map.prototype._setInitData = function(initData) {
        if (!util.isArray(initData)) {
            throw new Error('Only Array is supported.');
        }
        util.forEachArray(initData, function(pair) {
            this.set(pair[0], pair[1]);
        }, this);
    };

    /**
     * Returns true if the specified value is NaN.<br>
     * For unsing NaN as a key, use this method to test equality of NaN<br>
     * because === operator doesn't work for NaN.
     * @private
     * @param {*} value - Any object to be tested
     * @return {boolean} True if value is NaN, false otherwise.
     */
    Map.prototype._isNaN = function(value) {
        return typeof value === 'number' && value !== value;
    };

    /**
     * Returns the index of the specified key.
     * @private
     * @param  {*} key - The key object to search for.
     * @return {number} The index of the specified key
     */
    Map.prototype._getKeyIndex = function(key) {
        var result = -1,
            value;

        if (util.isString(key)) {
            value = this._valuesForString[key];
            if (value) {
                result = value.keyIndex;
            }
        } else {
            result = util.inArray(key, this._keys);
        }
        return result;
    };

    /**
     * Returns the original key of the specified key.
     * @private
     * @param  {*} key - key
     * @return {*} Original key
     */
    Map.prototype._getOriginKey = function(key) {
        var originKey = key;
        if (key === _KEY_FOR_UNDEFINED) {
            originKey = undefined;
        } else if (key === _KEY_FOR_NAN) {
            originKey = NaN;
        }
        return originKey;
    };

    /**
     * Returns the unique key of the specified key.
     * @private
     * @param  {*} key - key
     * @return {*} Unique key
     */
    Map.prototype._getUniqueKey = function(key) {
        var uniqueKey = key;
        if (util.isUndefined(key)) {
            uniqueKey = _KEY_FOR_UNDEFINED;
        } else if (this._isNaN(key)) {
            uniqueKey = _KEY_FOR_NAN;
        }
        return uniqueKey;
    };

    /**
     * Returns the value object of the specified key.
     * @private
     * @param  {*} key - The key of the value object to be returned
     * @param  {number} keyIndex - The index of the key
     * @return {{keyIndex: number, origin: *}} Value object
     */
    Map.prototype._getValueObject = function(key, keyIndex) {
        if (util.isString(key)) {
            return this._valuesForString[key];
        } else {
            if (util.isUndefined(keyIndex)) {
                keyIndex = this._getKeyIndex(key);
            }
            if (keyIndex >= 0) {
                return this._valuesForIndex[keyIndex];
            }
        }
    };

    /**
     * Returns the original value of the specified key.
     * @private
     * @param  {*} key - The key of the value object to be returned
     * @param  {number} keyIndex - The index of the key
     * @return {*} Original value
     */
    Map.prototype._getOriginValue = function(key, keyIndex) {
        return this._getValueObject(key, keyIndex).origin;
    };

    /**
     * Returns key-value pair of the specified key.
     * @private
     * @param  {*} key - The key of the value object to be returned
     * @param  {number} keyIndex - The index of the key
     * @return {Array} Key-value Pair
     */
    Map.prototype._getKeyValuePair = function(key, keyIndex) {
        return [this._getOriginKey(key), this._getOriginValue(key, keyIndex)];
    };

    /**
     * Creates the wrapper object of original value that contains a key index
     * and returns it.
     * @private
     * @param  {type} origin - Original value
     * @param  {type} keyIndex - Index of the key
     * @return {{keyIndex: number, origin: *}} Value object
     */
    Map.prototype._createValueObject = function(origin, keyIndex) {
        return {
            keyIndex: keyIndex,
            origin: origin
        };
    };

    /**
     * Sets the value for the key in the Map object.
     * @param  {*} key - The key of the element to add to the Map object
     * @param  {*} value - The value of the element to add to the Map object
     * @return {Map} The Map object
     */
    Map.prototype.set = function(key, value) {
        var uniqueKey = this._getUniqueKey(key),
            keyIndex = this._getKeyIndex(uniqueKey),
            valueObject;

        if (keyIndex < 0) {
            keyIndex = this._keys.push(uniqueKey) - 1;
            this.size += 1;
        }
        valueObject = this._createValueObject(value, keyIndex);

        if (util.isString(key)) {
            this._valuesForString[key] = valueObject;
        } else {
            this._valuesForIndex[keyIndex] = valueObject;
        }
        return this;
    };

    /**
     * Returns the value associated to the key, or undefined if there is none.
     * @param  {*} key - The key of the element to return
     * @return {*} Element associated with the specified key
     */
    Map.prototype.get = function(key) {
        var uniqueKey = this._getUniqueKey(key),
            value = this._getValueObject(uniqueKey);

        return value && value.origin;
    };

    /**
     * Returns a new Iterator object that contains the keys for each element
     * in the Map object in insertion order.
     * @return {Iterator} A new Iterator object
     */
    Map.prototype.keys = function() {
        return new MapIterator(this._keys, util.bind(this._getOriginKey, this));
    };

    /**
     * Returns a new Iterator object that contains the values for each element
     * in the Map object in insertion order.
     * @return {Iterator} A new Iterator object
     */
    Map.prototype.values = function() {
        return new MapIterator(this._keys, util.bind(this._getOriginValue, this));
    };

    /**
     * Returns a new Iterator object that contains the [key, value] pairs
     * for each element in the Map object in insertion order.
     * @return {Iterator} A new Iterator object
     */
    Map.prototype.entries = function() {
        return new MapIterator(this._keys, util.bind(this._getKeyValuePair, this));
    };

    /**
     * Returns a boolean asserting whether a value has been associated to the key
     * in the Map object or not.
     * @param  {*} key - The key of the element to test for presence
     * @return {boolean} True if an element with the specified key exists;
     *          Otherwise false
     */
    Map.prototype.has = function(key) {
        return !!this._getValueObject(key);
    };

    /**
     * Removes the specified element from a Map object.
     * @param {*} key - The key of the element to remove
     */
     // cannot use reserved keyword as a property name in IE8 and under.
    Map.prototype['delete'] = function(key) {
        var keyIndex;

        if (util.isString(key)) {
            if (this._valuesForString[key]) {
                keyIndex = this._valuesForString[key].keyIndex;
                delete this._valuesForString[key];
            }
        } else {
            keyIndex = this._getKeyIndex(key);
            if (keyIndex >= 0) {
                delete this._valuesForIndex[keyIndex];
            }
        }

        if (keyIndex >= 0) {
            delete this._keys[keyIndex];
            this.size -= 1;
        }
    };

    /**
     * Executes a provided function once per each key/value pair in the Map object,
     * in insertion order.
     * @param  {function} callback - Function to execute for each element
     * @param  {thisArg} thisArg - Value to use as this when executing callback
     */
    Map.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || this;
        util.forEachArray(this._keys, function(key) {
            if (!util.isUndefined(key)) {
                callback.call(thisArg, this._getValueObject(key).origin, key, this);
            }
        }, this);
    };

    /**
     * Removes all elements from a Map object.
     */
    Map.prototype.clear = function() {
        Map.call(this);
    };

    // Use native Map object if exists.
    // But only latest versions of Chrome and Firefox support full implementation.
    (function() {
        var browser = util.browser;
        if (window.Map && (
            (browser.firefox && browser.version >= 37) ||
            (browser.chrome && browser.version >= 42) )) {
            Map = window.Map;
        }
    })();

    util.Map = Map;
})(window.tui);

/**********
 * object.js
 **********/

/**
 * @fileoverview This module has some functions for handling a plain object, json.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type.js, collection.js
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Extend the target object from other objects.
     * @param {object} target - Object that will be extended
     * @param {...object} objects - Objects as sources
     * @return {object} Extended object
     * @memberOf tui.util
     */
    function extend(target, objects) {
        var source,
            prop,
            hasOwnProp = Object.prototype.hasOwnProperty,
            i,
            len;

        for (i = 1, len = arguments.length; i < len; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProp.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    /**
     * The last id of stamp
     * @type {number}
     */
    var lastId = 0;

    /**
     * Assign a unique id to an object
     * @param {object} obj - Object that will be assigned id.
     * @return {number} Stamped id
     * @memberOf tui.util
     */
    function stamp(obj) {
        obj.__fe_id = obj.__fe_id || ++lastId;
        return obj.__fe_id;
    }

    /**
     * Verify whether an object has a stamped id or not.
     * @param {object} obj
     * @returns {boolean}
     * @memberOf tui.util
     */
    function hasStamp(obj) {
        return tui.util.isExisty(tui.util.pick(obj, '__fe_id'));
    }

    /**
     * Reset the last id of stamp
     */
    function resetLastId() {
        lastId = 0;
    }

    /**
     * Return a key-list(array) of a given object
     * @param {object} obj - Object from which a key-list will be extracted
     * @returns {Array} A key-list(array)
     * @memberOf tui.util
     */
    function keys(obj) {
        var keys = [],
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    }

    /**
     * Return the equality for multiple objects(jsonObjects).<br>
     *  See {@link http://stackoverflow.com/questions/1068834/object-comparison-in-javascript}
     * @param {...object} object - Multiple objects for comparing.
     * @return {boolean} Equality
     * @example
     *
     *  var jsonObj1 = {name:'milk', price: 1000},
     *      jsonObj2 = {name:'milk', price: 1000},
     *      jsonObj3 = {name:'milk', price: 1000};
     *
     *  tui.util.compareJSON(jsonObj1, jsonObj2, jsonObj3);   // true
     *
     *
     *  var jsonObj4 = {name:'milk', price: 1000},
     *      jsonObj5 = {name:'beer', price: 3000};
     *
     *      tui.util.compareJSON(jsonObj4, jsonObj5); // false

     * @memberOf tui.util
     */
    function compareJSON(object) {
        var leftChain,
            rightChain,
            argsLen = arguments.length,
            i;

        function isSameObject(x, y) {
            var p;

            // remember that NaN === NaN returns false
            // and isNaN(undefined) returns true
            if (isNaN(x) &&
                isNaN(y) &&
                tui.util.isNumber(x) &&
                tui.util.isNumber(y)) {
                return true;
            }

            // Compare primitives and functions.
            // Check if both arguments link to the same object.
            // Especially useful on step when comparing prototypes
            if (x === y) {
                return true;
            }

            // Works in case when functions are created in constructor.
            // Comparing dates is a common scenario. Another built-ins?
            // We can even handle functions passed across iframes
            if ((tui.util.isFunction(x) && tui.util.isFunction(y)) ||
                (x instanceof Date && y instanceof Date) ||
                (x instanceof RegExp && y instanceof RegExp) ||
                (x instanceof String && y instanceof String) ||
                (x instanceof Number && y instanceof Number)) {
                return x.toString() === y.toString();
            }

            // At last checking prototypes as good a we can
            if (!(x instanceof Object && y instanceof Object)) {
                return false;
            }

            if (x.isPrototypeOf(y) ||
                y.isPrototypeOf(x) ||
                x.constructor !== y.constructor ||
                x.prototype !== y.prototype) {
                return false;
            }

            // check for infinitive linking loops
            if (tui.util.inArray(x, leftChain) > -1 ||
                tui.util.inArray(y, rightChain) > -1) {
                return false;
            }

            // Quick checking of one object beeing a subset of another.
            for (p in y) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }
            }

            //This for loop executes comparing with hasOwnProperty() and typeof for each property in 'x' object,
            //and verifying equality for x[property] and y[property].
            for (p in x) {
                if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                    return false;
                }
                else if (typeof y[p] !== typeof x[p]) {
                    return false;
                }

                if (typeof(x[p]) === 'object' || typeof(x[p]) === 'function') {
                    leftChain.push(x);
                    rightChain.push(y);

                    if (!isSameObject(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                } else if (x[p] !== y[p]) {
                    return false;
                }
            }

            return true;
        }

        if (argsLen < 1) {
            return true;
        }

        for (i = 1; i < argsLen; i++) {
            leftChain = [];
            rightChain = [];

            if (!isSameObject(arguments[0], arguments[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Retrieve a nested item from the given object/array
     * @param {object|Array} obj - Object for retrieving
     * @param {...string|number} paths - Paths of property
     * @returns {*} Value
     * @example
     *  var obj = {
     *      'key1': 1,
     *      'nested' : {
     *          'key1': 11,
     *          'nested': {
     *              'key1': 21
     *          }
     *      }
     *  };
     *  tui.util.pick(obj, 'nested', 'nested', 'key1'); // 21
     *  tui.util.pick(obj, 'nested', 'nested', 'key2'); // undefined
     *
     *  var arr = ['a', 'b', 'c'];
     *  tui.util.pick(arr, 1); // 'b'
     */
    function pick(obj, paths) {
        var args = arguments,
            target = args[0],
            length = args.length,
            i;
        try {
            for (i = 1; i < length; i++) {
                target = target[args[i]];
            }
            return target;
        } catch(e) {
            return;
        }
    }

    tui.util.extend = extend;
    tui.util.stamp = stamp;
    tui.util.hasStamp = hasStamp;
    tui.util._resetLastId = resetLastId;
    tui.util.keys = Object.keys || keys;
    tui.util.compareJSON = compareJSON;
    tui.util.pick = pick;
})(window.tui);

/**********
 * string.js
 **********/

/**
 * @fileoverview This module has some functions for handling the string.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 */

(function(tui) {
    'use strict';

    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Transform the given HTML Entity string into plain string
     * @param {String} htmlEntity - HTML Entity type string
     * @return {String} Plain string
     * @memberof tui.util
     * @example
     *  var htmlEntityString = "A &#39;quote&#39; is &lt;b&gt;bold&lt;/b&gt;"
     *  var result = decodeHTMLEntity(htmlEntityString); //"A 'quote' is <b>bold</b>"
     */
    function decodeHTMLEntity(htmlEntity) {
        var entities = {'&quot;' : '"', '&amp;' : '&', '&lt;' : '<', '&gt;' : '>', '&#39;' : '\'', '&nbsp;' : ' '};
        return htmlEntity.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&nbsp;/g, function(m0) {
            return entities[m0] ? entities[m0] : m0;
        });
    }

    /**
     * Transform the given string into HTML Entity string
     * @param {String} html - String for encoding
     * @return {String} HTML Entity
     * @memberof tui.util
     * @example
     *  var htmlEntityString = "<script> alert('test');</script><a href='test'>";
     *  var result = encodeHTMLEntity(htmlEntityString); //"&lt;script&gt; alert(&#39;test&#39;);&lt;/script&gt;&lt;a href=&#39;test&#39;&gt;"
     */
    function encodeHTMLEntity(html) {
        var entities = {'"': 'quot', '&': 'amp', '<': 'lt', '>': 'gt', '\'': '#39'};
        return html.replace(/[<>&"']/g, function(m0) {
            return entities[m0] ? '&' + entities[m0] + ';' : m0;
        });
    }

    /**
     * Return whether the string capable to transform into plain string is in the given string or not.
     * @param {String} string
     * @memberof tui.util
     * @return {boolean}
     */
    function hasEncodableString(string) {
        return /[<>&"']/.test(string);
    }

    /**
     * Return duplicate charters
     * @param {string} operandStr1 The operand string
     * @param {string} operandStr2 The operand string
     * @private
     * @memberof tui.util
     * @returns {string}
     * @example
     * tui.util.getDuplicatedChar('fe dev', 'nhn entertainment');
     * => 'e'
     * tui.util.getDuplicatedChar('fdsa', 'asdf');
     * => 'asdf'
     */
    function getDuplicatedChar(operandStr1, operandStr2) {
        var dupl,
            key,
            i = 0,
            len = operandStr1.length,
            pool = {};

        for (; i < len; i += 1) {
            key = operandStr1.charAt(i);
            pool[key] = 1;
        }

        for (i = 0, len = operandStr2.length; i < len; i += 1) {
            key = operandStr2.charAt(i);
            if(pool[key]) {
                pool[key] += 1;
            }
        }

        pool = tui.util.filter(pool, function(item) {
            return item > 1;
        });

        pool = tui.util.keys(pool).sort();
        dupl = pool.join('');

        return dupl;
    }

    tui.util.decodeHTMLEntity = decodeHTMLEntity;
    tui.util.encodeHTMLEntity = encodeHTMLEntity;
    tui.util.hasEncodableString = hasEncodableString;
    tui.util.getDuplicatedChar = getDuplicatedChar;

})(window.tui);

/**********
 * tricks.js
 **********/

/**
 * @fileoverview collections of some technic methods.
 * @author NHN Ent. FE Development Team <e0242.nhnent.com>
 */

/** @namespace tui */
/** @namespace tui.util */

(function(tui) {
    'use strict';
    var aps = Array.prototype.slice;

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    /* istanbul ignore if */
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Creates a debounced function that delays invoking fn until after delay milliseconds has elapsed
     * since the last time the debouced function was invoked.
     * @param {function} fn The function to debounce.
     * @param {number} [delay=0] The number of milliseconds to delay
     * @memberof tui.util
     * @returns {function} debounced function.
     * @example
     *
     * function someMethodToInvokeDebounced() {}
     *
     * var debounced = tui.util.debounce(someMethodToInvokeDebounced, 300);
     *
     * // invoke repeatedly
     * debounced();
     * debounced();
     * debounced();
     * debounced();
     * debounced();
     * debounced();    // last invoke of debounced()
     *
     * // invoke someMethodToInvokeDebounced() after 300 milliseconds.
     */
    function debounce(fn, delay) {
        var timer,
            args;

        /* istanbul ignore next */
        delay = delay || 0;

        function debounced() {
            args = arguments;

            window.clearTimeout(timer);
            timer = window.setTimeout(function() {
                fn.apply(null, args);
            }, delay);
        }

        return debounced;
    }

    /**
     * return timestamp
     * @memberof tui.util
     * @returns {number} The number of milliseconds from Jan. 1970 00:00:00 (GMT)
     */
    function timestamp() {
        return +(new Date());
    }

    /**
     * Creates a throttled function that only invokes fn at most once per every interval milliseconds.
     *
     * You can use this throttle short time repeatedly invoking functions. (e.g MouseMove, Resize ...)
     *
     * if you need reuse throttled method. you must remove slugs (e.g. flag variable) related with throttling.
     * @param {function} fn function to throttle
     * @param {number} [interval=0] the number of milliseconds to throttle invocations to.
     * @memberof tui.util
     * @returns {function} throttled function
     * @example
     *
     * function someMethodToInvokeThrottled() {}
     *
     * var throttled = tui.util.throttle(someMethodToInvokeThrottled, 300);
     *
     * // invoke repeatedly
     * throttled();    // invoke (leading)
     * throttled();
     * throttled();    // invoke (near 300 milliseconds)
     * throttled();
     * throttled();
     * throttled();    // invoke (near 600 milliseconds)
     * // ...
     * // invoke (trailing)
     *
     * // if you need reuse throttled method. then invoke reset()
     * throttled.reset();
     */
    function throttle(fn, interval) {
        var base,
            _timestamp = tui.util.timestamp,
            debounced,
            isLeading = true,
            stamp,
            args,
            tick = function(_args) {
                fn.apply(null, _args);
                base = null;
            };

        /* istanbul ignore next */
        interval = interval || 0;

        debounced = tui.util.debounce(tick, interval);

        function throttled() {
            args = aps.call(arguments);

            if (isLeading) {
                tick(args);
                isLeading = false;
                return;
            }

            stamp = _timestamp();

            base = base || stamp;

            debounced();

            if ((stamp - base) >= interval) {
                tick(args);
            }
        }

        function reset() {
            isLeading = true;
            base = null;
        }

        throttled.reset = reset;
        return throttled;
    }

    tui.util.timestamp = timestamp;
    tui.util.debounce = debounce;
    tui.util.throttle = throttle;
})(window.tui);


/**********
 * type.js
 **********/

/**
 * @fileoverview This module provides some functions to check the type of variable
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency collection.js
 */

(function(tui) {
    'use strict';
    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * Check whether the given variable is existing or not.<br>
     *  If the given variable is not null and not undefined, returns true.
     * @param {*} param - Target for checking
     * @returns {boolean} Is existy?
     * @memberOf tui.util
     * @example
     *  tui.util.isExisty(''); //true
     *  tui.util.isExisty(0); //true
     *  tui.util.isExisty([]); //true
     *  tui.util.isExisty({}); //true
     *  tui.util.isExisty(null); //false
     *  tui.util.isExisty(undefined); //false
    */
    function isExisty(param) {
        return param != null;
    }

    /**
     * Check whether the given variable is undefined or not.<br>
     *  If the given variable is undefined, returns true.
     * @param {*} obj - Target for checking
     * @returns {boolean} Is undefined?
     * @memberOf tui.util
     */
    function isUndefined(obj) {
        return obj === undefined;
    }

    /**
     * Check whether the given variable is null or not.<br>
     *  If the given variable(arguments[0]) is null, returns true.
     * @param {*} obj - Target for checking
     * @returns {boolean} Is null?
     * @memberOf tui.util
     */
    function isNull(obj) {
        return obj === null;
    }

    /**
     * Check whether the given variable is truthy or not.<br>
     *  If the given variable is not null or not undefined or not false, returns true.<br>
     *  (It regards 0 as true)
     * @param {*} obj - Target for checking
     * @return {boolean} Is truthy?
     * @memberOf tui.util
     */
    function isTruthy(obj) {
        return isExisty(obj) && obj !== false;
    }

    /**
     * Check whether the given variable is falsy or not.<br>
     *  If the given variable is null or undefined or false, returns true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is falsy?
     * @memberOf tui.util
     */
    function isFalsy(obj) {
        return !isTruthy(obj);
    }


    var toString = Object.prototype.toString;

    /**
     * Check whether the given variable is an arguments object or not.<br>
     *  If the given variable is an arguments object, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is arguments?
     * @memberOf tui.util
     */
    function isArguments(obj) {
        var result = isExisty(obj) &&
            ((toString.call(obj) === '[object Arguments]') || !!obj.callee);

        return result;
    }

    /**
     * Check whether the given variable is an instance of Array or not.<br>
     *  If the given variable is an instance of Array, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is array instance?
     * @memberOf tui.util
     */
    function isArray(obj) {
        return obj instanceof Array;
    }

    /**
     * Check whether the given variable is an object or not.<br>
     *  If the given variable is an object, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is object?
     * @memberOf tui.util
     */
    function isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * Check whether the given variable is a function or not.<br>
     *  If the given variable is a function, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is function?
     * @memberOf tui.util
     */
    function isFunction(obj) {
        return obj instanceof Function;
    }

    /**
     * Check whether the given variable is a number or not.<br>
     *  If the given variable is a number, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is number?
     * @memberOf tui.util
     */
    function isNumber(obj) {
        return typeof obj === 'number' || obj instanceof Number;
    }

    /**
     * Check whether the given variable is a string or not.<br>
     *  If the given variable is a string, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is string?
     * @memberOf tui.util
     */
    function isString(obj) {
        return typeof obj === 'string' || obj instanceof String;
    }

    /**
     * Check whether the given variable is a boolean or not.<br>
     *  If the given variable is a boolean, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is boolean?
     * @memberOf tui.util
     */
    function isBoolean(obj) {
        return typeof obj === 'boolean' || obj instanceof Boolean;
    }


    /**
     * Check whether the given variable is an instance of Array or not.<br>
     *  If the given variable is an instance of Array, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @return {boolean} Is an instance of array?
     * @memberOf tui.util
     */
    function isArraySafe(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * Check whether the given variable is a function or not.<br>
     *  If the given variable is a function, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @return {boolean} Is a function?
     * @memberOf tui.util
     */
    function isFunctionSafe(obj) {
        return toString.call(obj) === '[object Function]';
    }

    /**
     * Check whether the given variable is a number or not.<br>
     *  If the given variable is a number, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @return {boolean} Is a number?
     * @memberOf tui.util
     */
    function isNumberSafe(obj) {
        return toString.call(obj) === '[object Number]';
    }

    /**
     * Check whether the given variable is a string or not.<br>
     *  If the given variable is a string, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @return {boolean} Is a string?
     * @memberOf tui.util
     */
    function isStringSafe(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * Check whether the given variable is a boolean or not.<br>
     *  If the given variable is a boolean, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @return {boolean} Is a boolean?
     * @memberOf tui.util
     */
    function isBooleanSafe(obj) {
        return toString.call(obj) === '[object Boolean]';
    }

    /**
     * Check whether the given variable is a instance of HTMLNode or not.<br>
     *  If the given variables is a instance of HTMLNode, return true.
     * @param {*} html - Target for checking
     * @return {boolean} Is HTMLNode ?
     * @memberOf tui.util
     */
    function isHTMLNode(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement || !!html.nodeType));
        }
        return !!(html && html.nodeType);
    }

    /**
     * Check whether the given variable is a HTML tag or not.<br>
     *  If the given variables is a HTML tag, return true.
     * @param {*} html - Target for checking
     * @return {Boolean} Is HTML tag?
     * @memberOf tui.util
     */
    function isHTMLTag(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement));
        }
        return !!(html && html.nodeType && html.nodeType === 1);
    }

    /**
     * Check whether the given variable is empty(null, undefined, or empty array, empty object) or not.<br>
     *  If the given variables is empty, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is empty?
     * @memberOf tui.util
     */
    function isEmpty(obj) {
        var hasKey = false;

        if (!isExisty(obj)) {
            return true;
        }

        if (isString(obj) && obj === '') {
            return true;
        }

        if (isArray(obj) || isArguments(obj)) {
            return obj.length === 0;
        }

        if (isObject(obj) && !isFunction(obj)) {
            tui.util.forEachOwnProperties(obj, function() {
                hasKey = true;
                return false;
            });

            return !hasKey;
        }

        return true;

    }

    /**
     * Check whether the given variable is not empty(not null, not undefined, or not empty array, not empty object) or not.<br>
     *  If the given variables is not empty, return true.
     * @param {*} obj - Target for checking
     * @return {boolean} Is not empty?
     * @memberOf tui.util
     */
    function isNotEmpty(obj) {
        return !isEmpty(obj);
    }

    /**
     * Check whether the given variable is an instance of Date or not.<br>
     *  If the given variables is an instance of Date, return true.
     * @param {*} obj - Target for checking
     * @returns {boolean} Is an instance of Date?
     * @memberOf tui.util
     */
    function isDate(obj) {
        return obj instanceof Date;
    }

    /**
     * Check whether the given variable is an instance of Date or not.<br>
     *  If the given variables is an instance of Date, return true.<br>
     *  (It is used for multiple frame environments)
     * @param {*} obj - Target for checking
     * @returns {boolean} Is an instance of Date?
     * @memberOf tui.util
     */
    function isDateSafe(obj) {
        return toString.call(obj) === '[object Date]';
    }


    tui.util.isExisty = isExisty;
    tui.util.isUndefined = isUndefined;
    tui.util.isNull = isNull;
    tui.util.isTruthy = isTruthy;
    tui.util.isFalsy = isFalsy;
    tui.util.isArguments = isArguments;
    tui.util.isArray = Array.isArray || isArray;
    tui.util.isArraySafe = Array.isArray || isArraySafe;
    tui.util.isObject = isObject;
    tui.util.isFunction = isFunction;
    tui.util.isFunctionSafe = isFunctionSafe;
    tui.util.isNumber = isNumber;
    tui.util.isNumberSafe = isNumberSafe;
    tui.util.isDate = isDate;
    tui.util.isDateSafe = isDateSafe;
    tui.util.isString = isString;
    tui.util.isStringSafe = isStringSafe;
    tui.util.isBoolean = isBoolean;
    tui.util.isBooleanSafe = isBooleanSafe;
    tui.util.isHTMLNode = isHTMLNode;
    tui.util.isHTMLTag = isHTMLTag;
    tui.util.isEmpty = isEmpty;
    tui.util.isNotEmpty = isNotEmpty;

})(window.tui);

/**********
 * window.js
 **********/

/**
 * @fileoverview This module has some methods for handling popup-window
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency browser.js, type.js, object.js, collection.js, func.js, window.js
 */

(function(tui) {
    'use strict';
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    var popup_id = 0;

    /**
     * Popup management class
     * @constructor
     * @memberof tui.util
     */
    function Popup() {

        /**
         * Caching the window-contexts of opened popups
         * @type {Object}
         */
        this.openedPopup = {};

        /**
         * In IE7, an error occurs when the closeWithParent property attaches to window object.<br>
         * So, It is for saving the value of closeWithParent instead of attaching to window object.
         * @type {Object}
         */
        this.closeWithParentPopup = {};

        /**
         * Post data bridge for IE11 popup
         * @type {string}
         */
        this.postDataBridgeUrl = '';
    }

    /**********
     * public methods
     **********/

    /**
     * Returns a popup-list administered by current window.
     * @param {string} [key] The key of popup.
     * @returns {Object} popup window list object
     */
    Popup.prototype.getPopupList = function(key) {
        var target;
        if (tui.util.isExisty(key)) {
            target = this.openedPopup[key];
        } else {
            target = this.openedPopup;
        }
        return target;
    };

    /**
     * Open popup
     * Caution:
     *  In IE11, when transfer data to popup by POST, must set the postDataBridgeUrl.
     *
     * @param {string} url - popup url
     * @param {Object} options
     *     @param {string} [options.popupName] - Key of popup window.<br>
     *      If the key is set, when you try to open by this key, the popup of this key is focused.<br>
     *      Or else a new popup window having this key is opened.
     *
     *     @param {string} [options.popupOptionStr=""] - Option string of popup window<br>
     *      It is same with the third parameter of window.open() method.<br>
     *      See {@link http://www.w3schools.com/jsref/met_win_open.asp}
     *
     *     @param {boolean} [options.closeWithParent=true] - Is closed when parent window closed?
     *
     *     @param {boolean} [options.useReload=false] - This property indicates whether reload the popup or not.<br>
     *      If true, the popup will be reloaded when you try to re-open the popup that has been opened.<br>
     *      When transmit the POST-data, some browsers alert a message for confirming whether retransmit or not.
     *
     *     @param {string} [options.postDataBridgeUrl=''] - Use this url to avoid a certain bug occuring when transmitting POST data to the popup in IE11.<br>
     *      This specific buggy situation is known to happen because IE11 tries to open the requested url not in a new popup window as intended, but in a new tab.<br>
     *      See {@link http://wiki.nhnent.com/pages/viewpage.action?pageId=240562844}
     *
     *     @param {string} [options.method=get] - The method of transmission when the form-data is transmitted to popup-window.
     *
     *     @param {Object} [options.param=null] - Using as parameters for transmission when the form-data is transmitted to popup-window.
     */
    Popup.prototype.openPopup = function(url, options) {
        options = tui.util.extend({
            popupName: 'popup_' + popup_id + '_' + (+new Date()),
            popupOptionStr: '',
            useReload: true,
            closeWithParent: true,
            method: 'get',
            param: {}
        }, options || {});

        options.method = options.method.toUpperCase();

        this.postDataBridgeUrl = options.postDataBridgeUrl || this.postDataBridgeUrl;

        var popup,
            formElement,
            useIEPostBridge = options.method === 'POST' && options.param &&
                tui.util.browser.msie && tui.util.browser.version === 11;

        if (!tui.util.isExisty(url)) {
            throw new Error('Popup#open() 팝업 URL이 입력되지 않았습니다');
        }

        popup_id += 1;

        /*
         * In form-data transmission
         * 1. Create a form before opening a popup.
         * 2. Transmit the form-data.
         * 3. Remove the form after transmission.
         */
        if (options.param) {
            if (options.method === 'GET') {
                url = url + (/\?/.test(url) ? '&' : '?') + this._parameterize(options.param);
            } else if (options.method === 'POST') {
                if (!useIEPostBridge) {
                    formElement = this.createForm(url, options.param, options.method, options.popupName);
                    url = 'about:blank';
                }
            }
        }

        popup = this.openedPopup[options.popupName];

        if (!tui.util.isExisty(popup)) {
            this.openedPopup[options.popupName] = popup = this._open(useIEPostBridge, options.param,
                url, options.popupName, options.popupOptionStr);

        } else {
            if (popup.closed) {
                this.openedPopup[options.popupName] = popup = this._open(useIEPostBridge, options.param,
                    url, options.popupName, options.popupOptionStr);

            } else {
                if (options.useReload) {
                    popup.location.replace(url);
                }
                popup.focus();
            }
        }

        this.closeWithParentPopup[options.popupName] = options.closeWithParent;

        if (!popup || popup.closed || tui.util.isUndefined(popup.closed)) {
            alert('브라우저에 팝업을 막는 기능이 활성화 상태이기 때문에 서비스 이용에 문제가 있을 수 있습니다. 해당 기능을 비활성화 해 주세요');
        }

        if (options.param && options.method === 'POST' && !useIEPostBridge) {
            if (popup) {
                formElement.submit();
            }
            if (formElement.parentNode) {
                formElement.parentNode.removeChild(formElement);
            }
        }

        window.onunload = tui.util.bind(this.closeAllPopup, this);
    };

    /**
     * Close the popup
     * @param {boolean} [skipBeforeUnload] - If true, the 'window.onunload' will be null and skip unload event.
     * @param {Window} [popup] - Window-context of popup for closing. If omit this, current window-context will be closed.
     */
    Popup.prototype.close = function(skipBeforeUnload, popup) {
        skipBeforeUnload = tui.util.isExisty(skipBeforeUnload) ? skipBeforeUnload : false;

        var target = popup || window;

        if (skipBeforeUnload) {
            window.onunload = null;
        }

        if (!target.closed) {
            target.opener = window.location.href;
            target.close();
        }
    };

    /**
     * Close all the popups in current window.
     * @param {boolean} closeWithParent - If true, popups having the closeWithParentPopup property as true will be closed.
     */
    Popup.prototype.closeAllPopup = function(closeWithParent) {
        var hasArg = tui.util.isExisty(closeWithParent);

        tui.util.forEachOwnProperties(this.openedPopup, function(popup, key) {
            if ((hasArg && this.closeWithParentPopup[key]) || !hasArg) {
                this.close(false, popup);
            }
        }, this);
    };

    /**
     * Activate(or focus) the popup of the given name.
     * @param {string} popupName - Name of popup for activation
     */
    Popup.prototype.focus = function(popupName) {
        this.getPopupList(popupName).focus();
    };

    /**
     * Return an object made of parsing the query string.
     * @return {Object} An object having some information of the query string.
     * @private
     */
    Popup.prototype.parseQuery = function() {
        var search,
            pair,
            param = {};

        search = window.location.search.substr(1);
        tui.util.forEachArray(search.split('&'), function(part) {
            pair = part.split('=');
            param[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        });

        return param;
    };

    /**
     * Create a hidden form from the given arguments and return this form.
     * @param {string} action - URL for form transmission
     * @param {Object} [data] - Data for form transmission
     * @param {string} [method] - Method of transmission
     * @param {string} [target] - Target of transmission
     * @param {HTMLElement} [container] - Container element of form.
     * @returns {HTMLElement} Form element
     */
    Popup.prototype.createForm = function(action, data, method, target, container) {
        var form = document.createElement('form'),
            input;

        container = container || document.body;

        form.method = method || 'POST';
        form.action = action || '';
        form.target = target || '';
        form.style.display = 'none';

        tui.util.forEachOwnProperties(data, function(value, key) {
            input = document.createElement('input');
            input.name = key;
            input.type = 'hidden';
            input.value = value;
            form.appendChild(input);
        });

        container.appendChild(form);

        return form;
    };

    /**********
     * private methods
     **********/

    /**
     * Return an query string made by parsing the given object
     * @param {Object} object - An object that has information for query string
     * @returns {string} - Query string
     * @private
     */
    Popup.prototype._parameterize = function(object) {
        var query = [];

        tui.util.forEachOwnProperties(object, function(value, key) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        });

        return query.join('&');
    };

    /**
     * Open popup
     * @param {boolean} useIEPostBridge - A switch option whether to use alternative of tossing POST data to the popup window in IE11
     * @param {Object} param - A data for tossing to popup
     * @param {string} url - Popup url
     * @param {string} popupName - Popup name
     * @param {string} optionStr - Setting for popup, ex) 'width=640,height=320,scrollbars=yes'
     * @returns {Window} Window context of popup
     * @private
     */
    Popup.prototype._open = function(useIEPostBridge, param, url, popupName, optionStr) {
        var popup;

        if (useIEPostBridge) {
            url = this.postDataBridgeUrl + '?storageKey=' + encodeURIComponent(popupName) +
            '&redirectUrl=' + encodeURIComponent(url);
            if (!window.localStorage) {
                alert('IE11브라우저의 문제로 인해 이 기능은 브라우저의 LocalStorage 기능을 활성화 하셔야 이용하실 수 있습니다');
            } else {
                localStorage.removeItem(popupName);
                localStorage.setItem(popupName, JSON.stringify(param));

                popup = window.open(url, popupName, optionStr);
            }
        } else {
            popup = window.open(url, popupName, optionStr);
        }

        return popup;
    };

    tui.util.popup = new Popup();

})(window.tui);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90dWktY29kZS1zbmlwcGV0L2NvZGUtc25pcHBldC5qcyIsInNyYy9qcy9jb2xvcnV0aWwuanMiLCJzcmMvanMvY29yZS9jb2xsZWN0aW9uLmpzIiwic3JjL2pzL2NvcmUvZG9tZXZlbnQuanMiLCJzcmMvanMvY29yZS9kb211dGlsLmpzIiwic3JjL2pzL2NvcmUvZHJhZy5qcyIsInNyYy9qcy9jb3JlL3ZpZXcuanMiLCJzcmMvanMvZmFjdG9yeS5qcyIsInNyYy9qcy9sYXlvdXQuanMiLCJzcmMvanMvcGFsZXR0ZS5qcyIsInNyYy9qcy9zbGlkZXIuanMiLCJzcmMvanMvc3Zndm1sLmpzIiwic3JjL3RlbXBsYXRlL3BhbGV0dGUuanMiLCJzcmMvdGVtcGxhdGUvc2xpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6aklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMxYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdmFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDamtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUM5WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRvYXN0IFVJIENvbG9ycGlja2VyXG4gKiBAdmVyc2lvbiAxLjAuMFxuICovXG4vKiBlc2xpbnQgdmFycy1vbi10b3A6MCwgc3RyaWN0OjAgKi9cbnJlcXVpcmUoJ3R1aS1jb2RlLXNuaXBwZXQnKTtcblxuLyoqIEBuYW1lc3BhY2UgdHVpLmNvbXBvbmVudCAqL1xudHVpLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCd0dWkuY29tcG9uZW50LmNvbG9ycGlja2VyJywge1xuICAgIGRvbXV0aWw6IHJlcXVpcmUoJy4vc3JjL2pzL2NvcmUvZG9tdXRpbCcpLFxuICAgIGRvbWV2ZW50OiByZXF1aXJlKCcuL3NyYy9qcy9jb3JlL2RvbWV2ZW50JyksXG4gICAgQ29sbGVjdGlvbjogcmVxdWlyZSgnLi9zcmMvanMvY29yZS9jb2xsZWN0aW9uJyksXG4gICAgVmlldzogcmVxdWlyZSgnLi9zcmMvanMvY29yZS92aWV3JyksXG4gICAgRHJhZzogcmVxdWlyZSgnLi9zcmMvanMvY29yZS9kcmFnJyksXG5cbiAgICBjcmVhdGU6IHJlcXVpcmUoJy4vc3JjL2pzL2ZhY3RvcnknKSxcbiAgICBQYWxldHRlOiByZXF1aXJlKCcuL3NyYy9qcy9wYWxldHRlJyksXG4gICAgU2xpZGVyOiByZXF1aXJlKCcuL3NyYy9qcy9zbGlkZXInKSxcbiAgICBjb2xvcnV0aWw6IHJlcXVpcmUoJy4vc3JjL2pzL2NvbG9ydXRpbCcpLFxuICAgIHN2Z3ZtbDogcmVxdWlyZSgnLi9zcmMvanMvc3Zndm1sJylcbn0pO1xuXG4iLCIvKiFjb2RlLXNuaXBwZXQgdjEuMC40IHwgTkhOIEVudGVydGFpbm1lbnQqL1xuLyoqKioqKioqKipcbiAqIGFycmF5LmpzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRoaXMgbW9kdWxlIGhhcyBzb21lIGZ1bmN0aW9ucyBmb3IgaGFuZGxpbmcgYXJyYXkuXG4gKiBAYXV0aG9yIE5ITiBFbnQuXG4gKiAgICAgICAgIEZFIERldmVsb3BtZW50IFRlYW0gPGppdW5nLmthbmdAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR5cGUuanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGlmICghdHVpKSB7XG4gICAgICAgIHR1aSA9IHdpbmRvdy50dWkgPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0dWkudXRpbCkge1xuICAgICAgICB0dWkudXRpbCA9IHdpbmRvdy50dWkudXRpbCA9IHt9O1xuICAgIH1cblxuICAgIHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RvcFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzdGVwXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgIHZhciBhcnIgPSB0dWkudXRpbC5yYW5nZSg1KTtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGFycik7IC8vIFswLDEsMiwzLDRdXG4gICAgICpcbiAgICAgKiAgIGFyciA9IHR1aS51dGlsLnJhbmdlKDEsIDUpO1xuICAgICAqICAgY29uc29sZS5sb2coYXJyKTsgLy8gWzEsMiwzLDRdXG4gICAgICpcbiAgICAgKiAgIGFyciA9IHR1aS51dGlsLnJhbmdlKDIsIDEwLCAyKTtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGFycik7IC8vIFsyLDQsNiw4XVxuICAgICAqXG4gICAgICogICBhcnIgPSB0dWkudXRpbC5yYW5nZSgxMCwgMiwgLTIpO1xuICAgICAqICAgY29uc29sZS5sb2coYXJyKTsgLy8gWzEwLDgsNiw0XVxuICAgICAqL1xuICAgIHZhciByYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICAgIHZhciBhcnIgPSBbXSxcbiAgICAgICAgICAgIGZsYWc7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzVW5kZWZpbmVkKHN0b3ApKSB7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG4gICAgICAgIGZsYWcgPSBzdGVwIDwgMCA/IC0xIDogMTtcbiAgICAgICAgc3RvcCAqPSBmbGFnO1xuXG4gICAgICAgIGZvcig7IHN0YXJ0ICogZmxhZyA8IHN0b3A7IHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgICAgICAgIGFyci5wdXNoKHN0YXJ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5XG4gICAgICogQHBhcmFtIHsuLi5BcnJheX1cbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgdmFyIHJlc3VsdCA9IHR1aS51dGlsLnppcChbMSwgMiwgM10sIFsnYScsICdiJywnYyddLCBbdHJ1ZSwgZmFsc2UsIHRydWVdKTtcbiAgICAgKlxuICAgICAqICAgY29uc29sZS5sb2cocmVzdWx0WzBdKTsgLy8gWzEsICdhJywgdHJ1ZV1cbiAgICAgKiAgIGNvbnNvbGUubG9nKHJlc3VsdFsxXSk7IC8vIFsyLCAnYicsIGZhbHNlXVxuICAgICAqICAgY29uc29sZS5sb2cocmVzdWx0WzJdKTsgLy8gWzMsICdjJywgdHJ1ZV1cbiAgICAgKi9cbiAgICB2YXIgemlwID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcnIyZCA9IGFwcy5jYWxsKGFyZ3VtZW50cyksXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKGFycjJkLCBmdW5jdGlvbihhcnIpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2goYXJyLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdFtpbmRleF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2luZGV4XSA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHRbaW5kZXhdLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHR1aS51dGlsLnJhbmdlID0gcmFuZ2U7XG4gICAgdHVpLnV0aWwuemlwID0gemlwO1xufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBicm93c2VyLmpzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRoaXMgbW9kdWxlIGRldGVjdHMgdGhlIGtpbmQgb2Ygd2VsbC1rbm93biBicm93c2VyIGFuZCB2ZXJzaW9uLlxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQG5hbWVzcGFjZSB0dWkudXRpbFxuICovXG5cbihmdW5jdGlvbih0dWkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBvYmplY3QgaGFzIGFuIGluZm9ybWF0aW9uIHRoYXQgaW5kaWNhdGUgdGhlIGtpbmQgb2YgYnJvd3Nlci48YnI+XG4gICAgICogVGhlIGxpc3QgYmVsb3cgaXMgYSBkZXRlY3RhYmxlIGJyb3dzZXIgbGlzdC5cbiAgICAgKiAgLSBpZTcgfiBpZTExXG4gICAgICogIC0gY2hyb21lXG4gICAgICogIC0gZmlyZWZveFxuICAgICAqICAtIHNhZmFyaVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHR1aS51dGlsLmJyb3dzZXIuY2hyb21lID09PSB0cnVlOyAgICAvLyBjaHJvbWVcbiAgICAgKiAgdHVpLnV0aWwuYnJvd3Nlci5maXJlZm94ID09PSB0cnVlOyAgICAvLyBmaXJlZm94XG4gICAgICogIHR1aS51dGlsLmJyb3dzZXIuc2FmYXJpID09PSB0cnVlOyAgICAvLyBzYWZhcmlcbiAgICAgKiAgdHVpLnV0aWwuYnJvd3Nlci5tc2llID09PSB0cnVlOyAgICAvLyBJRVxuICAgICAqICB0dWkudXRpbC5icm93c2VyLm90aGVyID09PSB0cnVlOyAgICAvLyBvdGhlciBicm93c2VyXG4gICAgICogIHR1aS51dGlsLmJyb3dzZXIudmVyc2lvbjsgICAgLy8gYnJvd3NlciB2ZXJzaW9uXG4gICAgICovXG4gICAgdmFyIGJyb3dzZXIgPSB7XG4gICAgICAgIGNocm9tZTogZmFsc2UsXG4gICAgICAgIGZpcmVmb3g6IGZhbHNlLFxuICAgICAgICBzYWZhcmk6IGZhbHNlLFxuICAgICAgICBtc2llOiBmYWxzZSxcbiAgICAgICAgb3RoZXJzOiBmYWxzZSxcbiAgICAgICAgdmVyc2lvbjogMFxuICAgIH07XG5cbiAgICB2YXIgbmF2ID0gd2luZG93Lm5hdmlnYXRvcixcbiAgICAgICAgYXBwTmFtZSA9IG5hdi5hcHBOYW1lLnJlcGxhY2UoL1xccy9nLCAnXycpLFxuICAgICAgICB1c2VyQWdlbnQgPSBuYXYudXNlckFnZW50O1xuXG4gICAgdmFyIHJJRSA9IC9NU0lFXFxzKFswLTldK1suMC05XSopLyxcbiAgICAgICAgcklFMTEgPSAvVHJpZGVudC4qcnY6MTFcXC4vLFxuICAgICAgICB2ZXJzaW9uUmVnZXggPSB7XG4gICAgICAgICAgICAnZmlyZWZveCc6IC9GaXJlZm94XFwvKFxcZCspXFwuLyxcbiAgICAgICAgICAgICdjaHJvbWUnOiAvQ2hyb21lXFwvKFxcZCspXFwuLyxcbiAgICAgICAgICAgICdzYWZhcmknOiAvVmVyc2lvblxcLyhbXFxkXFwuXSspXFxzU2FmYXJpXFwvKFxcZCspL1xuICAgICAgICB9O1xuXG4gICAgdmFyIGtleSwgdG1wO1xuXG4gICAgdmFyIGRldGVjdG9yID0ge1xuICAgICAgICAnTWljcm9zb2Z0X0ludGVybmV0X0V4cGxvcmVyJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZTggfiBpZTEwXG4gICAgICAgICAgICBicm93c2VyLm1zaWUgPSB0cnVlO1xuICAgICAgICAgICAgYnJvd3Nlci52ZXJzaW9uID0gcGFyc2VGbG9hdCh1c2VyQWdlbnQubWF0Y2gocklFKVsxXSk7XG4gICAgICAgIH0sXG4gICAgICAgICdOZXRzY2FwZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGRldGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChySUUxMS5leGVjKHVzZXJBZ2VudCkpIHtcbiAgICAgICAgICAgICAgICBicm93c2VyLm1zaWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyb3dzZXIudmVyc2lvbiA9IDExO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiB2ZXJzaW9uUmVnZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnNpb25SZWdleC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXAgPSB1c2VyQWdlbnQubWF0Y2godmVyc2lvblJlZ2V4W2tleV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRtcCAmJiB0bXAubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyb3dzZXJba2V5XSA9IGRldGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicm93c2VyLnZlcnNpb24gPSBwYXJzZUZsb2F0KHRtcFsxXSB8fCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBicm93c2VyLm90aGVycyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZGV0ZWN0b3JbYXBwTmFtZV0oKTtcbiAgICB0dWkudXRpbC5icm93c2VyID0gYnJvd3Nlcjtcbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogY29sbGVjdGlvbi5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBUaGlzIG1vZHVsZSBoYXMgc29tZSBmdW5jdGlvbnMgZm9yIGhhbmRsaW5nIG9iamVjdCBhcyBjb2xsZWN0aW9uLlxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHlwZS5qcywgb2JqZWN0LmpzXG4gKi9cblxuKGZ1bmN0aW9uKHR1aSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBpZiAoIXR1aSkge1xuICAgICAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG4gICAgfVxuICAgIGlmICghdHVpLnV0aWwpIHtcbiAgICAgICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIHZhcmlhYmxlIHNhdmVzIHdoZXRoZXIgdGhlICdpbmRleE9mJyBtZXRob2QgaXMgaW4gQXJyYXkucHJvdG90eXBlIG9yIG5vdC48YnI+XG4gICAgICogQW5kIGl0IHdpbGwgYmUgY2hlY2tlZCBvbmx5IG9uY2Ugd2hlbiB0aGUgcGFnZSBpcyBsb2FkZWQuXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIGhhc0luZGV4T2YgPSAhIUFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgb25jZSBmb3IgZWFjaCBlbGVtZW50IHByZXNlbnQgaW4gdGhlIGFycmF5KG9yIEFycmF5LWxpa2Ugb2JqZWN0KSBpbiBhc2NlbmRpbmcgb3JkZXIuPGJyPlxuICAgICAqIElmIHRoZSBjYWxsYmFjayBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLCB0aGUgbG9vcCB3aWxsIGJlIHN0b3BwZWQuPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgICAqICAtIFRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudFxuICAgICAqICAtIFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudFxuICAgICAqICAtIFRoZSBhcnJheShvciBBcnJheS1saWtlIG9iamVjdCkgYmVpbmcgdHJhdmVyc2VkXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyIFRoZSBhcnJheShvciBBcnJheS1saWtlIG9iamVjdCkgdGhhdCB3aWxsIGJlIHRyYXZlcnNlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0KHRoaXMpIG9mIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIHN1bSA9IDA7XG4gICAgICpcbiAgICAgKiAgZm9yRWFjaEFycmF5KFsxLDIsM10sIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgKiAgICAgIHN1bSArPSB2YWx1ZTtcbiAgICAgKiAgIH0pO1xuICAgICAqICBhbGVydChzdW0pOyAvLyA2XG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9yRWFjaEFycmF5KGFyciwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gMCxcbiAgICAgICAgICAgIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwgbnVsbDtcblxuICAgICAgICBmb3IgKDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgICAgICAgIGlmIChpdGVyYXRlZS5jYWxsKGNvbnRleHQsIGFycltpbmRleF0sIGluZGV4LCBhcnIpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBvbmNlIGZvciBlYWNoIHByb3BlcnR5IG9mIG9iamVjdCB3aGljaCBhY3R1YWxseSBleGlzdC48YnI+XG4gICAgICogSWYgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UsIHRoZSBsb29wIHdpbGwgYmUgc3RvcHBlZC48YnI+XG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24oaXRlcmF0ZWUpIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gICAgICogIC0gVGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqICAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxuICAgICAqICAtIFRoZSBvYmplY3QgYmVpbmcgdHJhdmVyc2VkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRoYXQgd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSAgQ2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHRdIENvbnRleHQodGhpcykgb2YgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB2YXIgc3VtID0gMDtcbiAgICAgKlxuICAgICAqICBmb3JFYWNoT3duUHJvcGVydGllcyh7YToxLGI6MixjOjN9LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICogICAgICBzdW0gKz0gdmFsdWU7XG4gICAgICogIH0pO1xuICAgICAqICBhbGVydChzdW0pOyAvLyA2XG4gICAgICoqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2hPd25Qcm9wZXJ0aWVzKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dCB8fCBudWxsO1xuXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZXJhdGVlLmNhbGwoY29udGV4dCwgb2JqW2tleV0sIGtleSwgb2JqKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgb25jZSBmb3IgZWFjaCBwcm9wZXJ0eSBvZiBvYmplY3Qob3IgZWxlbWVudCBvZiBhcnJheSkgd2hpY2ggYWN0dWFsbHkgZXhpc3QuPGJyPlxuICAgICAqIElmIHRoZSBvYmplY3QgaXMgQXJyYXktbGlrZSBvYmplY3QoZXgtYXJndW1lbnRzIG9iamVjdCksIEl0IG5lZWRzIHRvIHRyYW5zZm9ybSB0byBBcnJheS4oc2VlICdleDInIG9mIGV4YW1wbGUpLjxicj5cbiAgICAgKiBJZiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSwgdGhlIGxvb3Agd2lsbCBiZSBzdG9wcGVkLjxicj5cbiAgICAgKiBDYWxsYmFjayBmdW5jdGlvbihpdGVyYXRlZSkgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAgICAgKiAgLSBUaGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5KG9yIFRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudClcbiAgICAgKiAgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkob3IgVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50KVxuICAgICAqICAtIFRoZSBvYmplY3QgYmVpbmcgdHJhdmVyc2VkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRoYXQgd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dCh0aGlzKSBvZiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIC8vZXgxXG4gICAgICogIHZhciBzdW0gPSAwO1xuICAgICAqXG4gICAgICogIGZvckVhY2goWzEsMiwzXSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAqICAgICAgc3VtICs9IHZhbHVlO1xuICAgICAqICB9KTtcbiAgICAgKiAgYWxlcnQoc3VtKTsgLy8gNlxuICAgICAqXG4gICAgICogIC8vZXgyIC0gSW4gY2FzZSBvZiBBcnJheS1saWtlIG9iamVjdFxuICAgICAqICBmdW5jdGlvbiBzdW0oKXtcbiAgICAgKiAgICAgIHZhciBmYWN0b3JzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgKiAgICAgIGZvckVhY2goZmFjdG9ycywgZnVuY3Rpb24odmFsdWUpe1xuICAgICAqICAgICAgICAgICAvLy4uLi4uLlxuICAgICAqICAgICAgfSk7XG4gICAgICogIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JFYWNoKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKHR1aS51dGlsLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaEFycmF5KG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgaW4gYW4gYXJyYXksIGluIG9yZGVyLCBhbmQgY29uc3RydWN0cyBhIG5ldyBhcnJheSBmcm9tIHRoZSByZXN1bHRzLjxicj5cbiAgICAgKiBJZiB0aGUgb2JqZWN0IGlzIEFycmF5LWxpa2Ugb2JqZWN0KGV4LWFyZ3VtZW50cyBvYmplY3QpLCBJdCBuZWVkcyB0byB0cmFuc2Zvcm0gdG8gQXJyYXkuKHNlZSAnZXgyJyBvZiBmb3JFYWNoIGV4YW1wbGUpPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgICAqICAtIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkob3IgVGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50KVxuICAgICAqICAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eShvciBUaGUgaW5kZXggb2YgdGhlIGVsZW1lbnQpXG4gICAgICogIC0gVGhlIG9iamVjdCBiZWluZyB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdGhhdCB3aWxsIGJlIHRyYXZlcnNlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XSBDb250ZXh0KHRoaXMpIG9mIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBjb21wb3NlZCBvZiByZXR1cm5lZCB2YWx1ZXMgZnJvbSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciByZXN1bHQgPSBtYXAoWzAsMSwyLDNdLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgICAgcmV0dXJuIHZhbHVlICsgMTtcbiAgICAgKiAgfSk7XG4gICAgICpcbiAgICAgKiAgYWxlcnQocmVzdWx0KTsgIC8vIDEsMiwzLDRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXAob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgICB2YXIgcmVzdWx0QXJyYXkgPSBbXTtcblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dCB8fCBudWxsO1xuXG4gICAgICAgIHR1aS51dGlsLmZvckVhY2gob2JqLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJlc3VsdEFycmF5LnB1c2goaXRlcmF0ZWUuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHRBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBvbmNlIGZvciBlYWNoIGVsZW1lbnQgcHJlc2VudCBpbiB0aGUgYXJyYXkob3IgQXJyYXktbGlrZSBvYmplY3Qgb3IgcGxhaW4gb2JqZWN0KS48YnI+XG4gICAgICogSWYgdGhlIG9iamVjdCBpcyBBcnJheS1saWtlIG9iamVjdChleC1hcmd1bWVudHMgb2JqZWN0KSwgSXQgbmVlZHMgdG8gdHJhbnNmb3JtIHRvIEFycmF5LihzZWUgJ2V4Micgb2YgZm9yRWFjaCBleGFtcGxlKTxicj5cbiAgICAgKiBDYWxsYmFjayBmdW5jdGlvbihpdGVyYXRlZSkgaXMgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOlxuICAgICAqICAtIFRoZSBwcmV2aW91c1ZhbHVlXG4gICAgICogIC0gVGhlIGN1cnJlbnRWYWx1ZVxuICAgICAqICAtIFRoZSBpbmRleFxuICAgICAqICAtIFRoZSBvYmplY3QgYmVpbmcgdHJhdmVyc2VkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRoYXQgd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dCh0aGlzKSBvZiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsqfSBUaGUgcmVzdWx0IHZhbHVlXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIHJlc3VsdCA9IHJlZHVjZShbMCwxLDIsM10sIGZ1bmN0aW9uKHN0b3JlZCwgdmFsdWUpIHtcbiAgICAgKiAgICAgIHJldHVybiBzdG9yZWQgKyB2YWx1ZTtcbiAgICAgKiAgfSk7XG4gICAgICpcbiAgICAgKiAgYWxlcnQocmVzdWx0KTsgLy8gNlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlZHVjZShvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBrZXlzLFxuICAgICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgICAgbGVuZ3RoLFxuICAgICAgICAgICAgc3RvcmU7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwgbnVsbDtcblxuICAgICAgICBpZiAoIXR1aS51dGlsLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAga2V5cyA9IHR1aS51dGlsLmtleXMob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlbmd0aCA9IGtleXMgPyBrZXlzLmxlbmd0aCA6IG9iai5sZW5ndGg7XG5cbiAgICAgICAgc3RvcmUgPSBvYmpba2V5cyA/IGtleXNbaW5kZXgrK10gOiBpbmRleCsrXTtcblxuICAgICAgICBmb3IgKDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHN0b3JlID0gaXRlcmF0ZWUuY2FsbChjb250ZXh0LCBzdG9yZSwgb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RvcmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybSB0aGUgQXJyYXktbGlrZSBvYmplY3QgdG8gQXJyYXkuPGJyPlxuICAgICAqIEluIGxvdyBJRSAoYmVsb3cgOCksIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsIGlzIG5vdCBwZXJmZWN0LiBTbywgdHJ5LWNhdGNoIHN0YXRlbWVudCBpcyB1c2VkLlxuICAgICAqIEBwYXJhbSB7Kn0gYXJyYXlMaWtlIEFycmF5LWxpa2Ugb2JqZWN0XG4gICAgICogQHJldHVybiB7QXJyYXl9IEFycmF5XG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIGFycmF5TGlrZSA9IHtcbiAgICAgKiAgICAgIDA6ICdvbmUnLFxuICAgICAqICAgICAgMTogJ3R3bycsXG4gICAgICogICAgICAyOiAndGhyZWUnLFxuICAgICAqICAgICAgMzogJ2ZvdXInLFxuICAgICAqICAgICAgbGVuZ3RoOiA0XG4gICAgICogIH07XG4gICAgICogIHZhciByZXN1bHQgPSB0b0FycmF5KGFycmF5TGlrZSk7XG4gICAgICpcbiAgICAgKiAgYWxlcnQocmVzdWx0IGluc3RhbmNlb2YgQXJyYXkpOyAvLyB0cnVlXG4gICAgICogIGFsZXJ0KHJlc3VsdCk7IC8vIG9uZSx0d28sdGhyZWUsZm91clxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvQXJyYXkoYXJyYXlMaWtlKSB7XG4gICAgICAgIHZhciBhcnI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhcnIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnJheUxpa2UpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBhcnIgPSBbXTtcbiAgICAgICAgICAgIGZvckVhY2hBcnJheShhcnJheUxpa2UsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYXJyYXkgb3IgcGxhaW4gb2JqZWN0IHdpdGggYWxsIGVsZW1lbnRzKG9yIHByb3BlcnRpZXMpIHRoYXQgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgICAqICAtIFRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkob3IgVGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50KVxuICAgICAqICAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eShvciBUaGUgaW5kZXggb2YgdGhlIGVsZW1lbnQpXG4gICAgICogIC0gVGhlIG9iamVjdCBiZWluZyB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIE9iamVjdChwbGFpbiBvYmplY3Qgb3IgQXJyYXkpIHRoYXQgd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF0gQ29udGV4dCh0aGlzKSBvZiBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHBsYWluIG9iamVjdCBvciBBcnJheVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciByZXN1bHQxID0gZmlsdGVyKFswLDEsMiwzXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgKiAgICAgIHJldHVybiAodmFsdWUgJSAyID09PSAwKTtcbiAgICAgKiAgfSk7XG4gICAgICogIGFsZXJ0KHJlc3VsdDEpOyAvLyAwLDJcbiAgICAgKlxuICAgICAqICB2YXIgcmVzdWx0MiA9IGZpbHRlcih7YSA6IDEsIGI6IDIsIGM6IDN9LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgICAgcmV0dXJuICh2YWx1ZSAlIDIgIT09IDApO1xuICAgICAqICB9KTtcbiAgICAgKiAgYWxlcnQocmVzdWx0Mi5hKTsgLy8gMVxuICAgICAqICBhbGVydChyZXN1bHQyLmIpOyAvLyB1bmRlZmluZWRcbiAgICAgKiAgYWxlcnQocmVzdWx0Mi5jKTsgLy8gM1xuICAgICAqL1xuICAgIHZhciBmaWx0ZXIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciByZXN1bHQsXG4gICAgICAgICAgICBhZGQ7XG5cbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQgfHwgbnVsbDtcblxuICAgICAgICBpZiAoIXR1aS51dGlsLmlzT2JqZWN0KG9iaikgfHwgIXR1aS51dGlsLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3dyb25nIHBhcmFtZXRlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgICAgICBhZGQgPSBmdW5jdGlvbihyZXN1bHQsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChhcmdzWzBdKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIGFkZCA9IGZ1bmN0aW9uKHJlc3VsdCwgYXJncykge1xuICAgICAgICAgICAgICAgIHJlc3VsdFthcmdzWzFdXSA9IGFyZ3NbMF07XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaChvYmosIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKGl0ZXJhdGVlLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICBhZGQocmVzdWx0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBjb250ZXh0KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBhdCB3aGljaCBhIGdpdmVuIGVsZW1lbnQgY2FuIGJlIGZvdW5kIGluIHRoZSBhcnJheSBmcm9tIHN0YXJ0IGluZGV4KGRlZmF1bHQgMCksIG9yIC0xIGlmIGl0IGlzIG5vdCBwcmVzZW50Ljxicj5cbiAgICAgKiBJdCBjb21wYXJlcyBzZWFyY2hFbGVtZW50IHRvIGVsZW1lbnRzIG9mIHRoZSBBcnJheSB1c2luZyBzdHJpY3QgZXF1YWxpdHkgKHRoZSBzYW1lIG1ldGhvZCB1c2VkIGJ5IHRoZSA9PT0sIG9yIHRyaXBsZS1lcXVhbHMsIG9wZXJhdG9yKS5cbiAgICAgKiBAcGFyYW0geyp9IHNlYXJjaEVsZW1lbnQgRWxlbWVudCB0byBsb2NhdGUgaW4gdGhlIGFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgQXJyYXkgdGhhdCB3aWxsIGJlIHRyYXZlcnNlZC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnRJbmRleCBTdGFydCBpbmRleCBpbiBhcnJheSBmb3Igc2VhcmNoaW5nIChkZWZhdWx0IDApXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgRmlyc3QgaW5kZXggYXQgd2hpY2ggYSBnaXZlbiBlbGVtZW50LCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgIHZhciBhcnIgPSBbJ29uZScsICd0d28nLCAndGhyZWUnLCAnZm91ciddLFxuICAgICAqICAgICAgIGlkeDEsXG4gICAgICogICAgICAgaWR4MjtcbiAgICAgKlxuICAgICAqICAgaWR4MSA9IHR1aS51dGlsLmluQXJyYXkoJ29uZScsIGFyciwgMyk7XG4gICAgICogICBhbGVydChpZHgxKTsgLy8gLTFcbiAgICAgKlxuICAgICAqICAgaWR4MiA9IHR1aS51dGlsLmluQXJyYXkoJ29uZScsIGFycik7XG4gICAgICogICBhbGVydChpZHgyKTsgLy8gMFxuICAgICAqL1xuICAgIHZhciBpbkFycmF5ID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCwgYXJyYXksIHN0YXJ0SW5kZXgpIHtcbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc0luZGV4T2YpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGFycmF5LCBzZWFyY2hFbGVtZW50LCBzdGFydEluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIC8vIHNldCBzdGFydEluZGV4XG4gICAgICAgIGlmICh0dWkudXRpbC5pc1VuZGVmaW5lZChzdGFydEluZGV4KSkge1xuICAgICAgICAgICAgc3RhcnRJbmRleCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnRJbmRleCA+PSBsZW5ndGggfHwgc3RhcnRJbmRleCA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlYXJjaFxuICAgICAgICBmb3IgKGkgPSBzdGFydEluZGV4OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChhcnJheVtpXSA9PT0gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBmZXRjaGluZyBhIHByb3BlcnR5XG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyIHRhcmdldCBjb2xsZWN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwcm9wZXJ0eSBwcm9wZXJ0eSBuYW1lXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogICB2YXIgb2JqQXJyID0gW1xuICAgICAqICAgICAgICAgeydhYmMnOiAxLCAnZGVmJzogMiwgJ2doaSc6IDN9LFxuICAgICAqICAgICAgICAgeydhYmMnOiA0LCAnZGVmJzogNSwgJ2doaSc6IDZ9LFxuICAgICAqICAgICAgICAgeydhYmMnOiA3LCAnZGVmJzogOCwgJ2doaSc6IDl9XG4gICAgICogICAgICAgXSxcbiAgICAgKiAgICAgICBhcnIyZCA9IFtcbiAgICAgKiAgICAgICAgIFsxLCAyLCAzXSxcbiAgICAgKiAgICAgICAgIFs0LCA1LCA2XSxcbiAgICAgKiAgICAgICAgIFs3LCA4LCA5XVxuICAgICAqICAgICAgIF0sXG4gICAgICogICAgICAgcmVzdWx0O1xuICAgICAqXG4gICAgICogICByZXN1bHQgPSB0dWkudXRpbC5wbHVjayhvYmpBcnIsICdhYmMnKTtcbiAgICAgKiAgIGNvbnNvbGUubG9nKHJlc3VsdCkgLy8gWzEsIDQsIDddXG4gICAgICpcbiAgICAgKiAgIHJlc3VsdCA9IHR1aS51dGlsLnBsdWNrKGFycjJkLCAyKTtcbiAgICAgKiAgIGNvbnNvbGUubG9nKHJlc3VsdCkgLy8gWzMsIDYsIDldXG4gICAgICovXG4gICAgdmFyIHBsdWNrID0gZnVuY3Rpb24oYXJyLCBwcm9wZXJ0eSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gdHVpLnV0aWwubWFwKGFyciwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1bcHJvcGVydHldO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMgPSBmb3JFYWNoT3duUHJvcGVydGllcztcbiAgICB0dWkudXRpbC5mb3JFYWNoQXJyYXkgPSBmb3JFYWNoQXJyYXk7XG4gICAgdHVpLnV0aWwuZm9yRWFjaCA9IGZvckVhY2g7XG4gICAgdHVpLnV0aWwudG9BcnJheSA9IHRvQXJyYXk7XG4gICAgdHVpLnV0aWwubWFwID0gbWFwO1xuICAgIHR1aS51dGlsLnJlZHVjZSA9IHJlZHVjZTtcbiAgICB0dWkudXRpbC5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgdHVpLnV0aWwuaW5BcnJheSA9IGluQXJyYXk7XG4gICAgdHVpLnV0aWwucGx1Y2sgPSBwbHVjaztcblxufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBjdXN0b21FdmVudC5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgZnVuY3Rpb25zIGZvciBjdXN0b20gZXZlbnRzLjxicj5cbiAqICBBbmQgaXQgaXMgaW1wbGVtZW50ZWQgaW4gdGhlIG9ic2VydmVyIGRlc2lnbiBwYXR0ZXJuLlxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHlwZS5qcywgY29sbGVjdGlvbi5qcyBvYmplY3QuanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdHVpKSB7XG4gICAgICAgIHR1aSA9IHdpbmRvdy50dWkgPSB7fTtcbiAgICB9XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSB1bml0IG9mIGV2ZW50IGhhbmRsZXIgaXRlbS5cbiAgICAgKiBAaWdub3JlXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gaGFuZGxlckl0ZW1cbiAgICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBmbiAtIGV2ZW50IGhhbmRsZXJcbiAgICAgKiBAcHJvcGVydHkgeyp9IGN0eCAtIGNvbnRleHQgb2YgZXZlbnQgaGFuZGxlclxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQSBkYXRhIHN0cnVjdHVyZSBmb3Igc3RvcmluZyBoYW5kbGVySXRlbXMgYm91bmQgd2l0aCBhIHNwZWNpZmljIGNvbnRleHRcbiAgICAgKiAgYW5kIGlzIGEgdW5pdCBpdGVtIG9mIGN0eEV2ZW50cy48YnI+XG4gICAgICogSGFuZGxlcnMgaW4gdGhpcyBpdGVtLCB3aWxsIGJlIGV4ZWN1dGVkIHdpdGggc2FtZSBldmVudC5cbiAgICAgKiBAaWdub3JlXG4gICAgICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCBoYW5kbGVySXRlbT59IGN0eEV2ZW50c0l0ZW1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBjdHhFdmVudHNJdGVtID0ge1xuICAgICAqICAgICAgMV8xOiB7XG4gICAgICogICAgICAgICAgZm46IGZ1bmN0aW9uKCl7Li4ufSxcbiAgICAgKiAgICAgICAgICBjdHg6IGNvbnRleHQxXG4gICAgICogICAgICB9LFxuICAgICAqICAgICAgMl8xOiB7XG4gICAgICogICAgICAgICAgZm46IGZ1bmN0aW9uKCl7Li4ufSxcbiAgICAgKiAgICAgICAgICBjdHg6IGNvbnRleHQxXG4gICAgICogICAgICB9XG4gICAgICogIH1cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEEgZGF0YSBzdHJ1Y3R1cmUgZm9yIHN0b3JpbmcgY3R4RXZlbnRzSXRlbSBhbmQgbGVuZ3RoIGZvciBlYWNoIGV2ZW50KG9yIGV2ZW50IG5hbWUpLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0LjxzdHJpbmcsIChjdHhFdmVudHNJdGVtfG51bWJlcik+fSBjdHhFdmVudHNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICBjdHhFdmVudHMgPSB7XG4gICAgICogICAgICBldmVudE5hbWUxX2lkeDoge1xuICAgICAqICAgICAgICAgIDFfMToge1xuICAgICAqICAgICAgICAgICAgICBmbjogZnVuY3Rpb24oKXsuLi59LFxuICAgICAqICAgICAgICAgICAgICBjdHg6IGNvbnRleHQxXG4gICAgICogICAgICAgICAgfSxcbiAgICAgKiAgICAgICAgICAyXzE6IHtcbiAgICAgKiAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uKCl7Li4ufSxcbiAgICAgKiAgICAgICAgICAgICAgY3R4OiBjb250ZXh0MVxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIH0sXG4gICAgICogICAgICBldmVudE5hbWUxX2xlbjogMixcbiAgICAgKiAgICAgIGV2ZW50TmFtZTJfaWR4OiB7XG4gICAgICogICAgICAgICAgM18yOiB7XG4gICAgICogICAgICAgICAgICAgIGZuOiBmdW5jdGlvbigpey4uLn0sXG4gICAgICogICAgICAgICAgICAgIGN0eDogY29udGV4dDJcbiAgICAgKiAgICAgICAgICB9LFxuICAgICAqICAgICAgICAgIDRfMjoge1xuICAgICAqICAgICAgICAgICAgICBmbjogZnVuY3Rpb24oKXsuLi59LFxuICAgICAqICAgICAgICAgICAgICBjdHg6IGNvbnRleHQyXG4gICAgICogICAgICAgICAgfVxuICAgICAqICAgICAgfSxcbiAgICAgKiAgICAgIGV2ZW50TmFtZTJfbGVuOiAyXG4gICAgICogIH07XG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50cygpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhY2hpbmcgYSBkYXRhIHN0cnVjdHVyZSB0aGF0IGhhcyBub3JtYWwgZXZlbnQgaGFuZGxlcnMgd2hpY2ggYXJlIG5vdCBib3VuZCB3aXRoIGEgc3BlY2lmaWMgY29udGV4dC5cbiAgICAgICAgICogQHR5cGUge29iamVjdC48c3RyaW5nLCBoYW5kbGVySXRlbVtdPn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhY2hpbmcgYSB7Y3R4RXZlbnRzfVxuICAgICAgICAgKiBAdHlwZSB7Y3R4RXZlbnRzfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY3R4RXZlbnRzID0gbnVsbDtcbiAgICB9XG5cblxuICAgIC8qKioqKioqKioqXG4gICAgICogc3RhdGljXG4gICAgICoqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBVc2UgZm9yIG1ha2luZyBhIGNvbnN0cnVjdG9yIHRvIGJlIGFibGUgdG8gZG8gQ3VzdG9tRXZlbnQncyBmdW5jdGlvbnMuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyAtIENvbnN0cnVjdG9yXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgZnVuY3Rpb24gTW9kZWwoKSB7XG4gICAgICogICAgICB0aGlzLm5hbWUgPSAnJztcbiAgICAgKiAgfVxuICAgICAqICB0dWkudXRpbC5DdXN0b21FdmVudHMubWl4aW4oTW9kZWwpO1xuICAgICAqXG4gICAgICogIHZhciBtb2RlbCA9IG5ldyBNb2RlbCgpO1xuICAgICAqICBtb2RlbC5vbignY2hhbmdlJywgZnVuY3Rpb24oKSB7IHRoaXMubmFtZSA9ICdtb2RlbCc7IH0sIHRoaXMpO1xuICAgICAqICBtb2RlbC5maXJlKCdjaGFuZ2UnKTtcbiAgICAgKiAgYWxlcnQobW9kZWwubmFtZSk7IC8vICdtb2RlbCc7XG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLm1peGluID0gZnVuY3Rpb24oZnVuYykge1xuICAgICAgICB0dWkudXRpbC5leHRlbmQoZnVuYy5wcm90b3R5cGUsIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUpO1xuICAgIH07XG5cbiAgICAvKioqKioqKioqKlxuICAgICAqIHByaXZhdGVcbiAgICAgKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIFdvcmsgc2ltaWxhcmx5IHRvIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKCksXG4gICAgICogIGhvd2V2ZXIgZG9lcyBBcnJheS5wcm90b3R5cGUuc3BsaWNlKCkgYWRkaXRpb25hbGx5Ljxicj5cbiAgICAgKiBDYWxsYmFjayhpdGVyYXRlZSkgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOlxuICAgICAqICAtIFRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudFxuICAgICAqICAtIFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudFxuICAgICAqICAtIFRoZSBhcnJheSBiZWluZyB0cmF2ZXJzZWRcbiAgICAgKiAgLSBBIHNwZWNpYWwgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBkZWNyZWFzZXMgdGhlIGxlbmd0aCBvZiBhcnJheVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyciAtIEFycmF5IHRoYXQgd2lsbCBiZSB0cmF2ZXJzZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fZm9yRWFjaEFycmF5U3BsaWNlID0gZnVuY3Rpb24oYXJyLCBpdGVyYXRlZSkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGxlbixcbiAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICBkZWNyZWFzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGFyci5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgbGVuIC09IDE7XG4gICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoIXR1aS51dGlsLmlzRXhpc3R5KGFycikgfHwgIXR1aS51dGlsLmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtID0gYXJyW2ldO1xuXG4gICAgICAgICAgICBpZiAoaXRlcmF0ZWUoaXRlbSwgaSwgYXJyLCBkZWNyZWFzZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogY29udGV4dCBldmVudCBoYW5kbGVyXG4gICAgICoqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGN0eEV2ZW50c0l0ZW0uPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICAgICAqICAtIHtjdHhFdmVudHNJdGVtfSBBIHVuaXQgaXRlbSBvZiBjdHhFdmVudHNcbiAgICAgKiAgLSB7c3RyaW5nfSBBIGtleSAoZXggLSAnZXZlbnROYW1lX2lkeCcgb3IgJ2V2ZW50TmFtZV9sZW4nKVxuICAgICAqICAtIHtjdHhFdmVudHN9IEEgY3R4RXZlbnRzIGJlaW5nIHRyYXZlcnNlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX2VhY2hDdHhFdmVudHMgPSBmdW5jdGlvbihpdGVyYXRlZSkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fY3R4RXZlbnRzO1xuICAgICAgICB0dWkudXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyhldmVudHMsIGl0ZXJhdGVlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZVxuICAgICAqICBmb3IgZWFjaCBoYW5kbGVyIGl0ZW0gdGhhdCBpcyB2YWx1ZSBvZiB0aGUga2V5IGluY2x1ZGluZyBhIHNwZWNpZmljIHN0cmluZyg9aWQsIGFyZ3VtZW50c1sxXSkuPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggdHdvIGFyZ3VtZW50czpcbiAgICAgKiAgLSBoYW5kbGVySXRlbVxuICAgICAqICAtIGhhbmRsZXJJdGVtSWRcbiAgICAgKiBAcGFyYW0ge2N0eEV2ZW50c0l0ZW19IGN0eEV2ZW50c0l0ZW0gLSBBIGRhdGEgc3RydWN0dXJlIHN0b3JpbmcgaGFuZGxlckl0ZW1zLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIEFuIGlkIG9mIGhhbmRsZXIgZm9yIHNlYXJjaGluZ1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGl0ZXJhdGVlIC0gQ2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX2VhY2hDdHhIYW5kbGVySXRlbUJ5Q29udGFpbklkID0gZnVuY3Rpb24oY3R4RXZlbnRzSXRlbSwgaWQsIGl0ZXJhdGVlKSB7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKGN0eEV2ZW50c0l0ZW0sIGZ1bmN0aW9uKGhhbmRsZXJJdGVtLCBoYW5kbGVySXRlbUlkKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlckl0ZW1JZC5pbmRleE9mKGlkKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZWUoaGFuZGxlckl0ZW0sIGhhbmRsZXJJdGVtSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZVxuICAgICAqICBmb3IgZWFjaCBjYXNlIG9mIHdoZW4gdGhlIHByb3ZpZGVkIGhhbmRsZXIoYXJndW1lbnRzWzBdKSBpcyBlcXVhbCB0byBhIGhhbmRsZXIgaW4gY3R4RXZlbnRzSXRlbS48YnI+XG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24oaXRlcmF0ZWUpIGlzIGludm9rZWQgd2l0aCBmb3VyIGFyZ3VtZW50czpcbiAgICAgKiAgLSBoYW5kbGVySXRlbVxuICAgICAqICAtIGhhbmRsZXJJdGVtSWRcbiAgICAgKiAgLSBjdHhFdmVudHNJdGVtXG4gICAgICogIC0gZXZlbnRLZXksIEEgTmFtZSBvZiBjdXN0b20gZXZlbnQgKGV4IC0gJ2V2ZW50TmFtZV9pZHgnKVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBFdmVudCBoYW5kbGVyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0ZWUgLSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fZWFjaEN0eEV2ZW50QnlIYW5kbGVyID0gZnVuY3Rpb24oaGFuZGxlciwgaXRlcmF0ZWUpIHtcbiAgICAgICAgdmFyIGhhbmRsZXJJZCA9IHR1aS51dGlsLnN0YW1wKGhhbmRsZXIpLFxuICAgICAgICAgICAgZWFjaEJ5SWQgPSB0aGlzLl9lYWNoQ3R4SGFuZGxlckl0ZW1CeUNvbnRhaW5JZDtcblxuICAgICAgICB0aGlzLl9lYWNoQ3R4RXZlbnRzKGZ1bmN0aW9uKGN0eEV2ZW50c0l0ZW0sIGV2ZW50S2V5KSB7XG4gICAgICAgICAgICBlYWNoQnlJZChjdHhFdmVudHNJdGVtLCBoYW5kbGVySWQsIGZ1bmN0aW9uKGhhbmRsZXJJdGVtLCBoYW5kbGVySXRlbUlkKSB7XG4gICAgICAgICAgICAgICAgaXRlcmF0ZWUoaGFuZGxlckl0ZW0sIGhhbmRsZXJJdGVtSWQsIGN0eEV2ZW50c0l0ZW0sIGV2ZW50S2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZVxuICAgICAqICBmb3IgZWFjaCBjYXNlIG9mIHdoZW4gdGhlIHByb3ZpZGVkIGNvbnRleHQoYXJndW1lbnRzWzBdKSBpcyBlcXVhbCB0byBhIGNvbnRleHQgaW4gY3R4RXZlbnRzSXRlbS48YnI+XG4gICAgICogQ2FsbGJhY2sgZnVuY3Rpb24oaXRlcmF0ZWUpIGlzIGludm9rZWQgd2l0aCBmb3VyIGFyZ3VtZW50czpcbiAgICAgKiAgLSBoYW5kbGVySXRlbVxuICAgICAqICAtIGhhbmRsZXJJdGVtSWRcbiAgICAgKiAgLSBjdHhFdmVudHNJdGVtXG4gICAgICogIC0gZXZlbnRLZXksIEEgTmFtZSBvZiBjdXN0b20gZXZlbnQgd2l0aCBwb3N0Zml4IChleCAtICdldmVudE5hbWVfaWR4JylcbiAgICAgKiBAcGFyYW0geyp9IGNvbnRleHQgLSBDb250ZXh0IGZvciBzZWFyY2hpbmdcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLl9lYWNoQ3R4RXZlbnRCeUNvbnRleHQgPSBmdW5jdGlvbihjb250ZXh0LCBpdGVyYXRlZSkge1xuICAgICAgICB2YXIgY29udGV4dElkID0gdHVpLnV0aWwuc3RhbXAoY29udGV4dCksXG4gICAgICAgICAgICBlYWNoQnlJZCA9IHRoaXMuX2VhY2hDdHhIYW5kbGVySXRlbUJ5Q29udGFpbklkO1xuXG4gICAgICAgIHRoaXMuX2VhY2hDdHhFdmVudHMoZnVuY3Rpb24oY3R4RXZlbnRzSXRlbSwgZXZlbnRLZXkpIHtcbiAgICAgICAgICAgIGVhY2hCeUlkKGN0eEV2ZW50c0l0ZW0sIGNvbnRleHRJZCwgZnVuY3Rpb24oaGFuZGxlckl0ZW0sIGhhbmRsZXJJdGVtSWQpIHtcbiAgICAgICAgICAgICAgICBpdGVyYXRlZShoYW5kbGVySXRlbSwgaGFuZGxlckl0ZW1JZCwgY3R4RXZlbnRzSXRlbSwgZXZlbnRLZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGhhbmRsZXIgb2YgY3R4RXZlbnRzSXRlbSBvZiB0aGUgcHJvdmlkZWQgZXZlbnROYW1lKGFyZ3VtZW50c1swXSkuPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggZm91ciBhcmd1bWVudHM6XG4gICAgICogIC0gaGFuZGxlckl0ZW1cbiAgICAgKiAgLSBoYW5kbGVySXRlbUlkXG4gICAgICogIC0gY3R4RXZlbnRzSXRlbVxuICAgICAqICAtIGV2ZW50S2V5LCBBIE5hbWUgb2YgY3VzdG9tIGV2ZW50IHdpdGggcG9zdGZpeCAoZXggLSAnZXZlbnROYW1lX2lkeCcpXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0ZWUgLSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fZWFjaEN0eEV2ZW50QnlFdmVudE5hbWUgPSBmdW5jdGlvbihldmVudE5hbWUsIGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghdGhpcy5fY3R4RXZlbnRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5ID0gdGhpcy5fZ2V0Q3R4S2V5KGV2ZW50TmFtZSksXG4gICAgICAgICAgICBjdHhFdmVudHNJdGVtID0gdGhpcy5fY3R4RXZlbnRzW2tleV0sXG4gICAgICAgICAgICBhcmdzO1xuXG4gICAgICAgIHR1aS51dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKGN0eEV2ZW50c0l0ZW0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBhcmdzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIGl0ZXJhdGVlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBub3JtYWwgZXZlbnQgaGFuZGxlclxuICAgICAqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSB0aGUgY2FsbGJhY2sgb25jZVxuICAgICAqICBmb3IgZWFjaCBoYW5kbGVyIGluIGluc3RhbmNlIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBoYW5kbGVyKGFyZ3VtZW50c1swXSkuPGJyPlxuICAgICAqIENhbGxiYWNrIGZ1bmN0aW9uKGl0ZXJhdGVlKSBpcyBpbnZva2VkIHdpdGggZml2ZSBhcmd1bWVudHM6XG4gICAgICogIC0gaGFuZGxlckl0ZW1cbiAgICAgKiAgLSBpbmRleCBvZiBoYW5kbGVySXRlbSBhcnJheVxuICAgICAqICAtIGV2ZW50TGlzdCBieSBoYW5kbGVyXG4gICAgICogIC0gZXZlbnRLZXksIEEgTmFtZSBvZiBjdXN0b20gZXZlbnQgd2l0aCBwb3N0Zml4IChleCAtICdldmVudE5hbWVfaWR4JylcbiAgICAgKiAgLSBkZWNyZWFzZSwgQSBzcGVjaWFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZGVjcmVhc2VzIHRoZSBsZW5ndGggb2YgYXJyYXkuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIEEgaGFuZGxlciBmb3Igc2VhcmNoaW5nXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0ZWUgLSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fZWFjaEV2ZW50QnlIYW5kbGVyID0gZnVuY3Rpb24oaGFuZGxlciwgaXRlcmF0ZWUpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cyxcbiAgICAgICAgICAgIGZvckVhY2hBcnJheURlY3JlYXNlID0gdGhpcy5fZm9yRWFjaEFycmF5U3BsaWNlLFxuICAgICAgICAgICAgaWR4ID0gMDtcblxuICAgICAgICB0dWkudXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyhldmVudHMsIGZ1bmN0aW9uKGV2ZW50TGlzdCwgZXZlbnRLZXkpIHtcbiAgICAgICAgICAgIGZvckVhY2hBcnJheURlY3JlYXNlKGV2ZW50TGlzdCwgZnVuY3Rpb24oaGFuZGxlckl0ZW0sIGluZGV4LCBldmVudExpc3QsIGRlY3JlYXNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXJJdGVtLmZuID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZXJhdGVlKGhhbmRsZXJJdGVtLCBpZHgsIGV2ZW50TGlzdCwgZXZlbnRLZXksIGRlY3JlYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGhhbmRsZXIgb2Ygbm9ybWFsIGV2ZW50cyBvZiB0aGUgcHJvdmlkZWQgZXZlbnROYW1lLjxicj5cbiAgICAgKiBDYWxsYmFjayBmdW5jdGlvbihpdGVyYXRlZSkgaXMgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOlxuICAgICAqICAtIGhhbmRsZXJcbiAgICAgKiAgLSBpbmRleCBvZiBoYW5kbGVyLWxpc3RcbiAgICAgKiAgLSBoYW5kbGVyLWxpc3RcbiAgICAgKiAgLSBkZWNyZWFzZSwgQSBzcGVjaWFsIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgZGVjcmVhc2VzIHRoZSBsZW5ndGggb2YgYXJyYXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gQ3VzdG9tIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSAtIENhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLl9lYWNoRXZlbnRCeUV2ZW50TmFtZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgaXRlcmF0ZWUpIHtcbiAgICAgICAgdmFyIGV2ZW50cztcblxuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmICghdHVpLnV0aWwuaXNFeGlzdHkoZXZlbnRzKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZm9yRWFjaEFycmF5U3BsaWNlKGV2ZW50cywgaXRlcmF0ZWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBuZXcga2V5IGZvciBzYXZpbmcgYSBoYW5kbGVyIHdpdGggYSBjb250ZXh0IGluIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBBIGV2ZW50IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBLZXlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX2dldEN0eEtleSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICByZXR1cm4gZXZlbnROYW1lICsgJ19pZHgnO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBuZXcga2V5IGZvciBzYXZpbmcgbGVuZ3RoIG9mIGhhbmRsZXJzIGluIGV2ZW50IG5hbWUuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSBBIGV2ZW50IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBLZXlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX2dldEN0eExlbktleSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICByZXR1cm4gZXZlbnROYW1lICsgJ19sZW4nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBuZXcga2V5IGZvciBzdG9yaW5nIHRvIGN0eEV2ZW50c0l0ZW0uXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyBBIGV2ZW50IGhhbmRsZXJcbiAgICAgKiBAcGFyYW0geyp9IGN0eCBBIGNvbnRleHQgaW4gaGFuZGxlclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEtleVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fZ2V0SGFuZGxlcktleSA9IGZ1bmN0aW9uKGZ1bmMsIGN0eCkge1xuICAgICAgICByZXR1cm4gdHVpLnV0aWwuc3RhbXAoZnVuYykgKyAnXycgKyB0dWkudXRpbC5zdGFtcChjdHgpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgbGVuZ3RoIG9mIGhhbmRsZXJzIGluIGN0eEV2ZW50c0l0ZW0uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxlbktleSAtIEEga2V5IGZvciBzYXZpbmcgdGhlIGxlbmd0aCBvZiBoYW5kbGVycyBpbiBgdGhpcy5fY3R4RXZlbnRzYFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2UgLSBBIHZhcmlhdGlvbiB2YWx1ZSBvZiBsZW5ndGhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX3NldEN0eExlbiA9IGZ1bmN0aW9uKGxlbktleSwgY2hhbmdlKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9jdHhFdmVudHM7XG5cbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0V4aXN0eShldmVudHNbbGVuS2V5XSkpIHtcbiAgICAgICAgICAgIGV2ZW50c1tsZW5LZXldID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50c1tsZW5LZXldICs9IGNoYW5nZTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSBhIHtoYW5kbGVySXRlbX0gdG8gaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHsqfSBjb250ZXh0IC0gQ29udGV4dCBmb3IgYmluZGluZ1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBIYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLl9hZGRDdHhFdmVudCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgY29udGV4dCwgaGFuZGxlcikge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fY3R4RXZlbnRzLFxuICAgICAgICAgICAga2V5ID0gdGhpcy5fZ2V0Q3R4S2V5KGV2ZW50TmFtZSksXG4gICAgICAgICAgICBldmVudDtcblxuICAgICAgICBpZiAoIXR1aS51dGlsLmlzRXhpc3R5KGV2ZW50cykpIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2N0eEV2ZW50cyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQgPSBldmVudHNba2V5XTtcbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0V4aXN0eShldmVudCkpIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2tleV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW5LZXkgPSB0aGlzLl9nZXRDdHhMZW5LZXkoZXZlbnROYW1lKSxcbiAgICAgICAgICAgIGhhbmRsZXJJdGVtSWQgPSB0aGlzLl9nZXRIYW5kbGVyS2V5KGhhbmRsZXIsIGNvbnRleHQpO1xuXG4gICAgICAgIGV2ZW50W2hhbmRsZXJJdGVtSWRdID0ge1xuICAgICAgICAgICAgZm46IGhhbmRsZXIsXG4gICAgICAgICAgICBjdHg6IGNvbnRleHRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9zZXRDdHhMZW4obGVuS2V5LCArMSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGEgZXZlbnQgaGFuZGxlciB3aXRob3V0IGNvbnRleHQgdG8gaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIEhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX2FkZE5vcm1hbEV2ZW50ID0gZnVuY3Rpb24oZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHMsXG4gICAgICAgICAgICBldmVudDtcblxuICAgICAgICBpZiAoIXR1aS51dGlsLmlzRXhpc3R5KGV2ZW50cykpIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQgPSBldmVudHNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0V4aXN0eShldmVudCkpIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnB1c2goeyBmbjogaGFuZGxlciB9KTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBUYWtlIHRoZSBldmVudCBoYW5kbGVyIG9mZiBieSBoYW5kbGVyKGFyZ3VtZW50c1swXSlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gSGFuZGxlciBmb3Igb2ZmaW5nXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLl9vZmZCeUhhbmRsZXIgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgIHZhciBjdHhFdmVudHMgPSB0aGlzLl9jdHhFdmVudHMsXG4gICAgICAgICAgICBsZW5LZXk7XG5cbiAgICAgICAgdGhpcy5fZWFjaEN0eEV2ZW50QnlIYW5kbGVyKGhhbmRsZXIsIGZ1bmN0aW9uKGhhbmRsZXJJdGVtLCBoYW5JZCwgY3R4SXRlbXMsIGV2ZW50S2V5KSB7XG4gICAgICAgICAgICBsZW5LZXkgPSBldmVudEtleS5yZXBsYWNlKCdfaWR4JywgJ19sZW4nKTtcbiAgICAgICAgICAgIGRlbGV0ZSBjdHhJdGVtc1toYW5JZF07XG4gICAgICAgICAgICBjdHhFdmVudHNbbGVuS2V5XSAtPSAxO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9lYWNoRXZlbnRCeUhhbmRsZXIoaGFuZGxlciwgZnVuY3Rpb24oaGFuZGxlckl0ZW0sIGluZGV4LCBpdGVtcywgZXZlbnRLZXksIGRlY3JlYXNlKSB7XG4gICAgICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgZGVjcmVhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2UgdGhlIGV2ZW50IGhhbmRsZXIgb2ZmIGJ5IGNvbnRleHQgd2l0aCBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHsqfSBjb250ZXh0IC0gQ29udGV4dFxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xmdW5jdGlvbil9IFtldmVudE5hbWVdIC0gQ3VzdG9tIGV2ZW50IG5hbWVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuX29mZkJ5Q29udGV4dCA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50TmFtZSkge1xuICAgICAgICB2YXIgY3R4RXZlbnRzID0gdGhpcy5fY3R4RXZlbnRzLFxuICAgICAgICAgICAgaGFzQXJncyA9IHR1aS51dGlsLmlzRXhpc3R5KGV2ZW50TmFtZSksXG4gICAgICAgICAgICBtYXRjaEV2ZW50TmFtZSxcbiAgICAgICAgICAgIG1hdGNoSGFuZGxlcixcbiAgICAgICAgICAgIGxlbktleTtcblxuICAgICAgICB0aGlzLl9lYWNoQ3R4RXZlbnRCeUNvbnRleHQoY29udGV4dCwgZnVuY3Rpb24oaGFuZGxlckl0ZW0sIGhhbklkLCBjdHhJdGVtcywgZXZlbnRLZXkpIHtcbiAgICAgICAgICAgIGxlbktleSA9IGV2ZW50S2V5LnJlcGxhY2UoJ19pZHgnLCAnX2xlbicpO1xuXG4gICAgICAgICAgICBtYXRjaEV2ZW50TmFtZSA9IGhhc0FyZ3MgJiYgdHVpLnV0aWwuaXNTdHJpbmcoZXZlbnROYW1lKSAmJiBldmVudEtleS5pbmRleE9mKGV2ZW50TmFtZSkgPiAtMTtcbiAgICAgICAgICAgIG1hdGNoSGFuZGxlciA9IGhhc0FyZ3MgJiYgdHVpLnV0aWwuaXNGdW5jdGlvbihldmVudE5hbWUpICYmIGhhbmRsZXJJdGVtLmZuID09PSBldmVudE5hbWU7XG5cbiAgICAgICAgICAgIGlmICghaGFzQXJncyB8fCAobWF0Y2hFdmVudE5hbWUgfHwgbWF0Y2hIYW5kbGVyKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBjdHhJdGVtc1toYW5JZF07XG4gICAgICAgICAgICAgICAgY3R4RXZlbnRzW2xlbktleV0gLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2UgdGhlIGV2ZW50IGhhbmRsZXIgb2ZmIGJ5IGV2ZW50IG5hbWUgd2l0aCBoYW5kbGVyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2hhbmRsZXJdIC0gRXZlbnQgaGFuZGxlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5fb2ZmQnlFdmVudE5hbWUgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgdmFyIGN0eEV2ZW50cyA9IHRoaXMuX2N0eEV2ZW50cyxcbiAgICAgICAgICAgIGhhc0hhbmRsZXIgPSB0dWkudXRpbC5pc0V4aXN0eShoYW5kbGVyKSxcbiAgICAgICAgICAgIGxlbktleTtcblxuICAgICAgICB0aGlzLl9lYWNoQ3R4RXZlbnRCeUV2ZW50TmFtZShldmVudE5hbWUsIGZ1bmN0aW9uKGhhbmRsZXJJdGVtLCBoYW5JZCwgY3R4SXRlbXMsIGV2ZW50S2V5KSB7XG4gICAgICAgICAgICBsZW5LZXkgPSBldmVudEtleS5yZXBsYWNlKCdfaWR4JywgJ19sZW4nKTtcbiAgICAgICAgICAgIGlmICghaGFzSGFuZGxlciB8fCAoaGFzSGFuZGxlciAmJiBoYW5kbGVySXRlbS5mbiA9PT0gaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgY3R4SXRlbXNbaGFuSWRdO1xuICAgICAgICAgICAgICAgIGN0eEV2ZW50c1tsZW5LZXldIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2VhY2hFdmVudEJ5RXZlbnROYW1lKGV2ZW50TmFtZSwgZnVuY3Rpb24oaGFuZGxlckl0ZW0sIGluZGV4LCBpdGVtcywgZGVjcmVhc2UpIHtcbiAgICAgICAgICAgIGlmICghaGFzSGFuZGxlciB8fCAoaGFzSGFuZGxlciAmJiBoYW5kbGVySXRlbS5mbiA9PT0gaGFuZGxlcikpIHtcbiAgICAgICAgICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGRlY3JlYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogcHVibGljXG4gICAgICoqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggdGhlIGV2ZW50IGhhbmRsZXIgd2l0aCBldmVudCBuYW1lIGFuZCBjb250ZXh0LlxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3x7bmFtZTpzdHJpbmcsIGhhbmRsZXI6ZnVuY3Rpb259KX0gZXZlbnROYW1lIC0gQ3VzdG9tIGV2ZW50IG5hbWUgb3IgYW4gb2JqZWN0IHtldmVudE5hbWU6IGhhbmRsZXJ9XG4gICAgICogQHBhcmFtIHsoZnVuY3Rpb258Kil9IFtoYW5kbGVyXSAtIEhhbmRsZXIgZnVuY3Rpb24gb3IgY29udGV4dFxuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIC0gQ29udGV4dCBmb3IgYmluZGluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogIC8vIDEuIEJhc2ljXG4gICAgICogIGN1c3RvbUV2ZW50Lm9uKCdvbmxvYWQnLCBoYW5kbGVyKTtcbiAgICAgKlxuICAgICAqICAvLyAyLiBXaXRoIGNvbnRleHRcbiAgICAgKiAgY3VzdG9tRXZlbnQub24oJ29ubG9hZCcsIGhhbmRsZXIsIG15T2JqKTtcbiAgICAgKlxuICAgICAqICAvLyAzLiBBdHRhY2ggd2l0aCBhbiBvYmplY3RcbiAgICAgKiAgY3VzdG9tRXZlbnQub24oe1xuICAgICAqICAgICdwbGF5JzogaGFuZGxlcixcbiAgICAgKiAgICAncGF1c2UnOiBoYW5kbGVyMlxuICAgICAqICB9KTtcbiAgICAgKlxuICAgICAqICAvLyA0LiBBdHRhY2ggd2l0aCBhbiBvYmplY3Qgd2l0aCBjb250ZXh0XG4gICAgICogIGN1c3RvbUV2ZW50Lm9uKHtcbiAgICAgKiAgICAncGxheSc6IGhhbmRsZXJcbiAgICAgKiAgfSwgbXlPYmopO1xuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGV2ZW50TmFtZUxpc3Q7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzT2JqZWN0KGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgIC8vIHtldmVudE5hbWU6IGhhbmRsZXJ9XG4gICAgICAgICAgICBjb250ZXh0ID0gaGFuZGxlcjtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKGV2ZW50TmFtZSwgZnVuY3Rpb24oaGFuZGxlciwgbmFtZSkge1xuICAgICAgICAgICAgICAgICB0aGlzLm9uKG5hbWUsIGhhbmRsZXIsIGNvbnRleHQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAodHVpLnV0aWwuaXNTdHJpbmcoZXZlbnROYW1lKSAmJiBldmVudE5hbWUuaW5kZXhPZignICcpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3Npbmcgb2YgbXVsdGlwbGUgZXZlbnRzIGJ5IHNwbGl0IGV2ZW50IG5hbWVcbiAgICAgICAgICAgIGV2ZW50TmFtZUxpc3QgPSBldmVudE5hbWUuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2hBcnJheShldmVudE5hbWVMaXN0LCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbihuYW1lLCBoYW5kbGVyLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN0eElkO1xuXG4gICAgICAgIGlmICh0dWkudXRpbC5pc0V4aXN0eShjb250ZXh0KSkge1xuICAgICAgICAgICAgY3R4SWQgPSB0dWkudXRpbC5zdGFtcChjb250ZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0dWkudXRpbC5pc0V4aXN0eShjdHhJZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEN0eEV2ZW50KGV2ZW50TmFtZSwgY29udGV4dCwgaGFuZGxlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hZGROb3JtYWxFdmVudChldmVudE5hbWUsIGhhbmRsZXIpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERldGFjaCB0aGUgZXZlbnQgaGFuZGxlci5cbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8e25hbWU6c3RyaW5nLCBoYW5kbGVyOmZ1bmN0aW9ufSl9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lIG9yIGFuIG9iamVjdCB7ZXZlbnROYW1lOiBoYW5kbGVyfVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtoYW5kbGVyXSBIYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyAxLiBvZmYgYnkgY29udGV4dFxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZihteU9iaik7XG4gICAgICpcbiAgICAgKiAvLyAyLiBvZmYgYnkgZXZlbnQgbmFtZVxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZignb25sb2FkJyk7XG4gICAgICpcbiAgICAgKiAvLyAzLiBvZmYgYnkgaGFuZGxlclxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZihoYW5kbGVyKTtcbiAgICAgKlxuICAgICAqIC8vIDQuIG9mZiBieSBldmVudCBuYW1lIGFuZCBoYW5kbGVyXG4gICAgICogY3VzdG9tRXZlbnQub2ZmKCdwbGF5JywgaGFuZGxlcik7XG4gICAgICpcbiAgICAgKiAvLyA1LiBvZmYgYnkgY29udGV4dCBhbmQgaGFuZGxlclxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZihteU9iaiwgaGFuZGxlcik7XG4gICAgICpcbiAgICAgKiAvLyA2LiBvZmYgYnkgY29udGV4dCBhbmQgZXZlbnQgbmFtZVxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZihteU9iaiwgJ29ubG9hZCcpO1xuICAgICAqXG4gICAgICogLy8gNy4gb2ZmIGJ5IGFuIE9iamVjdC48c3RyaW5nLCBmdW5jdGlvbj4gdGhhdCBpcyB7ZXZlbnROYW1lOiBoYW5kbGVyfVxuICAgICAqIGN1c3RvbUV2ZW50Lm9mZih7XG4gICAgICogICAncGxheSc6IGhhbmRsZXIsXG4gICAgICogICAncGF1c2UnOiBoYW5kbGVyMlxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gOC4gb2ZmIHRoZSBhbGwgZXZlbnRzXG4gICAgICogY3VzdG9tRXZlbnQub2ZmKCk7XG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyA4LiBvZmYgdGhlIGFsbCBldmVudHNcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl9jdHhFdmVudHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzRnVuY3Rpb24oZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgLy8gMy4gb2ZmIGJ5IGhhbmRsZXJcbiAgICAgICAgICAgIHRoaXMuX29mZkJ5SGFuZGxlcihldmVudE5hbWUpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodHVpLnV0aWwuaXNPYmplY3QoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgaWYgKHR1aS51dGlsLmhhc1N0YW1wKGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAvLyAxLCA1LCA2IG9mZiBieSBjb250ZXh0XG4gICAgICAgICAgICAgICAgdGhpcy5fb2ZmQnlDb250ZXh0KGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIDQuIG9mZiBieSBhbiBPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+XG4gICAgICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMoZXZlbnROYW1lLCBmdW5jdGlvbihoYW5kbGVyLCBuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2ZmKG5hbWUsIGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAyLCA0IG9mZiBieSBldmVudCBuYW1lXG4gICAgICAgICAgICB0aGlzLl9vZmZCeUV2ZW50TmFtZShldmVudE5hbWUsIGhhbmRsZXIpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgY291bnQgb2YgZXZlbnRzIHJlZ2lzdGVyZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50TmFtZSAtIEN1c3RvbSBldmVudCBuYW1lXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5nZXRMaXN0ZW5lckxlbmd0aCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICB2YXIgY3R4RXZlbnRzID0gdGhpcy5fY3R4RXZlbnRzLFxuICAgICAgICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzLFxuICAgICAgICAgICAgZXhpc3R5ID0gdHVpLnV0aWwuaXNFeGlzdHksXG4gICAgICAgICAgICBsZW5LZXkgPSB0aGlzLl9nZXRDdHhMZW5LZXkoZXZlbnROYW1lKTtcblxuICAgICAgICB2YXIgbm9ybWFsID0gKGV4aXN0eShldmVudHMpICYmIHR1aS51dGlsLmlzQXJyYXkoZXZlbnRzW2V2ZW50TmFtZV0pKSA/IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aCA6IDAsXG4gICAgICAgICAgICBjdHggPSAoZXhpc3R5KGN0eEV2ZW50cykgJiYgZXhpc3R5KGN0eEV2ZW50c1tsZW5LZXldKSkgPyBjdHhFdmVudHNbbGVuS2V5XSA6IDA7XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbCArIGN0eDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHdoZXRoZXIgYXQgbGVhc3Qgb25lIG9mIHRoZSBoYW5kbGVycyBpcyByZWdpc3RlcmVkIGluIHRoZSBnaXZlbiBldmVudCBuYW1lLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBDdXN0b20gZXZlbnQgbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJcyB0aGVyZSBhdCBsZWFzdCBvbmUgaGFuZGxlciBpbiBldmVudCBuYW1lP1xuICAgICAqL1xuICAgIEN1c3RvbUV2ZW50cy5wcm90b3R5cGUuaGFzTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGlzdGVuZXJMZW5ndGgoZXZlbnROYW1lKSA+IDA7XG4gICAgfTtcblxuXG5cbiAgICAvKipcbiAgICAgKiBGaXJlIGEgZXZlbnQgYW5kIHJldHVybnMgdGhlIHJlc3VsdCBvZiBvcGVyYXRpb24gJ2Jvb2xlYW4gQU5EJyB3aXRoIGFsbCBsaXN0ZW5lcidzIHJlc3VsdHMuPGJyPlxuICAgICAqIFNvLCBJdCBpcyBkaWZmZXJlbnQgZnJvbSB7QGxpbmsgQ3VzdG9tRXZlbnRzI2ZpcmV9Ljxicj5cbiAgICAgKiBJbiBzZXJ2aWNlIGNvZGUsXG4gICAgICogIHVzZSB0aGlzIGFzIGEgYmVmb3JlIGV2ZW50IGluIGNvbXBvbmVudCBsZXZlbCB1c3VhbGx5IGZvciBub3RpZnlpbmcgdGhhdCB0aGUgZXZlbnQgaXMgY2FuY2VsYWJsZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIC0gQ3VzdG9tIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gey4uLip9IGRhdGEgLSBEYXRhIGZvciBldmVudFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUaGUgcmVzdWx0IG9mIG9wZXJhdGlvbiAnYm9vbGVhbiBBTkQnXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgaWYgKHRoaXMuaW52b2tlKCdiZWZvcmVab29tJykpIHsgICAgLy8gY2hlY2sgdGhlIHJlc3VsdCBvZiAnYmVmb3JlWm9vbSdcbiAgICAgKiAgICAgIC8vIGlmIHRydWUsXG4gICAgICogICAgICAvLyBkb1NvbWV0aGluZ1xuICAgICAqICB9XG4gICAgICpcbiAgICAgKiAgLy8gSW4gc2VydmljZSBjb2RlLFxuICAgICAqICBtYXAub24oe1xuICAgICAqICAgICAgJ2JlZm9yZVpvb20nOiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgICBpZiAodGhhdC5kaXNhYmxlZCAmJiB0aGlzLmdldFN0YXRlKCkpIHsgICAgLy8gSXQgc2hvdWxkIGNhbmNlbCB0aGUgJ3pvb20nIGV2ZW50IGJ5IHNvbWUgY29uZGl0aW9ucy5cbiAgICAgKiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgKiAgICAgIH1cbiAgICAgKiAgfSk7XG4gICAgICovXG4gICAgQ3VzdG9tRXZlbnRzLnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0xpc3RlbmVyKGV2ZW50TmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXMsXG4gICAgICAgICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgICAgICAgZXhpc3R5ID0gdHVpLnV0aWwuaXNFeGlzdHk7XG5cbiAgICAgICAgdGhpcy5fZWFjaEV2ZW50QnlFdmVudE5hbWUoZXZlbnROYW1lLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpZiAoZXhpc3R5KGl0ZW0pICYmIGl0ZW0uZm4uYXBwbHkoc2VsZiwgYXJncykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuX2VhY2hDdHhFdmVudEJ5RXZlbnROYW1lKGV2ZW50TmFtZSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgaWYgKGV4aXN0eShpdGVtKSAmJiBpdGVtLmZuLmFwcGx5KGl0ZW0uY3R4LCBhcmdzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmlyZSBhIGV2ZW50IGJ5IGV2ZW50IG5hbWUgd2l0aCBkYXRhLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgLSBDdXN0b20gZXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSB7Li4uKn0gZGF0YSAtIERhdGEgZm9yIGV2ZW50XG4gICAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgaW5zdGFuY2Uub24oJ21vdmUnLCBmdW5jdGlvbihkaXJlY3Rpb24pIHtcbiAgICAgKiAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgICogIH0pO1xuICAgICAqICBpbnN0YW5jZS5maXJlKCdtb3ZlJywgJ2xlZnQnKTtcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLmZpcmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBhIG9uZS1zaG90IGV2ZW50LlxuICAgICAqIEBwYXJhbSB7KG9iamVjdHxzdHJpbmcpfSBldmVudE5hbWUgLSBDdXN0b20gZXZlbnQgbmFtZSBvciBhbiBvYmplY3Qge2V2ZW50TmFtZTogaGFuZGxlcn1cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIEhhbmRsZXIgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0geyp9IFtjb250ZXh0XSAtIENvbnRleHQgZm9yIGJpbmRpbmdcbiAgICAgKi9cbiAgICBDdXN0b21FdmVudHMucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAodHVpLnV0aWwuaXNPYmplY3QoZXZlbnROYW1lKSkge1xuICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMoZXZlbnROYW1lLCBmdW5jdGlvbihoYW5kbGVyLCBldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uY2UoZXZlbnROYW1lLCBoYW5kbGVyLCBmbik7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25jZUhhbmRsZXIoKSB7XG4gICAgICAgICAgICBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgdGhhdC5vZmYoZXZlbnROYW1lLCBvbmNlSGFuZGxlciwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgb25jZUhhbmRsZXIsIGNvbnRleHQpO1xuICAgIH07XG5cbiAgICB0dWkudXRpbC5DdXN0b21FdmVudHMgPSBDdXN0b21FdmVudHM7XG5cbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogZGVmaW5lQ2xhc3MuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIGZ1bmN0aW9uIHRvIG1ha2UgYSBjb25zdHJ1Y3RvciB0aGF0IGNhbiBpbmhlcml0IGZyb20gdGhlIG90aGVyIGNvbnN0cnVjdG9ycyBsaWtlIHRoZSBDTEFTUyBlYXNpbHkuXG4gKiBAYXV0aG9yIE5ITiBFbnQuXG4gKiAgICAgICAgIEZFIERldmVsb3BtZW50IFRlYW0gPGUwMjQyQG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBpbmhlcml0YW5jZS5qcywgb2JqZWN0LmpzXG4gKi9cblxuKGZ1bmN0aW9uKHR1aSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aSkge1xuICAgICAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdHVpLnV0aWwpIHtcbiAgICAgICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwIGEgY29uc3RydWN0b3IgdG8gYmUgZGVmaW5lZCBhbmQgdG8gaW5oZXJpdCBmcm9tIHRoZSBvdGhlciBjb25zdHJ1Y3RvcnNcbiAgICAgKiBAcGFyYW0geyp9IFtwYXJlbnRdIFBhcmVudCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBNZW1iZXJzIG9mIGNvbnN0cnVjdG9yXG4gICAgICogIEBwYXJhbSB7RnVuY3Rpb259IHByb3BzLmluaXQgSW5pdGlhbGl6YXRpb24gbWV0aG9kXG4gICAgICogIEBwYXJhbSB7T2JqZWN0fSBbcHJvcHMuc3RhdGljXSBTdGF0aWMgbWVtYmVycyBvZiBjb25zdHJ1Y3RvclxuICAgICAqIEByZXR1cm5zIHsqfSBDb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBQYXJlbnQgPSBkZWZpbmVDbGFzcyh7XG4gICAgICogICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgICB0aGlzLm5hbWUgPSAnbWFkZSBieSBkZWYnO1xuICAgICAqICAgICAgfSxcbiAgICAgKiAgICAgIG1ldGhvZDogZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgICAgLy8uLmNhbiBkbyBzb21ldGhpbmcgd2l0aCB0aGlzXG4gICAgICogICAgICB9LFxuICAgICAqICAgICAgc3RhdGljOiB7XG4gICAgICogICAgICAgICAgc3RhdGljTWV0aG9kOiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgICAgICAgIC8vLi5kbyBzb21ldGhpbmdcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9XG4gICAgICogIH0pO1xuICAgICAqXG4gICAgICogIHZhciBDaGlsZCA9IGRlZmluZUNsYXNzKFBhcmVudCwge1xuICAgICAqICAgICAgbWV0aG9kMjogZnVuY3Rpb24oKSB7fVxuICAgICAqICB9KTtcbiAgICAgKlxuICAgICAqICBQYXJlbnQuc3RhdGljTWV0aG9kKCk7XG4gICAgICpcbiAgICAgKiAgdmFyIHBhcmVudEluc3RhbmNlID0gbmV3IFBhcmVudCgpO1xuICAgICAqICBjb25zb2xlLmxvZyhwYXJlbnRJbnN0YW5jZS5uYW1lKTsgLy9tYWRlIGJ5IGRlZlxuICAgICAqICBwYXJlbnRJbnN0YW5jZS5zdGF0aWNNZXRob2QoKTsgLy8gRXJyb3JcbiAgICAgKlxuICAgICAqICB2YXIgY2hpbGRJbnN0YW5jZSA9IG5ldyBDaGlsZCgpO1xuICAgICAqICBjaGlsZEluc3RhbmNlLm1ldGhvZCgpO1xuICAgICAqICBjaGlsZEluc3RhbmNlLm1ldGhvZDIoKTtcbiAgICAgKi9cbiAgICB0dWkudXRpbC5kZWZpbmVDbGFzcyA9IGZ1bmN0aW9uKHBhcmVudCwgcHJvcHMpIHtcbiAgICAgICAgdmFyIG9iajtcblxuICAgICAgICBpZiAoIXByb3BzKSB7XG4gICAgICAgICAgICBwcm9wcyA9IHBhcmVudDtcbiAgICAgICAgICAgIHBhcmVudCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBvYmogPSBwcm9wcy5pbml0IHx8IGZ1bmN0aW9uKCl7fTtcblxuICAgICAgICBpZihwYXJlbnQpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmluaGVyaXQob2JqLCBwYXJlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BzLmhhc093blByb3BlcnR5KCdzdGF0aWMnKSkge1xuICAgICAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKG9iaiwgcHJvcHMuc3RhdGljKTtcbiAgICAgICAgICAgIGRlbGV0ZSBwcm9wcy5zdGF0aWM7XG4gICAgICAgIH1cblxuICAgICAgICB0dWkudXRpbC5leHRlbmQob2JqLnByb3RvdHlwZSwgcHJvcHMpO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcblxufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBkZWZpbmVNb2R1bGUuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lIG1vZHVsZVxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHlwZS5qcywgZGVmaW5lTmFtZXNwYWNlLmpzXG4gKi9cbihmdW5jdGlvbih0dWkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgdmFyIHV0aWwgPSB0dWkudXRpbCxcbiAgICAgICAgSU5JVElBTElaQVRJT05fTUVUSE9EX05BTUUgPSAnaW5pdGlhbGl6ZSc7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmUgbW9kdWxlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVzcGFjZSAtIE5hbWVzcGFjZSBvZiBtb2R1bGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbW9kdWxlRGVmaW5pdGlvbiAtIE9iamVjdCBsaXRlcmFsIGZvciBtb2R1bGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBEZWZpbmVkIG1vZHVsZVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogICAgIHZhciBteU1vZHVsZSA9IHR1aS51dGlsLmRlZmluZU1vZHVsZSgnbW9kdWxlcy5teU1vZHVsZScsIHtcbiAgICAgKiAgICAgICAgICBuYW1lOiAnam9obicsXG4gICAgICogICAgICAgICAgbWVzc2FnZTogJycsXG4gICAgICogICAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9ICdoZWxsbyB3b3JsZCc7XG4gICAgICogICAgICAgICAgfSxcbiAgICAgKiAgICAgICAgICBnZXRNZXNzYWdlOiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArICc6ICcgKyB0aGlzLm1lc3NhZ2VcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogICAgIGNvbnNvbGUubG9nKG15TW9kdWxlLmdldE1lc3NhZ2UoKSk7ICAvLyAnam9objogaGVsbG8gd29ybGQnO1xuICAgICAqICAgICBjb25zb2xlLmxvZyh3aW5kb3cubW9kdWxlcy5teU1vZHVsZS5nZXRNZXNzYWdlKCkpOyAgIC8vICdqb2huOiBoZWxsbyB3b3JsZCc7XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVmaW5lTW9kdWxlKG5hbWVzcGFjZSwgbW9kdWxlRGVmaW5pdGlvbikge1xuICAgICAgICB2YXIgYmFzZSA9IG1vZHVsZURlZmluaXRpb24gfHwge307XG5cbiAgICAgICAgaWYgKHV0aWwuaXNGdW5jdGlvbihiYXNlW0lOSVRJQUxJWkFUSU9OX01FVEhPRF9OQU1FXSkpIHtcbiAgICAgICAgICAgIGJhc2VbSU5JVElBTElaQVRJT05fTUVUSE9EX05BTUVdKCk7XG4gICAgICAgICAgICBkZWxldGUgYmFzZVtJTklUSUFMSVpBVElPTl9NRVRIT0RfTkFNRV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXRpbC5kZWZpbmVOYW1lc3BhY2UobmFtZXNwYWNlLCBiYXNlLCB0cnVlKTtcbiAgICB9XG4gICAgdHVpLnV0aWwuZGVmaW5lTW9kdWxlID0gZGVmaW5lTW9kdWxlO1xufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBkZWZpbmVOYW1lc3BhY2UuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgRGVmaW5lIG5hbWVzcGFjZVxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgaW5oZXJpdGFuY2UuanMsIG9iamVjdC5qcywgY29sbGVjdGlvbi5qc1xuICovXG4oZnVuY3Rpb24odHVpKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIG5hbWVzcGFjZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTW9kdWxlIG5hbWVcbiAgICAgKiBAcGFyYW0geyhvYmplY3R8ZnVuY3Rpb24pfSBwcm9wcyAtIEEgc2V0IG9mIG1vZHVsZXMgb3Igb25lIG1vZHVsZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNPdmVycmlkZSBmbGFnIC0gV2hhdCBpZiBtb2R1bGUgYWxyZWFkeSBkZWZpbmUsIG92ZXJyaWRlIG9yIG5vdFxuICAgICAqIEByZXR1cm5zIHsob2JqZWN0fGZ1bmN0aW9uKX0gRGVmaW5lZCBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZUNvbXAgPSBkZWZpbmVOYW1lc3BhY2UoJ25lLmNvbXBvbmVudCcpO1xuICAgICAqIG5lQ29tcC5saXN0TWVudSA9IHR1aS51dGlsLmRlZmluZUNsYXNzKHtcbiAgICAgKiAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgICAgIC8vIGNvZGVcbiAgICAgKiAgICAgIH1cbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB2YXIgZGVmaW5lTmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSwgcHJvcHMsIGlzT3ZlcnJpZGUpIHtcbiAgICAgICAgdmFyIG5hbWVzcGFjZSxcbiAgICAgICAgICAgIGxhc3RzcGFjZSxcbiAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgIG1vZHVsZSA9IGdldE5hbWVzcGFjZShuYW1lKTtcblxuICAgICAgICBpZiAoIWlzT3ZlcnJpZGUgJiYgaXNWYWxpZFR5cGUobW9kdWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVzcGFjZSA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgbGFzdHNwYWNlID0gbmFtZXNwYWNlLnBvcCgpO1xuICAgICAgICBuYW1lc3BhY2UudW5zaGlmdCh3aW5kb3cpO1xuXG4gICAgICAgIHJlc3VsdCA9IHR1aS51dGlsLnJlZHVjZShuYW1lc3BhY2UsIGZ1bmN0aW9uKG9iaiwgbmFtZSkge1xuICAgICAgICAgICAgb2JqW25hbWVdID0gb2JqW25hbWVdIHx8IHt9O1xuICAgICAgICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0W2xhc3RzcGFjZV0gPSBpc1ZhbGlkVHlwZShwcm9wcykgPyBwcm9wcyA6IHt9O1xuXG4gICAgICAgIHJldHVybiByZXN1bHRbbGFzdHNwYWNlXTtcblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgbmFtZXNwYWNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBuYW1lc3BhY2VcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICB2YXIgZ2V0TmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB2YXIgbmFtZXNwYWNlLFxuICAgICAgICAgICAgcmVzdWx0O1xuXG4gICAgICAgIG5hbWVzcGFjZSA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgbmFtZXNwYWNlLnVuc2hpZnQod2luZG93KTtcblxuICAgICAgICByZXN1bHQgPSB0dWkudXRpbC5yZWR1Y2UobmFtZXNwYWNlLCBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmogJiYgb2JqW25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdmFsaWQgdHlwZVxuICAgICAqIEBwYXJhbSB7Kn0gbW9kdWxlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIGlzVmFsaWRUeXBlID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICAgIHJldHVybiAodHVpLnV0aWwuaXNPYmplY3QobW9kdWxlKSB8fCB0dWkudXRpbC5pc0Z1bmN0aW9uKG1vZHVsZSkpO1xuICAgIH07XG5cbiAgICB0dWkudXRpbC5kZWZpbmVOYW1lc3BhY2UgPSBkZWZpbmVOYW1lc3BhY2U7XG5cbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogZW51bS5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIEVudW0gQ29uc3RydWN0b3IuXG4gKiBAYXV0aG9yIE5ITiBFbnQuXG4gKiAgICAgICAgIEZFIERldmVsb3BtZW50IFRlYW0gPGUwMjQyQG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSB0eXBlLCBjb2xsZWN0aW9uLmpzXG4gKi9cblxuKGZ1bmN0aW9uKHR1aSkge1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuaWYgKCF0dWkpIHtcbiAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG59XG5pZiAoIXR1aS51dGlsKSB7XG4gICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBkZWZpbmVQcm9wZXJ0eSgpIG1ldGhvZCBpcyBzdXBwb3J0ZWQuXG4gKiBAdHlwZSB7Ym9vbGVhbn1cbiAqL1xudmFyIGlzU3VwcG9ydERlZmluZWRQcm9wZXJ0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAneCcsIHt9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSgpKTtcblxuLyoqXG4gKiBBIHVuaXF1ZSB2YWx1ZSBvZiBhIGNvbnN0YW50LlxuICogQHR5cGUge251bWJlcn1cbiAqL1xudmFyIGVudW1WYWx1ZSA9IDA7XG5cbi8qKlxuICogTWFrZSBhIGNvbnN0YW50LWxpc3QgdGhhdCBoYXMgdW5pcXVlIHZhbHVlcy48YnI+XG4gKiBJbiBtb2Rlcm4gYnJvd3NlcnMgKGV4Y2VwdCBJRTggYW5kIGxvd2VyKSw8YnI+XG4gKiAgYSB2YWx1ZSBkZWZpbmVkIG9uY2UgY2FuIG5vdCBiZSBjaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7Li4uc3RyaW5nIHwgc3RyaW5nW119IGl0ZW1MaXN0IENvbnN0YW50LWxpc3QgKEFuIGFycmF5IG9mIHN0cmluZyBpcyBhdmFpbGFibGUpXG4gKiBAZXhwb3J0cyBFbnVtXG4gKiBAY29uc3RydWN0b3JcbiAqIEBjbGFzc1xuICogQG1lbWJlcm9mIHR1aS51dGlsXG4gKiBAZXhhbXBsZXNcbiAqICAvL2NyZWF0ZVxuICogIHZhciBNWUVOVU0gPSBuZXcgRW51bSgnVFlQRTEnLCAnVFlQRTInKTtcbiAqICB2YXIgTVlFTlVNMiA9IG5ldyBFbnVtKFsnVFlQRTEnLCAnVFlQRTInXSk7XG4gKlxuICogIC8vdXNhZ2VcbiAqICBpZiAodmFsdWUgPT09IE1ZRU5VTS5UWVBFMSkge1xuICogICAgICAgLi4uLlxuICogIH1cbiAqXG4gKiAgLy9hZGQgKElmIGEgZHVwbGljYXRlIG5hbWUgaXMgaW5wdXR0ZWQsIHdpbGwgYmUgZGlzcmVnYXJkZWQuKVxuICogIE1ZRU5VTS5zZXQoJ1RZUEUzJywgJ1RZUEU0Jyk7XG4gKlxuICogIC8vZ2V0IG5hbWUgb2YgYSBjb25zdGFudCBieSBhIHZhbHVlXG4gKiAgTVlFTlVNLmdldE5hbWUoTVlFTlVNLlRZUEUxKTsgLy8gJ1RZUEUxJ+ydtCDrpqzthLTrkJzri6QuXG4gKlxuICogIC8vIEluIG1vZGVybiBicm93c2VycyAoZXhjZXB0IElFOCBhbmQgbG93ZXIpLCBhIHZhbHVlIGNhbiBub3QgYmUgY2hhbmdlZCBpbiBjb25zdGFudHMuXG4gKiAgdmFyIG9yaWdpbmFsVmFsdWUgPSBNWUVOVU0uVFlQRTE7XG4gKiAgTVlFTlVNLlRZUEUxID0gMTIzNDsgLy8gbWF5YmUgVHlwZUVycm9yXG4gKiAgTVlFTlVNLlRZUEUxID09PSBvcmlnaW5hbFZhbHVlOyAvLyB0cnVlXG4gKlxuICoqL1xuZnVuY3Rpb24gRW51bShpdGVtTGlzdCkge1xuICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICB0aGlzLnNldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBjb25zdGFudHMtbGlzdFxuICogQHBhcmFtIHsuLi5zdHJpbmd8IHN0cmluZ1tdfSBpdGVtTGlzdCBDb25zdGFudC1saXN0IChBbiBhcnJheSBvZiBzdHJpbmcgaXMgYXZhaWxhYmxlKVxuICovXG5FbnVtLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihpdGVtTGlzdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICghdHVpLnV0aWwuaXNBcnJheShpdGVtTGlzdCkpIHtcbiAgICAgICAgaXRlbUxpc3QgPSB0dWkudXRpbC50b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgdHVpLnV0aWwuZm9yRWFjaChpdGVtTGlzdCwgZnVuY3Rpb24gaXRlbUxpc3RJdGVyYXRlZShpdGVtKSB7XG4gICAgICAgIHNlbGYuX2FkZEl0ZW0oaXRlbSk7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGtleSBvZiB0aGUgY29uc3RhbnQuXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgQSB2YWx1ZSBvZiB0aGUgY29uc3RhbnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH0gS2V5IG9mIHRoZSBjb25zdGFudC5cbiAqL1xuRW51bS5wcm90b3R5cGUuZ2V0TmFtZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGZvdW5kZWRLZXksXG4gICAgICAgIHNlbGYgPSB0aGlzO1xuXG4gICAgdHVpLnV0aWwuZm9yRWFjaCh0aGlzLCBmdW5jdGlvbihpdGVtVmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoc2VsZi5faXNFbnVtSXRlbShrZXkpICYmIHZhbHVlID09PSBpdGVtVmFsdWUpIHtcbiAgICAgICAgICAgIGZvdW5kZWRLZXkgPSBrZXk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZGVkS2V5O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYSBjb25zdGFudC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBDb25zdGFudCBuYW1lLiAoSXQgd2lsbCBiZSBhIGtleSBvZiBhIGNvbnN0YW50KVxuICovXG5FbnVtLnByb3RvdHlwZS5fYWRkSXRlbSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLl9tYWtlRW51bVZhbHVlKCk7XG5cbiAgICAgICAgaWYgKGlzU3VwcG9ydERlZmluZWRQcm9wZXJ0eSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybiBhIHVuaXF1ZSB2YWx1ZSBmb3IgYXNzaWduaW5nIHRvIGEgY29uc3RhbnQuXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge251bWJlcn0gQSB1bmlxdWUgdmFsdWVcbiAqL1xuRW51bS5wcm90b3R5cGUuX21ha2VFbnVtVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICB2YWx1ZSA9IGVudW1WYWx1ZTtcbiAgICBlbnVtVmFsdWUgKz0gMTtcblxuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHdoZXRoZXIgYSBjb25zdGFudCBmcm9tIHRoZSBnaXZlbiBrZXkgaXMgaW4gaW5zdGFuY2Ugb3Igbm90LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIEEgY29uc3RhbnQga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmVzdWx0XG4gKiBAcHJpdmF0ZVxuICovXG5FbnVtLnByb3RvdHlwZS5faXNFbnVtSXRlbSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiB0dWkudXRpbC5pc051bWJlcih0aGlzW2tleV0pO1xufTtcblxudHVpLnV0aWwuRW51bSA9IEVudW07XG5cbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogZXhNYXAuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqICBJbXBsZW1lbnRzIHRoZSBFeE1hcCAoRXh0ZW5kZWQgTWFwKSBvYmplY3QuXG4gKiBAYXV0aG9yIE5ITiBFbnQuXG4gKiAgICAgICAgIEZFIERldmVsb3BtZW50IFRlYW0gPGUwMjQyQG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBNYXAuanMsIGNvbGxlY3Rpb24uanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLy8gQ2FjaGluZyB0dWkudXRpbCBmb3IgcGVyZm9ybWFuY2UgZW5oYW5jaW5nXG4gICAgdmFyIHV0aWwgPSB0dWkudXRpbCxcbiAgICAgICAgbWFwQVBJc0ZvclJlYWQgPSBbJ2dldCcsICdoYXMnLCAnZm9yRWFjaCcsICdrZXlzJywgJ3ZhbHVlcycsICdlbnRyaWVzJ10sXG4gICAgICAgIG1hcEFQSXNGb3JEZWxldGUgPSBbJ2RlbGV0ZScsICdjbGVhciddO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEV4TWFwIG9iamVjdCBpcyBFeHRlbmRlZCBWZXJzaW9uIG9mIHRoZSB0dWkudXRpbC5NYXAgb2JqZWN0Ljxicj5cbiAgICAgKiBhbmQgYWRkZWQgc29tZSB1c2VmdWwgZmVhdHVyZSB0byBtYWtlIGl0IGVhc3kgdG8gbWFuYWdlIHRoZSBNYXAgb2JqZWN0LlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGluaXREYXRhIC0gQXJyYXkgb2Yga2V5LXZhbHVlIHBhaXJzICgyLWVsZW1lbnQgQXJyYXlzKS5cbiAgICAgKiAgICAgIEVhY2gga2V5LXZhbHVlIHBhaXIgd2lsbCBiZSBhZGRlZCB0byB0aGUgbmV3IE1hcFxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV4TWFwKGluaXREYXRhKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ldyB1dGlsLk1hcChpbml0RGF0YSk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX21hcC5zaXplO1xuICAgIH1cblxuICAgIHV0aWwuZm9yRWFjaEFycmF5KG1hcEFQSXNGb3JSZWFkLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIEV4TWFwLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcFtuYW1lXS5hcHBseSh0aGlzLl9tYXAsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICB1dGlsLmZvckVhY2hBcnJheShtYXBBUElzRm9yRGVsZXRlLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIEV4TWFwLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX21hcFtuYW1lXS5hcHBseSh0aGlzLl9tYXAsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9tYXAuc2l6ZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBFeE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuX21hcC5zZXQuYXBwbHkodGhpcy5fbWFwLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNpemUgPSB0aGlzLl9tYXAuc2l6ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldHMgYWxsIG9mIHRoZSBrZXktdmFsdWUgcGFpcnMgaW4gdGhlIHNwZWNpZmllZCBvYmplY3QgdG8gdGhlIE1hcCBvYmplY3QuXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmplY3QgLSBQbGFpbiBvYmplY3QgdGhhdCBoYXMgYSBrZXktdmFsdWUgcGFpclxuICAgICAqL1xuICAgIEV4TWFwLnByb3RvdHlwZS5zZXRPYmplY3QgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgdXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyhvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZWxlbWVudHMgYXNzb2NpYXRlZCB3aXRoIGtleXMgaW4gdGhlIHNwZWNpZmllZCBhcnJheS5cbiAgICAgKiBAcGFyYW0gIHtBcnJheX0ga2V5cyAtIEFycmF5IHRoYXQgY29udGFpbnMga2V5cyBvZiB0aGUgZWxlbWVudCB0byByZW1vdmVcbiAgICAgKi9cbiAgICBFeE1hcC5wcm90b3R5cGUuZGVsZXRlQnlLZXlzID0gZnVuY3Rpb24oa2V5cykge1xuICAgICAgICB1dGlsLmZvckVhY2hBcnJheShrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIHRoaXNbJ2RlbGV0ZSddKGtleSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIGFsbCBvZiB0aGUga2V5LXZhbHVlIHBhaXJzIGluIHRoZSBzcGVjaWZpZWQgTWFwIG9iamVjdCB0byB0aGlzIE1hcCBvYmplY3QuXG4gICAgICogQHBhcmFtICB7TWFwfSBtYXAgLSBNYXAgb2JqZWN0IHRvIGJlIG1lcmdlZCBpbnRvIHRoaXMgTWFwIG9iamVjdFxuICAgICAqL1xuICAgIEV4TWFwLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKG1hcCkge1xuICAgICAgICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvb2tzIHRocm91Z2ggZWFjaCBrZXktdmFsdWUgcGFpciBpbiB0aGUgbWFwIGFuZCByZXR1cm5zIHRoZSBuZXcgRXhNYXAgb2JqZWN0IG9mXG4gICAgICogYWxsIGtleS12YWx1ZSBwYWlycyB0aGF0IHBhc3MgYSB0cnV0aCB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gcHJlZGljYXRlIC0gRnVuY3Rpb24gdG8gdGVzdCBlYWNoIGtleS12YWx1ZSBwYWlyIG9mIHRoZSBNYXAgb2JqZWN0Ljxicj5cbiAgICAgKiAgICAgIEludm9rZWQgd2l0aCBhcmd1bWVudHMgKHZhbHVlLCBrZXkpLiBSZXR1cm4gdHJ1ZSB0byBrZWVwIHRoZSBlbGVtZW50LCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICogQHJldHVybiB7RXhNYXB9IEEgbmV3IEV4TWFwIG9iamVjdFxuICAgICAqL1xuICAgIEV4TWFwLnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICAgICAgdmFyIGZpbHRlcmVkID0gbmV3IEV4TWFwKCk7XG5cbiAgICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9O1xuXG4gICAgdXRpbC5FeE1hcCA9IEV4TWFwO1xufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBmb3JtYXREYXRlLmpzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRoaXMgbW9kdWxlIGhhcyBhIGZ1bmN0aW9uIGZvciBkYXRlIGZvcm1hdC5cbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR5cGUuanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHRva2VucyA9IC9bXFxcXF0qWVlZWXxbXFxcXF0qWVl8W1xcXFxdKk1NTU18W1xcXFxdKk1NTXxbXFxcXF0qTU18W1xcXFxdKk18W1xcXFxdKkREfFtcXFxcXSpEfFtcXFxcXSpISHxbXFxcXF0qSHxbXFxcXF0qQS9naSxcbiAgICAgICAgTU9OVEhfU1RSID0gW1wiSW52YWxpZCBtb250aFwiLCBcIkphbnVhcnlcIiwgXCJGZWJydWFyeVwiLCBcIk1hcmNoXCIsIFwiQXByaWxcIiwgXCJNYXlcIiwgXCJKdW5lXCIsIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdLFxuICAgICAgICBNT05USF9EQVlTID0gWzAsIDMxLCAyOCwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdLFxuICAgICAgICByZXBsYWNlTWFwID0ge1xuICAgICAgICAgICAgTTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIoZGF0ZS5tb250aCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU06IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9udGggPSBkYXRlLm1vbnRoO1xuICAgICAgICAgICAgICAgIHJldHVybiAoTnVtYmVyKG1vbnRoKSA8IDEwKSA/ICcwJyArIG1vbnRoIDogbW9udGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1PTlRIX1NUUltOdW1iZXIoZGF0ZS5tb250aCldLnN1YnN0cigwLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNTU1NOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1PTlRIX1NUUltOdW1iZXIoZGF0ZS5tb250aCldO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEQ6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGRhdGUuZGF0ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlTWFwLkQoZGF0ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgREQ6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF5SW5Nb250aCA9IGRhdGUuZGF0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKE51bWJlcihkYXlJbk1vbnRoKSA8IDEwKSA/ICcwJyArIGRheUluTW9udGggOiBkYXlJbk1vbnRoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VNYXAuREQoZGF0ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVk6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGRhdGUueWVhcikgJSAxMDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeXk6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwbGFjZU1hcC5ZWShkYXRlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHByZWZpeCA9ICcyMCcsXG4gICAgICAgICAgICAgICAgICAgIHllYXIgPSBkYXRlLnllYXI7XG4gICAgICAgICAgICAgICAgaWYgKHllYXIgPiA2OSAmJiB5ZWFyIDwgMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZWZpeCA9ICcxOSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoTnVtYmVyKHllYXIpIDwgMTAwKSA/IHByZWZpeCArIFN0cmluZyh5ZWFyKSA6IHllYXI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeXl5eTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlTWFwLllZWVkoZGF0ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXRlLm1lcmlkaWFuO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGE6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZS5tZXJpZGlhbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhoOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhvdXIgPSBkYXRlLmhvdXI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChOdW1iZXIoaG91cikgPCAxMCkgPyAnMCcgKyBob3VyIDogaG91cjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBISDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlTWFwLmhoKGRhdGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGg6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKE51bWJlcihkYXRlLmhvdXIpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VNYXAuaChkYXRlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhOdW1iZXIoZGF0ZS5taW51dGUpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtbTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAgICAgICAgIHZhciBtaW51dGUgPSBkYXRlLm1pbnV0ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKE51bWJlcihtaW51dGUpIDwgMTApID8gJzAnICsgbWludXRlIDogbWludXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGVzIGFyZSB2YWxpZCBkYXRlIG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geWVhciAtIFllYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbW9udGggLSBNb250aFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlIC0gRGF5IGluIG1vbnRoLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJcyB2YWxpZD9cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1ZhbGlkRGF0ZSh5ZWFyLCBtb250aCwgZGF0ZSkge1xuICAgICAgICB2YXIgaXNWYWxpZFllYXIsXG4gICAgICAgICAgICBpc1ZhbGlkTW9udGgsXG4gICAgICAgICAgICBpc1ZhbGlkLFxuICAgICAgICAgICAgbGFzdERheUluTW9udGg7XG5cbiAgICAgICAgeWVhciA9IE51bWJlcih5ZWFyKTtcbiAgICAgICAgbW9udGggPSBOdW1iZXIobW9udGgpO1xuICAgICAgICBkYXRlID0gTnVtYmVyKGRhdGUpO1xuXG4gICAgICAgIGlzVmFsaWRZZWFyID0gKHllYXIgPiAtMSAmJiB5ZWFyIDwgMTAwKSB8fCAoeWVhciA+IDE5NjkpICYmICh5ZWFyIDwgMjA3MCk7XG4gICAgICAgIGlzVmFsaWRNb250aCA9IChtb250aCA+IDApICYmIChtb250aCA8IDEzKTtcblxuICAgICAgICBpZiAoIWlzVmFsaWRZZWFyIHx8ICFpc1ZhbGlkTW9udGgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxhc3REYXlJbk1vbnRoID0gTU9OVEhfREFZU1ttb250aF07XG4gICAgICAgIGlmIChtb250aCA9PT0gMiAmJiB5ZWFyICUgNCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGxhc3REYXlJbk1vbnRoID0gMjk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpc1ZhbGlkID0gKGRhdGUgPiAwKSAmJiAoZGF0ZSA8PSBsYXN0RGF5SW5Nb250aCk7XG4gICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIHN0cmluZyB0aGF0IHRyYW5zZm9ybWVkIGZyb20gdGhlIGdpdmVuIGZvcm0gYW5kIGRhdGUuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZvcm0gLSBEYXRlIGZvcm1cbiAgICAgKiBAcGFyYW0ge0RhdGV8T2JqZWN0fSBkYXRlIC0gRGF0ZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbnxzdHJpbmd9IEEgdHJhbnNmb3JtZWQgc3RyaW5nIG9yIGZhbHNlLlxuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIC8vIGtleSAgICAgICAgIHwgU2hvcnRoYW5kXG4gICAgICogIC8vIC0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqICAvLyB5ZWFycyAgICAgICB8IFlZIC8gWVlZWSAvIHl5IC8geXl5eVxuICAgICAqICAvLyBtb250aHMobikgICB8IE0gLyBNTVxuICAgICAqICAvLyBtb250aHMoc3RyKSB8IE1NTSAvIE1NTU1cbiAgICAgKiAgLy8gZGF5cyAgICAgICAgfCBEIC8gREQgLyBkIC8gZGRcbiAgICAgKiAgLy8gaG91cnMgICAgICAgfCBIIC8gSEggLyBoIC8gaGhcbiAgICAgKiAgLy8gbWludXRlcyAgICAgfCBtIC8gbW1cbiAgICAgKiAgLy8gQU0vUE0gICAgICAgfCBBIC8gYVxuICAgICAqXG4gICAgICogIHZhciBkYXRlU3RyMSA9IGZvcm1hdERhdGUoJ3l5eXktTU0tZGQnLCB7XG4gICAgICogICAgICB5ZWFyOiAyMDE0LFxuICAgICAqICAgICAgbW9udGg6IDEyLFxuICAgICAqICAgICAgZGF0ZTogMTJcbiAgICAgKiAgfSk7XG4gICAgICogIGFsZXJ0KGRhdGVTdHIxKTsgLy8gJzIwMTQtMTItMTInXG4gICAgICpcbiAgICAgKiAgdmFyIGRhdGVTdHIyID0gZm9ybWF0RGF0ZSgnTU1NIEREIFlZWVkgSEg6bW0nLCB7XG4gICAgICogICAgICB5ZWFyOiAxOTk5LFxuICAgICAqICAgICAgbW9udGg6IDksXG4gICAgICogICAgICBkYXRlOiA5LFxuICAgICAqICAgICAgaG91cjogMCxcbiAgICAgKiAgICAgIG1pbnV0ZTogMlxuICAgICAqICB9KVxuICAgICAqICBhbGVydChkYXRlU3RyMik7IC8vICdTZXAgMDkgMTk5OSAwMDowMidcbiAgICAgKlxuICAgICAqICB2YXIgZHQgPSBuZXcgRGF0ZSgyMDEwLCAyLCAxMyksXG4gICAgICogICAgICBkYXRlU3RyMyA9IGZvcm1hdERhdGUoJ3l5eXnrhYQgTeyblCBkZOydvCcsIGR0KTtcbiAgICAgKlxuICAgICAqICBhbGVydChkYXRlU3RyMyk7IC8vICcyMDEw64WEIDPsm5QgMTPsnbwnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9ybWF0RGF0ZShmb3JtLCBkYXRlKSB7XG4gICAgICAgIHZhciBtZXJpZGlhbixcbiAgICAgICAgICAgIG5EYXRlLFxuICAgICAgICAgICAgcmVzdWx0U3RyO1xuXG4gICAgICAgIGlmICh0dWkudXRpbC5pc0RhdGUoZGF0ZSkpIHtcbiAgICAgICAgICAgIG5EYXRlID0ge1xuICAgICAgICAgICAgICAgIHllYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICAgICAgICBtb250aDogZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLmdldERhdGUoKSxcbiAgICAgICAgICAgICAgICBob3VyOiBkYXRlLmdldEhvdXJzKCksXG4gICAgICAgICAgICAgICAgbWludXRlOiBkYXRlLmdldE1pbnV0ZXMoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5EYXRlID0ge1xuICAgICAgICAgICAgICAgIHllYXI6IGRhdGUueWVhcixcbiAgICAgICAgICAgICAgICBtb250aDogZGF0ZS5tb250aCxcbiAgICAgICAgICAgICAgICBkYXRlOiBkYXRlLmRhdGUsXG4gICAgICAgICAgICAgICAgaG91cjogZGF0ZS5ob3VyLFxuICAgICAgICAgICAgICAgIG1pbnV0ZTogZGF0ZS5taW51dGVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzVmFsaWREYXRlKG5EYXRlLnllYXIsIG5EYXRlLm1vbnRoLCBuRGF0ZS5kYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbkRhdGUubWVyaWRpYW4gPSAnJztcbiAgICAgICAgaWYgKC9bXlxcXFxdW2FBXVxcYi9nLnRlc3QoZm9ybSkpIHtcbiAgICAgICAgICAgIG1lcmlkaWFuID0gKG5EYXRlLmhvdXIgPiAxMikgPyAnUE0nIDogJ0FNJztcbiAgICAgICAgICAgIG5EYXRlLmhvdXIgJT0gMTI7XG4gICAgICAgICAgICBuRGF0ZS5tZXJpZGlhbiA9IG1lcmlkaWFuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0U3RyID0gZm9ybS5yZXBsYWNlKHRva2VucywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoJ1xcXFwnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleS5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGxhY2VNYXBba2V5XShuRGF0ZSkgfHwgJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0U3RyO1xuICAgIH1cblxuICAgIHR1aS51dGlsLmZvcm1hdERhdGUgPSBmb3JtYXREYXRlO1xufSkod2luZG93LnR1aSk7XG5cblxuLyoqKioqKioqKipcbiAqIGZ1bmMuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgVGhpcyBtb2R1bGUgcHJvdmlkZXMgYSBiaW5kKCkgZnVuY3Rpb24gZm9yIGNvbnRleHQgYmluZGluZy5cbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBoYXMgaXRzIHRoaXMga2V5d29yZCBzZXQgdG8gdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIEEgb3JpZ2luYWwgZnVuY3Rpb24gYmVmb3JlIGJpbmRpbmdcbiAgICAgKiBAcGFyYW0geyp9IG9iaiBjb250ZXh0IG9mIGZ1bmN0aW9uIGluIGFyZ3VtZW50c1swXVxuICAgICAqIEByZXR1cm4ge2Z1bmN0aW9uKCl9IEEgbmV3IGJvdW5kIGZ1bmN0aW9uIHdpdGggY29udGV4dCB0aGF0IGlzIGluIGFyZ3VtZW50c1sxXVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmQoZm4sIG9iaikge1xuICAgICAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgICAgICAgaWYgKGZuLmJpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5iaW5kLmFwcGx5KGZuLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShvYmosIGFyZ3MubGVuZ3RoID8gYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSA6IGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdHVpLnV0aWwuYmluZCA9IGJpbmQ7XG5cbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogaGFzaE1hcC5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBUaGlzIG1vZHVsZSBwcm92aWRlcyB0aGUgSGFzaE1hcCBjb25zdHJ1Y3Rvci5cbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR5cGUsIGNvbGxlY3Rpb24uanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBkYXRhIGluIGhhc2hNYXAgYmVnaW4gd2l0aCBfTUFQREFUQVBSRUZJWDtcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdmFyIF9NQVBEQVRBUFJFRklYID0gJ8OlJztcblxuICAgIC8qKlxuICAgICAqIEhhc2hNYXAgY2FuIGhhbmRsZSB0aGUga2V5LXZhbHVlIHBhaXJzLjxicj5cbiAgICAgKiBDYXV0aW9uOjxicj5cbiAgICAgKiAgSGFzaE1hcCBpbnN0YW5jZSBoYXMgYSBsZW5ndGggcHJvcGVydHkgYnV0IGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBBcnJheS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29ial0gQSBpbml0aWFsIGRhdGEgZm9yIGNyZWF0aW9uLlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBobSA9IG5ldyB0dWkudXRpbC5IYXNoTWFwKHtcbiAgICAgKiAgICAgICdteWRhdGEnOiB7XG4gICAgICogICAgICAgICAgICdoZWxsbyc6ICdpbWZpbmUnXG4gICAgICogICAgICAgfSxcbiAgICAgKiAgICAgICd3aGF0JzogJ3RpbWUnXG4gICAgICogIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIEhhc2hNYXAob2JqKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzaXplXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgaWYgKG9iaikge1xuICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qob2JqKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBhIGRhdGEgZnJvbSB0aGUgZ2l2ZW4ga2V5IHdpdGggdmFsdWUgb3IgdGhlIGdpdmVuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IGtleSBBIHN0cmluZyBvciBvYmplY3QgZm9yIGtleVxuICAgICAqIEBwYXJhbSB7Kn0gW3ZhbHVlXSBBIGRhdGFcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB2YXIgaG0gPSBuZXcgSGFzaE1hcCgpO1xuICAgICAqXG4gICAgICogIGhtLnNldCgna2V5JywgJ3ZhbHVlJyk7XG4gICAgICogIGhtLnNldCh7XG4gICAgICogICAgICAna2V5MSc6ICdkYXRhMScsXG4gICAgICogICAgICAna2V5Mic6ICdkYXRhMidcbiAgICAgKiAgfSk7XG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICB0aGlzLnNldEtleVZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRPYmplY3Qoa2V5KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBkYXRhIGZyb20gdGhlIGdpdmVuIGtleSB3aXRoIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgQSBzdHJpbmcgZm9yIGtleVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgQSBkYXRhXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIGhtID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgKiAgaG0uc2V0S2V5VmFsdWUoJ2tleScsICd2YWx1ZScpO1xuICAgICAqL1xuICAgIEhhc2hNYXAucHJvdG90eXBlLnNldEtleVZhbHVlID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpc1t0aGlzLmVuY29kZUtleShrZXkpXSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBkYXRhIGZyb20gdGhlIGdpdmVuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIEEgb2JqZWN0IGZvciBkYXRhXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIGhtID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgKlxuICAgICAqICBobS5zZXRPYmplY3Qoe1xuICAgICAqICAgICAgJ2tleTEnOiAnZGF0YTEnLFxuICAgICAqICAgICAgJ2tleTInOiAnZGF0YTInXG4gICAgICogIH0pO1xuICAgICAqL1xuICAgIEhhc2hNYXAucHJvdG90eXBlLnNldE9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBzZWxmLnNldEtleVZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTWVyZ2Ugd2l0aCB0aGUgZ2l2ZW4gYW5vdGhlciBoYXNoTWFwLlxuICAgICAqIEBwYXJhbSB7SGFzaE1hcH0gaGFzaE1hcCBBbm90aGVyIGhhc2hNYXAgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBIYXNoTWFwLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKGhhc2hNYXApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGhhc2hNYXAuZWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBzZWxmLnNldEtleVZhbHVlKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRW5jb2RlIHRoZSBnaXZlbiBrZXkgZm9yIGhhc2hNYXAuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBBIHN0cmluZyBmb3Iga2V5XG4gICAgICogQHJldHVybnMge3N0cmluZ30gQSBlbmNvZGVkIGtleVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUuZW5jb2RlS2V5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBfTUFQREFUQVBSRUZJWCArIGtleTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGVjb2RlIHRoZSBnaXZlbiBrZXkgaW4gaGFzaE1hcC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEEgc3RyaW5nIGZvciBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIGRlY29kZWQga2V5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBIYXNoTWFwLnByb3RvdHlwZS5kZWNvZGVLZXkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIGRlY29kZWRLZXkgPSBrZXkuc3BsaXQoX01BUERBVEFQUkVGSVgpO1xuICAgICAgICByZXR1cm4gZGVjb2RlZEtleVtkZWNvZGVkS2V5Lmxlbmd0aC0xXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSB2YWx1ZSBmcm9tIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBBIHN0cmluZyBmb3Iga2V5XG4gICAgICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSBmcm9tIGEga2V5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgdmFyIGhtID0gbmV3IEhhc2hNYXAoKTtcbiAgICAgKiAgaG0uc2V0KCdrZXknLCAndmFsdWUnKTtcbiAgICAgKlxuICAgICAqICBobS5nZXQoJ2tleScpIC8vIHZhbHVlXG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RoaXMuZW5jb2RlS2V5KGtleSldO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB0aGUgZXhpc3RlbmNlIG9mIGEgdmFsdWUgZnJvbSB0aGUga2V5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgQSBzdHJpbmcgZm9yIGtleVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJbmRpY2F0aW5nIHdoZXRoZXIgYSB2YWx1ZSBleGlzdHMgb3Igbm90LlxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBobSA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICogIGhtLnNldCgna2V5JywgJ3ZhbHVlJyk7XG4gICAgICpcbiAgICAgKiAgaG0uaGFzKCdrZXknKSAvLyB0cnVlXG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc093blByb3BlcnR5KHRoaXMuZW5jb2RlS2V5KGtleSkpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBkYXRhKGtleS12YWx1ZSBwYWlycykgZnJvbSB0aGUgZ2l2ZW4ga2V5IG9yIHRoZSBnaXZlbiBrZXktbGlzdC5cbiAgICAgKiBAcGFyYW0gey4uLnN0cmluZ3xzdHJpbmdbXX0ga2V5IEEgc3RyaW5nIGZvciBrZXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfHN0cmluZ1tdfSBBIHJlbW92ZWQgZGF0YVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBobSA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICogIGhtLnNldCgna2V5JywgJ3ZhbHVlJyk7XG4gICAgICogIGhtLnNldCgna2V5MicsICd2YWx1ZScpO1xuICAgICAqXG4gICAgICogIC8vZXgxXG4gICAgICogIGhtLnJlbW92ZSgna2V5Jyk7XG4gICAgICpcbiAgICAgKiAgLy9leDJcbiAgICAgKiAgaG0ucmVtb3ZlKCdrZXknLCAna2V5MicpO1xuICAgICAqXG4gICAgICogIC8vZXgzXG4gICAgICogIGhtLnJlbW92ZShbJ2tleScsICdrZXkyJ10pO1xuICAgICAqL1xuICAgIEhhc2hNYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGtleSA9IHR1aS51dGlsLnRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0dWkudXRpbC5pc0FycmF5KGtleSkgPyB0aGlzLnJlbW92ZUJ5S2V5QXJyYXkoa2V5KSA6IHRoaXMucmVtb3ZlQnlLZXkoa2V5KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGRhdGEoa2V5LXZhbHVlIHBhaXIpIGZyb20gdGhlIGdpdmVuIGtleS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEEgc3RyaW5nIGZvciBrZXlcbiAgICAgKiBAcmV0dXJucyB7KnxudWxsfSBBIHJlbW92ZWQgZGF0YVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBobSA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICogIGhtLnNldCgna2V5JywgJ3ZhbHVlJyk7XG4gICAgICpcbiAgICAgKiAgaG0ucmVtb3ZlQnlLZXkoJ2tleScpXG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUucmVtb3ZlQnlLZXkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmhhcyhrZXkpID8gdGhpcy5nZXQoa2V5KSA6IG51bGw7XG5cbiAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzW3RoaXMuZW5jb2RlS2V5KGtleSldO1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBkYXRhKGtleS12YWx1ZSBwYWlycykgZnJvbSB0aGUgZ2l2ZW4ga2V5LWxpc3QuXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0ga2V5QXJyYXkgQW4gYXJyYXkgb2Yga2V5c1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX0gQSByZW1vdmVkIGRhdGFcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB2YXIgaG0gPSBuZXcgSGFzaE1hcCgpO1xuICAgICAqICBobS5zZXQoJ2tleScsICd2YWx1ZScpO1xuICAgICAqICBobS5zZXQoJ2tleTInLCAndmFsdWUnKTtcbiAgICAgKlxuICAgICAqICBobS5yZW1vdmVCeUtleUFycmF5KFsna2V5JywgJ2tleTInXSk7XG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUucmVtb3ZlQnlLZXlBcnJheSA9IGZ1bmN0aW9uKGtleUFycmF5KSB7XG4gICAgICAgIHZhciBkYXRhID0gW10sXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKGtleUFycmF5LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGRhdGEucHVzaChzZWxmLnJlbW92ZUJ5S2V5KGtleSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCB0aGUgZGF0YVxuICAgICAqL1xuICAgIEhhc2hNYXAucHJvdG90eXBlLnJlbW92ZUFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlKGtleSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIHRoZSBwcm92aWRlZCBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGFsbCB0aGUgZGF0YS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBDYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBobSA9IG5ldyBIYXNoTWFwKCk7XG4gICAgICogIGhtLnNldCgna2V5JywgJ3ZhbHVlJyk7XG4gICAgICogIGhtLnNldCgna2V5MicsICd2YWx1ZScpO1xuICAgICAqXG4gICAgICogIGhtLmVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAqICAgICAgLy9kbyBzb21ldGhpbmcuLi5cbiAgICAgKiAgfSk7XG4gICAgICovXG4gICAgSGFzaE1hcC5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGl0ZXJhdGVlKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgICAgIGZsYWc7XG5cbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXModGhpcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgaWYgKGtleS5jaGFyQXQoMCkgPT09IF9NQVBEQVRBUFJFRklYKSB7XG4gICAgICAgICAgICAgICAgZmxhZyA9IGl0ZXJhdGVlKHZhbHVlLCBzZWxmLmRlY29kZUtleShrZXkpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZsYWcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZsYWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIGtleS1saXN0IHN0b3JlZC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEEga2V5LWxpc3RcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB2YXIgaG0gPSBuZXcgSGFzaE1hcCgpO1xuICAgICAqICBobS5zZXQoJ2tleScsICd2YWx1ZScpO1xuICAgICAqICBobS5zZXQoJ2tleTInLCAndmFsdWUnKTtcbiAgICAgKlxuICAgICAqICBobS5rZXlzKCk7ICAvL1sna2V5JywgJ2tleTInKTtcbiAgICAgKi9cbiAgICBIYXNoTWFwLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAga2V5cy5wdXNoKHNlbGYuZGVjb2RlS2V5KGtleSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogV29yayBzaW1pbGFybHkgdG8gQXJyYXkucHJvdG90eXBlLm1hcCgpLjxicj5cbiAgICAgKiBJdCBleGVjdXRlcyB0aGUgcHJvdmlkZWQgY2FsbGJhY2sgdGhhdCBjaGVja3MgY29uZGl0aW9ucyBvbmNlIGZvciBlYWNoIGVsZW1lbnQgb2YgaGFzaE1hcCw8YnI+XG4gICAgICogIGFuZCByZXR1cm5zIGEgbmV3IGFycmF5IGhhdmluZyBlbGVtZW50cyBzYXRpc2Z5aW5nIHRoZSBjb25kaXRpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uIEEgZnVuY3Rpb24gdGhhdCBjaGVja3MgY29uZGl0aW9uc1xuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgaGF2aW5nIGVsZW1lbnRzIHNhdGlzZnlpbmcgdGhlIGNvbmRpdGlvbnNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAvL2V4MVxuICAgICAqICB2YXIgaG0gPSBuZXcgSGFzaE1hcCgpO1xuICAgICAqICBobS5zZXQoJ2tleScsICd2YWx1ZScpO1xuICAgICAqICBobS5zZXQoJ2tleTInLCAndmFsdWUnKTtcbiAgICAgKlxuICAgICAqICBobS5maW5kKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgICAgIHJldHVybiBrZXkgPT09ICdrZXkyJztcbiAgICAgKiAgfSk7IC8vIFsndmFsdWUnXVxuICAgICAqXG4gICAgICogIC8vZXgyXG4gICAgICogIHZhciBobSA9IG5ldyBIYXNoTWFwKHtcbiAgICAgKiAgICAgICdteW9iajEnOiB7XG4gICAgICogICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgKiAgICAgICB9LFxuICAgICAqICAgICAgJ215Ym9iajInOiB7XG4gICAgICogICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICogICAgICAgfVxuICAgICAqICB9KTtcbiAgICAgKlxuICAgICAqICBobS5maW5kKGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgICogICAgICByZXR1cm4gb2JqLnZpc2libGUgPT09IHRydWU7XG4gICAgICogIH0pOyAvLyBbe3Zpc2libGU6IHRydWV9XTtcbiAgICAgKi9cbiAgICBIYXNoTWFwLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oY29uZGl0aW9uKSB7XG4gICAgICAgIHZhciBmb3VuZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbih2YWx1ZSwga2V5KSkge1xuICAgICAgICAgICAgICAgIGZvdW5kcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGEgbmV3IEFycmF5IGhhdmluZyBhbGwgdmFsdWVzLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgaGF2aW5nIGFsbCB2YWx1ZXNcbiAgICAgKi9cbiAgICBIYXNoTWFwLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24odikge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHR1aS51dGlsLkhhc2hNYXAgPSBIYXNoTWFwO1xuXG59KSh3aW5kb3cudHVpKTtcblxuLyoqKioqKioqKipcbiAqIGluaGVyaXRhbmNlLmpzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgc2ltcGxlIGZ1bmN0aW9uIGZvciBpbmhlcml0YW5jZS5cbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdHVpKSB7XG4gICAgICAgIHR1aSA9IHdpbmRvdy50dWkgPSB7fTtcbiAgICB9XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkudXRpbCkge1xuICAgICAgICB0dWkudXRpbCA9IHdpbmRvdy50dWkudXRpbCA9IHt9O1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgb2JqZWN0IHdpdGggdGhlIHNwZWNpZmllZCBwcm90b3R5cGUgb2JqZWN0IGFuZCBwcm9wZXJ0aWVzLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhpcyBvYmplY3Qgd2lsbCBiZSBhIHByb3RvdHlwZSBvZiB0aGUgbmV3bHktY3JlYXRlZCBvYmplY3QuXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdCgpIHtcbiAgICAgICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgICAgICAgRi5wcm90b3R5cGUgPSBvYmo7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlIGEgc2ltcGxlIGluaGVyaXRhbmNlIGluIHByb3RvdHlwZS1vcmllbnRlZC5cbiAgICAgKiBDYXV0aW9uIDpcbiAgICAgKiAgRG9uJ3Qgb3ZlcndyaXRlIHRoZSBwcm90b3R5cGUgb2YgY2hpbGQgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdWJUeXBlIENoaWxkIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJUeXBlIFBhcmVudCBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIC8vIFBhcmVudCBjb25zdHJ1Y3RvclxuICAgICAqICBmdW5jdGlvbiBBbmltYWwobGVnKSB7XG4gICAgICogICAgICB0aGlzLmxlZyA9IGxlZztcbiAgICAgKiAgfVxuICAgICAqXG4gICAgICogIEFuaW1hbC5wcm90b3R5cGUuZ3Jvd2wgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgIC8vIC4uLlxuICAgICAqICB9O1xuICAgICAqXG4gICAgICogIC8vIENoaWxkIGNvbnN0cnVjdG9yXG4gICAgICogIGZ1bmN0aW9uIFBlcnNvbihuYW1lKSB7XG4gICAgICogICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAqICB9XG4gICAgICpcbiAgICAgKiAgLy8gSW5oZXJpdGFuY2VcbiAgICAgKiAgY29yZS5pbmhlcml0KFBlcnNvbiwgQW5pbWFsKTtcbiAgICAgKlxuICAgICAqICAvLyBBZnRlciB0aGlzIGluaGVyaXRhbmNlLCBwbGVhc2UgdXNlIG9ubHkgdGhlIGV4dGVuZGluZyBvZiBwcm9wZXJ0eS5cbiAgICAgKiAgLy8gRG8gbm90IG92ZXJ3cml0ZSBwcm90b3R5cGUuXG4gICAgICogIFBlcnNvbi5wcm90b3R5cGUud2FsayA9IGZ1bmN0aW9uKGRpcmVjdGlvbikge1xuICAgICAqICAgICAgLy8gLi4uXG4gICAgICogIH07XG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5oZXJpdChzdWJUeXBlLCBzdXBlclR5cGUpIHtcbiAgICAgICAgdmFyIHByb3RvdHlwZSA9IHR1aS51dGlsLmNyZWF0ZU9iamVjdChzdXBlclR5cGUucHJvdG90eXBlKTtcbiAgICAgICAgcHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViVHlwZTtcbiAgICAgICAgc3ViVHlwZS5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgfVxuXG4gICAgdHVpLnV0aWwuY3JlYXRlT2JqZWN0ID0gY3JlYXRlT2JqZWN0KCk7XG4gICAgdHVpLnV0aWwuaW5oZXJpdCA9IGluaGVyaXQ7XG5cbn0pKHdpbmRvdy50dWkpO1xuXG4vKioqKioqKioqKlxuICogbWFwLmpzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiAgSW1wbGVtZW50cyB0aGUgTWFwIG9iamVjdC5cbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR5cGUuanMsIGNvbGxlY3Rpb24uanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG5cbiAgICAvLyBDYWNoaW5nIHR1aS51dGlsIGZvciBwZXJmb3JtYW5jZSBlbmhhbmNpbmdcbiAgICB2YXIgdXRpbCA9IHR1aS51dGlsLFxuXG4gICAgLyoqXG4gICAgICogVXNpbmcgdW5kZWZpbmVkIGZvciBhIGtleSBjYW4gYmUgYW1iaWd1b3VzIGlmIHRoZXJlJ3MgZGVsZXRlZCBpdGVtIGluIHRoZSBhcnJheSw8YnI+XG4gICAgICogd2hpY2ggaXMgYWxzbyB1bmRlZmluZWQgd2hlbiBhY2Nlc3NlZCBieSBpbmRleC48YnI+XG4gICAgICogU28gdXNlIHRoaXMgdW5pcXVlIG9iamVjdCBhcyBhbiB1bmRlZmluZWQga2V5IHRvIGRpc3Rpbmd1aXNoIGl0IGZyb20gZGVsZXRlZCBrZXlzLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNvbnN0YW50XG4gICAgICovXG4gICAgX0tFWV9GT1JfVU5ERUZJTkVEID0ge30sXG5cbiAgICAvKipcbiAgICAgKiBGb3IgdXNpbmcgTmFOIGFzIGEga2V5LCB1c2UgdGhpcyB1bmlxdWUgb2JqZWN0IGFzIGEgTmFOIGtleS48YnI+XG4gICAgICogVGhpcyBtYWtlcyBpdCBlYXNpZXIgYW5kIGZhc3RlciB0byBjb21wYXJlIGFuIG9iamVjdCB3aXRoIGVhY2gga2V5cyBpbiB0aGUgYXJyYXk8YnI+XG4gICAgICogdGhyb3VnaCBubyBleGNlcHRpb25hbCBjb21hcHJpbmcgZm9yIE5hTi5cbiAgICAgKi9cbiAgICBfS0VZX0ZPUl9OQU4gPSB7fTtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIG9mIE1hcEl0ZXJhdG9yPGJyPlxuICAgICAqIENyZWF0ZXMgaXRlcmF0b3Igb2JqZWN0IHdpdGggbmV3IGtleXdvcmQuXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtICB7QXJyYXl9IGtleXMgLSBUaGUgYXJyYXkgb2Yga2V5cyBpbiB0aGUgbWFwXG4gICAgICogQHBhcmFtICB7ZnVuY3Rpb259IHZhbHVlR2V0dGVyIC0gRnVuY3Rpb24gdGhhdCByZXR1cm5zIGNlcnRhaW4gdmFsdWUsXG4gICAgICogICAgICB0YWtpbmcga2V5IGFuZCBrZXlJbmRleCBhcyBhcmd1bWVudHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gTWFwSXRlcmF0b3Ioa2V5cywgdmFsdWVHZXR0ZXIpIHtcbiAgICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX3ZhbHVlR2V0dGVyID0gdmFsdWVHZXR0ZXI7XG4gICAgICAgIHRoaXMuX2xlbmd0aCA9IHRoaXMuX2tleXMubGVuZ3RoO1xuICAgICAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLl9kb25lID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgSXRlcmF0b3IgcHJvdG9jb2wuXG4gICAgICogQHJldHVybiB7e2RvbmU6IGJvb2xlYW4sIHZhbHVlOiAqfX0gT2JqZWN0IHRoYXQgY29udGFpbnMgZG9uZShib29sZWFuKSBhbmQgdmFsdWUuXG4gICAgICovXG4gICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICB0aGlzLl9pbmRleCArPSAxO1xuICAgICAgIH0gd2hpbGUgKHV0aWwuaXNVbmRlZmluZWQodGhpcy5fa2V5c1t0aGlzLl9pbmRleF0pICYmIHRoaXMuX2luZGV4IDwgdGhpcy5fbGVuZ3RoKTtcblxuICAgICAgICBpZiAodGhpcy5faW5kZXggPj0gdGhpcy5fbGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhLmRvbmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICBkYXRhLnZhbHVlID0gdGhpcy5fdmFsdWVHZXR0ZXIodGhpcy5fa2V5c1t0aGlzLl9pbmRleF0sIHRoaXMuX2luZGV4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIE1hcCBvYmplY3QgaW1wbGVtZW50cyB0aGUgRVM2IE1hcCBzcGVjaWZpY2F0aW9uIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuPGJyPlxuICAgICAqIEZvciB1c2luZyBvYmplY3RzIGFuZCBwcmltaXRpdmUgdmFsdWVzIGFzIGtleXMsIHRoaXMgb2JqZWN0IHVzZXMgYXJyYXkgaW50ZXJuYWxseS48YnI+XG4gICAgICogU28gaWYgdGhlIGtleSBpcyBub3QgYSBzdHJpbmcsIGdldCgpLCBzZXQoKSwgaGFzKCksIGRlbGV0ZSgpIHdpbGwgb3BlcmF0ZXMgaW4gTyhuKSw8YnI+XG4gICAgICogYW5kIGl0IGNhbiBjYXVzZSBwZXJmb3JtYW5jZSBpc3N1ZXMgd2l0aCBhIGxhcmdlIGRhdGFzZXQuXG4gICAgICpcbiAgICAgKiBGZWF0dXJlcyBsaXN0ZWQgYmVsb3cgYXJlIG5vdCBzdXBwb3J0ZWQuIChjYW4ndCBiZSBpbXBsZW50ZWQgd2l0aG91dCBuYXRpdmUgc3VwcG9ydClcbiAgICAgKiAtIE1hcCBvYmplY3QgaXMgaXRlcmFibGU8YnI+XG4gICAgICogLSBJdGVyYWJsZSBvYmplY3QgY2FuIGJlIHVzZWQgYXMgYW4gYXJndW1lbnQgb2YgY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIElmIHRoZSBicm93c2VyIHN1cHBvcnRzIGZ1bGwgaW1wbGVtZW50YXRpb24gb2YgRVM2IE1hcCBzcGVjaWZpY2F0aW9uLCBuYXRpdmUgTWFwIG9iZWpjdFxuICAgICAqIHdpbGwgYmUgdXNlZCBpbnRlcm5hbGx5LlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSAge0FycmF5fSBpbml0RGF0YSAtIEFycmF5IG9mIGtleS12YWx1ZSBwYWlycyAoMi1lbGVtZW50IEFycmF5cykuXG4gICAgICogICAgICBFYWNoIGtleS12YWx1ZSBwYWlyIHdpbGwgYmUgYWRkZWQgdG8gdGhlIG5ldyBNYXBcbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBNYXAoaW5pdERhdGEpIHtcbiAgICAgICAgdGhpcy5fdmFsdWVzRm9yU3RyaW5nID0ge307XG4gICAgICAgIHRoaXMuX3ZhbHVlc0ZvckluZGV4ID0ge307XG4gICAgICAgIHRoaXMuX2tleXMgPSBbXTtcblxuICAgICAgICBpZiAoaW5pdERhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldEluaXREYXRhKGluaXREYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFsbCBlbGVtZW50cyBpbiB0aGUgaW5pdERhdGEgdG8gdGhlIE1hcCBvYmplY3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHtBcnJheX0gaW5pdERhdGEgLSBBcnJheSBvZiBrZXktdmFsdWUgcGFpcnMgdG8gYWRkIHRvIHRoZSBNYXAgb2JqZWN0XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fc2V0SW5pdERhdGEgPSBmdW5jdGlvbihpbml0RGF0YSkge1xuICAgICAgICBpZiAoIXV0aWwuaXNBcnJheShpbml0RGF0YSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBBcnJheSBpcyBzdXBwb3J0ZWQuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdXRpbC5mb3JFYWNoQXJyYXkoaW5pdERhdGEsIGZ1bmN0aW9uKHBhaXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KHBhaXJbMF0sIHBhaXJbMV0pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgTmFOLjxicj5cbiAgICAgKiBGb3IgdW5zaW5nIE5hTiBhcyBhIGtleSwgdXNlIHRoaXMgbWV0aG9kIHRvIHRlc3QgZXF1YWxpdHkgb2YgTmFOPGJyPlxuICAgICAqIGJlY2F1c2UgPT09IG9wZXJhdG9yIGRvZXNuJ3Qgd29yayBmb3IgTmFOLlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSAtIEFueSBvYmplY3QgdG8gYmUgdGVzdGVkXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBOYU4sIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLl9pc05hTiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIHZhbHVlICE9PSB2YWx1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHsqfSBrZXkgLSBUaGUga2V5IG9iamVjdCB0byBzZWFyY2ggZm9yLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBzcGVjaWZpZWQga2V5XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fZ2V0S2V5SW5kZXggPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IC0xLFxuICAgICAgICAgICAgdmFsdWU7XG5cbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcoa2V5KSkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl92YWx1ZXNGb3JTdHJpbmdba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlLmtleUluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gdXRpbC5pbkFycmF5KGtleSwgdGhpcy5fa2V5cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgb3JpZ2luYWwga2V5IG9mIHRoZSBzcGVjaWZpZWQga2V5LlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7Kn0ga2V5IC0ga2V5XG4gICAgICogQHJldHVybiB7Kn0gT3JpZ2luYWwga2V5XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fZ2V0T3JpZ2luS2V5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBvcmlnaW5LZXkgPSBrZXk7XG4gICAgICAgIGlmIChrZXkgPT09IF9LRVlfRk9SX1VOREVGSU5FRCkge1xuICAgICAgICAgICAgb3JpZ2luS2V5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gX0tFWV9GT1JfTkFOKSB7XG4gICAgICAgICAgICBvcmlnaW5LZXkgPSBOYU47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbktleTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdW5pcXVlIGtleSBvZiB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSAgeyp9IGtleSAtIGtleVxuICAgICAqIEByZXR1cm4geyp9IFVuaXF1ZSBrZXlcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLl9nZXRVbmlxdWVLZXkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIHVuaXF1ZUtleSA9IGtleTtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoa2V5KSkge1xuICAgICAgICAgICAgdW5pcXVlS2V5ID0gX0tFWV9GT1JfVU5ERUZJTkVEO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzTmFOKGtleSkpIHtcbiAgICAgICAgICAgIHVuaXF1ZUtleSA9IF9LRVlfRk9SX05BTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5pcXVlS2V5O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvYmplY3Qgb2YgdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHsqfSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSBvYmplY3QgdG8gYmUgcmV0dXJuZWRcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGtleUluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBrZXlcbiAgICAgKiBAcmV0dXJuIHt7a2V5SW5kZXg6IG51bWJlciwgb3JpZ2luOiAqfX0gVmFsdWUgb2JqZWN0XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fZ2V0VmFsdWVPYmplY3QgPSBmdW5jdGlvbihrZXksIGtleUluZGV4KSB7XG4gICAgICAgIGlmICh1dGlsLmlzU3RyaW5nKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZXNGb3JTdHJpbmdba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh1dGlsLmlzVW5kZWZpbmVkKGtleUluZGV4KSkge1xuICAgICAgICAgICAgICAgIGtleUluZGV4ID0gdGhpcy5fZ2V0S2V5SW5kZXgoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlc0ZvckluZGV4W2tleUluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBvcmlnaW5hbCB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIGtleS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSAgeyp9IGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIG9iamVjdCB0byBiZSByZXR1cm5lZFxuICAgICAqIEBwYXJhbSAge251bWJlcn0ga2V5SW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGtleVxuICAgICAqIEByZXR1cm4geyp9IE9yaWdpbmFsIHZhbHVlXG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fZ2V0T3JpZ2luVmFsdWUgPSBmdW5jdGlvbihrZXksIGtleUluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRWYWx1ZU9iamVjdChrZXksIGtleUluZGV4KS5vcmlnaW47XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMga2V5LXZhbHVlIHBhaXIgb2YgdGhlIHNwZWNpZmllZCBrZXkuXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0gIHsqfSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSBvYmplY3QgdG8gYmUgcmV0dXJuZWRcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGtleUluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBrZXlcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gS2V5LXZhbHVlIFBhaXJcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLl9nZXRLZXlWYWx1ZVBhaXIgPSBmdW5jdGlvbihrZXksIGtleUluZGV4KSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5fZ2V0T3JpZ2luS2V5KGtleSksIHRoaXMuX2dldE9yaWdpblZhbHVlKGtleSwga2V5SW5kZXgpXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgd3JhcHBlciBvYmplY3Qgb2Ygb3JpZ2luYWwgdmFsdWUgdGhhdCBjb250YWlucyBhIGtleSBpbmRleFxuICAgICAqIGFuZCByZXR1cm5zIGl0LlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtICB7dHlwZX0gb3JpZ2luIC0gT3JpZ2luYWwgdmFsdWVcbiAgICAgKiBAcGFyYW0gIHt0eXBlfSBrZXlJbmRleCAtIEluZGV4IG9mIHRoZSBrZXlcbiAgICAgKiBAcmV0dXJuIHt7a2V5SW5kZXg6IG51bWJlciwgb3JpZ2luOiAqfX0gVmFsdWUgb2JqZWN0XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5fY3JlYXRlVmFsdWVPYmplY3QgPSBmdW5jdGlvbihvcmlnaW4sIGtleUluZGV4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBrZXlJbmRleDoga2V5SW5kZXgsXG4gICAgICAgICAgICBvcmlnaW46IG9yaWdpblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGtleSBpbiB0aGUgTWFwIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gIHsqfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgTWFwIG9iamVjdFxuICAgICAqIEBwYXJhbSAgeyp9IHZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgTWFwIG9iamVjdFxuICAgICAqIEByZXR1cm4ge01hcH0gVGhlIE1hcCBvYmplY3RcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIHVuaXF1ZUtleSA9IHRoaXMuX2dldFVuaXF1ZUtleShrZXkpLFxuICAgICAgICAgICAga2V5SW5kZXggPSB0aGlzLl9nZXRLZXlJbmRleCh1bmlxdWVLZXkpLFxuICAgICAgICAgICAgdmFsdWVPYmplY3Q7XG5cbiAgICAgICAgaWYgKGtleUluZGV4IDwgMCkge1xuICAgICAgICAgICAga2V5SW5kZXggPSB0aGlzLl9rZXlzLnB1c2godW5pcXVlS2V5KSAtIDE7XG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZU9iamVjdCA9IHRoaXMuX2NyZWF0ZVZhbHVlT2JqZWN0KHZhbHVlLCBrZXlJbmRleCk7XG5cbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcoa2V5KSkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWVzRm9yU3RyaW5nW2tleV0gPSB2YWx1ZU9iamVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlc0ZvckluZGV4W2tleUluZGV4XSA9IHZhbHVlT2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHRvIHRoZSBrZXksIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBub25lLlxuICAgICAqIEBwYXJhbSAgeyp9IGtleSAtIFRoZSBrZXkgb2YgdGhlIGVsZW1lbnQgdG8gcmV0dXJuXG4gICAgICogQHJldHVybiB7Kn0gRWxlbWVudCBhc3NvY2lhdGVkIHdpdGggdGhlIHNwZWNpZmllZCBrZXlcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICB2YXIgdW5pcXVlS2V5ID0gdGhpcy5fZ2V0VW5pcXVlS2V5KGtleSksXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuX2dldFZhbHVlT2JqZWN0KHVuaXF1ZUtleSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLm9yaWdpbjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBJdGVyYXRvciBvYmplY3QgdGhhdCBjb250YWlucyB0aGUga2V5cyBmb3IgZWFjaCBlbGVtZW50XG4gICAgICogaW4gdGhlIE1hcCBvYmplY3QgaW4gaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqIEByZXR1cm4ge0l0ZXJhdG9yfSBBIG5ldyBJdGVyYXRvciBvYmplY3RcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLl9rZXlzLCB1dGlsLmJpbmQodGhpcy5fZ2V0T3JpZ2luS2V5LCB0aGlzKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgSXRlcmF0b3Igb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHZhbHVlcyBmb3IgZWFjaCBlbGVtZW50XG4gICAgICogaW4gdGhlIE1hcCBvYmplY3QgaW4gaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqIEByZXR1cm4ge0l0ZXJhdG9yfSBBIG5ldyBJdGVyYXRvciBvYmplY3RcbiAgICAgKi9cbiAgICBNYXAucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1hcEl0ZXJhdG9yKHRoaXMuX2tleXMsIHV0aWwuYmluZCh0aGlzLl9nZXRPcmlnaW5WYWx1ZSwgdGhpcykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IEl0ZXJhdG9yIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBba2V5LCB2YWx1ZV0gcGFpcnNcbiAgICAgKiBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBNYXAgb2JqZWN0IGluIGluc2VydGlvbiBvcmRlci5cbiAgICAgKiBAcmV0dXJuIHtJdGVyYXRvcn0gQSBuZXcgSXRlcmF0b3Igb2JqZWN0XG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcy5fa2V5cywgdXRpbC5iaW5kKHRoaXMuX2dldEtleVZhbHVlUGFpciwgdGhpcykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYm9vbGVhbiBhc3NlcnRpbmcgd2hldGhlciBhIHZhbHVlIGhhcyBiZWVuIGFzc29jaWF0ZWQgdG8gdGhlIGtleVxuICAgICAqIGluIHRoZSBNYXAgb2JqZWN0IG9yIG5vdC5cbiAgICAgKiBAcGFyYW0gIHsqfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBlbGVtZW50IHRvIHRlc3QgZm9yIHByZXNlbmNlXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBrZXkgZXhpc3RzO1xuICAgICAqICAgICAgICAgIE90aGVyd2lzZSBmYWxzZVxuICAgICAqL1xuICAgIE1hcC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2dldFZhbHVlT2JqZWN0KGtleSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHNwZWNpZmllZCBlbGVtZW50IGZyb20gYSBNYXAgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Kn0ga2V5IC0gVGhlIGtleSBvZiB0aGUgZWxlbWVudCB0byByZW1vdmVcbiAgICAgKi9cbiAgICAgLy8gY2Fubm90IHVzZSByZXNlcnZlZCBrZXl3b3JkIGFzIGEgcHJvcGVydHkgbmFtZSBpbiBJRTggYW5kIHVuZGVyLlxuICAgIE1hcC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciBrZXlJbmRleDtcblxuICAgICAgICBpZiAodXRpbC5pc1N0cmluZyhrZXkpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdmFsdWVzRm9yU3RyaW5nW2tleV0pIHtcbiAgICAgICAgICAgICAgICBrZXlJbmRleCA9IHRoaXMuX3ZhbHVlc0ZvclN0cmluZ1trZXldLmtleUluZGV4O1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl92YWx1ZXNGb3JTdHJpbmdba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGtleUluZGV4ID0gdGhpcy5fZ2V0S2V5SW5kZXgoa2V5KTtcbiAgICAgICAgICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ZhbHVlc0ZvckluZGV4W2tleUluZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrZXlJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fa2V5c1trZXlJbmRleF07XG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uY2UgcGVyIGVhY2gga2V5L3ZhbHVlIHBhaXIgaW4gdGhlIE1hcCBvYmplY3QsXG4gICAgICogaW4gaW5zZXJ0aW9uIG9yZGVyLlxuICAgICAqIEBwYXJhbSAge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgZm9yIGVhY2ggZWxlbWVudFxuICAgICAqIEBwYXJhbSAge3RoaXNBcmd9IHRoaXNBcmcgLSBWYWx1ZSB0byB1c2UgYXMgdGhpcyB3aGVuIGV4ZWN1dGluZyBjYWxsYmFja1xuICAgICAqL1xuICAgIE1hcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAgIHRoaXNBcmcgPSB0aGlzQXJnIHx8IHRoaXM7XG4gICAgICAgIHV0aWwuZm9yRWFjaEFycmF5KHRoaXMuX2tleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgaWYgKCF1dGlsLmlzVW5kZWZpbmVkKGtleSkpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHRoaXMuX2dldFZhbHVlT2JqZWN0KGtleSkub3JpZ2luLCBrZXksIHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSBhIE1hcCBvYmplY3QuXG4gICAgICovXG4gICAgTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBNYXAuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgLy8gVXNlIG5hdGl2ZSBNYXAgb2JqZWN0IGlmIGV4aXN0cy5cbiAgICAvLyBCdXQgb25seSBsYXRlc3QgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBGaXJlZm94IHN1cHBvcnQgZnVsbCBpbXBsZW1lbnRhdGlvbi5cbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBicm93c2VyID0gdXRpbC5icm93c2VyO1xuICAgICAgICBpZiAod2luZG93Lk1hcCAmJiAoXG4gICAgICAgICAgICAoYnJvd3Nlci5maXJlZm94ICYmIGJyb3dzZXIudmVyc2lvbiA+PSAzNykgfHxcbiAgICAgICAgICAgIChicm93c2VyLmNocm9tZSAmJiBicm93c2VyLnZlcnNpb24gPj0gNDIpICkpIHtcbiAgICAgICAgICAgIE1hcCA9IHdpbmRvdy5NYXA7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgdXRpbC5NYXAgPSBNYXA7XG59KSh3aW5kb3cudHVpKTtcblxuLyoqKioqKioqKipcbiAqIG9iamVjdC5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBUaGlzIG1vZHVsZSBoYXMgc29tZSBmdW5jdGlvbnMgZm9yIGhhbmRsaW5nIGEgcGxhaW4gb2JqZWN0LCBqc29uLlxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHlwZS5qcywgY29sbGVjdGlvbi5qc1xuICovXG5cbihmdW5jdGlvbih0dWkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0dWkpIHtcbiAgICAgICAgdHVpID0gd2luZG93LnR1aSA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXR1aS51dGlsKSB7XG4gICAgICAgIHR1aS51dGlsID0gd2luZG93LnR1aS51dGlsID0ge307XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0ZW5kIHRoZSB0YXJnZXQgb2JqZWN0IGZyb20gb3RoZXIgb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0IC0gT2JqZWN0IHRoYXQgd2lsbCBiZSBleHRlbmRlZFxuICAgICAqIEBwYXJhbSB7Li4ub2JqZWN0fSBvYmplY3RzIC0gT2JqZWN0cyBhcyBzb3VyY2VzXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBFeHRlbmRlZCBvYmplY3RcbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBvYmplY3RzKSB7XG4gICAgICAgIHZhciBzb3VyY2UsXG4gICAgICAgICAgICBwcm9wLFxuICAgICAgICAgICAgaGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbGVuO1xuXG4gICAgICAgIGZvciAoaSA9IDEsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yIChwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wLmNhbGwoc291cmNlLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGxhc3QgaWQgb2Ygc3RhbXBcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHZhciBsYXN0SWQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogQXNzaWduIGEgdW5pcXVlIGlkIHRvIGFuIG9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBPYmplY3QgdGhhdCB3aWxsIGJlIGFzc2lnbmVkIGlkLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gU3RhbXBlZCBpZFxuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHN0YW1wKG9iaikge1xuICAgICAgICBvYmouX19mZV9pZCA9IG9iai5fX2ZlX2lkIHx8ICsrbGFzdElkO1xuICAgICAgICByZXR1cm4gb2JqLl9fZmVfaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmVyaWZ5IHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIHN0YW1wZWQgaWQgb3Igbm90LlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYXNTdGFtcChvYmopIHtcbiAgICAgICAgcmV0dXJuIHR1aS51dGlsLmlzRXhpc3R5KHR1aS51dGlsLnBpY2sob2JqLCAnX19mZV9pZCcpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCB0aGUgbGFzdCBpZCBvZiBzdGFtcFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0TGFzdElkKCkge1xuICAgICAgICBsYXN0SWQgPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGtleS1saXN0KGFycmF5KSBvZiBhIGdpdmVuIG9iamVjdFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmogLSBPYmplY3QgZnJvbSB3aGljaCBhIGtleS1saXN0IHdpbGwgYmUgZXh0cmFjdGVkXG4gICAgICogQHJldHVybnMge0FycmF5fSBBIGtleS1saXN0KGFycmF5KVxuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgZXF1YWxpdHkgZm9yIG11bHRpcGxlIG9iamVjdHMoanNvbk9iamVjdHMpLjxicj5cbiAgICAgKiAgU2VlIHtAbGluayBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNjg4MzQvb2JqZWN0LWNvbXBhcmlzb24taW4tamF2YXNjcmlwdH1cbiAgICAgKiBAcGFyYW0gey4uLm9iamVjdH0gb2JqZWN0IC0gTXVsdGlwbGUgb2JqZWN0cyBmb3IgY29tcGFyaW5nLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IEVxdWFsaXR5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICB2YXIganNvbk9iajEgPSB7bmFtZTonbWlsaycsIHByaWNlOiAxMDAwfSxcbiAgICAgKiAgICAgIGpzb25PYmoyID0ge25hbWU6J21pbGsnLCBwcmljZTogMTAwMH0sXG4gICAgICogICAgICBqc29uT2JqMyA9IHtuYW1lOidtaWxrJywgcHJpY2U6IDEwMDB9O1xuICAgICAqXG4gICAgICogIHR1aS51dGlsLmNvbXBhcmVKU09OKGpzb25PYmoxLCBqc29uT2JqMiwganNvbk9iajMpOyAgIC8vIHRydWVcbiAgICAgKlxuICAgICAqXG4gICAgICogIHZhciBqc29uT2JqNCA9IHtuYW1lOidtaWxrJywgcHJpY2U6IDEwMDB9LFxuICAgICAqICAgICAganNvbk9iajUgPSB7bmFtZTonYmVlcicsIHByaWNlOiAzMDAwfTtcbiAgICAgKlxuICAgICAqICAgICAgdHVpLnV0aWwuY29tcGFyZUpTT04oanNvbk9iajQsIGpzb25PYmo1KTsgLy8gZmFsc2VcblxuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBhcmVKU09OKG9iamVjdCkge1xuICAgICAgICB2YXIgbGVmdENoYWluLFxuICAgICAgICAgICAgcmlnaHRDaGFpbixcbiAgICAgICAgICAgIGFyZ3NMZW4gPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICAgICAgaTtcblxuICAgICAgICBmdW5jdGlvbiBpc1NhbWVPYmplY3QoeCwgeSkge1xuICAgICAgICAgICAgdmFyIHA7XG5cbiAgICAgICAgICAgIC8vIHJlbWVtYmVyIHRoYXQgTmFOID09PSBOYU4gcmV0dXJucyBmYWxzZVxuICAgICAgICAgICAgLy8gYW5kIGlzTmFOKHVuZGVmaW5lZCkgcmV0dXJucyB0cnVlXG4gICAgICAgICAgICBpZiAoaXNOYU4oeCkgJiZcbiAgICAgICAgICAgICAgICBpc05hTih5KSAmJlxuICAgICAgICAgICAgICAgIHR1aS51dGlsLmlzTnVtYmVyKHgpICYmXG4gICAgICAgICAgICAgICAgdHVpLnV0aWwuaXNOdW1iZXIoeSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcGFyZSBwcmltaXRpdmVzIGFuZCBmdW5jdGlvbnMuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBib3RoIGFyZ3VtZW50cyBsaW5rIHRvIHRoZSBzYW1lIG9iamVjdC5cbiAgICAgICAgICAgIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHN0ZXAgd2hlbiBjb21wYXJpbmcgcHJvdG90eXBlc1xuICAgICAgICAgICAgaWYgKHggPT09IHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV29ya3MgaW4gY2FzZSB3aGVuIGZ1bmN0aW9ucyBhcmUgY3JlYXRlZCBpbiBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgIC8vIENvbXBhcmluZyBkYXRlcyBpcyBhIGNvbW1vbiBzY2VuYXJpby4gQW5vdGhlciBidWlsdC1pbnM/XG4gICAgICAgICAgICAvLyBXZSBjYW4gZXZlbiBoYW5kbGUgZnVuY3Rpb25zIHBhc3NlZCBhY3Jvc3MgaWZyYW1lc1xuICAgICAgICAgICAgaWYgKCh0dWkudXRpbC5pc0Z1bmN0aW9uKHgpICYmIHR1aS51dGlsLmlzRnVuY3Rpb24oeSkpIHx8XG4gICAgICAgICAgICAgICAgKHggaW5zdGFuY2VvZiBEYXRlICYmIHkgaW5zdGFuY2VvZiBEYXRlKSB8fFxuICAgICAgICAgICAgICAgICh4IGluc3RhbmNlb2YgUmVnRXhwICYmIHkgaW5zdGFuY2VvZiBSZWdFeHApIHx8XG4gICAgICAgICAgICAgICAgKHggaW5zdGFuY2VvZiBTdHJpbmcgJiYgeSBpbnN0YW5jZW9mIFN0cmluZykgfHxcbiAgICAgICAgICAgICAgICAoeCBpbnN0YW5jZW9mIE51bWJlciAmJiB5IGluc3RhbmNlb2YgTnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4LnRvU3RyaW5nKCkgPT09IHkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQXQgbGFzdCBjaGVja2luZyBwcm90b3R5cGVzIGFzIGdvb2QgYSB3ZSBjYW5cbiAgICAgICAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QgJiYgeSBpbnN0YW5jZW9mIE9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4LmlzUHJvdG90eXBlT2YoeSkgfHxcbiAgICAgICAgICAgICAgICB5LmlzUHJvdG90eXBlT2YoeCkgfHxcbiAgICAgICAgICAgICAgICB4LmNvbnN0cnVjdG9yICE9PSB5LmNvbnN0cnVjdG9yIHx8XG4gICAgICAgICAgICAgICAgeC5wcm90b3R5cGUgIT09IHkucHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVjayBmb3IgaW5maW5pdGl2ZSBsaW5raW5nIGxvb3BzXG4gICAgICAgICAgICBpZiAodHVpLnV0aWwuaW5BcnJheSh4LCBsZWZ0Q2hhaW4pID4gLTEgfHxcbiAgICAgICAgICAgICAgICB0dWkudXRpbC5pbkFycmF5KHksIHJpZ2h0Q2hhaW4pID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFF1aWNrIGNoZWNraW5nIG9mIG9uZSBvYmplY3QgYmVlaW5nIGEgc3Vic2V0IG9mIGFub3RoZXIuXG4gICAgICAgICAgICBmb3IgKHAgaW4geSkge1xuICAgICAgICAgICAgICAgIGlmICh5Lmhhc093blByb3BlcnR5KHApICE9PSB4Lmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHlbcF0gIT09IHR5cGVvZiB4W3BdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vVGhpcyBmb3IgbG9vcCBleGVjdXRlcyBjb21wYXJpbmcgd2l0aCBoYXNPd25Qcm9wZXJ0eSgpIGFuZCB0eXBlb2YgZm9yIGVhY2ggcHJvcGVydHkgaW4gJ3gnIG9iamVjdCxcbiAgICAgICAgICAgIC8vYW5kIHZlcmlmeWluZyBlcXVhbGl0eSBmb3IgeFtwcm9wZXJ0eV0gYW5kIHlbcHJvcGVydHldLlxuICAgICAgICAgICAgZm9yIChwIGluIHgpIHtcbiAgICAgICAgICAgICAgICBpZiAoeS5oYXNPd25Qcm9wZXJ0eShwKSAhPT0geC5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB5W3BdICE9PSB0eXBlb2YgeFtwXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZih4W3BdKSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mKHhbcF0pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnRDaGFpbi5wdXNoKHgpO1xuICAgICAgICAgICAgICAgICAgICByaWdodENoYWluLnB1c2goeSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1NhbWVPYmplY3QoeFtwXSwgeVtwXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxlZnRDaGFpbi5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRDaGFpbi5wb3AoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHhbcF0gIT09IHlbcF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJnc0xlbiA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGFyZ3NMZW47IGkrKykge1xuICAgICAgICAgICAgbGVmdENoYWluID0gW107XG4gICAgICAgICAgICByaWdodENoYWluID0gW107XG5cbiAgICAgICAgICAgIGlmICghaXNTYW1lT2JqZWN0KGFyZ3VtZW50c1swXSwgYXJndW1lbnRzW2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlIGEgbmVzdGVkIGl0ZW0gZnJvbSB0aGUgZ2l2ZW4gb2JqZWN0L2FycmF5XG4gICAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IG9iaiAtIE9iamVjdCBmb3IgcmV0cmlldmluZ1xuICAgICAqIEBwYXJhbSB7Li4uc3RyaW5nfG51bWJlcn0gcGF0aHMgLSBQYXRocyBvZiBwcm9wZXJ0eVxuICAgICAqIEByZXR1cm5zIHsqfSBWYWx1ZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBvYmogPSB7XG4gICAgICogICAgICAna2V5MSc6IDEsXG4gICAgICogICAgICAnbmVzdGVkJyA6IHtcbiAgICAgKiAgICAgICAgICAna2V5MSc6IDExLFxuICAgICAqICAgICAgICAgICduZXN0ZWQnOiB7XG4gICAgICogICAgICAgICAgICAgICdrZXkxJzogMjFcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICB9XG4gICAgICogIH07XG4gICAgICogIHR1aS51dGlsLnBpY2sob2JqLCAnbmVzdGVkJywgJ25lc3RlZCcsICdrZXkxJyk7IC8vIDIxXG4gICAgICogIHR1aS51dGlsLnBpY2sob2JqLCAnbmVzdGVkJywgJ25lc3RlZCcsICdrZXkyJyk7IC8vIHVuZGVmaW5lZFxuICAgICAqXG4gICAgICogIHZhciBhcnIgPSBbJ2EnLCAnYicsICdjJ107XG4gICAgICogIHR1aS51dGlsLnBpY2soYXJyLCAxKTsgLy8gJ2InXG4gICAgICovXG4gICAgZnVuY3Rpb24gcGljayhvYmosIHBhdGhzKSB7XG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgdGFyZ2V0ID0gYXJnc1swXSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldFthcmdzW2ldXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHVpLnV0aWwuZXh0ZW5kID0gZXh0ZW5kO1xuICAgIHR1aS51dGlsLnN0YW1wID0gc3RhbXA7XG4gICAgdHVpLnV0aWwuaGFzU3RhbXAgPSBoYXNTdGFtcDtcbiAgICB0dWkudXRpbC5fcmVzZXRMYXN0SWQgPSByZXNldExhc3RJZDtcbiAgICB0dWkudXRpbC5rZXlzID0gT2JqZWN0LmtleXMgfHwga2V5cztcbiAgICB0dWkudXRpbC5jb21wYXJlSlNPTiA9IGNvbXBhcmVKU09OO1xuICAgIHR1aS51dGlsLnBpY2sgPSBwaWNrO1xufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiBzdHJpbmcuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgVGhpcyBtb2R1bGUgaGFzIHNvbWUgZnVuY3Rpb25zIGZvciBoYW5kbGluZyB0aGUgc3RyaW5nLlxuICogQGF1dGhvciBOSE4gRW50LlxuICogICAgICAgICBGRSBEZXZlbG9wbWVudCBUZWFtIDxlMDI0MkBuaG5lbnQuY29tPlxuICovXG5cbihmdW5jdGlvbih0dWkpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBpZiAoIXR1aSkge1xuICAgICAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG4gICAgfVxuICAgIGlmICghdHVpLnV0aWwpIHtcbiAgICAgICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm0gdGhlIGdpdmVuIEhUTUwgRW50aXR5IHN0cmluZyBpbnRvIHBsYWluIHN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sRW50aXR5IC0gSFRNTCBFbnRpdHkgdHlwZSBzdHJpbmdcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFBsYWluIHN0cmluZ1xuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEBleGFtcGxlXG4gICAgICogIHZhciBodG1sRW50aXR5U3RyaW5nID0gXCJBICYjMzk7cXVvdGUmIzM5OyBpcyAmbHQ7YiZndDtib2xkJmx0Oy9iJmd0O1wiXG4gICAgICogIHZhciByZXN1bHQgPSBkZWNvZGVIVE1MRW50aXR5KGh0bWxFbnRpdHlTdHJpbmcpOyAvL1wiQSAncXVvdGUnIGlzIDxiPmJvbGQ8L2I+XCJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWNvZGVIVE1MRW50aXR5KGh0bWxFbnRpdHkpIHtcbiAgICAgICAgdmFyIGVudGl0aWVzID0geycmcXVvdDsnIDogJ1wiJywgJyZhbXA7JyA6ICcmJywgJyZsdDsnIDogJzwnLCAnJmd0OycgOiAnPicsICcmIzM5OycgOiAnXFwnJywgJyZuYnNwOycgOiAnICd9O1xuICAgICAgICByZXR1cm4gaHRtbEVudGl0eS5yZXBsYWNlKC8mYW1wO3wmbHQ7fCZndDt8JnF1b3Q7fCYjMzk7fCZuYnNwOy9nLCBmdW5jdGlvbihtMCkge1xuICAgICAgICAgICAgcmV0dXJuIGVudGl0aWVzW20wXSA/IGVudGl0aWVzW20wXSA6IG0wO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2Zvcm0gdGhlIGdpdmVuIHN0cmluZyBpbnRvIEhUTUwgRW50aXR5IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBodG1sIC0gU3RyaW5nIGZvciBlbmNvZGluZ1xuICAgICAqIEByZXR1cm4ge1N0cmluZ30gSFRNTCBFbnRpdHlcbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB2YXIgaHRtbEVudGl0eVN0cmluZyA9IFwiPHNjcmlwdD4gYWxlcnQoJ3Rlc3QnKTs8L3NjcmlwdD48YSBocmVmPSd0ZXN0Jz5cIjtcbiAgICAgKiAgdmFyIHJlc3VsdCA9IGVuY29kZUhUTUxFbnRpdHkoaHRtbEVudGl0eVN0cmluZyk7IC8vXCImbHQ7c2NyaXB0Jmd0OyBhbGVydCgmIzM5O3Rlc3QmIzM5Oyk7Jmx0Oy9zY3JpcHQmZ3Q7Jmx0O2EgaHJlZj0mIzM5O3Rlc3QmIzM5OyZndDtcIlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVuY29kZUhUTUxFbnRpdHkoaHRtbCkge1xuICAgICAgICB2YXIgZW50aXRpZXMgPSB7J1wiJzogJ3F1b3QnLCAnJic6ICdhbXAnLCAnPCc6ICdsdCcsICc+JzogJ2d0JywgJ1xcJyc6ICcjMzknfTtcbiAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZSgvWzw+JlwiJ10vZywgZnVuY3Rpb24obTApIHtcbiAgICAgICAgICAgIHJldHVybiBlbnRpdGllc1ttMF0gPyAnJicgKyBlbnRpdGllc1ttMF0gKyAnOycgOiBtMDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHdoZXRoZXIgdGhlIHN0cmluZyBjYXBhYmxlIHRvIHRyYW5zZm9ybSBpbnRvIHBsYWluIHN0cmluZyBpcyBpbiB0aGUgZ2l2ZW4gc3RyaW5nIG9yIG5vdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nXG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBoYXNFbmNvZGFibGVTdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAvWzw+JlwiJ10vLnRlc3Qoc3RyaW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gZHVwbGljYXRlIGNoYXJ0ZXJzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wZXJhbmRTdHIxIFRoZSBvcGVyYW5kIHN0cmluZ1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcGVyYW5kU3RyMiBUaGUgb3BlcmFuZCBzdHJpbmdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0dWkudXRpbC5nZXREdXBsaWNhdGVkQ2hhcignZmUgZGV2JywgJ25obiBlbnRlcnRhaW5tZW50Jyk7XG4gICAgICogPT4gJ2UnXG4gICAgICogdHVpLnV0aWwuZ2V0RHVwbGljYXRlZENoYXIoJ2Zkc2EnLCAnYXNkZicpO1xuICAgICAqID0+ICdhc2RmJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldER1cGxpY2F0ZWRDaGFyKG9wZXJhbmRTdHIxLCBvcGVyYW5kU3RyMikge1xuICAgICAgICB2YXIgZHVwbCxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbGVuID0gb3BlcmFuZFN0cjEubGVuZ3RoLFxuICAgICAgICAgICAgcG9vbCA9IHt9O1xuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGtleSA9IG9wZXJhbmRTdHIxLmNoYXJBdChpKTtcbiAgICAgICAgICAgIHBvb2xba2V5XSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBvcGVyYW5kU3RyMi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAga2V5ID0gb3BlcmFuZFN0cjIuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYocG9vbFtrZXldKSB7XG4gICAgICAgICAgICAgICAgcG9vbFtrZXldICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwb29sID0gdHVpLnV0aWwuZmlsdGVyKHBvb2wsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtID4gMTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcG9vbCA9IHR1aS51dGlsLmtleXMocG9vbCkuc29ydCgpO1xuICAgICAgICBkdXBsID0gcG9vbC5qb2luKCcnKTtcblxuICAgICAgICByZXR1cm4gZHVwbDtcbiAgICB9XG5cbiAgICB0dWkudXRpbC5kZWNvZGVIVE1MRW50aXR5ID0gZGVjb2RlSFRNTEVudGl0eTtcbiAgICB0dWkudXRpbC5lbmNvZGVIVE1MRW50aXR5ID0gZW5jb2RlSFRNTEVudGl0eTtcbiAgICB0dWkudXRpbC5oYXNFbmNvZGFibGVTdHJpbmcgPSBoYXNFbmNvZGFibGVTdHJpbmc7XG4gICAgdHVpLnV0aWwuZ2V0RHVwbGljYXRlZENoYXIgPSBnZXREdXBsaWNhdGVkQ2hhcjtcblxufSkod2luZG93LnR1aSk7XG5cbi8qKioqKioqKioqXG4gKiB0cmlja3MuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgY29sbGVjdGlvbnMgb2Ygc29tZSB0ZWNobmljIG1ldGhvZHMuXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGUwMjQyLm5obmVudC5jb20+XG4gKi9cblxuLyoqIEBuYW1lc3BhY2UgdHVpICovXG4vKiogQG5hbWVzcGFjZSB0dWkudXRpbCAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXR1aSkge1xuICAgICAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdHVpLnV0aWwpIHtcbiAgICAgICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGZuIHVudGlsIGFmdGVyIGRlbGF5IG1pbGxpc2Vjb25kcyBoYXMgZWxhcHNlZFxuICAgICAqIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91Y2VkIGZ1bmN0aW9uIHdhcyBpbnZva2VkLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5XG4gICAgICogQG1lbWJlcm9mIHR1aS51dGlsXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIHNvbWVNZXRob2RUb0ludm9rZURlYm91bmNlZCgpIHt9XG4gICAgICpcbiAgICAgKiB2YXIgZGVib3VuY2VkID0gdHVpLnV0aWwuZGVib3VuY2Uoc29tZU1ldGhvZFRvSW52b2tlRGVib3VuY2VkLCAzMDApO1xuICAgICAqXG4gICAgICogLy8gaW52b2tlIHJlcGVhdGVkbHlcbiAgICAgKiBkZWJvdW5jZWQoKTtcbiAgICAgKiBkZWJvdW5jZWQoKTtcbiAgICAgKiBkZWJvdW5jZWQoKTtcbiAgICAgKiBkZWJvdW5jZWQoKTtcbiAgICAgKiBkZWJvdW5jZWQoKTtcbiAgICAgKiBkZWJvdW5jZWQoKTsgICAgLy8gbGFzdCBpbnZva2Ugb2YgZGVib3VuY2VkKClcbiAgICAgKlxuICAgICAqIC8vIGludm9rZSBzb21lTWV0aG9kVG9JbnZva2VEZWJvdW5jZWQoKSBhZnRlciAzMDAgbWlsbGlzZWNvbmRzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlYm91bmNlKGZuLCBkZWxheSkge1xuICAgICAgICB2YXIgdGltZXIsXG4gICAgICAgICAgICBhcmdzO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgIGRlbGF5ID0gZGVsYXkgfHwgMDtcblxuICAgICAgICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICB9LCBkZWxheSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVib3VuY2VkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiB0aW1lc3RhbXBcbiAgICAgKiBAbWVtYmVyb2YgdHVpLnV0aWxcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBmcm9tIEphbi4gMTk3MCAwMDowMDowMCAoR01UKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgICAgICAgcmV0dXJuICsobmV3IERhdGUoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBmbiBhdCBtb3N0IG9uY2UgcGVyIGV2ZXJ5IGludGVydmFsIG1pbGxpc2Vjb25kcy5cbiAgICAgKlxuICAgICAqIFlvdSBjYW4gdXNlIHRoaXMgdGhyb3R0bGUgc2hvcnQgdGltZSByZXBlYXRlZGx5IGludm9raW5nIGZ1bmN0aW9ucy4gKGUuZyBNb3VzZU1vdmUsIFJlc2l6ZSAuLi4pXG4gICAgICpcbiAgICAgKiBpZiB5b3UgbmVlZCByZXVzZSB0aHJvdHRsZWQgbWV0aG9kLiB5b3UgbXVzdCByZW1vdmUgc2x1Z3MgKGUuZy4gZmxhZyB2YXJpYWJsZSkgcmVsYXRlZCB3aXRoIHRocm90dGxpbmcuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gZnVuY3Rpb24gdG8gdGhyb3R0bGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2ludGVydmFsPTBdIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn0gdGhyb3R0bGVkIGZ1bmN0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIHNvbWVNZXRob2RUb0ludm9rZVRocm90dGxlZCgpIHt9XG4gICAgICpcbiAgICAgKiB2YXIgdGhyb3R0bGVkID0gdHVpLnV0aWwudGhyb3R0bGUoc29tZU1ldGhvZFRvSW52b2tlVGhyb3R0bGVkLCAzMDApO1xuICAgICAqXG4gICAgICogLy8gaW52b2tlIHJlcGVhdGVkbHlcbiAgICAgKiB0aHJvdHRsZWQoKTsgICAgLy8gaW52b2tlIChsZWFkaW5nKVxuICAgICAqIHRocm90dGxlZCgpO1xuICAgICAqIHRocm90dGxlZCgpOyAgICAvLyBpbnZva2UgKG5lYXIgMzAwIG1pbGxpc2Vjb25kcylcbiAgICAgKiB0aHJvdHRsZWQoKTtcbiAgICAgKiB0aHJvdHRsZWQoKTtcbiAgICAgKiB0aHJvdHRsZWQoKTsgICAgLy8gaW52b2tlIChuZWFyIDYwMCBtaWxsaXNlY29uZHMpXG4gICAgICogLy8gLi4uXG4gICAgICogLy8gaW52b2tlICh0cmFpbGluZylcbiAgICAgKlxuICAgICAqIC8vIGlmIHlvdSBuZWVkIHJldXNlIHRocm90dGxlZCBtZXRob2QuIHRoZW4gaW52b2tlIHJlc2V0KClcbiAgICAgKiB0aHJvdHRsZWQucmVzZXQoKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0aHJvdHRsZShmbiwgaW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGJhc2UsXG4gICAgICAgICAgICBfdGltZXN0YW1wID0gdHVpLnV0aWwudGltZXN0YW1wLFxuICAgICAgICAgICAgZGVib3VuY2VkLFxuICAgICAgICAgICAgaXNMZWFkaW5nID0gdHJ1ZSxcbiAgICAgICAgICAgIHN0YW1wLFxuICAgICAgICAgICAgYXJncyxcbiAgICAgICAgICAgIHRpY2sgPSBmdW5jdGlvbihfYXJncykge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KG51bGwsIF9hcmdzKTtcbiAgICAgICAgICAgICAgICBiYXNlID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgaW50ZXJ2YWwgPSBpbnRlcnZhbCB8fCAwO1xuXG4gICAgICAgIGRlYm91bmNlZCA9IHR1aS51dGlsLmRlYm91bmNlKHRpY2ssIGludGVydmFsKTtcblxuICAgICAgICBmdW5jdGlvbiB0aHJvdHRsZWQoKSB7XG4gICAgICAgICAgICBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgaWYgKGlzTGVhZGluZykge1xuICAgICAgICAgICAgICAgIHRpY2soYXJncyk7XG4gICAgICAgICAgICAgICAgaXNMZWFkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdGFtcCA9IF90aW1lc3RhbXAoKTtcblxuICAgICAgICAgICAgYmFzZSA9IGJhc2UgfHwgc3RhbXA7XG5cbiAgICAgICAgICAgIGRlYm91bmNlZCgpO1xuXG4gICAgICAgICAgICBpZiAoKHN0YW1wIC0gYmFzZSkgPj0gaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aWNrKGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgICAgICBpc0xlYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgYmFzZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdHRsZWQucmVzZXQgPSByZXNldDtcbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9XG5cbiAgICB0dWkudXRpbC50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgdHVpLnV0aWwuZGVib3VuY2UgPSBkZWJvdW5jZTtcbiAgICB0dWkudXRpbC50aHJvdHRsZSA9IHRocm90dGxlO1xufSkod2luZG93LnR1aSk7XG5cblxuLyoqKioqKioqKipcbiAqIHR5cGUuanNcbiAqKioqKioqKioqL1xuXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXcgVGhpcyBtb2R1bGUgcHJvdmlkZXMgc29tZSBmdW5jdGlvbnMgdG8gY2hlY2sgdGhlIHR5cGUgb2YgdmFyaWFibGVcbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IGNvbGxlY3Rpb24uanNcbiAqL1xuXG4oZnVuY3Rpb24odHVpKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdHVpKSB7XG4gICAgICAgIHR1aSA9IHdpbmRvdy50dWkgPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0dWkudXRpbCkge1xuICAgICAgICB0dWkudXRpbCA9IHdpbmRvdy50dWkudXRpbCA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGV4aXN0aW5nIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBub3QgbnVsbCBhbmQgbm90IHVuZGVmaW5lZCwgcmV0dXJucyB0cnVlLlxuICAgICAqIEBwYXJhbSB7Kn0gcGFyYW0gLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElzIGV4aXN0eT9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICB0dWkudXRpbC5pc0V4aXN0eSgnJyk7IC8vdHJ1ZVxuICAgICAqICB0dWkudXRpbC5pc0V4aXN0eSgwKTsgLy90cnVlXG4gICAgICogIHR1aS51dGlsLmlzRXhpc3R5KFtdKTsgLy90cnVlXG4gICAgICogIHR1aS51dGlsLmlzRXhpc3R5KHt9KTsgLy90cnVlXG4gICAgICogIHR1aS51dGlsLmlzRXhpc3R5KG51bGwpOyAvL2ZhbHNlXG4gICAgICogIHR1aS51dGlsLmlzRXhpc3R5KHVuZGVmaW5lZCk7IC8vZmFsc2VcbiAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRXhpc3R5KHBhcmFtKSB7XG4gICAgICAgIHJldHVybiBwYXJhbSAhPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIHVuZGVmaW5lZCBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgdW5kZWZpbmVkLCByZXR1cm5zIHRydWUuXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElzIHVuZGVmaW5lZD9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIG51bGwgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlKGFyZ3VtZW50c1swXSkgaXMgbnVsbCwgcmV0dXJucyB0cnVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIC0gVGFyZ2V0IGZvciBjaGVja2luZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBJcyBudWxsP1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTnVsbChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyB0cnV0aHkgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIG5vdCBudWxsIG9yIG5vdCB1bmRlZmluZWQgb3Igbm90IGZhbHNlLCByZXR1cm5zIHRydWUuPGJyPlxuICAgICAqICAoSXQgcmVnYXJkcyAwIGFzIHRydWUpXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgdHJ1dGh5P1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzVHJ1dGh5KG9iaikge1xuICAgICAgICByZXR1cm4gaXNFeGlzdHkob2JqKSAmJiBvYmogIT09IGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGZhbHN5IG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBudWxsIG9yIHVuZGVmaW5lZCBvciBmYWxzZSwgcmV0dXJucyB0cnVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIC0gVGFyZ2V0IGZvciBjaGVja2luZ1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElzIGZhbHN5P1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRmFsc3kob2JqKSB7XG4gICAgICAgIHJldHVybiAhaXNUcnV0aHkob2JqKTtcbiAgICB9XG5cblxuICAgIHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhbiBhcmd1bWVudHMgb2JqZWN0IG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhbiBhcmd1bWVudHMgb2JqZWN0LCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBhcmd1bWVudHM/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBpc0V4aXN0eShvYmopICYmXG4gICAgICAgICAgICAoKHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScpIHx8ICEhb2JqLmNhbGxlZSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhbiBpbnN0YW5jZSBvZiBBcnJheSBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYW4gaW5zdGFuY2Ugb2YgQXJyYXksIHJldHVybiB0cnVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIC0gVGFyZ2V0IGZvciBjaGVja2luZ1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElzIGFycmF5IGluc3RhbmNlP1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhbiBvYmplY3Qgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGFuIG9iamVjdCwgcmV0dXJuIHRydWUuXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgb2JqZWN0P1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgICAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBmdW5jdGlvbj9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRnVuY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBudW1iZXIgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgbnVtYmVyLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBudW1iZXI/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnbnVtYmVyJyB8fCBvYmogaW5zdGFuY2VvZiBOdW1iZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBzdHJpbmcgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgc3RyaW5nLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBzdHJpbmc/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyB8fCBvYmogaW5zdGFuY2VvZiBTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBib29sZWFuIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGJvb2xlYW4sIHJldHVybiB0cnVlLlxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIC0gVGFyZ2V0IGZvciBjaGVja2luZ1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElzIGJvb2xlYW4/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKG9iaikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8IG9iaiBpbnN0YW5jZW9mIEJvb2xlYW47XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhbiBpbnN0YW5jZSBvZiBBcnJheSBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYW4gaW5zdGFuY2Ugb2YgQXJyYXksIHJldHVybiB0cnVlLjxicj5cbiAgICAgKiAgKEl0IGlzIHVzZWQgZm9yIG11bHRpcGxlIGZyYW1lIGVudmlyb25tZW50cylcbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBhbiBpbnN0YW5jZSBvZiBhcnJheT9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0FycmF5U2FmZShvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGZ1bmN0aW9uLCByZXR1cm4gdHJ1ZS48YnI+XG4gICAgICogIChJdCBpcyB1c2VkIGZvciBtdWx0aXBsZSBmcmFtZSBlbnZpcm9ubWVudHMpXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgYSBmdW5jdGlvbj9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uU2FmZShvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIG51bWJlciBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBudW1iZXIsIHJldHVybiB0cnVlLjxicj5cbiAgICAgKiAgKEl0IGlzIHVzZWQgZm9yIG11bHRpcGxlIGZyYW1lIGVudmlyb25tZW50cylcbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBhIG51bWJlcj9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlclNhZmUob2JqKSB7XG4gICAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgc3RyaW5nIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIHN0cmluZywgcmV0dXJuIHRydWUuPGJyPlxuICAgICAqICAoSXQgaXMgdXNlZCBmb3IgbXVsdGlwbGUgZnJhbWUgZW52aXJvbm1lbnRzKVxuICAgICAqIEBwYXJhbSB7Kn0gb2JqIC0gVGFyZ2V0IGZvciBjaGVja2luZ1xuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IElzIGEgc3RyaW5nP1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nU2FmZShvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYSBib29sZWFuIG9yIG5vdC48YnI+XG4gICAgICogIElmIHRoZSBnaXZlbiB2YXJpYWJsZSBpcyBhIGJvb2xlYW4sIHJldHVybiB0cnVlLjxicj5cbiAgICAgKiAgKEl0IGlzIHVzZWQgZm9yIG11bHRpcGxlIGZyYW1lIGVudmlyb25tZW50cylcbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBhIGJvb2xlYW4/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuU2FmZShvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgaW5zdGFuY2Ugb2YgSFRNTE5vZGUgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlcyBpcyBhIGluc3RhbmNlIG9mIEhUTUxOb2RlLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IGh0bWwgLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgSFRNTE5vZGUgP1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSFRNTE5vZGUoaHRtbCkge1xuICAgICAgICBpZiAodHlwZW9mKEhUTUxFbGVtZW50KSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiAoaHRtbCAmJiAoaHRtbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8ICEhaHRtbC5ub2RlVHlwZSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIShodG1sICYmIGh0bWwubm9kZVR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGEgSFRNTCB0YWcgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlcyBpcyBhIEhUTUwgdGFnLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IGh0bWwgLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gSXMgSFRNTCB0YWc/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNIVE1MVGFnKGh0bWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZihIVE1MRWxlbWVudCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gKGh0bWwgJiYgKGh0bWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIShodG1sICYmIGh0bWwubm9kZVR5cGUgJiYgaHRtbC5ub2RlVHlwZSA9PT0gMSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgd2hldGhlciB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgZW1wdHkobnVsbCwgdW5kZWZpbmVkLCBvciBlbXB0eSBhcnJheSwgZW1wdHkgb2JqZWN0KSBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGVzIGlzIGVtcHR5LCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBJcyBlbXB0eT9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0VtcHR5KG9iaikge1xuICAgICAgICB2YXIgaGFzS2V5ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCFpc0V4aXN0eShvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1N0cmluZyhvYmopICYmIG9iaiA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQXJyYXkob2JqKSB8fCBpc0FyZ3VtZW50cyhvYmopKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc09iamVjdChvYmopICYmICFpc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKG9iaiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaGFzS2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuICFoYXNLZXk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIG5vdCBlbXB0eShub3QgbnVsbCwgbm90IHVuZGVmaW5lZCwgb3Igbm90IGVtcHR5IGFycmF5LCBub3QgZW1wdHkgb2JqZWN0KSBvciBub3QuPGJyPlxuICAgICAqICBJZiB0aGUgZ2l2ZW4gdmFyaWFibGVzIGlzIG5vdCBlbXB0eSwgcmV0dXJuIHRydWUuXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gSXMgbm90IGVtcHR5P1xuICAgICAqIEBtZW1iZXJPZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzTm90RW1wdHkob2JqKSB7XG4gICAgICAgIHJldHVybiAhaXNFbXB0eShvYmopO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGFuIGluc3RhbmNlIG9mIERhdGUgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlcyBpcyBhbiBpbnN0YW5jZSBvZiBEYXRlLCByZXR1cm4gdHJ1ZS5cbiAgICAgKiBAcGFyYW0geyp9IG9iaiAtIFRhcmdldCBmb3IgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gSXMgYW4gaW5zdGFuY2Ugb2YgRGF0ZT9cbiAgICAgKiBAbWVtYmVyT2YgdHVpLnV0aWxcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0RhdGUob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBEYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHdoZXRoZXIgdGhlIGdpdmVuIHZhcmlhYmxlIGlzIGFuIGluc3RhbmNlIG9mIERhdGUgb3Igbm90Ljxicj5cbiAgICAgKiAgSWYgdGhlIGdpdmVuIHZhcmlhYmxlcyBpcyBhbiBpbnN0YW5jZSBvZiBEYXRlLCByZXR1cm4gdHJ1ZS48YnI+XG4gICAgICogIChJdCBpcyB1c2VkIGZvciBtdWx0aXBsZSBmcmFtZSBlbnZpcm9ubWVudHMpXG4gICAgICogQHBhcmFtIHsqfSBvYmogLSBUYXJnZXQgZm9yIGNoZWNraW5nXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IElzIGFuIGluc3RhbmNlIG9mIERhdGU/XG4gICAgICogQG1lbWJlck9mIHR1aS51dGlsXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEYXRlU2FmZShvYmopIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgIH1cblxuXG4gICAgdHVpLnV0aWwuaXNFeGlzdHkgPSBpc0V4aXN0eTtcbiAgICB0dWkudXRpbC5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuICAgIHR1aS51dGlsLmlzTnVsbCA9IGlzTnVsbDtcbiAgICB0dWkudXRpbC5pc1RydXRoeSA9IGlzVHJ1dGh5O1xuICAgIHR1aS51dGlsLmlzRmFsc3kgPSBpc0ZhbHN5O1xuICAgIHR1aS51dGlsLmlzQXJndW1lbnRzID0gaXNBcmd1bWVudHM7XG4gICAgdHVpLnV0aWwuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgaXNBcnJheTtcbiAgICB0dWkudXRpbC5pc0FycmF5U2FmZSA9IEFycmF5LmlzQXJyYXkgfHwgaXNBcnJheVNhZmU7XG4gICAgdHVpLnV0aWwuaXNPYmplY3QgPSBpc09iamVjdDtcbiAgICB0dWkudXRpbC5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbiAgICB0dWkudXRpbC5pc0Z1bmN0aW9uU2FmZSA9IGlzRnVuY3Rpb25TYWZlO1xuICAgIHR1aS51dGlsLmlzTnVtYmVyID0gaXNOdW1iZXI7XG4gICAgdHVpLnV0aWwuaXNOdW1iZXJTYWZlID0gaXNOdW1iZXJTYWZlO1xuICAgIHR1aS51dGlsLmlzRGF0ZSA9IGlzRGF0ZTtcbiAgICB0dWkudXRpbC5pc0RhdGVTYWZlID0gaXNEYXRlU2FmZTtcbiAgICB0dWkudXRpbC5pc1N0cmluZyA9IGlzU3RyaW5nO1xuICAgIHR1aS51dGlsLmlzU3RyaW5nU2FmZSA9IGlzU3RyaW5nU2FmZTtcbiAgICB0dWkudXRpbC5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG4gICAgdHVpLnV0aWwuaXNCb29sZWFuU2FmZSA9IGlzQm9vbGVhblNhZmU7XG4gICAgdHVpLnV0aWwuaXNIVE1MTm9kZSA9IGlzSFRNTE5vZGU7XG4gICAgdHVpLnV0aWwuaXNIVE1MVGFnID0gaXNIVE1MVGFnO1xuICAgIHR1aS51dGlsLmlzRW1wdHkgPSBpc0VtcHR5O1xuICAgIHR1aS51dGlsLmlzTm90RW1wdHkgPSBpc05vdEVtcHR5O1xuXG59KSh3aW5kb3cudHVpKTtcblxuLyoqKioqKioqKipcbiAqIHdpbmRvdy5qc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQGZpbGVvdmVydmlldyBUaGlzIG1vZHVsZSBoYXMgc29tZSBtZXRob2RzIGZvciBoYW5kbGluZyBwb3B1cC13aW5kb3dcbiAqIEBhdXRob3IgTkhOIEVudC5cbiAqICAgICAgICAgRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZTAyNDJAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IGJyb3dzZXIuanMsIHR5cGUuanMsIG9iamVjdC5qcywgY29sbGVjdGlvbi5qcywgZnVuYy5qcywgd2luZG93LmpzXG4gKi9cblxuKGZ1bmN0aW9uKHR1aSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBpZiAoIXR1aSkge1xuICAgICAgICB0dWkgPSB3aW5kb3cudHVpID0ge307XG4gICAgfVxuICAgIGlmICghdHVpLnV0aWwpIHtcbiAgICAgICAgdHVpLnV0aWwgPSB3aW5kb3cudHVpLnV0aWwgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgcG9wdXBfaWQgPSAwO1xuXG4gICAgLyoqXG4gICAgICogUG9wdXAgbWFuYWdlbWVudCBjbGFzc1xuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJvZiB0dWkudXRpbFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIFBvcHVwKCkge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWNoaW5nIHRoZSB3aW5kb3ctY29udGV4dHMgb2Ygb3BlbmVkIHBvcHVwc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vcGVuZWRQb3B1cCA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbiBJRTcsIGFuIGVycm9yIG9jY3VycyB3aGVuIHRoZSBjbG9zZVdpdGhQYXJlbnQgcHJvcGVydHkgYXR0YWNoZXMgdG8gd2luZG93IG9iamVjdC48YnI+XG4gICAgICAgICAqIFNvLCBJdCBpcyBmb3Igc2F2aW5nIHRoZSB2YWx1ZSBvZiBjbG9zZVdpdGhQYXJlbnQgaW5zdGVhZCBvZiBhdHRhY2hpbmcgdG8gd2luZG93IG9iamVjdC5cbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2xvc2VXaXRoUGFyZW50UG9wdXAgPSB7fTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUG9zdCBkYXRhIGJyaWRnZSBmb3IgSUUxMSBwb3B1cFxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wb3N0RGF0YUJyaWRnZVVybCA9ICcnO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqXG4gICAgICogcHVibGljIG1ldGhvZHNcbiAgICAgKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBwb3B1cC1saXN0IGFkbWluaXN0ZXJlZCBieSBjdXJyZW50IHdpbmRvdy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBwb3B1cC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBwb3B1cCB3aW5kb3cgbGlzdCBvYmplY3RcbiAgICAgKi9cbiAgICBQb3B1cC5wcm90b3R5cGUuZ2V0UG9wdXBMaXN0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHZhciB0YXJnZXQ7XG4gICAgICAgIGlmICh0dWkudXRpbC5pc0V4aXN0eShrZXkpKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0aGlzLm9wZW5lZFBvcHVwW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0aGlzLm9wZW5lZFBvcHVwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIE9wZW4gcG9wdXBcbiAgICAgKiBDYXV0aW9uOlxuICAgICAqICBJbiBJRTExLCB3aGVuIHRyYW5zZmVyIGRhdGEgdG8gcG9wdXAgYnkgUE9TVCwgbXVzdCBzZXQgdGhlIHBvc3REYXRhQnJpZGdlVXJsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHBvcHVwIHVybFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5wb3B1cE5hbWVdIC0gS2V5IG9mIHBvcHVwIHdpbmRvdy48YnI+XG4gICAgICogICAgICBJZiB0aGUga2V5IGlzIHNldCwgd2hlbiB5b3UgdHJ5IHRvIG9wZW4gYnkgdGhpcyBrZXksIHRoZSBwb3B1cCBvZiB0aGlzIGtleSBpcyBmb2N1c2VkLjxicj5cbiAgICAgKiAgICAgIE9yIGVsc2UgYSBuZXcgcG9wdXAgd2luZG93IGhhdmluZyB0aGlzIGtleSBpcyBvcGVuZWQuXG4gICAgICpcbiAgICAgKiAgICAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnBvcHVwT3B0aW9uU3RyPVwiXCJdIC0gT3B0aW9uIHN0cmluZyBvZiBwb3B1cCB3aW5kb3c8YnI+XG4gICAgICogICAgICBJdCBpcyBzYW1lIHdpdGggdGhlIHRoaXJkIHBhcmFtZXRlciBvZiB3aW5kb3cub3BlbigpIG1ldGhvZC48YnI+XG4gICAgICogICAgICBTZWUge0BsaW5rIGh0dHA6Ly93d3cudzNzY2hvb2xzLmNvbS9qc3JlZi9tZXRfd2luX29wZW4uYXNwfVxuICAgICAqXG4gICAgICogICAgIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2xvc2VXaXRoUGFyZW50PXRydWVdIC0gSXMgY2xvc2VkIHdoZW4gcGFyZW50IHdpbmRvdyBjbG9zZWQ/XG4gICAgICpcbiAgICAgKiAgICAgQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy51c2VSZWxvYWQ9ZmFsc2VdIC0gVGhpcyBwcm9wZXJ0eSBpbmRpY2F0ZXMgd2hldGhlciByZWxvYWQgdGhlIHBvcHVwIG9yIG5vdC48YnI+XG4gICAgICogICAgICBJZiB0cnVlLCB0aGUgcG9wdXAgd2lsbCBiZSByZWxvYWRlZCB3aGVuIHlvdSB0cnkgdG8gcmUtb3BlbiB0aGUgcG9wdXAgdGhhdCBoYXMgYmVlbiBvcGVuZWQuPGJyPlxuICAgICAqICAgICAgV2hlbiB0cmFuc21pdCB0aGUgUE9TVC1kYXRhLCBzb21lIGJyb3dzZXJzIGFsZXJ0IGEgbWVzc2FnZSBmb3IgY29uZmlybWluZyB3aGV0aGVyIHJldHJhbnNtaXQgb3Igbm90LlxuICAgICAqXG4gICAgICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5wb3N0RGF0YUJyaWRnZVVybD0nJ10gLSBVc2UgdGhpcyB1cmwgdG8gYXZvaWQgYSBjZXJ0YWluIGJ1ZyBvY2N1cmluZyB3aGVuIHRyYW5zbWl0dGluZyBQT1NUIGRhdGEgdG8gdGhlIHBvcHVwIGluIElFMTEuPGJyPlxuICAgICAqICAgICAgVGhpcyBzcGVjaWZpYyBidWdneSBzaXR1YXRpb24gaXMga25vd24gdG8gaGFwcGVuIGJlY2F1c2UgSUUxMSB0cmllcyB0byBvcGVuIHRoZSByZXF1ZXN0ZWQgdXJsIG5vdCBpbiBhIG5ldyBwb3B1cCB3aW5kb3cgYXMgaW50ZW5kZWQsIGJ1dCBpbiBhIG5ldyB0YWIuPGJyPlxuICAgICAqICAgICAgU2VlIHtAbGluayBodHRwOi8vd2lraS5uaG5lbnQuY29tL3BhZ2VzL3ZpZXdwYWdlLmFjdGlvbj9wYWdlSWQ9MjQwNTYyODQ0fVxuICAgICAqXG4gICAgICogICAgIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5tZXRob2Q9Z2V0XSAtIFRoZSBtZXRob2Qgb2YgdHJhbnNtaXNzaW9uIHdoZW4gdGhlIGZvcm0tZGF0YSBpcyB0cmFuc21pdHRlZCB0byBwb3B1cC13aW5kb3cuXG4gICAgICpcbiAgICAgKiAgICAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnBhcmFtPW51bGxdIC0gVXNpbmcgYXMgcGFyYW1ldGVycyBmb3IgdHJhbnNtaXNzaW9uIHdoZW4gdGhlIGZvcm0tZGF0YSBpcyB0cmFuc21pdHRlZCB0byBwb3B1cC13aW5kb3cuXG4gICAgICovXG4gICAgUG9wdXAucHJvdG90eXBlLm9wZW5Qb3B1cCA9IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zID0gdHVpLnV0aWwuZXh0ZW5kKHtcbiAgICAgICAgICAgIHBvcHVwTmFtZTogJ3BvcHVwXycgKyBwb3B1cF9pZCArICdfJyArICgrbmV3IERhdGUoKSksXG4gICAgICAgICAgICBwb3B1cE9wdGlvblN0cjogJycsXG4gICAgICAgICAgICB1c2VSZWxvYWQ6IHRydWUsXG4gICAgICAgICAgICBjbG9zZVdpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxuICAgICAgICAgICAgcGFyYW06IHt9XG4gICAgICAgIH0sIG9wdGlvbnMgfHwge30pO1xuXG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gb3B0aW9ucy5tZXRob2QudG9VcHBlckNhc2UoKTtcblxuICAgICAgICB0aGlzLnBvc3REYXRhQnJpZGdlVXJsID0gb3B0aW9ucy5wb3N0RGF0YUJyaWRnZVVybCB8fCB0aGlzLnBvc3REYXRhQnJpZGdlVXJsO1xuXG4gICAgICAgIHZhciBwb3B1cCxcbiAgICAgICAgICAgIGZvcm1FbGVtZW50LFxuICAgICAgICAgICAgdXNlSUVQb3N0QnJpZGdlID0gb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJyAmJiBvcHRpb25zLnBhcmFtICYmXG4gICAgICAgICAgICAgICAgdHVpLnV0aWwuYnJvd3Nlci5tc2llICYmIHR1aS51dGlsLmJyb3dzZXIudmVyc2lvbiA9PT0gMTE7XG5cbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0V4aXN0eSh1cmwpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvcHVwI29wZW4oKSDtjJ3sl4UgVVJM7J20IOyeheugpeuQmOyngCDslYrslZjsirXri4jri6QnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVwX2lkICs9IDE7XG5cbiAgICAgICAgLypcbiAgICAgICAgICogSW4gZm9ybS1kYXRhIHRyYW5zbWlzc2lvblxuICAgICAgICAgKiAxLiBDcmVhdGUgYSBmb3JtIGJlZm9yZSBvcGVuaW5nIGEgcG9wdXAuXG4gICAgICAgICAqIDIuIFRyYW5zbWl0IHRoZSBmb3JtLWRhdGEuXG4gICAgICAgICAqIDMuIFJlbW92ZSB0aGUgZm9ybSBhZnRlciB0cmFuc21pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBpZiAob3B0aW9ucy5wYXJhbSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICAgICAgICAgIHVybCA9IHVybCArICgvXFw/Ly50ZXN0KHVybCkgPyAnJicgOiAnPycpICsgdGhpcy5fcGFyYW1ldGVyaXplKG9wdGlvbnMucGFyYW0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF1c2VJRVBvc3RCcmlkZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybUVsZW1lbnQgPSB0aGlzLmNyZWF0ZUZvcm0odXJsLCBvcHRpb25zLnBhcmFtLCBvcHRpb25zLm1ldGhvZCwgb3B0aW9ucy5wb3B1cE5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB1cmwgPSAnYWJvdXQ6YmxhbmsnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHBvcHVwID0gdGhpcy5vcGVuZWRQb3B1cFtvcHRpb25zLnBvcHVwTmFtZV07XG5cbiAgICAgICAgaWYgKCF0dWkudXRpbC5pc0V4aXN0eShwb3B1cCkpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbmVkUG9wdXBbb3B0aW9ucy5wb3B1cE5hbWVdID0gcG9wdXAgPSB0aGlzLl9vcGVuKHVzZUlFUG9zdEJyaWRnZSwgb3B0aW9ucy5wYXJhbSxcbiAgICAgICAgICAgICAgICB1cmwsIG9wdGlvbnMucG9wdXBOYW1lLCBvcHRpb25zLnBvcHVwT3B0aW9uU3RyKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBvcHVwLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbmVkUG9wdXBbb3B0aW9ucy5wb3B1cE5hbWVdID0gcG9wdXAgPSB0aGlzLl9vcGVuKHVzZUlFUG9zdEJyaWRnZSwgb3B0aW9ucy5wYXJhbSxcbiAgICAgICAgICAgICAgICAgICAgdXJsLCBvcHRpb25zLnBvcHVwTmFtZSwgb3B0aW9ucy5wb3B1cE9wdGlvblN0cik7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudXNlUmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvcHVwLmxvY2F0aW9uLnJlcGxhY2UodXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcG9wdXAuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xvc2VXaXRoUGFyZW50UG9wdXBbb3B0aW9ucy5wb3B1cE5hbWVdID0gb3B0aW9ucy5jbG9zZVdpdGhQYXJlbnQ7XG5cbiAgICAgICAgaWYgKCFwb3B1cCB8fCBwb3B1cC5jbG9zZWQgfHwgdHVpLnV0aWwuaXNVbmRlZmluZWQocG9wdXAuY2xvc2VkKSkge1xuICAgICAgICAgICAgYWxlcnQoJ+u4jOudvOyasOyggOyXkCDtjJ3sl4XsnYQg66eJ64qUIOq4sOuKpeydtCDtmZzshLHtmZQg7IOB7YOc7J206riwIOuVjOusuOyXkCDshJzruYTsiqQg7J207Jqp7JeQIOusuOygnOqwgCDsnojsnYQg7IiYIOyeiOyKteuLiOuLpC4g7ZW064u5IOq4sOuKpeydhCDruYTtmZzshLHtmZQg7ZW0IOyjvOyEuOyalCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMucGFyYW0gJiYgb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJyAmJiAhdXNlSUVQb3N0QnJpZGdlKSB7XG4gICAgICAgICAgICBpZiAocG9wdXApIHtcbiAgICAgICAgICAgICAgICBmb3JtRWxlbWVudC5zdWJtaXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmb3JtRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgZm9ybUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmb3JtRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cub251bmxvYWQgPSB0dWkudXRpbC5iaW5kKHRoaXMuY2xvc2VBbGxQb3B1cCwgdGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENsb3NlIHRoZSBwb3B1cFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NraXBCZWZvcmVVbmxvYWRdIC0gSWYgdHJ1ZSwgdGhlICd3aW5kb3cub251bmxvYWQnIHdpbGwgYmUgbnVsbCBhbmQgc2tpcCB1bmxvYWQgZXZlbnQuXG4gICAgICogQHBhcmFtIHtXaW5kb3d9IFtwb3B1cF0gLSBXaW5kb3ctY29udGV4dCBvZiBwb3B1cCBmb3IgY2xvc2luZy4gSWYgb21pdCB0aGlzLCBjdXJyZW50IHdpbmRvdy1jb250ZXh0IHdpbGwgYmUgY2xvc2VkLlxuICAgICAqL1xuICAgIFBvcHVwLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKHNraXBCZWZvcmVVbmxvYWQsIHBvcHVwKSB7XG4gICAgICAgIHNraXBCZWZvcmVVbmxvYWQgPSB0dWkudXRpbC5pc0V4aXN0eShza2lwQmVmb3JlVW5sb2FkKSA/IHNraXBCZWZvcmVVbmxvYWQgOiBmYWxzZTtcblxuICAgICAgICB2YXIgdGFyZ2V0ID0gcG9wdXAgfHwgd2luZG93O1xuXG4gICAgICAgIGlmIChza2lwQmVmb3JlVW5sb2FkKSB7XG4gICAgICAgICAgICB3aW5kb3cub251bmxvYWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0YXJnZXQuY2xvc2VkKSB7XG4gICAgICAgICAgICB0YXJnZXQub3BlbmVyID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgICB0YXJnZXQuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZSBhbGwgdGhlIHBvcHVwcyBpbiBjdXJyZW50IHdpbmRvdy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsb3NlV2l0aFBhcmVudCAtIElmIHRydWUsIHBvcHVwcyBoYXZpbmcgdGhlIGNsb3NlV2l0aFBhcmVudFBvcHVwIHByb3BlcnR5IGFzIHRydWUgd2lsbCBiZSBjbG9zZWQuXG4gICAgICovXG4gICAgUG9wdXAucHJvdG90eXBlLmNsb3NlQWxsUG9wdXAgPSBmdW5jdGlvbihjbG9zZVdpdGhQYXJlbnQpIHtcbiAgICAgICAgdmFyIGhhc0FyZyA9IHR1aS51dGlsLmlzRXhpc3R5KGNsb3NlV2l0aFBhcmVudCk7XG5cbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaE93blByb3BlcnRpZXModGhpcy5vcGVuZWRQb3B1cCwgZnVuY3Rpb24ocG9wdXAsIGtleSkge1xuICAgICAgICAgICAgaWYgKChoYXNBcmcgJiYgdGhpcy5jbG9zZVdpdGhQYXJlbnRQb3B1cFtrZXldKSB8fCAhaGFzQXJnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZShmYWxzZSwgcG9wdXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWN0aXZhdGUob3IgZm9jdXMpIHRoZSBwb3B1cCBvZiB0aGUgZ2l2ZW4gbmFtZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcG9wdXBOYW1lIC0gTmFtZSBvZiBwb3B1cCBmb3IgYWN0aXZhdGlvblxuICAgICAqL1xuICAgIFBvcHVwLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uKHBvcHVwTmFtZSkge1xuICAgICAgICB0aGlzLmdldFBvcHVwTGlzdChwb3B1cE5hbWUpLmZvY3VzKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhbiBvYmplY3QgbWFkZSBvZiBwYXJzaW5nIHRoZSBxdWVyeSBzdHJpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgaGF2aW5nIHNvbWUgaW5mb3JtYXRpb24gb2YgdGhlIHF1ZXJ5IHN0cmluZy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFBvcHVwLnByb3RvdHlwZS5wYXJzZVF1ZXJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWFyY2gsXG4gICAgICAgICAgICBwYWlyLFxuICAgICAgICAgICAgcGFyYW0gPSB7fTtcblxuICAgICAgICBzZWFyY2ggPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKTtcbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaEFycmF5KHNlYXJjaC5zcGxpdCgnJicpLCBmdW5jdGlvbihwYXJ0KSB7XG4gICAgICAgICAgICBwYWlyID0gcGFydC5zcGxpdCgnPScpO1xuICAgICAgICAgICAgcGFyYW1bZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcmFtO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBoaWRkZW4gZm9ybSBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHMgYW5kIHJldHVybiB0aGlzIGZvcm0uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvbiAtIFVSTCBmb3IgZm9ybSB0cmFuc21pc3Npb25cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW2RhdGFdIC0gRGF0YSBmb3IgZm9ybSB0cmFuc21pc3Npb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZF0gLSBNZXRob2Qgb2YgdHJhbnNtaXNzaW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0YXJnZXRdIC0gVGFyZ2V0IG9mIHRyYW5zbWlzc2lvblxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtjb250YWluZXJdIC0gQ29udGFpbmVyIGVsZW1lbnQgb2YgZm9ybS5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEZvcm0gZWxlbWVudFxuICAgICAqL1xuICAgIFBvcHVwLnByb3RvdHlwZS5jcmVhdGVGb3JtID0gZnVuY3Rpb24oYWN0aW9uLCBkYXRhLCBtZXRob2QsIHRhcmdldCwgY29udGFpbmVyKSB7XG4gICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpLFxuICAgICAgICAgICAgaW5wdXQ7XG5cbiAgICAgICAgY29udGFpbmVyID0gY29udGFpbmVyIHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgZm9ybS5tZXRob2QgPSBtZXRob2QgfHwgJ1BPU1QnO1xuICAgICAgICBmb3JtLmFjdGlvbiA9IGFjdGlvbiB8fCAnJztcbiAgICAgICAgZm9ybS50YXJnZXQgPSB0YXJnZXQgfHwgJyc7XG4gICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICB0dWkudXRpbC5mb3JFYWNoT3duUHJvcGVydGllcyhkYXRhLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBpbnB1dC5uYW1lID0ga2V5O1xuICAgICAgICAgICAgaW5wdXQudHlwZSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGZvcm0uYXBwZW5kQ2hpbGQoaW5wdXQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZm9ybSk7XG5cbiAgICAgICAgcmV0dXJuIGZvcm07XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogcHJpdmF0ZSBtZXRob2RzXG4gICAgICoqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYW4gcXVlcnkgc3RyaW5nIG1hZGUgYnkgcGFyc2luZyB0aGUgZ2l2ZW4gb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCAtIEFuIG9iamVjdCB0aGF0IGhhcyBpbmZvcm1hdGlvbiBmb3IgcXVlcnkgc3RyaW5nXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBRdWVyeSBzdHJpbmdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFBvcHVwLnByb3RvdHlwZS5fcGFyYW1ldGVyaXplID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBxdWVyeSA9IFtdO1xuXG4gICAgICAgIHR1aS51dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgcXVlcnkucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcXVlcnkuam9pbignJicpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBPcGVuIHBvcHVwXG4gICAgICogQHBhcmFtIHtib29sZWFufSB1c2VJRVBvc3RCcmlkZ2UgLSBBIHN3aXRjaCBvcHRpb24gd2hldGhlciB0byB1c2UgYWx0ZXJuYXRpdmUgb2YgdG9zc2luZyBQT1NUIGRhdGEgdG8gdGhlIHBvcHVwIHdpbmRvdyBpbiBJRTExXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIC0gQSBkYXRhIGZvciB0b3NzaW5nIHRvIHBvcHVwXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIFBvcHVwIHVybFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwb3B1cE5hbWUgLSBQb3B1cCBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvblN0ciAtIFNldHRpbmcgZm9yIHBvcHVwLCBleCkgJ3dpZHRoPTY0MCxoZWlnaHQ9MzIwLHNjcm9sbGJhcnM9eWVzJ1xuICAgICAqIEByZXR1cm5zIHtXaW5kb3d9IFdpbmRvdyBjb250ZXh0IG9mIHBvcHVwXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBQb3B1cC5wcm90b3R5cGUuX29wZW4gPSBmdW5jdGlvbih1c2VJRVBvc3RCcmlkZ2UsIHBhcmFtLCB1cmwsIHBvcHVwTmFtZSwgb3B0aW9uU3RyKSB7XG4gICAgICAgIHZhciBwb3B1cDtcblxuICAgICAgICBpZiAodXNlSUVQb3N0QnJpZGdlKSB7XG4gICAgICAgICAgICB1cmwgPSB0aGlzLnBvc3REYXRhQnJpZGdlVXJsICsgJz9zdG9yYWdlS2V5PScgKyBlbmNvZGVVUklDb21wb25lbnQocG9wdXBOYW1lKSArXG4gICAgICAgICAgICAnJnJlZGlyZWN0VXJsPScgKyBlbmNvZGVVUklDb21wb25lbnQodXJsKTtcbiAgICAgICAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCdJRTEx67iM65287Jqw7KCA7J2YIOusuOygnOuhnCDsnbjtlbQg7J20IOq4sOuKpeydgCDruIzrnbzsmrDsoIDsnZggTG9jYWxTdG9yYWdlIOq4sOuKpeydhCDtmZzshLHtmZQg7ZWY7IWU7JW8IOydtOyaqe2VmOyLpCDsiJgg7J6I7Iq164uI64ukJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHBvcHVwTmFtZSk7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0ocG9wdXBOYW1lLCBKU09OLnN0cmluZ2lmeShwYXJhbSkpO1xuXG4gICAgICAgICAgICAgICAgcG9wdXAgPSB3aW5kb3cub3Blbih1cmwsIHBvcHVwTmFtZSwgb3B0aW9uU3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcHVwID0gd2luZG93Lm9wZW4odXJsLCBwb3B1cE5hbWUsIG9wdGlvblN0cik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9wdXA7XG4gICAgfTtcblxuICAgIHR1aS51dGlsLnBvcHVwID0gbmV3IFBvcHVwKCk7XG5cbn0pKHdpbmRvdy50dWkpO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFV0aWxpdHkgbWV0aG9kcyB0byBtYW5pcHVsYXRlIGNvbG9yc1xuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGhleFJYID0gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pO1xuXG52YXIgY29sb3J1dGlsID0ge1xuICAgIC8qKlxuICAgICAqIHBhZCBsZWZ0IHplcm8gY2hhcmFjdGVycy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIG51bWJlciB2YWx1ZSB0byBwYWQgemVyby5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIHBhZCBsZW5ndGggdG8gd2FudC5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwYWRkZWQgc3RyaW5nLlxuICAgICAqL1xuICAgIGxlYWRpbmdaZXJvOiBmdW5jdGlvbihudW1iZXIsIGxlbmd0aCkge1xuICAgICAgICB2YXIgemVybyA9ICcnLFxuICAgICAgICAgICAgaSA9IDA7XG5cbiAgICAgICAgaWYgKChudW1iZXIgKyAnJykubGVuZ3RoID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgJyc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKDsgaSA8IChsZW5ndGggLSAxKTsgaSArPSAxKSB7XG4gICAgICAgICAgICB6ZXJvICs9ICcwJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoemVybyArIG51bWJlcikuc2xpY2UobGVuZ3RoICogLTEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB2YWxpZGF0ZSBvZiBoZXggc3RyaW5nIHZhbHVlIGlzIFJHQlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSByZ2IgaGV4IHN0cmluZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB3aGVuIHN1cHBsaWVkIHN0ciBpcyB2YWxpZCBSR0IgaGV4IHN0cmluZ1xuICAgICAqL1xuICAgIGlzVmFsaWRSR0I6IGZ1bmN0aW9uKHN0cikge1xuICAgICAgICByZXR1cm4gaGV4UlgudGVzdChzdHIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGNvbG9yIGhleCBzdHJpbmcgdG8gcmdiIG51bWJlciBhcnJheVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHIgLSBoZXggc3RyaW5nXG4gICAgICogQHJldHVybiB7bnVtYmVyW119IHJnYiBudW1iZXJzXG4gICAgICovXG4gICAgaGV4VG9SR0I6IGZ1bmN0aW9uKGhleFN0cikge1xuICAgICAgICB2YXIgciwgZywgYjtcblxuICAgICAgICBpZiAoIWNvbG9ydXRpbC5pc1ZhbGlkUkdCKGhleFN0cikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGhleFN0ciA9IGhleFN0ci5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgciA9IHBhcnNlSW50KGhleFN0ci5zdWJzdHIoMCwgMiksIDE2KTtcbiAgICAgICAgZyA9IHBhcnNlSW50KGhleFN0ci5zdWJzdHIoMiwgMiksIDE2KTtcbiAgICAgICAgYiA9IHBhcnNlSW50KGhleFN0ci5zdWJzdHIoNCwgMiksIDE2KTtcblxuICAgICAgICByZXR1cm4gW3IsIGcsIGJdO1xuICAgIH0sXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IHJnYiBudW1iZXIgdG8gaGV4IHN0cmluZ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gcmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBncmVlblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gYmx1ZVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8Ym9vbGVhbn0gcmV0dXJuIGZhbHNlIHdoZW4gc3VwcGxpZWQgcmdiIG51bWJlciBpcyBub3QgdmFsaWQuIG90aGVyd2lzZSwgY29udmVydGVkIGhleCBzdHJpbmdcbiAgICAgKi9cbiAgICByZ2JUb0hFWDogZnVuY3Rpb24ociwgZywgYikge1xuICAgICAgICB2YXIgaGV4U3RyID0gJyMnICsgXG4gICAgICAgICAgICBjb2xvcnV0aWwubGVhZGluZ1plcm8oci50b1N0cmluZygxNiksIDIpICsgXG4gICAgICAgICAgICBjb2xvcnV0aWwubGVhZGluZ1plcm8oZy50b1N0cmluZygxNiksIDIpICtcbiAgICAgICAgICAgIGNvbG9ydXRpbC5sZWFkaW5nWmVybyhiLnRvU3RyaW5nKDE2KSwgMik7XG4gICAgICAgIFxuICAgICAgICBpZiAoY29sb3J1dGlsLmlzVmFsaWRSR0IoaGV4U3RyKSkge1xuICAgICAgICAgICAgcmV0dXJuIGhleFN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCByZ2IgbnVtYmVyIHRvIEhTViB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gcmVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBncmVlblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gYmx1ZVxuICAgICAqIEByZXR1cm4ge251bWJlcltdfSBoc3YgdmFsdWVcbiAgICAgKi9cbiAgICByZ2JUb0hTVjogZnVuY3Rpb24ociwgZywgYikge1xuICAgICAgICB2YXIgbWF4LCBtaW4sIGgsIHMsIHYsIGQ7XG5cbiAgICAgICAgciAvPSAyNTU7XG4gICAgICAgIGcgLz0gMjU1O1xuICAgICAgICBiIC89IDI1NTtcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgICAgICB2ID0gbWF4O1xuICAgICAgICBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbWF4ID09PSAwID8gMCA6IChkIC8gbWF4KTtcblxuICAgICAgICBpZiAobWF4ID09PSBtaW4pIHtcbiAgICAgICAgICAgIGggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChtYXgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICAgICAgICAgIC8vIG5vIGRlZmF1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGggLz0gNjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBNYXRoLnJvdW5kKGggKiAzNjApLCBcbiAgICAgICAgICAgIE1hdGgucm91bmQocyAqIDEwMCksXG4gICAgICAgICAgICBNYXRoLnJvdW5kKHYgKiAxMDApXG4gICAgICAgIF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgSFNWIG51bWJlciB0byBSR0JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaCAtIGh1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzIC0gc2F0dXJhdGlvblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2IC0gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IHJnYiB2YWx1ZVxuICAgICAqL1xuICAgIGhzdlRvUkdCOiBmdW5jdGlvbihoLCBzLCB2KSB7XG4gICAgICAgIHZhciByLCBnLCBiO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGYsIHAsIHEsIHQ7XG4gICAgICAgIFxuICAgICAgICBoID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMzYwLCBoKSk7XG4gICAgICAgIHMgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHMpKTtcbiAgICAgICAgdiA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEwMCwgdikpO1xuICAgICAgICBcbiAgICAgICAgcyAvPSAxMDA7XG4gICAgICAgIHYgLz0gMTAwO1xuICAgICAgICBcbiAgICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgICAgIC8vIEFjaHJvbWF0aWMgKGdyZXkpXG4gICAgICAgICAgICByID0gZyA9IGIgPSB2O1xuICAgICAgICAgICAgcmV0dXJuIFtNYXRoLnJvdW5kKHIgKiAyNTUpLCBNYXRoLnJvdW5kKGcgKiAyNTUpLCBNYXRoLnJvdW5kKGIgKiAyNTUpXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaCAvPSA2MDsgLy8gc2VjdG9yIDAgdG8gNVxuICAgICAgICBpID0gTWF0aC5mbG9vcihoKTtcbiAgICAgICAgZiA9IGggLSBpOyAvLyBmYWN0b3JpYWwgcGFydCBvZiBoXG4gICAgICAgIHAgPSB2ICogKDEgLSBzKTtcbiAgICAgICAgcSA9IHYgKiAoMSAtIHMgKiBmKTtcbiAgICAgICAgdCA9IHYgKiAoMSAtIHMgKiAoMSAtIGYpKTtcblxuICAgICAgICBzd2l0Y2ggKGkpIHtcbiAgICAgICAgICAgIGNhc2UgMDogciA9IHY7IGcgPSB0OyBiID0gcDsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IHIgPSBxOyBnID0gdjsgYiA9IHA7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiByID0gcDsgZyA9IHY7IGIgPSB0OyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzogciA9IHA7IGcgPSBxOyBiID0gdjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6IHIgPSB0OyBnID0gcDsgYiA9IHY7IGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDogciA9IHY7IGcgPSBwOyBiID0gcTsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBbTWF0aC5yb3VuZChyICogMjU1KSwgTWF0aC5yb3VuZChnICogMjU1KSwgTWF0aC5yb3VuZChiICogMjU1KV07XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb2xvcnV0aWw7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBDb21tb24gY29sbGVjdGlvbnMuXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbCxcbiAgICBmb3JFYWNoUHJvcCA9IHV0aWwuZm9yRWFjaE93blByb3BlcnRpZXMsXG4gICAgZm9yRWFjaEFyciA9IHV0aWwuZm9yRWFjaEFycmF5LFxuICAgIGlzRnVuYyA9IHV0aWwuaXNGdW5jdGlvbixcbiAgICBpc09iaiA9IHV0aWwuaXNPYmplY3Q7XG5cbnZhciBhcHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogQ29tbW9uIGNvbGxlY3Rpb24uXG4gKlxuICogSXQgbmVlZCBmdW5jdGlvbiBmb3IgZ2V0IG1vZGVsJ3MgdW5pcXVlIGlkLlxuICpcbiAqIGlmIHRoZSBmdW5jdGlvbiBpcyBub3Qgc3VwcGxpZWQgdGhlbiBpdCB1c2UgZGVmYXVsdCBmdW5jdGlvbiB7QGxpbmsgQ29sbGVjdGlvbiNnZXRJdGVtSUR9XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRJdGVtSURGbl0gZnVuY3Rpb24gZm9yIGdldCBtb2RlbCdzIGlkLlxuICovXG5mdW5jdGlvbiBDb2xsZWN0aW9uKGdldEl0ZW1JREZuKSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge29iamVjdC48c3RyaW5nLCAqPn1cbiAgICAgKi9cbiAgICB0aGlzLml0ZW1zID0ge307XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubGVuZ3RoID0gMDtcblxuICAgIGlmIChpc0Z1bmMoZ2V0SXRlbUlERm4pKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7ZnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldEl0ZW1JRCA9IGdldEl0ZW1JREZuO1xuICAgIH1cbn1cblxuLyoqKioqKioqKipcbiAqIHN0YXRpYyBwcm9wc1xuICoqKioqKioqKiovXG5cbi8qKlxuICogQ29tYmluZCBzdXBwbGllZCBmdW5jdGlvbiBmaWx0ZXJzIGFuZCBjb25kaXRpb24uXG4gKiBAcGFyYW0gey4uLmZ1bmN0aW9ufSBmaWx0ZXJzIC0gZnVuY3Rpb24gZmlsdGVyc1xuICogQHJldHVybnMge2Z1bmN0aW9ufSBjb21iaW5lZCBmaWx0ZXJcbiAqL1xuQ29sbGVjdGlvbi5hbmQgPSBmdW5jdGlvbihmaWx0ZXJzKSB7XG4gICAgdmFyIGNudDtcblxuICAgIGZpbHRlcnMgPSBhcHMuY2FsbChhcmd1bWVudHMpO1xuICAgIGNudCA9IGZpbHRlcnMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAgIGZvciAoOyBpIDwgY250OyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmICghZmlsdGVyc1tpXS5jYWxsKG51bGwsIGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBDb21iaW5lIG11bHRpcGxlIGZ1bmN0aW9uIGZpbHRlcnMgd2l0aCBPUiBjbGF1c2UuXG4gKiBAcGFyYW0gey4uLmZ1bmN0aW9ufSBmaWx0ZXJzIC0gZnVuY3Rpb24gZmlsdGVyc1xuICogQHJldHVybnMge2Z1bmN0aW9ufSBjb21iaW5lZCBmaWx0ZXJcbiAqL1xuQ29sbGVjdGlvbi5vciA9IGZ1bmN0aW9uKGZpbHRlcnMpIHtcbiAgICB2YXIgY250O1xuXG4gICAgZmlsdGVycyA9IGFwcy5jYWxsKGFyZ3VtZW50cyk7XG4gICAgY250ID0gZmlsdGVycy5sZW5ndGg7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgaSA9IDEsXG4gICAgICAgICAgICByZXN1bHQgPSBmaWx0ZXJzWzBdLmNhbGwobnVsbCwgaXRlbSk7XG5cbiAgICAgICAgZm9yICg7IGkgPCBjbnQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgcmVzdWx0ID0gKHJlc3VsdCB8fCBmaWx0ZXJzW2ldLmNhbGwobnVsbCwgaXRlbSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xufTtcblxuLyoqXG4gKiBNZXJnZSBzZXZlcmFsIGNvbGxlY3Rpb25zLlxuICpcbiAqIFlvdSBjYW5cXCd0IG1lcmdlIGNvbGxlY3Rpb25zIGRpZmZlcmVudCBfZ2V0RXZlbnRJRCBmdW5jdGlvbnMuIFRha2UgY2FzZSBvZiB1c2UuXG4gKiBAcGFyYW0gey4uLkNvbGxlY3Rpb259IGNvbGxlY3Rpb25zIGNvbGxlY3Rpb24gYXJndW1lbnRzIHRvIG1lcmdlXG4gKiBAcmV0dXJucyB7Q29sbGVjdGlvbn0gbWVyZ2VkIGNvbGxlY3Rpb24uXG4gKi9cbkNvbGxlY3Rpb24ubWVyZ2UgPSBmdW5jdGlvbihjb2xsZWN0aW9ucykgeyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgdmFyIGNvbHMgPSBhcHMuY2FsbChhcmd1bWVudHMpLFxuICAgICAgICBuZXdJdGVtcyA9IHt9LFxuICAgICAgICBtZXJnZWQgPSBuZXcgQ29sbGVjdGlvbihjb2xzWzBdLmdldEl0ZW1JRCksXG4gICAgICAgIGV4dGVuZCA9IHV0aWwuZXh0ZW5kO1xuXG4gICAgZm9yRWFjaEFycihjb2xzLCBmdW5jdGlvbihjb2wpIHtcbiAgICAgICAgZXh0ZW5kKG5ld0l0ZW1zLCBjb2wuaXRlbXMpO1xuICAgIH0pO1xuXG4gICAgbWVyZ2VkLml0ZW1zID0gbmV3SXRlbXM7XG4gICAgbWVyZ2VkLmxlbmd0aCA9IHV0aWwua2V5cyhtZXJnZWQuaXRlbXMpLmxlbmd0aDtcblxuICAgIHJldHVybiBtZXJnZWQ7XG59O1xuXG4vKioqKioqKioqKlxuICogcHJvdG90eXBlIHByb3BzXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBnZXQgbW9kZWwncyB1bmlxdWUgaWQuXG4gKiBAcGFyYW0ge29iamVjdH0gaXRlbSBtb2RlbCBpbnN0YW5jZS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IG1vZGVsIHVuaXF1ZSBpZC5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZ2V0SXRlbUlEID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiBpdGVtLl9pZCArICcnO1xufTtcblxuLyoqXG4gKiBhZGQgbW9kZWxzLlxuICogQHBhcmFtIHsuLi4qfSBpdGVtIG1vZGVscyB0byBhZGQgdGhpcyBjb2xsZWN0aW9uLlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGlkLFxuICAgICAgICBvd25JdGVtcztcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3JFYWNoQXJyKGFwcy5jYWxsKGFyZ3VtZW50cyksIGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKG8pO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWQgPSB0aGlzLmdldEl0ZW1JRChpdGVtKTtcbiAgICBvd25JdGVtcyA9IHRoaXMuaXRlbXM7XG5cbiAgICBpZiAoIW93bkl0ZW1zW2lkXSkge1xuICAgICAgICB0aGlzLmxlbmd0aCArPSAxO1xuICAgIH1cbiAgICBvd25JdGVtc1tpZF0gPSBpdGVtO1xufTtcblxuLyoqXG4gKiByZW1vdmUgbW9kZWxzLlxuICogQHBhcmFtIHsuLi4ob2JqZWN0fHN0cmluZ3xudW1iZXIpfSBpZCBtb2RlbCBpbnN0YW5jZSBvciB1bmlxdWUgaWQgdG8gZGVsZXRlLlxuICogQHJldHVybnMge2FycmF5fSBkZWxldGVkIG1vZGVsIGxpc3QuXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIHJlbW92ZWQgPSBbXSxcbiAgICAgICAgb3duSXRlbXMsXG4gICAgICAgIGl0ZW1Ub1JlbW92ZTtcblxuICAgIGlmICghdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJlbW92ZWQgPSB1dGlsLm1hcChhcHMuY2FsbChhcmd1bWVudHMpLCBmdW5jdGlvbihpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIHJlbW92ZWQ7XG4gICAgfVxuXG4gICAgb3duSXRlbXMgPSB0aGlzLml0ZW1zO1xuXG4gICAgaWYgKGlzT2JqKGlkKSkge1xuICAgICAgICBpZCA9IHRoaXMuZ2V0SXRlbUlEKGlkKTtcbiAgICB9XG5cbiAgICBpZiAoIW93bkl0ZW1zW2lkXSkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcbiAgICB9XG5cbiAgICB0aGlzLmxlbmd0aCAtPSAxO1xuICAgIGl0ZW1Ub1JlbW92ZSA9IG93bkl0ZW1zW2lkXTtcbiAgICBkZWxldGUgb3duSXRlbXNbaWRdO1xuXG4gICAgcmV0dXJuIGl0ZW1Ub1JlbW92ZTtcbn07XG5cbi8qKlxuICogcmVtb3ZlIGFsbCBtb2RlbHMgaW4gY29sbGVjdGlvbi5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLml0ZW1zID0ge307XG4gICAgdGhpcy5sZW5ndGggPSAwO1xufTtcblxuLyoqXG4gKiBjaGVjayBjb2xsZWN0aW9uIGhhcyBzcGVjaWZpYyBtb2RlbC5cbiAqIEBwYXJhbSB7KG9iamVjdHxzdHJpbmd8bnVtYmVyfGZ1bmN0aW9uKX0gaWQgbW9kZWwgaW5zdGFuY2Ugb3IgaWQgb3IgZmlsdGVyIGZ1bmN0aW9uIHRvIGNoZWNrXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gaXMgaGFzIG1vZGVsP1xuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihpZCkge1xuICAgIHZhciBpc0ZpbHRlcixcbiAgICAgICAgaGFzO1xuXG4gICAgaWYgKCF0aGlzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNGaWx0ZXIgPSBpc0Z1bmMoaWQpO1xuICAgIGhhcyA9IGZhbHNlO1xuXG4gICAgaWYgKGlzRmlsdGVyKSB7XG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaWQoaXRlbSkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBoYXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWQgPSBpc09iaihpZCkgPyB0aGlzLmdldEl0ZW1JRChpZCkgOiBpZDtcbiAgICAgICAgaGFzID0gdXRpbC5pc0V4aXN0eSh0aGlzLml0ZW1zW2lkXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhcztcbn07XG5cbi8qKlxuICogaW52b2tlIGNhbGxiYWNrIHdoZW4gbW9kZWwgZXhpc3QgaW4gY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBpZCBtb2RlbCB1bmlxdWUgaWQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiB0aGUgY2FsbGJhY2suXG4gKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjYWxsYmFjayBjb250ZXh0LlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5kb1doZW5IYXMgPSBmdW5jdGlvbihpZCwgZm4sIGNvbnRleHQpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMuaXRlbXNbaWRdO1xuXG4gICAgaWYgKCF1dGlsLmlzRXhpc3R5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmbi5jYWxsKGNvbnRleHQgfHwgdGhpcywgaXRlbSk7XG59O1xuXG4vKipcbiAqIFNlYXJjaCBtb2RlbC4gYW5kIHJldHVybiBuZXcgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZpbHRlciBmaWx0ZXIgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7Q29sbGVjdGlvbn0gbmV3IGNvbGxlY3Rpb24gd2l0aCBmaWx0ZXJlZCBtb2RlbHMuXG4gKiBAZXhhbXBsZVxuICogY29sbGVjdGlvbi5maW5kKGZ1bmN0aW9uKGl0ZW0pIHtcbiAqICAgICByZXR1cm4gaXRlbS5lZGl0ZWQgPT09IHRydWU7XG4gKiB9KTtcbiAqXG4gKiBmdW5jdGlvbiBmaWx0ZXIxKGl0ZW0pIHtcbiAqICAgICByZXR1cm4gaXRlbS5lZGl0ZWQgPT09IGZhbHNlO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGZpbHRlcjIoaXRlbSkge1xuICogICAgIHJldHVybiBpdGVtLmRpc2FibGVkID09PSBmYWxzZTtcbiAqIH1cbiAqXG4gKiBjb2xsZWN0aW9uLmZpbmQoQ29sbGVjdGlvbi5hbmQoZmlsdGVyMSwgZmlsdGVyMikpO1xuICpcbiAqIGNvbGxlY3Rpb24uZmluZChDb2xsZWN0aW9uLm9yKGZpbHRlcjEsIGZpbHRlcjIpKTtcbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciByZXN1bHQgPSBuZXcgQ29sbGVjdGlvbigpO1xuXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2dldEl0ZW1JRCcpKSB7XG4gICAgICAgIHJlc3VsdC5nZXRJdGVtSUQgPSB0aGlzLmdldEl0ZW1JRDtcbiAgICB9XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBpZiAoZmlsdGVyKGl0ZW0pID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXN1bHQuYWRkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBHcm91cCBlbGVtZW50IGJ5IHNwZWNpZmljIGtleSB2YWx1ZXMuXG4gKlxuICogaWYga2V5IHBhcmFtZXRlciBpcyBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCBhbmQgdXNlIHJldHVybmVkIHZhbHVlLlxuICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcnxmdW5jdGlvbnxhcnJheSl9IGtleSBrZXkgcHJvcGVydHkgb3IgZ2V0dGVyIGZ1bmN0aW9uLiBpZiBzdHJpbmdbXSBzdXBwbGllZCwgY3JlYXRlIGVhY2ggY29sbGVjdGlvbiBiZWZvcmUgZ3JvdXBpbmcuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ3JvdXBGdW5jXSAtIGZ1bmN0aW9uIHRoYXQgcmV0dXJuIGVhY2ggZ3JvdXAncyBrZXlcbiAqIEByZXR1cm5zIHtvYmplY3QuPHN0cmluZywgQ29sbGVjdGlvbj59IGdyb3VwZWQgb2JqZWN0XG4gKiBAZXhhbXBsZVxuICogXG4gKiAvLyBwYXNzIGBzdHJpbmdgLCBgbnVtYmVyYCwgYGJvb2xlYW5gIHR5cGUgdmFsdWUgdGhlbiBncm91cCBieSBwcm9wZXJ0eSB2YWx1ZS5cbiAqIGNvbGxlY3Rpb24uZ3JvdXBCeSgnZ2VuZGVyJyk7ICAgIC8vIGdyb3VwIGJ5ICdnZW5kZXInIHByb3BlcnR5IHZhbHVlLlxuICogY29sbGVjdGlvbi5ncm91cEJ5KDUwKTsgICAgICAgICAgLy8gZ3JvdXAgYnkgJzUwJyBwcm9wZXJ0eSB2YWx1ZS5cbiAqIFxuICogLy8gcGFzcyBgZnVuY3Rpb25gIHRoZW4gZ3JvdXAgYnkgcmV0dXJuIHZhbHVlLiBlYWNoIGludm9jYXRpb24gYGZ1bmN0aW9uYCBpcyBjYWxsZWQgd2l0aCBgKGl0ZW0pYC5cbiAqIGNvbGxlY3Rpb24uZ3JvdXBCeShmdW5jdGlvbihpdGVtKSB7XG4gKiAgICAgaWYgKGl0ZW0uc2NvcmUgPiA2MCkge1xuICogICAgICAgICByZXR1cm4gJ3Bhc3MnO1xuICogICAgIH1cbiAqICAgICByZXR1cm4gJ2ZhaWwnO1xuICogfSk7XG4gKlxuICogLy8gcGFzcyBgYXJyYXlgIHdpdGggZmlyc3QgYXJndW1lbnRzIHRoZW4gY3JlYXRlIGVhY2ggY29sbGVjdGlvbiBiZWZvcmUgZ3JvdXBpbmcuXG4gKiBjb2xsZWN0aW9uLmdyb3VwQnkoWydnbycsICdydWJ5JywgJ2phdmFzY3JpcHQnXSk7XG4gKiAvLyByZXN1bHQ6IHsgJ2dvJzogZW1wdHkgQ29sbGVjdGlvbiwgJ3J1YnknOiBlbXB0eSBDb2xsZWN0aW9uLCAnamF2YXNjcmlwdCc6IGVtcHR5IENvbGxlY3Rpb24gfVxuICpcbiAqIC8vIGNhbiBwYXNzIGBmdW5jdGlvbmAgd2l0aCBgYXJyYXlgIHRoZW4gZ3JvdXAgZWFjaCBlbGVtZW50cy5cbiAqIGNvbGxlY3Rpb24uZ3JvdXBCeShbJ2dvJywgJ3J1YnknLCAnamF2YXNjcmlwdCddLCBmdW5jdGlvbihpdGVtKSB7XG4gKiAgICAgaWYgKGl0ZW0uaXNGYXN0KSB7XG4gKiAgICAgICAgIHJldHVybiAnZ28nO1xuICogICAgIH1cbiAqXG4gKiAgICAgcmV0dXJuIGl0ZW0ubmFtZTtcbiAqIH0pO1xuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5ncm91cEJ5ID0gZnVuY3Rpb24oa2V5LCBncm91cEZ1bmMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sXG4gICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIGJhc2VWYWx1ZSxcbiAgICAgICAgaXNGdW5jID0gdXRpbC5pc0Z1bmN0aW9uLFxuICAgICAgICBrZXlJc0Z1bmMgPSBpc0Z1bmMoa2V5KSxcbiAgICAgICAgZ2V0SXRlbUlERm4gPSB0aGlzLmdldEl0ZW1JRDtcblxuICAgIGlmICh1dGlsLmlzQXJyYXkoa2V5KSkge1xuICAgICAgICB1dGlsLmZvckVhY2hBcnJheShrZXksIGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIHJlc3VsdFtrICsgJyddID0gbmV3IENvbGxlY3Rpb24oZ2V0SXRlbUlERm4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWdyb3VwRnVuYykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGtleSA9IGdyb3VwRnVuYztcbiAgICAgICAga2V5SXNGdW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBpZiAoa2V5SXNGdW5jKSB7XG4gICAgICAgICAgICBiYXNlVmFsdWUgPSBrZXkoaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYXNlVmFsdWUgPSBpdGVtW2tleV07XG5cbiAgICAgICAgICAgIGlmIChpc0Z1bmMoYmFzZVZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGJhc2VWYWx1ZSA9IGJhc2VWYWx1ZS5hcHBseShpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbGxlY3Rpb24gPSByZXN1bHRbYmFzZVZhbHVlXTtcblxuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24gPSByZXN1bHRbYmFzZVZhbHVlXSA9IG5ldyBDb2xsZWN0aW9uKGdldEl0ZW1JREZuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbGxlY3Rpb24uYWRkKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogUmV0dXJuIHNpbmdsZSBpdGVtIGluIGNvbGxlY3Rpb24uXG4gKlxuICogUmV0dXJuZWQgaXRlbSBpcyBpbnNlcnRlZCBpbiB0aGlzIGNvbGxlY3Rpb24gZmlyc3RseS5cbiAqIEByZXR1cm5zIHtvYmplY3R9IGl0ZW0uXG4gKi9cbkNvbGxlY3Rpb24ucHJvdG90eXBlLnNpbmdsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHQ7XG5cbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXN1bHQgPSBpdGVtO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBzb3J0IGEgYmFzaXMgb2Ygc3VwcGxpZWQgY29tcGFyZSBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbXBhcmVGdW5jdGlvbiBjb21wYXJlRnVuY3Rpb25cbiAqIEByZXR1cm5zIHthcnJheX0gc29ydGVkIGFycmF5LlxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgdmFyIGFyciA9IFtdO1xuXG4gICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgYXJyLnB1c2goaXRlbSk7XG4gICAgfSk7XG5cbiAgICBpZiAoaXNGdW5jKGNvbXBhcmVGdW5jdGlvbikpIHtcbiAgICAgICAgYXJyID0gYXJyLnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyO1xufTtcblxuLyoqXG4gKiBpdGVyYXRlIGVhY2ggbW9kZWwgZWxlbWVudC5cbiAqXG4gKiB3aGVuIGl0ZXJhdGVlIHJldHVybiBmYWxzZSB0aGVuIGJyZWFrIHRoZSBsb29wLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gaXRlcmF0ZWUgaXRlcmF0ZWUoaXRlbSwgaW5kZXgsIGl0ZW1zKVxuICogQHBhcmFtIHsqfSBbY29udGV4dF0gY29udGV4dFxuICovXG5Db2xsZWN0aW9uLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBmb3JFYWNoUHJvcCh0aGlzLml0ZW1zLCBpdGVyYXRlZSwgY29udGV4dCB8fCB0aGlzKTtcbn07XG5cbi8qKlxuICogcmV0dXJuIG5ldyBhcnJheSB3aXRoIGNvbGxlY3Rpb24gaXRlbXMuXG4gKiBAcmV0dXJucyB7YXJyYXl9IG5ldyBhcnJheS5cbiAqL1xuQ29sbGVjdGlvbi5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlsLm1hcCh0aGlzLml0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgVXRpbGl0eSBtb2R1bGUgZm9yIGhhbmRsaW5nIERPTSBldmVudHMuXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbCxcbiAgICBicm93c2VyID0gdXRpbC5icm93c2VyLFxuICAgIGV2ZW50S2V5ID0gJ19ldnQnLFxuICAgIERSQUcgPSB7XG4gICAgICAgIFNUQVJUOiBbJ3RvdWNoc3RhcnQnLCAnbW91c2Vkb3duJ10sXG4gICAgICAgIEVORDoge1xuICAgICAgICAgICAgbW91c2Vkb3duOiAnbW91c2V1cCcsXG4gICAgICAgICAgICB0b3VjaHN0YXJ0OiAndG91Y2hlbmQnLFxuICAgICAgICAgICAgcG9pbnRlcmRvd246ICd0b3VjaGVuZCcsXG4gICAgICAgICAgICBNU1BvaW50ZXJEb3duOiAndG91Y2hlbmQnXG4gICAgICAgIH0sXG4gICAgICAgIE1PVkU6IHtcbiAgICAgICAgICAgIG1vdXNlZG93bjogJ21vdXNlbW92ZScsXG4gICAgICAgICAgICB0b3VjaHN0YXJ0OiAndG91Y2htb3ZlJyxcbiAgICAgICAgICAgIHBvaW50ZXJkb3duOiAndG91Y2htb3ZlJyxcbiAgICAgICAgICAgIE1TUG9pbnRlckRvd246ICd0b3VjaG1vdmUnXG4gICAgICAgIH1cbiAgICB9O1xuXG52YXIgZG9tZXZlbnQgPSB7XG4gICAgLyoqXG4gICAgICogQmluZCBkb20gZXZlbnRzLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudCB0byBiaW5kIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0geyhzdHJpbmd8b2JqZWN0KX0gdHlwZXMgU3BhY2Ugc3BsaXR0ZWQgZXZlbnRzIG5hbWVzIG9yIGV2ZW50TmFtZTpoYW5kbGVyIG9iamVjdC5cbiAgICAgKiBAcGFyYW0geyp9IGZuIGhhbmRsZXIgZnVuY3Rpb24gb3IgY29udGV4dCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICogQHBhcmFtIHsqfSBbY29udGV4dF0gY29udGV4dCBvYmplY3QgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihvYmosIHR5cGVzLCBmbiwgY29udGV4dCkge1xuICAgICAgICBpZiAodXRpbC5pc1N0cmluZyh0eXBlcykpIHtcbiAgICAgICAgICAgIHV0aWwuZm9yRWFjaCh0eXBlcy5zcGxpdCgnICcpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgZG9tZXZlbnQuX29uKG9iaiwgdHlwZSwgZm4sIGNvbnRleHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHV0aWwuZm9yRWFjaE93blByb3BlcnRpZXModHlwZXMsIGZ1bmN0aW9uKGhhbmRsZXIsIHR5cGUpIHtcbiAgICAgICAgICAgIGRvbWV2ZW50Ll9vbihvYmosIHR5cGUsIGhhbmRsZXIsIGZuKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERPTSBldmVudCBiaW5kaW5nLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudCB0byBiaW5kIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUaGUgbmFtZSBvZiBldmVudHMuXG4gICAgICogQHBhcmFtIHsqfSBmbiBoYW5kbGVyIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHsqfSBbY29udGV4dF0gY29udGV4dCBvYmplY3QgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX29uOiBmdW5jdGlvbihvYmosIHR5cGUsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpZCxcbiAgICAgICAgICAgIGhhbmRsZXIsXG4gICAgICAgICAgICBvcmlnaW5IYW5kbGVyO1xuXG4gICAgICAgIGlkID0gdHlwZSArIHV0aWwuc3RhbXAoZm4pICsgKGNvbnRleHQgPyAnXycgKyB1dGlsLnN0YW1wKGNvbnRleHQpIDogJycpO1xuXG4gICAgICAgIGlmIChvYmpbZXZlbnRLZXldICYmIG9ialtldmVudEtleV1baWRdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZm4uY2FsbChjb250ZXh0IHx8IG9iaiwgZSB8fCB3aW5kb3cuZXZlbnQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIG9yaWdpbkhhbmRsZXIgPSBoYW5kbGVyO1xuXG4gICAgICAgIGlmICgnYWRkRXZlbnRMaXN0ZW5lcicgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ21vdXNlZW50ZXInIHx8IHR5cGUgPT09ICdtb3VzZWxlYXZlJykge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFkb21ldmVudC5fY2hlY2tNb3VzZShvYmosIGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luSGFuZGxlcihlKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKCh0eXBlID09PSAnbW91c2VlbnRlcicpID9cbiAgICAgICAgICAgICAgICAgICAgJ21vdXNlb3ZlcicgOiAnbW91c2VvdXQnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnbW91c2V3aGVlbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJywgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG9iai5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICgnYXR0YWNoRXZlbnQnIGluIG9iaikge1xuICAgICAgICAgICAgb2JqLmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCBoYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9ialtldmVudEtleV0gPSBvYmpbZXZlbnRLZXldIHx8IHt9O1xuICAgICAgICBvYmpbZXZlbnRLZXldW2lkXSA9IGhhbmRsZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVuYmluZCBET00gRXZlbnQgaGFuZGxlci5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnQgdG8gdW5iaW5kLlxuICAgICAqIEBwYXJhbSB7KHN0cmluZ3xvYmplY3QpfSB0eXBlcyBTcGFjZSBzcGxpdHRlZCBldmVudHMgbmFtZXMgb3IgZXZlbnROYW1lOmhhbmRsZXIgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Kn0gZm4gaGFuZGxlciBmdW5jdGlvbiBvciBjb250ZXh0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0geyp9IFtjb250ZXh0XSBjb250ZXh0IG9iamVjdCBmb3IgaGFuZGxlciBtZXRob2QuXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbihvYmosIHR5cGVzLCBmbiwgY29udGV4dCkge1xuICAgICAgICBpZiAodXRpbC5pc1N0cmluZyh0eXBlcykpIHtcbiAgICAgICAgICAgIHV0aWwuZm9yRWFjaCh0eXBlcy5zcGxpdCgnICcpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgICAgICAgICAgZG9tZXZlbnQuX29mZihvYmosIHR5cGUsIGZuLCBjb250ZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB1dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKHR5cGVzLCBmdW5jdGlvbihoYW5kbGVyLCB0eXBlKSB7XG4gICAgICAgICAgICBkb21ldmVudC5fb2ZmKG9iaiwgdHlwZSwgaGFuZGxlciwgZm4pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5iaW5kIERPTSBldmVudCBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudCB0byB1bmJpbmQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVGhlIG5hbWUgb2YgZXZlbnQgdG8gdW5iaW5kLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gZm4gRXZlbnQgaGFuZGxlciB0aGF0IHN1cHBsaWVkIHdoZW4gYmluZGluZy5cbiAgICAgKiBAcGFyYW0geyp9IGNvbnRleHQgY29udGV4dCBvYmplY3QgdGhhdCBzdXBwbGllZCB3aGVuIGJpbmRpbmcuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb2ZmOiBmdW5jdGlvbihvYmosIHR5cGUsIGZuLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpZCA9IHR5cGUgKyB1dGlsLnN0YW1wKGZuKSArIChjb250ZXh0ID8gJ18nICsgdXRpbC5zdGFtcChjb250ZXh0KSA6ICcnKSxcbiAgICAgICAgICAgIGhhbmRsZXIgPSBvYmpbZXZlbnRLZXldICYmIG9ialtldmVudEtleV1baWRdO1xuXG4gICAgICAgIGlmICghaGFuZGxlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdyZW1vdmVFdmVudExpc3RlbmVyJyBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09PSAnbW91c2VlbnRlcicgfHwgdHlwZSA9PT0gJ21vdXNlbGVhdmUnKSB7XG4gICAgICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoKHR5cGUgPT09ICdtb3VzZWVudGVyJykgP1xuICAgICAgICAgICAgICAgICAgICAnbW91c2VvdmVyJyA6ICdtb3VzZW91dCcsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdtb3VzZXdoZWVsJykge1xuICAgICAgICAgICAgICAgICAgICBvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgb2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCdkZXRhY2hFdmVudCcgaW4gb2JqKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9iai5kZXRhY2hFdmVudCgnb24nICsgdHlwZSwgaGFuZGxlcik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fSAgICAvL2VzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBvYmpbZXZlbnRLZXldW2lkXTtcblxuICAgICAgICBpZiAodXRpbC5rZXlzKG9ialtldmVudEtleV0pLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhyb3cgZXhjZXB0aW9uIHdoZW4gZGVsZXRpbmcgaG9zdCBvYmplY3QncyBwcm9wZXJ0eSBpbiBiZWxvdyBJRThcbiAgICAgICAgaWYgKHV0aWwuYnJvd3Nlci5tc2llICYmIHV0aWwuYnJvd3Nlci52ZXJzaW9uIDwgOSkge1xuICAgICAgICAgICAgb2JqW2V2ZW50S2V5XSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgb2JqW2V2ZW50S2V5XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQmluZCBET00gZXZlbnQuIHRoaXMgZXZlbnQgd2lsbCB1bmJpbmQgYWZ0ZXIgaW52b2tlcy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBvYmogSFRNTEVsZW1lbnQgdG8gYmluZCBldmVudHMuXG4gICAgICogQHBhcmFtIHsoc3RyaW5nfG9iamVjdCl9IHR5cGVzIFNwYWNlIHNwbGl0dGVkIGV2ZW50cyBuYW1lcyBvciBldmVudE5hbWU6aGFuZGxlciBvYmplY3QuXG4gICAgICogQHBhcmFtIHsqfSBmbiBoYW5kbGVyIGZ1bmN0aW9uIG9yIGNvbnRleHQgZm9yIGhhbmRsZXIgbWV0aG9kLlxuICAgICAqIEBwYXJhbSB7Kn0gW2NvbnRleHRdIGNvbnRleHQgb2JqZWN0IGZvciBoYW5kbGVyIG1ldGhvZC5cbiAgICAgKi9cbiAgICBvbmNlOiBmdW5jdGlvbihvYmosIHR5cGVzLCBmbiwgY29udGV4dCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHV0aWwuaXNPYmplY3QodHlwZXMpKSB7XG4gICAgICAgICAgICB1dGlsLmZvckVhY2hPd25Qcm9wZXJ0aWVzKHR5cGVzLCBmdW5jdGlvbihoYW5kbGVyLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgZG9tZXZlbnQub25jZShvYmosIHR5cGUsIGhhbmRsZXIsIGZuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gb25jZUhhbmRsZXIoKSB7XG4gICAgICAgICAgICBmbi5hcHBseShjb250ZXh0IHx8IG9iaiwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHRoYXQuX29mZihvYmosIHR5cGVzLCBvbmNlSGFuZGxlciwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICBkb21ldmVudC5vbihvYmosIHR5cGVzLCBvbmNlSGFuZGxlciwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbmNlbCBldmVudCBidWJibGluZy5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIEV2ZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZS5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbmNlbCBicm93c2VyIGRlZmF1bHQgYWN0aW9ucy5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIEV2ZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICBwcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN5bnRhdGljIHN1Z2FyIG9mIHN0b3BQcm9wYWdhdGlvbiBhbmQgcHJldmVudERlZmF1bHRcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIEV2ZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGRvbWV2ZW50LnByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICBkb21ldmVudC5zdG9wUHJvcGFnYXRpb24oZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3Agc2Nyb2xsIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBIVE1MIGVsZW1lbnQgdG8gcHJldmVudCBzY3JvbGwuXG4gICAgICovXG4gICAgZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBkb21ldmVudC5vbihlbCwgJ21vdXNld2hlZWwgTW96TW91c2VQaXhlbFNjcm9sbCcsIGRvbWV2ZW50LnN0b3BQcm9wYWdhdGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgYWxsIGV2ZW50cyByZWxhdGVkIHdpdGggY2xpY2suXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgSFRNTCBlbGVtZW50IHRvIHByZXZlbnQgYWxsIGV2ZW50IHJlbGF0ZWQgd2l0aCBjbGljay5cbiAgICAgKi9cbiAgICBkaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbjogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgZG9tZXZlbnQub24oZWwsIERSQUcuU1RBUlQuam9pbignICcpICsgJyBjbGljayBkYmxjbGljaycsIGRvbWV2ZW50LnN0b3BQcm9wYWdhdGlvbik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBtb3VzZSBwb3NpdGlvbiBmcm9tIG1vdXNlIGV2ZW50LlxuICAgICAqXG4gICAgICogSWYgc3VwcGxpZWQgcmVsYXR2ZUVsZW1lbnQgcGFyYW1ldGVyIHRoZW4gcmV0dXJuIHJlbGF0aXZlIHBvc2l0aW9uIGJhc2VkIG9uIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtFdmVudH0gbW91c2VFdmVudCBNb3VzZSBldmVudCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByZWxhdGl2ZUVsZW1lbnQgSFRNTCBlbGVtZW50IHRoYXQgY2FsY3VsYXRlIHJlbGF0aXZlIHBvc2l0aW9uLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gbW91c2UgcG9zaXRpb24uXG4gICAgICovXG4gICAgZ2V0TW91c2VQb3NpdGlvbjogZnVuY3Rpb24obW91c2VFdmVudCwgcmVsYXRpdmVFbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0O1xuXG4gICAgICAgIGlmICghcmVsYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gW21vdXNlRXZlbnQuY2xpZW50WCwgbW91c2VFdmVudC5jbGllbnRZXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlY3QgPSByZWxhdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuY2xpZW50WCAtIHJlY3QubGVmdCAtIHJlbGF0aXZlRWxlbWVudC5jbGllbnRMZWZ0LFxuICAgICAgICAgICAgbW91c2VFdmVudC5jbGllbnRZIC0gcmVjdC50b3AgLSByZWxhdGl2ZUVsZW1lbnQuY2xpZW50VG9wXG4gICAgICAgIF07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZSBtb3VzZSB3aGVlbCBldmVudCB0aGF0IGRpZmZlcmVudCBlYWNoIGJyb3dzZXJzLlxuICAgICAqIEBwYXJhbSB7TW91c2VFdmVudH0gZSBNb3VzZSB3aGVlbCBldmVudC5cbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSBkZWx0YVxuICAgICAqL1xuICAgIGdldFdoZWVsRGVsdGE6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcblxuICAgICAgICBpZiAoZS53aGVlbERlbHRhKSB7XG4gICAgICAgICAgICBkZWx0YSA9IGUud2hlZWxEZWx0YSAvIDEyMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlLmRldGFpbCkge1xuICAgICAgICAgICAgZGVsdGEgPSAtZS5kZXRhaWwgLyAzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlbHRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwcmV2ZW50IGZpcmluZyBtb3VzZWxlYXZlIGV2ZW50IHdoZW4gbW91c2UgZW50ZXJlZCBjaGlsZCBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBIVE1MIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge01vdXNlRXZlbnR9IGUgTW91c2UgZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gbGVhdmU/XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2hlY2tNb3VzZTogZnVuY3Rpb24oZWwsIGUpIHtcbiAgICAgICAgdmFyIHJlbGF0ZWQgPSBlLnJlbGF0ZWRUYXJnZXQ7XG5cbiAgICAgICAgaWYgKCFyZWxhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aGlsZSAocmVsYXRlZCAmJiAocmVsYXRlZCAhPT0gZWwpKSB7XG4gICAgICAgICAgICAgICAgcmVsYXRlZCA9IHJlbGF0ZWQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHJlbGF0ZWQgIT09IGVsKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVHJpZ2dlciBzcGVjaWZpYyBldmVudHMgdG8gaHRtbCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG9iaiBIVE1MRWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIEV2ZW50IHR5cGUgbmFtZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbZXZlbnREYXRhXSBFdmVudCBkYXRhXG4gICAgICovXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24ob2JqLCB0eXBlLCBldmVudERhdGEpIHtcbiAgICAgICAgdmFyIHJNb3VzZUV2ZW50ID0gLyhtb3VzZXxjbGljaykvO1xuICAgICAgICBpZiAodXRpbC5pc1VuZGVmaW5lZChldmVudERhdGEpICYmIHJNb3VzZUV2ZW50LmV4ZWModHlwZSkpIHtcbiAgICAgICAgICAgIGV2ZW50RGF0YSA9IGRvbWV2ZW50Lm1vdXNlRXZlbnQodHlwZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2JqLmRpc3BhdGNoRXZlbnQpIHtcbiAgICAgICAgICAgIG9iai5kaXNwYXRjaEV2ZW50KGV2ZW50RGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAob2JqLmZpcmVFdmVudCkge1xuICAgICAgICAgICAgb2JqLmZpcmVFdmVudCgnb24nICsgdHlwZSwgZXZlbnREYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgdmlydHVhbCBtb3VzZSBldmVudC5cbiAgICAgKlxuICAgICAqIFRlc3RlZCBhdFxuICAgICAqXG4gICAgICogLSBJRTcgfiBJRTExXG4gICAgICogLSBDaHJvbWVcbiAgICAgKiAtIEZpcmVmb3hcbiAgICAgKiAtIFNhZmFyaVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIEV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50T2JqXSBFdmVudCBkYXRhXG4gICAgICogQHJldHVybnMge01vdXNlRXZlbnR9IFZpcnR1YWwgbW91c2UgZXZlbnQuXG4gICAgICovXG4gICAgbW91c2VFdmVudDogZnVuY3Rpb24odHlwZSwgZXZlbnRPYmopIHtcbiAgICAgICAgdmFyIGV2dCxcbiAgICAgICAgICAgIGU7XG5cbiAgICAgICAgZSA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgICBjYW5jZWxhYmxlOiAodHlwZSAhPT0gJ21vdXNlbW92ZScpLFxuICAgICAgICAgICAgdmlldzogd2luZG93LFxuICAgICAgICAgICAgd2hlZWxEZWx0YTogMCxcbiAgICAgICAgICAgIGRldGFpbDogMCxcbiAgICAgICAgICAgIHNjcmVlblg6IDAsXG4gICAgICAgICAgICBzY3JlZW5ZOiAwLFxuICAgICAgICAgICAgY2xpZW50WDogMCxcbiAgICAgICAgICAgIGNsaWVudFk6IDAsXG4gICAgICAgICAgICBjdHJsS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGFsdEtleTogZmFsc2UsXG4gICAgICAgICAgICBzaGlmdEtleTogZmFsc2UsXG4gICAgICAgICAgICBtZXRhS2V5OiBmYWxzZSxcbiAgICAgICAgICAgIGJ1dHRvbjogMCxcbiAgICAgICAgICAgIHJlbGF0ZWRUYXJnZXQ6IHVuZGVmaW5lZCAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9LCBldmVudE9iaik7XG5cbiAgICAgICAgLy8gcHJldmVudCB0aHJvdyBlcnJvciB3aGVuIGluc2VydGluZyB3aGVlbERlbHRhIHByb3BlcnR5IHRvIG1vdXNlIGV2ZW50IG9uIGJlbG93IElFOFxuICAgICAgICBpZiAoYnJvd3Nlci5tc2llICYmIGJyb3dzZXIudmVyc2lvbiA8IDkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBlLndoZWVsRGVsdGE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50LmNyZWF0ZUV2ZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnTW91c2VFdmVudHMnKTtcbiAgICAgICAgICAgIGV2dC5pbml0TW91c2VFdmVudCh0eXBlLFxuICAgICAgICAgICAgICAgIGUuYnViYmxlcywgZS5jYW5jZWxhYmxlLCBlLnZpZXcsIGUuZGV0YWlsLFxuICAgICAgICAgICAgICAgIGUuc2NyZWVuWCwgZS5zY3JlZW5ZLCBlLmNsaWVudFgsIGUuY2xpZW50WSxcbiAgICAgICAgICAgICAgICBlLmN0cmxLZXksIGUuYWx0S2V5LCBlLnNoaWZ0S2V5LCBlLm1ldGFLZXksXG4gICAgICAgICAgICAgICAgZS5idXR0b24sIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCkge1xuICAgICAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcblxuICAgICAgICAgICAgdXRpbC5mb3JFYWNoKGUsIGZ1bmN0aW9uKHZhbHVlLCBwcm9wTmFtZSkge1xuICAgICAgICAgICAgICAgIGV2dFtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgZXZ0LmJ1dHRvbiA9IHswOiAxLCAxOiA0LCAyOiAyfVtldnQuYnV0dG9uXSB8fCBldnQuYnV0dG9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBldnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE5vcm1hbGl6ZSBtb3VzZSBldmVudCdzIGJ1dHRvbiBhdHRyaWJ1dGVzLlxuICAgICAqXG4gICAgICogQ2FuIGRldGVjdCB3aGljaCBidXR0b24gaXMgY2xpY2tlZCBieSB0aGlzIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIE1lYW5pbmcgb2YgcmV0dXJuIG51bWJlcnNcbiAgICAgKlxuICAgICAqIC0gMDogcHJpbWFyeSBtb3VzZSBidXR0b25cbiAgICAgKiAtIDE6IHdoZWVsIGJ1dHRvbiBvciBjZW50ZXIgYnV0dG9uXG4gICAgICogLSAyOiBzZWNvbmRhcnkgbW91c2UgYnV0dG9uXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBtb3VzZUV2ZW50IC0gVGhlIG1vdXNlIGV2ZW50IG9iamVjdCB3YW50IHRvIGtub3cuXG4gICAgICogQHJldHVybnMge251bWJlcn0gLSBUaGUgdmFsdWUgb2YgbWVhbmluZyB3aGljaCBidXR0b24gaXMgY2xpY2tlZD9cbiAgICAgKi9cbiAgICBnZXRNb3VzZUJ1dHRvbjogZnVuY3Rpb24obW91c2VFdmVudCkge1xuICAgICAgICB2YXIgYnV0dG9uLFxuICAgICAgICAgICAgcHJpbWFyeSA9ICcwLDEsMyw1LDcnLFxuICAgICAgICAgICAgc2Vjb25kYXJ5ID0gJzIsNicsXG4gICAgICAgICAgICB3aGVlbCA9ICc0JztcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAoZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uaGFzRmVhdHVyZSgnTW91c2VFdmVudHMnLCAnMi4wJykpIHtcbiAgICAgICAgICAgIHJldHVybiBtb3VzZUV2ZW50LmJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1dHRvbiA9IG1vdXNlRXZlbnQuYnV0dG9uICsgJyc7XG4gICAgICAgIGlmICh+cHJpbWFyeS5pbmRleE9mKGJ1dHRvbikpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2UgaWYgKH5zZWNvbmRhcnkuaW5kZXhPZihidXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfSBlbHNlIGlmICh+d2hlZWwuaW5kZXhPZihidXR0b24pKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tZXZlbnQ7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBVdGlsaXR5IG1vZHVsZXMgZm9yIG1hbmlwdWxhdGUgRE9NIGVsZW1lbnRzLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGRvbWV2ZW50ID0gcmVxdWlyZSgnLi9kb21ldmVudCcpO1xudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb24nKTtcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWwsXG4gICAgcG9zS2V5ID0gJ19wb3MnLFxuICAgIGRvbXV0aWw7XG5cbnZhciBDU1NfQVVUT19SRUdFWCA9IC9eYXV0byR8XiR8JS87XG5cbmZ1bmN0aW9uIHRyaW0oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzXFxzKi8sICcnKS5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcbn1cblxuZG9tdXRpbCA9IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGUgRE9NIGVsZW1lbnQgYW5kIHJldHVybiBpdC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGFnTmFtZSBUYWcgbmFtZSB0byBhcHBlbmQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW2NvbnRhaW5lcl0gSFRNTCBlbGVtZW50IHdpbGwgYmUgcGFyZW50IHRvIGNyZWF0ZWQgZWxlbWVudC5cbiAgICAgKiBpZiBub3Qgc3VwcGxpZWQsIHdpbGwgdXNlICoqZG9jdW1lbnQuYm9keSoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtjbGFzc05hbWVdIERlc2lnbiBjbGFzcyBuYW1lcyB0byBhcHBsaW5nIGNyZWF0ZWQgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9IEhUTUwgZWxlbWVudCBjcmVhdGVkLlxuICAgICAqL1xuICAgIGFwcGVuZEhUTUxFbGVtZW50OiBmdW5jdGlvbih0YWdOYW1lLCBjb250YWluZXIsIGNsYXNzTmFtZSkge1xuICAgICAgICB2YXIgZWw7XG5cbiAgICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lIHx8ICcnO1xuXG4gICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXG4gICAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGVsZW1lbnQgZnJvbSBwYXJlbnQgbm9kZS5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIGVsZW1lbnQgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsICYmIGVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBlbGVtZW50IGJ5IGlkXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIGVsZW1lbnQgaWQgYXR0cmlidXRlXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBzdXBwbGllZCBlbGVtZW50IGlzIG1hdGNoZWQgc2VsZWN0b3IuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBlbGVtZW50IHRvIGNoZWNrXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gc2VsZWN0b3Igc3RyaW5nIHRvIGNoZWNrXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gbWF0Y2g/XG4gICAgICovXG4gICAgX21hdGNoZXI6IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgY3NzQ2xhc3NTZWxlY3RvciA9IC9eXFwuLyxcbiAgICAgICAgICAgIGlkU2VsZWN0b3IgPSAvXiMvO1xuXG4gICAgICAgIGlmIChjc3NDbGFzc1NlbGVjdG9yLnRlc3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9tdXRpbC5oYXNDbGFzcyhlbCwgc2VsZWN0b3IucmVwbGFjZSgnLicsICcnKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaWRTZWxlY3Rvci50ZXN0KHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmlkID09PSBzZWxlY3Rvci5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IHNlbGVjdG9yLnRvTG93ZXJDYXNlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgRE9NIGVsZW1lbnQgYnkgc3BlY2lmaWMgc2VsZWN0b3JzLlxuICAgICAqIGJlbG93IHRocmVlIHNlbGVjdG9yIG9ubHkgc3VwcG9ydGVkLlxuICAgICAqXG4gICAgICogMS4gY3NzIHNlbGVjdG9yXG4gICAgICogMi4gaWQgc2VsZWN0b3JcbiAgICAgKiAzLiBub2RlTmFtZSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7KEhUTUxFbGVtZW50fHN0cmluZyl9IFtyb290XSBZb3UgY2FuIGFzc2lnbiByb290IGVsZW1lbnQgdG8gZmluZC4gaWYgbm90IHN1cHBsaWVkLCBkb2N1bWVudC5ib2R5IHdpbGwgdXNlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxmdW5jdGlvbn0gW211bHRpcGxlPWZhbHNlXSAtIHNldCB0cnVlIHRoZW4gcmV0dXJuIGFsbCBlbGVtZW50cyB0aGF0IG1lZXQgY29uZGl0aW9uLCBpZiBzZXQgZnVuY3Rpb24gdGhlbiB1c2UgaXQgZmlsdGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH0gSFRNTCBlbGVtZW50IGZpbmRlZC5cbiAgICAgKi9cbiAgICBmaW5kOiBmdW5jdGlvbihzZWxlY3Rvciwgcm9vdCwgbXVsdGlwbGUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgICAgZm91bmQgPSBmYWxzZSxcbiAgICAgICAgICAgIGlzRmlyc3QgPSB1dGlsLmlzVW5kZWZpbmVkKG11bHRpcGxlKSB8fCBtdWx0aXBsZSA9PT0gZmFsc2UsXG4gICAgICAgICAgICBpc0ZpbHRlciA9IHV0aWwuaXNGdW5jdGlvbihtdWx0aXBsZSk7XG5cbiAgICAgICAgaWYgKHV0aWwuaXNTdHJpbmcocm9vdCkpIHtcbiAgICAgICAgICAgIHJvb3QgPSBkb211dGlsLmdldChyb290KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgd2luZG93LmRvY3VtZW50LmJvZHk7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzZShlbCwgc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGVzID0gZWwuY2hpbGROb2RlcyxcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBsZW4gPSBjaGlsZE5vZGVzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBjdXJzb3I7XG5cbiAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBjdXJzb3IgPSBjaGlsZE5vZGVzW2ldO1xuXG4gICAgICAgICAgICAgICAgaWYgKGN1cnNvci5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZG9tdXRpbC5fbWF0Y2hlcihjdXJzb3IsIHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGlzRmlsdGVyICYmIG11bHRpcGxlKGN1cnNvcikpIHx8ICFpc0ZpbHRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY3Vyc29yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3Vyc29yLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNlKGN1cnNvciwgc2VsZWN0b3IpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVjdXJzZShyb290LCBzZWxlY3Rvcik7XG5cbiAgICAgICAgcmV0dXJuIGlzRmlyc3QgPyAocmVzdWx0WzBdIHx8IG51bGwpIDogcmVzdWx0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHBhcmVudCBlbGVtZW50IHJlY3Vyc2l2ZWx5LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gYmFzZSBlbGVtZW50IHRvIHN0YXJ0IGZpbmQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gc2VsZWN0b3Igc3RyaW5nIGZvciBmaW5kXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fSAtIGVsZW1lbnQgZmluZGVkIG9yIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBjbG9zZXN0OiBmdW5jdGlvbihlbCwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IGVsLnBhcmVudE5vZGU7XG5cbiAgICAgICAgaWYgKGRvbXV0aWwuX21hdGNoZXIoZWwsIHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKHBhcmVudCAmJiBwYXJlbnQgIT09IHdpbmRvdy5kb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICBpZiAoZG9tdXRpbC5fbWF0Y2hlcihwYXJlbnQsIHNlbGVjdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0ZXh0cyBpbnNpZGUgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gdGV4dCBpbnNpZGUgbm9kZVxuICAgICAqL1xuICAgIHRleHQ6IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciByZXQgPSAnJyxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgbm9kZVR5cGUgPSBlbC5ub2RlVHlwZTtcblxuICAgICAgICBpZiAobm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEpIHtcbiAgICAgICAgICAgICAgICAvLyBub2RlcyB0aGF0IGF2YWlsYWJsZSBjb250YWluIG90aGVyIG5vZGVzXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbC50ZXh0Q29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoZWwgPSBlbC5maXJzdENoaWxkOyBlbDsgZWwgPSBlbC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgICAgICAgICByZXQgKz0gZG9tdXRpbC50ZXh0KGVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVUeXBlID09PSAzIHx8IG5vZGVUeXBlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgLy8gVEVYVCwgQ0RBVEEgU0VDVElPTlxuICAgICAgICAgICAgICAgIHJldHVybiBlbC5ub2RlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKDsgZWxbaV07IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHJldCArPSBkb211dGlsLnRleHQoZWxbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkYXRhIGF0dHJpYnV0ZSB0byB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gZWxlbWVudCB0byBzZXQgZGF0YSBhdHRyaWJ1dGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0ga2V5XG4gICAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBkYXRhIC0gZGF0YSB2YWx1ZVxuICAgICAqL1xuICAgIHNldERhdGE6IGZ1bmN0aW9uKGVsLCBrZXksIGRhdGEpIHtcbiAgICAgICAgaWYgKCdkYXRhc2V0JyBpbiBlbCkge1xuICAgICAgICAgICAgZWwuZGF0YXNldFtrZXldID0gZGF0YTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGF0YS0nICsga2V5LCBkYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGRhdGEgdmFsdWUgZnJvbSBkYXRhLWF0dHJpYnV0ZVxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0ga2V5XG4gICAgICogQHJldHVybnMge3N0cmluZ30gdmFsdWVcbiAgICAgKi9cbiAgICBnZXREYXRhOiBmdW5jdGlvbihlbCwga2V5KSB7XG4gICAgICAgIGlmICgnZGF0YXNldCcgaW4gZWwpIHtcbiAgICAgICAgICAgIHJldHVybiBlbC5kYXRhc2V0W2tleV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLScgKyBrZXkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBlbGVtZW50IGhhcyBzcGVjaWZpYyBkZXNpZ24gY2xhc3MgbmFtZS5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIGNzcyBjbGFzc1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSByZXR1cm4gdHJ1ZSB3aGVuIGVsZW1lbnQgaGFzIHRoYXQgY3NzIGNsYXNzIG5hbWVcbiAgICAgKi9cbiAgICBoYXNDbGFzczogZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZTtcblxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQoZWwuY2xhc3NMaXN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsYXNzTmFtZSA9IGRvbXV0aWwuZ2V0Q2xhc3MoZWwpO1xuXG4gICAgICAgIHJldHVybiBjbGFzc05hbWUubGVuZ3RoID4gMCAmJiBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgbmFtZSArICcoXFxcXHN8JCknKS50ZXN0KGNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFkZCBkZXNpZ24gY2xhc3MgdG8gSFRNTCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgY3NzIGNsYXNzIG5hbWVcbiAgICAgKi9cbiAgICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICAgICAgdmFyIGNsYXNzTmFtZTtcblxuICAgICAgICBpZiAoIXV0aWwuaXNVbmRlZmluZWQoZWwuY2xhc3NMaXN0KSkge1xuICAgICAgICAgICAgdXRpbC5mb3JFYWNoQXJyYXkobmFtZS5zcGxpdCgnICcpLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQodmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRvbXV0aWwuaGFzQ2xhc3MoZWwsIG5hbWUpKSB7XG4gICAgICAgICAgICBjbGFzc05hbWUgPSBkb211dGlsLmdldENsYXNzKGVsKTtcbiAgICAgICAgICAgIGRvbXV0aWwuc2V0Q2xhc3MoZWwsIChjbGFzc05hbWUgPyBjbGFzc05hbWUgKyAnICcgOiAnJykgKyBuYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIE92ZXJ3cml0ZSBkZXNpZ24gY2xhc3MgdG8gSFRNTCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgY3NzIGNsYXNzIG5hbWVcbiAgICAgKi9cbiAgICBzZXRDbGFzczogZnVuY3Rpb24oZWwsIG5hbWUpIHtcbiAgICAgICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoZWwuY2xhc3NOYW1lLmJhc2VWYWwpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBuYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuY2xhc3NOYW1lLmJhc2VWYWwgPSBuYW1lO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEVsZW1lbnTsl5AgY3NzQ2xhc3Psho3shLHsnYQg7KCc6rGw7ZWY64qUIOuplOyEnOuTnFxuICAgICAqIFJlbW92ZSBzcGVjaWZpYyBkZXNpZ24gY2xhc3MgZnJvbSBIVE1MIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBjbGFzcyBuYW1lIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbCwgbmFtZSkge1xuICAgICAgICB2YXIgcmVtb3ZlZCA9ICcnO1xuXG4gICAgICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZChlbC5jbGFzc0xpc3QpKSB7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKG5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVtb3ZlZCA9ICgnICcgKyBkb211dGlsLmdldENsYXNzKGVsKSArICcgJykucmVwbGFjZSgnICcgKyBuYW1lICsgJyAnLCAnICcpO1xuICAgICAgICAgICAgZG9tdXRpbC5zZXRDbGFzcyhlbCwgdHJpbShyZW1vdmVkKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IEhUTUwgZWxlbWVudCdzIGRlc2lnbiBjbGFzc2VzLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHJldHVybnMge3N0cmluZ30gZWxlbWVudCBjc3MgY2xhc3MgbmFtZVxuICAgICAqL1xuICAgIGdldENsYXNzOiBmdW5jdGlvbihlbCkge1xuICAgICAgICBpZiAoIWVsIHx8ICFlbC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1dGlsLmlzVW5kZWZpbmVkKGVsLmNsYXNzTmFtZS5iYXNlVmFsKSA/IGVsLmNsYXNzTmFtZSA6IGVsLmNsYXNzTmFtZS5iYXNlVmFsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3BlY2lmaWMgQ1NTIHN0eWxlIHZhbHVlIGZyb20gSFRNTCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0eWxlIGNzcyBhdHRyaWJ1dGUgbmFtZVxuICAgICAqIEByZXR1cm5zIHsoc3RyaW5nfG51bGwpfSBjc3Mgc3R5bGUgdmFsdWVcbiAgICAgKi9cbiAgICBnZXRTdHlsZTogZnVuY3Rpb24oZWwsIHN0eWxlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGVsLnN0eWxlW3N0eWxlXSB8fCAoZWwuY3VycmVudFN0eWxlICYmIGVsLmN1cnJlbnRTdHlsZVtzdHlsZV0pLFxuICAgICAgICAgICAgY3NzO1xuXG4gICAgICAgIGlmICgoIXZhbHVlIHx8IHZhbHVlID09PSAnYXV0bycpICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3KSB7XG4gICAgICAgICAgICBjc3MgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKTtcbiAgICAgICAgICAgIHZhbHVlID0gY3NzID8gY3NzW3N0eWxlXSA6IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsdWUgPT09ICdhdXRvJyA/IG51bGwgOiB2YWx1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IGVsZW1lbnQncyBjb21wdXRlZCBzdHlsZSB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBpbiBsb3dlciBJRTguIHVzZSBwb2x5ZmlsbCBmdW5jdGlvbiB0aGF0IHJldHVybiBvYmplY3QuIGl0IGhhcyBvbmx5IG9uZSBmdW5jdGlvbiAnZ2V0UHJvcGVydHlWYWx1ZSdcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCAtIGVsZW1lbnQgd2FudCB0byBnZXQgc3R5bGUuXG4gICAgICogQHJldHVybnMge29iamVjdH0gdmlydHVhbCBDU1NTdHlsZURlY2xhcmF0aW9uIG9iamVjdC5cbiAgICAgKi9cbiAgICBnZXRDb21wdXRlZFN0eWxlOiBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgZGVmYXVsdFZpZXcgPSBkb2N1bWVudC5kZWZhdWx0VmlldztcblxuICAgICAgICBpZiAoIWRlZmF1bHRWaWV3IHx8ICFkZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldFByb3BlcnR5VmFsdWU6IGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlID0gLyhcXC0oW2Etel0pezF9KS9nO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2Zsb2F0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcCA9ICdzdHlsZUZsb2F0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZS50ZXN0KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gcHJvcC5yZXBsYWNlKHJlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1syXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwuY3VycmVudFN0eWxlW3Byb3BdID8gZWwuY3VycmVudFN0eWxlW3Byb3BdIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zaXRpb24gQ1NTIHN0eWxlLlxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdIGxlZnQgcGl4ZWwgdmFsdWUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt5PTBdIHRvcCBwaXhlbCB2YWx1ZS5cbiAgICAgKi9cbiAgICBzZXRQb3NpdGlvbjogZnVuY3Rpb24oZWwsIHgsIHkpIHtcbiAgICAgICAgeCA9IHV0aWwuaXNVbmRlZmluZWQoeCkgPyAwIDogeDtcbiAgICAgICAgeSA9IHV0aWwuaXNVbmRlZmluZWQoeSkgPyAwIDogeTtcblxuICAgICAgICBlbFtwb3NLZXldID0gW3gsIHldO1xuXG4gICAgICAgIGVsLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcbiAgICAgICAgZWwuc3R5bGUudG9wID0geSArICdweCc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBwb3NpdGlvbiBmcm9tIEhUTUwgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NsZWFyPWZhbHNlXSBjbGVhciBjYWNoZSBiZWZvcmUgY2FsY3VsYXRpbmcgcG9zaXRpb24uXG4gICAgICogQHJldHVybnMge251bWJlcltdfSBwb2ludFxuICAgICAqL1xuICAgIGdldFBvc2l0aW9uOiBmdW5jdGlvbihlbCwgY2xlYXIpIHtcbiAgICAgICAgdmFyIGxlZnQsXG4gICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICBib3VuZDtcblxuICAgICAgICBpZiAoY2xlYXIpIHtcbiAgICAgICAgICAgIGVsW3Bvc0tleV0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsW3Bvc0tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBlbFtwb3NLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgbGVmdCA9IDA7XG4gICAgICAgIHRvcCA9IDA7XG5cbiAgICAgICAgaWYgKChDU1NfQVVUT19SRUdFWC50ZXN0KGVsLnN0eWxlLmxlZnQpIHx8IENTU19BVVRPX1JFR0VYLnRlc3QoZWwuc3R5bGUudG9wKSkgJiZcbiAgICAgICAgICAgICdnZXRCb3VuZGluZ0NsaWVudFJlY3QnIGluIGVsKSB7XG4gICAgICAgICAgICAvLyDsl5jrpqzrqLztirjsnZggbGVmdOuYkOuKlCB0b3DsnbQgJ2F1dG8n7J28IOuVjCDsiJjri6hcbiAgICAgICAgICAgIGJvdW5kID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgICAgIGxlZnQgPSBib3VuZC5sZWZ0O1xuICAgICAgICAgICAgdG9wID0gYm91bmQudG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVmdCA9IHBhcnNlRmxvYXQoZWwuc3R5bGUubGVmdCB8fCAwKTtcbiAgICAgICAgICAgIHRvcCA9IHBhcnNlRmxvYXQoZWwuc3R5bGUudG9wIHx8IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtsZWZ0LCB0b3BdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gZWxlbWVudCdzIHNpemVcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCB0YXJnZXQgZWxlbWVudFxuICAgICAqIEByZXR1cm4ge251bWJlcltdfSB3aWR0aCwgaGVpZ2h0XG4gICAgICovXG4gICAgZ2V0U2l6ZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyIGJvdW5kLFxuICAgICAgICAgICAgd2lkdGggPSBkb211dGlsLmdldFN0eWxlKGVsLCAnd2lkdGgnKSxcbiAgICAgICAgICAgIGhlaWdodCA9IGRvbXV0aWwuZ2V0U3R5bGUoZWwsICdoZWlnaHQnKTtcblxuICAgICAgICBpZiAoKENTU19BVVRPX1JFR0VYLnRlc3Qod2lkdGgpIHx8IENTU19BVVRPX1JFR0VYLnRlc3QoaGVpZ2h0KSkgJiZcbiAgICAgICAgICAgICdnZXRCb3VuZGluZ0NsaWVudFJlY3QnIGluIGVsKSB7XG4gICAgICAgICAgICBib3VuZCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgd2lkdGggPSBib3VuZC53aWR0aDtcbiAgICAgICAgICAgIGhlaWdodCA9IGJvdW5kLmhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpZHRoID0gcGFyc2VGbG9hdCh3aWR0aCB8fCAwKTtcbiAgICAgICAgICAgIGhlaWdodCA9IHBhcnNlRmxvYXQoaGVpZ2h0IHx8IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgc3BlY2lmaWMgQ1NTIHN0eWxlIGlzIGF2YWlsYWJsZS5cbiAgICAgKiBAcGFyYW0ge2FycmF5fSBwcm9wcyBwcm9wZXJ0eSBuYW1lIHRvIHRlc3RpbmdcbiAgICAgKiBAcmV0dXJuIHsoc3RyaW5nfGJvb2xlYW4pfSByZXR1cm4gdHJ1ZSB3aGVuIHByb3BlcnR5IGlzIGF2YWlsYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHByb3BzID0gWyd0cmFuc2Zvcm0nLCAnLXdlYmtpdC10cmFuc2Zvcm0nXTtcbiAgICAgKiBkb211dGlsLnRlc3RQcm9wKHByb3BzKTsgICAgLy8gJ3RyYW5zZm9ybSdcbiAgICAgKi9cbiAgICB0ZXN0UHJvcDogZnVuY3Rpb24ocHJvcHMpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW4gPSBwcm9wcy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKHByb3BzW2ldIGluIHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGZvcm0gZGF0YVxuICAgICAqIEBwYXJhbSB7SFRNTEZvcm1FbGVtZW50fSBmb3JtRWxlbWVudCAtIGZvcm0gZWxlbWVudCB0byBleHRyYWN0IGRhdGFcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBmb3JtIGRhdGFcbiAgICAgKi9cbiAgICBnZXRGb3JtRGF0YTogZnVuY3Rpb24oZm9ybUVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGdyb3VwZWRCeU5hbWUgPSBuZXcgQ29sbGVjdGlvbihmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMubGVuZ3RoOyB9KSxcbiAgICAgICAgICAgIG5vRGlzYWJsZWRGaWx0ZXIgPSBmdW5jdGlvbihlbCkgeyByZXR1cm4gIWVsLmRpc2FibGVkOyB9LFxuICAgICAgICAgICAgb3V0cHV0ID0ge307XG4gICAgICAgICAgICBcbiAgICAgICAgZ3JvdXBlZEJ5TmFtZS5hZGQuYXBwbHkoXG4gICAgICAgICAgICBncm91cGVkQnlOYW1lLCBcbiAgICAgICAgICAgIGRvbXV0aWwuZmluZCgnaW5wdXQnLCBmb3JtRWxlbWVudCwgbm9EaXNhYmxlZEZpbHRlcilcbiAgICAgICAgICAgICAgICAuY29uY2F0KGRvbXV0aWwuZmluZCgnc2VsZWN0JywgZm9ybUVsZW1lbnQsIG5vRGlzYWJsZWRGaWx0ZXIpKVxuICAgICAgICAgICAgICAgIC5jb25jYXQoZG9tdXRpbC5maW5kKCd0ZXh0YXJlYScsIGZvcm1FbGVtZW50LCBub0Rpc2FibGVkRmlsdGVyKSlcbiAgICAgICAgKTtcblxuICAgICAgICBncm91cGVkQnlOYW1lID0gZ3JvdXBlZEJ5TmFtZS5ncm91cEJ5KGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICByZXR1cm4gZWwgJiYgZWwuZ2V0QXR0cmlidXRlKCduYW1lJykgfHwgJ19vdGhlcic7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHV0aWwuZm9yRWFjaChncm91cGVkQnlOYW1lLCBmdW5jdGlvbihlbGVtZW50cywgbmFtZSkge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdfb3RoZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVOYW1lID0gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA9IGVsLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gW2VsZW1lbnRzLmZpbmQoZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLmNoZWNrZWQ7IH0pLnRvQXJyYXkoKS5wb3AoKV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnY2hlY2tib3gnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGVsZW1lbnRzLmZpbmQoZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLmNoZWNrZWQ7IH0pLnRvQXJyYXkoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVOYW1lID09PSAnc2VsZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50cy5maW5kKGZ1bmN0aW9uKGVsKSB7IHJldHVybiAhIWVsLmNoaWxkTm9kZXMubGVuZ3RoOyB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KGRvbXV0aWwuZmluZCgnb3B0aW9uJywgZWwsIGZ1bmN0aW9uKG9wdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0LnNlbGVjdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGVsZW1lbnRzLmZpbmQoZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLnZhbHVlICE9PSAnJzsgfSkudG9BcnJheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHV0aWwubWFwKHJlc3VsdCwgZnVuY3Rpb24oZWwpIHsgcmV0dXJuIGVsLnZhbHVlOyB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAnJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0WzBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG91dHB1dFtuYW1lXSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH1cbn07XG5cbi8qZXNsaW50LWRpc2FibGUqL1xudmFyIHVzZXJTZWxlY3RQcm9wZXJ0eSA9IGRvbXV0aWwudGVzdFByb3AoW1xuICAgICd1c2VyU2VsZWN0JywgXG4gICAgJ1dlYmtpdFVzZXJTZWxlY3QnLCBcbiAgICAnT1VzZXJTZWxlY3QnLCBcbiAgICAnTW96VXNlclNlbGVjdCcsIFxuICAgICdtc1VzZXJTZWxlY3QnXG5dKTtcbnZhciBzdXBwb3J0U2VsZWN0U3RhcnQgPSAnb25zZWxlY3RzdGFydCcgaW4gZG9jdW1lbnQ7XG52YXIgcHJldlNlbGVjdFN0eWxlID0gJyc7XG4vKmVzbGludC1lbmFibGUqL1xuXG4vKipcbiAqIERpc2FibGUgYnJvd3NlcidzIHRleHQgc2VsZWN0aW9uIGJlaGF2aW9ycy5cbiAqIEBtZXRob2RcbiAqL1xuZG9tdXRpbC5kaXNhYmxlVGV4dFNlbGVjdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgICBpZiAoc3VwcG9ydFNlbGVjdFN0YXJ0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGRvbWV2ZW50Lm9uKHdpbmRvdywgJ3NlbGVjdHN0YXJ0JywgZG9tZXZlbnQucHJldmVudERlZmF1bHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlO1xuICAgICAgICBwcmV2U2VsZWN0U3R5bGUgPSBzdHlsZVt1c2VyU2VsZWN0UHJvcGVydHldO1xuICAgICAgICBzdHlsZVt1c2VyU2VsZWN0UHJvcGVydHldID0gJ25vbmUnO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqIEVuYWJsZSBicm93c2VyJ3MgdGV4dCBzZWxlY3Rpb24gYmVoYXZpb3JzLlxuICogQG1ldGhvZFxuICovXG5kb211dGlsLmVuYWJsZVRleHRTZWxlY3Rpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN1cHBvcnRTZWxlY3RTdGFydCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkb21ldmVudC5vZmYod2luZG93LCAnc2VsZWN0c3RhcnQnLCBkb21ldmVudC5wcmV2ZW50RGVmYXVsdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGVbdXNlclNlbGVjdFByb3BlcnR5XSA9IHByZXZTZWxlY3RTdHlsZTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiBEaXNhYmxlIGJyb3dzZXIncyBpbWFnZSBkcmFnIGJlaGF2aW9ycy5cbiAqL1xuZG9tdXRpbC5kaXNhYmxlSW1hZ2VEcmFnID0gZnVuY3Rpb24oKSB7XG4gICAgZG9tZXZlbnQub24od2luZG93LCAnZHJhZ3N0YXJ0JywgZG9tZXZlbnQucHJldmVudERlZmF1bHQpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgYnJvd3NlcidzIGltYWdlIGRyYWcgYmVoYXZpb3JzLlxuICovXG5kb211dGlsLmVuYWJsZUltYWdlRHJhZyA9IGZ1bmN0aW9uKCkge1xuICAgIGRvbWV2ZW50Lm9mZih3aW5kb3csICdkcmFnc3RhcnQnLCBkb21ldmVudC5wcmV2ZW50RGVmYXVsdCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbXV0aWw7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBHZW5lcmFsIGRyYWcgaGFuZGxlclxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgZG9tdXRpbCA9IHJlcXVpcmUoJy4vZG9tdXRpbCcpO1xudmFyIGRvbWV2ZW50ID0gcmVxdWlyZSgnLi9kb21ldmVudCcpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIEN1c3RvbUV2ZW50c1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBkcmFnIGhhbmRsZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5kaXN0YW5jZT0xMF0gLSBkaXN0YW5jZSBpbiBwaXhlbHMgYWZ0ZXIgbW91c2UgbXVzdCBtb3ZlIGJlZm9yZSBkcmFnZ2luZyBzaG91bGQgc3RhcnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciAtIGNvbnRhaW5lciBlbGVtZW50IHRvIGJpbmQgZHJhZyBldmVudHNcbiAqL1xuZnVuY3Rpb24gRHJhZyhvcHRpb25zLCBjb250YWluZXIpIHtcbiAgICBkb21ldmVudC5vbihjb250YWluZXIsICdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93biwgdGhpcyk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB1dGlsLmV4dGVuZCh7XG4gICAgICAgIGRpc3RhbmNlOiAxMFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5faXNNb3ZlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogZHJhZ2dpbmcgZGlzdGFuY2UgaW4gcGl4ZWwgYmV0d2VlbiBtb3VzZWRvd24gYW5kIGZpcmluZyBkcmFnU3RhcnQgZXZlbnRzXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9kaXN0YW5jZSA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9kcmFnU3RhcnRGaXJlZCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLl9kcmFnU3RhcnRFdmVudERhdGEgPSBudWxsO1xufVxuXG4vKipcbiAqIERlc3Ryb3kgbWV0aG9kLlxuICovXG5EcmFnLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgZG9tZXZlbnQub2ZmKHRoaXMuY29udGFpbmVyLCAnbW91c2Vkb3duJywgdGhpcy5fb25Nb3VzZURvd24sIHRoaXMpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5jb250YWluZXIgPSB0aGlzLl9pc01vdmVkID0gdGhpcy5fZGlzdGFuY2UgPVxuICAgICAgICB0aGlzLl9kcmFnU3RhcnRGaXJlZCA9IHRoaXMuX2RyYWdTdGFydEV2ZW50RGF0YSA9IG51bGw7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSBldmVudHMgZm9yIG1vdXNlIGRyYWdnaW5nLlxuICogQHBhcmFtIHtib29sZWFufSB0b0JpbmQgLSBiaW5kIGV2ZW50cyByZWxhdGVkIHdpdGggZHJhZ2dpbmcgd2hlbiBzdXBwbGllZCBcInRydWVcIlxuICovXG5EcmFnLnByb3RvdHlwZS5fdG9nZ2xlRHJhZ0V2ZW50ID0gZnVuY3Rpb24odG9CaW5kKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICBkb21NZXRob2QsXG4gICAgICAgIG1ldGhvZDtcblxuICAgIGlmICh0b0JpbmQpIHtcbiAgICAgICAgZG9tTWV0aG9kID0gJ29uJztcbiAgICAgICAgbWV0aG9kID0gJ2Rpc2FibGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbU1ldGhvZCA9ICdvZmYnO1xuICAgICAgICBtZXRob2QgPSAnZW5hYmxlJztcbiAgICB9XG5cbiAgICBkb211dGlsW21ldGhvZCArICdUZXh0U2VsZWN0aW9uJ10oY29udGFpbmVyKTtcbiAgICBkb211dGlsW21ldGhvZCArICdJbWFnZURyYWcnXShjb250YWluZXIpO1xuICAgIGRvbWV2ZW50W2RvbU1ldGhvZF0oZ2xvYmFsLmRvY3VtZW50LCB7XG4gICAgICAgIG1vdXNlbW92ZTogdGhpcy5fb25Nb3VzZU1vdmUsXG4gICAgICAgIG1vdXNldXA6IHRoaXMuX29uTW91c2VVcFxuICAgIH0sIHRoaXMpO1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgbW91c2UgZXZlbnQgb2JqZWN0LlxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBtb3VzZUV2ZW50IC0gbW91c2UgZXZlbnQgb2JqZWN0LlxuICogQHJldHVybnMge29iamVjdH0gbm9ybWFsaXplZCBtb3VzZSBldmVudCBkYXRhLlxuICovXG5EcmFnLnByb3RvdHlwZS5fZ2V0RXZlbnREYXRhID0gZnVuY3Rpb24obW91c2VFdmVudCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRhcmdldDogbW91c2VFdmVudC50YXJnZXQgfHwgbW91c2VFdmVudC5zcmNFbGVtZW50LFxuICAgICAgICBvcmlnaW5FdmVudDogbW91c2VFdmVudFxuICAgIH07XG59O1xuXG4vKipcbiAqIE1vdXNlRG93biBET00gZXZlbnQgaGFuZGxlci5cbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gbW91c2VEb3duRXZlbnQgTW91c2VEb3duIGV2ZW50IG9iamVjdC5cbiAqL1xuRHJhZy5wcm90b3R5cGUuX29uTW91c2VEb3duID0gZnVuY3Rpb24obW91c2VEb3duRXZlbnQpIHtcbiAgICAvLyBvbmx5IHByaW1hcnkgYnV0dG9uIGNhbiBzdGFydCBkcmFnLlxuICAgIGlmIChkb21ldmVudC5nZXRNb3VzZUJ1dHRvbihtb3VzZURvd25FdmVudCkgIT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2Rpc3RhbmNlID0gMDtcbiAgICB0aGlzLl9kcmFnU3RhcnRGaXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX2RyYWdTdGFydEV2ZW50RGF0YSA9IHRoaXMuX2dldEV2ZW50RGF0YShtb3VzZURvd25FdmVudCk7XG5cbiAgICB0aGlzLl90b2dnbGVEcmFnRXZlbnQodHJ1ZSk7XG59O1xuXG4vKipcbiAqIE1vdXNlTW92ZSBET00gZXZlbnQgaGFuZGxlci5cbiAqIEBlbWl0cyBEcmFnI2RyYWdcbiAqIEBlbWl0cyBEcmFnI2RyYWdTdGFydFxuICogQHBhcmFtIHtNb3VzZUV2ZW50fSBtb3VzZU1vdmVFdmVudCBNb3VzZU1vdmUgZXZlbnQgb2JqZWN0LlxuICovXG5EcmFnLnByb3RvdHlwZS5fb25Nb3VzZU1vdmUgPSBmdW5jdGlvbihtb3VzZU1vdmVFdmVudCkge1xuICAgIHZhciBkaXN0YW5jZSA9IHRoaXMub3B0aW9ucy5kaXN0YW5jZTtcbiAgICAvLyBwcmV2ZW50IGF1dG9tYXRpYyBzY3JvbGxpbmcuXG4gICAgZG9tZXZlbnQucHJldmVudERlZmF1bHQobW91c2VNb3ZlRXZlbnQpO1xuXG4gICAgdGhpcy5faXNNb3ZlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fZGlzdGFuY2UgPCBkaXN0YW5jZSkge1xuICAgICAgICB0aGlzLl9kaXN0YW5jZSArPSAxO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLl9kcmFnU3RhcnRGaXJlZCkge1xuICAgICAgICB0aGlzLl9kcmFnU3RhcnRGaXJlZCA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERyYWcgc3RhcnRzIGV2ZW50cy4gY2FuY2VsYWJsZS5cbiAgICAgICAgICogQGV2ZW50IERyYWcjZHJhZ1N0YXJ0XG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIHRhcmdldCBlbGVtZW50IGluIHRoaXMgZXZlbnQuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TW91c2VFdmVudH0gb3JpZ2luRXZlbnQgLSBvcmlnaW5hbCBtb3VzZSBldmVudCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoIXRoaXMuaW52b2tlKCdkcmFnU3RhcnQnLCB0aGlzLl9kcmFnU3RhcnRFdmVudERhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLl90b2dnbGVEcmFnRXZlbnQoZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHdoaWxlIGRyYWdnaW5nLlxuICAgICAqIEBldmVudCBEcmFnI2RyYWdcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIHRhcmdldCBlbGVtZW50IGluIHRoaXMgZXZlbnQuXG4gICAgICogQHByb3BlcnR5IHtNb3VzZUV2ZW50fSBvcmlnaW5FdmVudCAtIG9yaWdpbmFsIG1vdXNlIGV2ZW50IG9iamVjdC5cbiAgICAgKi9cbiAgICB0aGlzLmZpcmUoJ2RyYWcnLCB0aGlzLl9nZXRFdmVudERhdGEobW91c2VNb3ZlRXZlbnQpKTtcbn07XG5cbi8qKlxuICogTW91c2VVcCBET00gZXZlbnQgaGFuZGxlci5cbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gbW91c2VVcEV2ZW50IE1vdXNlVXAgZXZlbnQgb2JqZWN0LlxuICogQGVtaXRzIERyYWcjZHJhZ0VuZFxuICogQGVtaXRzIERyYWcjY2xpY2tcbiAqL1xuRHJhZy5wcm90b3R5cGUuX29uTW91c2VVcCA9IGZ1bmN0aW9uKG1vdXNlVXBFdmVudCkge1xuICAgIHRoaXMuX3RvZ2dsZURyYWdFdmVudChmYWxzZSk7XG5cbiAgICAvLyBlbWl0IFwiY2xpY2tcIiBldmVudCB3aGVuIG5vdCBlbWl0dGVkIGRyYWcgZXZlbnQgYmV0d2VlbiBtb3VzZWRvd24gYW5kIG1vdXNldXAuXG4gICAgaWYgKHRoaXMuX2lzTW92ZWQpIHtcbiAgICAgICAgdGhpcy5faXNNb3ZlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEcmFnIGVuZCBldmVudHMuXG4gICAgICAgICAqIEBldmVudCBEcmFnI2RyYWdFbmRcbiAgICAgICAgICogQHR5cGUge01vdXNlRXZlbnR9XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIHRhcmdldCBlbGVtZW50IGluIHRoaXMgZXZlbnQuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TW91c2VFdmVudH0gb3JpZ2luRXZlbnQgLSBvcmlnaW5hbCBtb3VzZSBldmVudCBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZpcmUoJ2RyYWdFbmQnLCB0aGlzLl9nZXRFdmVudERhdGEobW91c2VVcEV2ZW50KSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGljayBldmVudHMuXG4gICAgICogQGV2ZW50IERyYWcjY2xpY2tcbiAgICAgKiBAdHlwZSB7TW91c2VFdmVudH1cbiAgICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXQgLSB0YXJnZXQgZWxlbWVudCBpbiB0aGlzIGV2ZW50LlxuICAgICAqIEBwcm9wZXJ0eSB7TW91c2VFdmVudH0gb3JpZ2luRXZlbnQgLSBvcmlnaW5hbCBtb3VzZSBldmVudCBvYmplY3QuXG4gICAgICovXG4gICAgdGhpcy5maXJlKCdjbGljaycsIHRoaXMuX2dldEV2ZW50RGF0YShtb3VzZVVwRXZlbnQpKTtcbn07XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKERyYWcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERyYWc7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBUaGUgYmFzZSBjbGFzcyBvZiB2aWV3cy5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgRGV2ZWxvcG1lbnQgVGVhbSA8ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGRvbXV0aWwgPSByZXF1aXJlKCcuL2RvbXV0aWwnKTtcbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi9jb2xsZWN0aW9uJyk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBvZiB2aWV3cy5cbiAqXG4gKiBBbGwgdmlld3MgY3JlYXRlIG93biBjb250YWluZXIgZWxlbWVudCBpbnNpZGUgc3VwcGxpZWQgY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7b3B0aW9uc30gb3B0aW9ucyBUaGUgb2JqZWN0IGZvciBkZXNjcmliZSB2aWV3J3Mgc3BlY3MuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgRGVmYXVsdCBjb250YWluZXIgZWxlbWVudCBmb3Igdmlldy4geW91IGNhbiB1c2UgdGhpcyBlbGVtZW50IGZvciB0aGlzLmNvbnRhaW5lciBzeW50YXguXG4gKi9cbmZ1bmN0aW9uIFZpZXcob3B0aW9ucywgY29udGFpbmVyKSB7XG4gICAgdmFyIGlkID0gdXRpbC5zdGFtcCh0aGlzKTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgaWYgKHV0aWwuaXNVbmRlZmluZWQoY29udGFpbmVyKSkge1xuICAgICAgICBjb250YWluZXIgPSBkb211dGlsLmFwcGVuZEhUTUxFbGVtZW50KCdkaXYnKTtcbiAgICB9XG5cbiAgICBkb211dGlsLmFkZENsYXNzKGNvbnRhaW5lciwgJ3R1aS12aWV3LScgKyBpZCk7XG5cbiAgICAvKipcbiAgICAgKiB1bmlxdWUgaWRcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIGJhc2UgZWxlbWVudCBvZiB2aWV3LlxuICAgICAqIEB0eXBlIHtIVE1MRElWRWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xuICAgIC8qKlxuICAgICAqIGNoaWxkIHZpZXdzLlxuICAgICAqIEB0eXBlIHtDb2xsZWN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMuY2hpbGRzID0gbmV3IENvbGxlY3Rpb24oZnVuY3Rpb24odmlldykge1xuICAgICAgICByZXR1cm4gdXRpbC5zdGFtcCh2aWV3KTtcbiAgICB9KTtcbiAgICAvKmVzbGludC1lbmFibGUqL1xuXG4gICAgLyoqXG4gICAgICogcGFyZW50IHZpZXcgaW5zdGFuY2UuXG4gICAgICogQHR5cGUge1ZpZXd9XG4gICAgICovXG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xufVxuXG4vKipcbiAqIEFkZCBjaGlsZCB2aWV3cy5cbiAqIEBwYXJhbSB7Vmlld30gdmlldyBUaGUgdmlldyBpbnN0YW5jZSB0byBhZGQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZm5dIEZ1bmN0aW9uIGZvciBpbnZva2UgYmVmb3JlIGFkZC4gcGFyZW50IHZpZXcgY2xhc3MgaXMgc3VwcGxpZWQgZmlyc3QgYXJndW1lbnRzLlxuICovXG5WaWV3LnByb3RvdHlwZS5hZGRDaGlsZCA9IGZ1bmN0aW9uKHZpZXcsIGZuKSB7XG4gICAgaWYgKGZuKSB7XG4gICAgICAgIGZuLmNhbGwodmlldywgdGhpcyk7XG4gICAgfVxuICAgIC8vIGFkZCBwYXJlbnQgdmlld1xuICAgIHZpZXcucGFyZW50ID0gdGhpcztcblxuICAgIHRoaXMuY2hpbGRzLmFkZCh2aWV3KTtcbn07XG5cbi8qKlxuICogUmVtb3ZlIGFkZGVkIGNoaWxkIHZpZXcuXG4gKiBAcGFyYW0geyhudW1iZXJ8Vmlldyl9IGlkIFZpZXcgaWQgb3IgaW5zdGFuY2UgaXRzZWxmIHRvIHJlbW92ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtmbl0gRnVuY3Rpb24gZm9yIGludm9rZSBiZWZvcmUgcmVtb3ZlLiBwYXJlbnQgdmlldyBjbGFzcyBpcyBzdXBwbGllZCBmaXJzdCBhcmd1bWVudHMuXG4gKi9cblZpZXcucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24oaWQsIGZuKSB7XG4gICAgdmFyIHZpZXcgPSB1dGlsLmlzTnVtYmVyKGlkKSA/IHRoaXMuY2hpbGRzLml0ZW1zW2lkXSA6IGlkO1xuXG4gICAgaWQgPSB1dGlsLnN0YW1wKHZpZXcpO1xuXG4gICAgaWYgKGZuKSB7XG4gICAgICAgIGZuLmNhbGwodmlldywgdGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZHMucmVtb3ZlKGlkKTtcbn07XG5cbi8qKlxuICogUmVuZGVyIHZpZXcgcmVjdXJzaXZlbHkuXG4gKi9cblZpZXcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2hpbGRzLmVhY2goZnVuY3Rpb24oY2hpbGRWaWV3KSB7XG4gICAgICAgIGNoaWxkVmlldy5yZW5kZXIoKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogSW52b2tlIGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gLSBmdW5jdGlvbiB0byBpbnZva2UgY2hpbGQgdmlldyByZWN1cnNpdmVseVxuICogQHBhcmFtIHtib29sZWFufSBbc2tpcFRoaXM9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiBza2lwIGludm9rZSB3aXRoIHRoaXMocm9vdCkgdmlldy5cbiAqL1xuVmlldy5wcm90b3R5cGUucmVjdXJzaXZlID0gZnVuY3Rpb24oZm4sIHNraXBUaGlzKSB7XG4gICAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXNraXBUaGlzKSB7XG4gICAgICAgIGZuKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGRzLmVhY2goZnVuY3Rpb24oY2hpbGRWaWV3KSB7XG4gICAgICAgIGNoaWxkVmlldy5yZWN1cnNpdmUoZm4pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBSZXNpemUgdmlldyByZWN1cnNpdmVseSB0byBwYXJlbnQuXG4gKi9cblZpZXcucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcbiAgICAgICAgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG5cbiAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIGlmICh1dGlsLmlzRnVuY3Rpb24ocGFyZW50Ll9vblJlc2l6ZSkpIHtcbiAgICAgICAgICAgIHBhcmVudC5fb25SZXNpemUuYXBwbHkocGFyZW50LCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgfVxufTtcblxuLyoqXG4gKiBJbnZva2luZyBtZXRob2QgYmVmb3JlIGRlc3Ryb3lpbmcuXG4gKi9cblZpZXcucHJvdG90eXBlLl9iZWZvcmVEZXN0cm95ID0gZnVuY3Rpb24oKSB7fTtcblxuLyoqXG4gKiBDbGVhciBwcm9wZXJ0aWVzXG4gKi9cblZpZXcucHJvdG90eXBlLl9kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fYmVmb3JlRGVzdHJveSgpO1xuICAgIHRoaXMuY2hpbGRzLmNsZWFyKCk7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB0aGlzLmlkID0gdGhpcy5wYXJlbnQgPSB0aGlzLmNoaWxkcyA9IHRoaXMuY29udGFpbmVyID0gbnVsbDtcbn07XG5cbi8qZXNsaW50LWRpc2FibGUqL1xuLyoqXG4gKiBEZXN0cm95IGNoaWxkIHZpZXcgcmVjdXJzaXZlbHkuXG4gKi9cblZpZXcucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbihpc0NoaWxkVmlldykge1xuICAgIHRoaXMuY2hpbGRzLmVhY2goZnVuY3Rpb24oY2hpbGRWaWV3KSB7XG4gICAgICAgIGNoaWxkVmlldy5kZXN0cm95KHRydWUpO1xuICAgICAgICBjaGlsZFZpZXcuX2Rlc3Ryb3koKTtcbiAgICB9KTtcblxuICAgIGlmIChpc0NoaWxkVmlldykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZGVzdHJveSgpO1xufTtcbi8qZXNsaW50LWVuYWJsZSovXG5cbi8qKlxuICogQ2FsY3VsYXRlIHZpZXcncyBjb250YWluZXIgZWxlbWVudCBib3VuZC5cbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBib3VuZCBvZiBjb250YWluZXIgZWxlbWVudC5cbiAqL1xuVmlldy5wcm90b3R5cGUuZ2V0Vmlld0JvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyLFxuICAgICAgICBwb3NpdGlvbiA9IGRvbXV0aWwuZ2V0UG9zaXRpb24oY29udGFpbmVyKSxcbiAgICAgICAgc2l6ZSA9IGRvbXV0aWwuZ2V0U2l6ZShjb250YWluZXIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogcG9zaXRpb25bMF0sXG4gICAgICAgIHk6IHBvc2l0aW9uWzFdLFxuICAgICAgICB3aWR0aDogc2l6ZVswXSxcbiAgICAgICAgaGVpZ2h0OiBzaXplWzFdXG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbG9ycGlja2VyIGZhY3RvcnkgbW9kdWxlXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgY29sb3J1dGlsID0gcmVxdWlyZSgnLi9jb2xvcnV0aWwnKTtcbnZhciBMYXlvdXQgPSByZXF1aXJlKCcuL2xheW91dCcpO1xudmFyIFBhbGV0dGUgPSByZXF1aXJlKCcuL3BhbGV0dGUnKTtcbnZhciBTbGlkZXIgPSByZXF1aXJlKCcuL3NsaWRlcicpO1xuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKG1zZykge1xuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xufVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIEN1c3RvbUV2ZW50c1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBjb2xvcnBpY2tlciBjb21wb25lbnRcbiAqICBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBvcHRpb25zLmNvbnRhaW5lciAtIGNvbnRhaW5lciBlbGVtZW50XG4gKiAgQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNvbG9yPScjZmZmZmZmJ10gLSBkZWZhdWx0IHNlbGVjdGVkIGNvbG9yXG4gKiAgQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnMucHJlc2V0XSAtIGNvbG9yIHByZXNldCBmb3IgcGFsZXR0ZSAodXNlIGJhc2UxNiBwYWxldHRlIGlmIG5vdCBzdXBwbGllZClcbiAqICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY3NzUHJlZml4PSd0dWktY29sb3JwaWNrZXItJ10gLSBjc3MgcHJlZml4IHRleHQgZm9yIGVhY2ggY2hpbGQgZWxlbWVudHNcbiAqICBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZGV0YWlsVHh0PSdEZXRhaWwnXSAtIHRleHQgZm9yIGRldGFpbCBidXR0b24uXG4gKiBAZXhhbXBsZVxuICogdmFyIGNvbG9ycGlja2VyID0gdHVpLmNvbXBvbmVudC5jb2xvcnBpY2tlcih7XG4gKiAgIGNvbnRhaW5lcjogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbG9ycGlja2VyJylcbiAqIH0pO1xuICpcbiAqIGNvbG9ycGlja2VyLmdldENvbG9yKCk7ICAgIC8vICcjZmZmZmZmJ1xuICovXG5mdW5jdGlvbiBDb2xvcnBpY2tlcihvcHRpb25zKSB7XG4gICAgdmFyIGxheW91dDtcblxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBDb2xvcnBpY2tlcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb2xvcnBpY2tlcihvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogT3B0aW9uIG9iamVjdFxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgY29udGFpbmVyOiBudWxsLFxuICAgICAgICBjb2xvcjogJyNmOGY4ZjgnLFxuICAgICAgICBwcmVzZXQ6IFtcbiAgICAgICAgICAgICcjMTgxODE4JyxcbiAgICAgICAgICAgICcjMjgyODI4JyxcbiAgICAgICAgICAgICcjMzgzODM4JyxcbiAgICAgICAgICAgICcjNTg1ODU4JyxcbiAgICAgICAgICAgICcjYjhiOGI4JyxcbiAgICAgICAgICAgICcjZDhkOGQ4JyxcbiAgICAgICAgICAgICcjZThlOGU4JyxcbiAgICAgICAgICAgICcjZjhmOGY4JyxcbiAgICAgICAgICAgICcjYWI0NjQyJyxcbiAgICAgICAgICAgICcjZGM5NjU2JyxcbiAgICAgICAgICAgICcjZjdjYTg4JyxcbiAgICAgICAgICAgICcjYTFiNTZjJyxcbiAgICAgICAgICAgICcjODZjMWI5JyxcbiAgICAgICAgICAgICcjN2NhZmMyJyxcbiAgICAgICAgICAgICcjYmE4YmFmJyxcbiAgICAgICAgICAgICcjYTE2OTQ2J1xuICAgICAgICBdLFxuICAgICAgICBjc3NQcmVmaXg6ICd0dWktY29sb3JwaWNrZXItJyxcbiAgICAgICAgZGV0YWlsVHh0OiAnRGV0YWlsJ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKCFvcHRpb25zLmNvbnRhaW5lcikge1xuICAgICAgICB0aHJvd0Vycm9yKCdDb2xvcnBpY2tlcigpOiBuZWVkIGNvbnRhaW5lciBvcHRpb24uJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKlxuICAgICAqIENyZWF0ZSBsYXlvdXQgdmlld1xuICAgICAqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0xheW91dH1cbiAgICAgKi9cbiAgICBsYXlvdXQgPSB0aGlzLmxheW91dCA9IG5ldyBMYXlvdXQob3B0aW9ucywgb3B0aW9ucy5jb250YWluZXIpO1xuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBDcmVhdGUgcGFsZXR0ZSB2aWV3XG4gICAgICoqKioqKioqKiovXG4gICAgdGhpcy5wYWxldHRlID0gbmV3IFBhbGV0dGUob3B0aW9ucywgbGF5b3V0LmNvbnRhaW5lcik7XG4gICAgdGhpcy5wYWxldHRlLm9uKHtcbiAgICAgICAgJ19zZWxlY3RDb2xvcic6IHRoaXMuX29uU2VsZWN0Q29sb3JJblBhbGV0dGUsXG4gICAgICAgICdfdG9nZ2xlU2xpZGVyJzogdGhpcy5fb25Ub2dnbGVTbGlkZXJcbiAgICB9LCB0aGlzKTtcblxuICAgIC8qKioqKioqKioqXG4gICAgICogQ3JlYXRlIHNsaWRlciB2aWV3XG4gICAgICoqKioqKioqKiovXG4gICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKG9wdGlvbnMsIGxheW91dC5jb250YWluZXIpO1xuICAgIHRoaXMuc2xpZGVyLm9uKCdfc2VsZWN0Q29sb3InLCB0aGlzLl9vblNlbGVjdENvbG9ySW5TbGlkZXIsIHRoaXMpO1xuXG4gICAgLyoqKioqKioqKipcbiAgICAgKiBBZGQgY2hpbGQgdmlld3NcbiAgICAgKioqKioqKioqKi9cbiAgICBsYXlvdXQuYWRkQ2hpbGQodGhpcy5wYWxldHRlKTtcbiAgICBsYXlvdXQuYWRkQ2hpbGQodGhpcy5zbGlkZXIpO1xuXG4gICAgdGhpcy5yZW5kZXIob3B0aW9ucy5jb2xvcik7XG59XG5cbi8qKlxuICogSGFuZGxlciBtZXRob2QgZm9yIFBhbGV0dGUjX3NlbGVjdENvbG9yIGV2ZW50XG4gKiBAcHJpdmF0ZVxuICogQGZpcmVzIENvbG9ycGlja2VyI3NlbGVjdENvbG9yXG4gKiBAcGFyYW0ge29iamVjdH0gc2VsZWN0Q29sb3JFdmVudERhdGEgLSBldmVudCBkYXRhXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5fb25TZWxlY3RDb2xvckluUGFsZXR0ZSA9IGZ1bmN0aW9uKHNlbGVjdENvbG9yRXZlbnREYXRhKSB7XG4gICAgdmFyIGNvbG9yID0gc2VsZWN0Q29sb3JFdmVudERhdGEuY29sb3IsXG4gICAgICAgIG9wdCA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmICghY29sb3J1dGlsLmlzVmFsaWRSR0IoY29sb3IpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0LmNvbG9yID09PSBjb2xvcikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb3B0LmNvbG9yID0gY29sb3I7XG4gICAgdGhpcy5yZW5kZXIoY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogQGV2ZW50IENvbG9ycGlja2VyI3NlbGVjdENvbG9yXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29sb3IgLSBzZWxlY3RlZCBjb2xvciAoaGV4IHN0cmluZylcbiAgICAgKi9cbiAgICB0aGlzLmZpcmUoJ3NlbGVjdENvbG9yJywge1xuICAgICAgICBjb2xvcjogY29sb3JcbiAgICB9KTtcbn07XG5cbi8qKlxuICogSGFuZGxlciBtZXRob2QgZm9yIFBhbGV0dGUjX3RvZ2dsZVNsaWRlciBldmVudFxuICogQHByaXZhdGVcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLl9vblRvZ2dsZVNsaWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVyLnRvZ2dsZSghdGhpcy5zbGlkZXIuaXNWaXNpYmxlKCkpO1xufTtcblxuXG4vKipcbiAqIEhhbmRsZXIgbWV0aG9kIGZvciBTbGlkZXIjX3NlbGVjdENvbG9yIGV2ZW50XG4gKiBAcHJpdmF0ZVxuICogQGZpcmVzIENvbG9ycGlja2VyI3NlbGVjdENvbG9yXG4gKiBAcGFyYW0ge29iamVjdH0gc2VsZWN0Q29sb3JFdmVudERhdGEgLSBldmVudCBkYXRhXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5fb25TZWxlY3RDb2xvckluU2xpZGVyID0gZnVuY3Rpb24oc2VsZWN0Q29sb3JFdmVudERhdGEpIHtcbiAgICB2YXIgY29sb3IgPSBzZWxlY3RDb2xvckV2ZW50RGF0YS5jb2xvcixcbiAgICAgICAgb3B0ID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdC5jb2xvciA9PT0gY29sb3IpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG9wdC5jb2xvciA9IGNvbG9yO1xuICAgIHRoaXMucGFsZXR0ZS5yZW5kZXIoY29sb3IpO1xuXG4gICAgLyoqXG4gICAgICogQGV2ZW50IENvbG9ycGlja2VyI3NlbGVjdENvbG9yXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29sb3IgLSBzZWxlY3RlZCBjb2xvciAoaGV4IHN0cmluZylcbiAgICAgKi9cbiAgICB0aGlzLmZpcmUoJ3NlbGVjdENvbG9yJywge1xuICAgICAgICBjb2xvcjogY29sb3JcbiAgICB9KTtcbn07XG5cbi8qKioqKioqKioqXG4gKiBQVUJMSUMgQVBJXG4gKioqKioqKioqKi9cblxuLyoqXG4gKiBTZXQgY29sb3JwaWNrZXIgY3VycmVudCBjb2xvclxuICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciAtIGhleCBmb3JtYXR0ZWQgY29sb3Igc3RyaW5nXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5zZXRDb2xvciA9IGZ1bmN0aW9uKGhleFN0cikge1xuICAgIGlmICghY29sb3J1dGlsLmlzVmFsaWRSR0IoaGV4U3RyKSkge1xuICAgICAgICB0aHJvd0Vycm9yKCdDb2xvcnBpY2tlciNzZXRDb2xvcigpOiBuZWVkIHZhbGlkIGhleCBzdHJpbmcgY29sb3IgdmFsdWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMuY29sb3IgPSBoZXhTdHI7XG4gICAgdGhpcy5yZW5kZXIoaGV4U3RyKTtcbn07XG5cbi8qKlxuICogR2V0IGNvbG9ycGlja2VyIGN1cnJlbnQgY29sb3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGhleCBzdHJpbmcgZm9ybWF0dGVkIGNvbG9yXG4gKi9cbkNvbG9ycGlja2VyLnByb3RvdHlwZS5nZXRDb2xvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY29sb3I7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSBjb2xvcnBpY2tlciBjb250YWluZXIgZWxlbWVudFxuICogQHBhcmFtIHtib29sZWFufSBbaXNTaG93PXRydWVdIC0gdHJ1ZSB3aGVuIHJldmVhbCBjb2xvcnBpY2tlclxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oaXNTaG93KSB7XG4gICAgdGhpcy5sYXlvdXQuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAhIWlzU2hvdyA/ICdibG9jaycgOiAnbm9uZSc7XG59O1xuXG4vKipcbiAqIFJlbmRlciBjb2xvcnBpY2tlclxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2xvcl0gLSBzZWxlY3RlZCBjb2xvclxuICovXG5Db2xvcnBpY2tlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sb3IpIHtcbiAgICB0aGlzLmxheW91dC5yZW5kZXIoY29sb3IgfHwgdGhpcy5vcHRpb25zLmNvbG9yKTtcbn07XG5cbi8qKlxuICogRGVzdHJveSBjb2xvcnBpY2tlciBjb21wb25lbnRcbiAqL1xuQ29sb3JwaWNrZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxheW91dC5kZXN0cm95KCk7XG4gICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIHRoaXMubGF5b3V0ID0gdGhpcy5zbGlkZXIgPSB0aGlzLnBhbGV0dGUgPVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBudWxsO1xufTtcblxudXRpbC5DdXN0b21FdmVudHMubWl4aW4oQ29sb3JwaWNrZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbG9ycGlja2VyO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQ29sb3JwaWNrZXIgbGF5b3V0IG1vZHVsZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGRvbXV0aWwgPSByZXF1aXJlKCcuL2NvcmUvZG9tdXRpbCcpO1xudmFyIFZpZXcgPSByZXF1aXJlKCcuL2NvcmUvdmlldycpO1xuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge1ZpZXd9XG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbiBvYmplY3RcbiAqICBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jc3NQcmVmaXggLSBjc3MgcHJlZml4IGZvciBlYWNoIGNoaWxkIGVsZW1lbnRzXG4gKiBAcGFyYW0ge0hUTUxEaXZFbGVtZW50fSBjb250YWluZXIgLSBjb250YWluZXJcbiAqL1xuZnVuY3Rpb24gTGF5b3V0KG9wdGlvbnMsIGNvbnRhaW5lcikge1xuICAgIC8qKlxuICAgICAqIG9wdGlvbiBvYmplY3RcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IHV0aWwuZXh0ZW5kKHtcbiAgICAgICAgY3NzUHJlZml4OiAndHVpLWNvbG9ycGlja2VyLSdcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGNvbnRhaW5lciA9IGRvbXV0aWwuYXBwZW5kSFRNTEVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICBjb250YWluZXIsXG4gICAgICAgIHRoaXMub3B0aW9ucy5jc3NQcmVmaXggKyAnY29udGFpbmVyJ1xuICAgICk7XG5cbiAgICBWaWV3LmNhbGwodGhpcywgb3B0aW9ucywgY29udGFpbmVyKTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG59XG5cbnV0aWwuaW5oZXJpdChMYXlvdXQsIFZpZXcpO1xuXG4vKipcbiAqIEBvdmVycmlkZVxuICogQHBhcmFtIHtzdHJpbmd9IFtjb2xvcl0gLSBzZWxlY3RlZCBjb2xvclxuICovXG5MYXlvdXQucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgdGhpcy5yZWN1cnNpdmUoZnVuY3Rpb24odmlldykge1xuICAgICAgICB2aWV3LnJlbmRlcihjb2xvcik7XG4gICAgfSwgdHJ1ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExheW91dDtcblxuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IENvbG9yIHBhbGV0dGUgdmlld1xuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciB1dGlsID0gZ2xvYmFsLnR1aS51dGlsO1xudmFyIGRvbXV0aWwgPSByZXF1aXJlKCcuL2NvcmUvZG9tdXRpbCcpO1xudmFyIGRvbWV2ZW50ID0gcmVxdWlyZSgnLi9jb3JlL2RvbWV2ZW50Jyk7XG52YXIgVmlldyA9IHJlcXVpcmUoJy4vY29yZS92aWV3Jyk7XG52YXIgdG1wbCA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL3BhbGV0dGUnKTtcblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIHtWaWV3fVxuICogQG1peGVzIEN1c3RvbUV2ZW50c1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25zIGZvciBjb2xvciBwYWxldHRlIHZpZXdcbiAqICBAcGFyYW0ge3N0cmluZ1tdfSBvcHRpb25zLnByZXNldCAtIGNvbG9yIGxpc3RcbiAqIEBwYXJhbSB7SFRNTERpdkVsZW1lbnR9IGNvbnRhaW5lciAtIGNvbnRhaW5lciBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIFBhbGV0dGUob3B0aW9ucywgY29udGFpbmVyKSB7XG4gICAgLyoqXG4gICAgICogb3B0aW9uIG9iamVjdFxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gdXRpbC5leHRlbmQoe1xuICAgICAgICBjc3NQcmVmaXg6ICd0dWktY29sb3JwaWNrZXItJyxcbiAgICAgICAgcHJlc2V0OiBbXG4gICAgICAgICAgICAnIzE4MTgxOCcsXG4gICAgICAgICAgICAnIzI4MjgyOCcsXG4gICAgICAgICAgICAnIzM4MzgzOCcsXG4gICAgICAgICAgICAnIzU4NTg1OCcsXG4gICAgICAgICAgICAnI0I4QjhCOCcsXG4gICAgICAgICAgICAnI0Q4RDhEOCcsXG4gICAgICAgICAgICAnI0U4RThFOCcsXG4gICAgICAgICAgICAnI0Y4RjhGOCcsXG4gICAgICAgICAgICAnI0FCNDY0MicsXG4gICAgICAgICAgICAnI0RDOTY1NicsXG4gICAgICAgICAgICAnI0Y3Q0E4OCcsXG4gICAgICAgICAgICAnI0ExQjU2QycsXG4gICAgICAgICAgICAnIzg2QzFCOScsXG4gICAgICAgICAgICAnIzdDQUZDMicsXG4gICAgICAgICAgICAnI0JBOEJBRicsXG4gICAgICAgICAgICAnI0ExNjk0NidcbiAgICAgICAgXSxcbiAgICAgICAgZGV0YWlsVHh0OiAnRGV0YWlsJ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgY29udGFpbmVyID0gZG9tdXRpbC5hcHBlbmRIVE1MRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIGNvbnRhaW5lcixcbiAgICAgICAgdGhpcy5vcHRpb25zLmNzc1ByZWZpeCArICdwYWxldHRlLWNvbnRhaW5lcidcbiAgICApO1xuXG4gICAgVmlldy5jYWxsKHRoaXMsIG9wdGlvbnMsIGNvbnRhaW5lcik7XG59XG5cbnV0aWwuaW5oZXJpdChQYWxldHRlLCBWaWV3KTtcblxuLyoqXG4gKiBNb3VzZSBjbGljayBldmVudCBoYW5kbGVyXG4gKiBAZmlyZXMgUGFsZXR0ZSNfc2VsZWN0Q29sb3JcbiAqIEBmaXJlcyBQYWxldHRlI190b2dnbGVTbGlkZXJcbiAqIEBwYXJhbSB7TW91c2VFdmVudH0gY2xpY2tFdmVudCAtIG1vdXNlIGV2ZW50IG9iamVjdFxuICovXG5QYWxldHRlLnByb3RvdHlwZS5fb25DbGljayA9IGZ1bmN0aW9uKGNsaWNrRXZlbnQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgdGFyZ2V0ID0gY2xpY2tFdmVudC5zcmNFbGVtZW50IHx8IGNsaWNrRXZlbnQudGFyZ2V0LFxuICAgICAgICBldmVudERhdGEgPSB7fTtcblxuICAgIGlmIChkb211dGlsLmhhc0NsYXNzKHRhcmdldCwgb3B0aW9ucy5jc3NQcmVmaXggKyAncGFsZXR0ZS1idXR0b24nKSkge1xuICAgICAgICBldmVudERhdGEuY29sb3IgPSB0YXJnZXQudmFsdWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBldmVudCBQYWxldHRlI19zZWxlY3RDb2xvclxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gY29sb3IgLSBzZWxlY3RlZCBjb2xvciB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJlKCdfc2VsZWN0Q29sb3InLCBldmVudERhdGEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRvbXV0aWwuaGFzQ2xhc3ModGFyZ2V0LCBvcHRpb25zLmNzc1ByZWZpeCArICdwYWxldHRlLXRvZ2dsZS1zbGlkZXInKSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGV2ZW50IFBhbGV0dGUjX3RvZ2dsZVNsaWRlclxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5maXJlKCdfdG9nZ2xlU2xpZGVyJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBUZXh0Ym94IGNoYW5nZSBldmVudCBoYW5kbGVyXG4gKiBAZmlyZXMgUGFsZXR0ZSNfc2VsZWN0Q29sb3JcbiAqIEBwYXJhbSB7RXZlbnR9IGNoYW5nZUV2ZW50IC0gY2hhbmdlIGV2ZW50IG9iamVjdFxuICovXG5QYWxldHRlLnByb3RvdHlwZS5fb25DaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VFdmVudCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICB0YXJnZXQgPSBjaGFuZ2VFdmVudC5zcmNFbGVtZW50IHx8IGNoYW5nZUV2ZW50LnRhcmdldCxcbiAgICAgICAgZXZlbnREYXRhID0ge307XG5cbiAgICBpZiAoZG9tdXRpbC5oYXNDbGFzcyh0YXJnZXQsIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3BhbGV0dGUtaGV4JykpIHtcbiAgICAgICAgZXZlbnREYXRhLmNvbG9yID0gdGFyZ2V0LnZhbHVlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZXZlbnQgUGFsZXR0ZSNfc2VsZWN0Q29sb3JcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGNvbG9yIC0gc2VsZWN0ZWQgY29sb3IgdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmlyZSgnX3NlbGVjdENvbG9yJywgZXZlbnREYXRhKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn07XG5cbi8qKlxuICogSW52b2tlIGJlZm9yZSBkZXN0b3J5XG4gKiBAb3ZlcnJpZGVcbiAqL1xuUGFsZXR0ZS5wcm90b3R5cGUuX2JlZm9yZURlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl90b2dnbGVFdmVudChmYWxzZSk7XG59O1xuXG4vKipcbiAqIFRvZ2dsZSB2aWV3IERPTSBldmVudHNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29uT2ZmPWZhbHNlXSAtIHRydWUgdG8gYmluZCBldmVudC5cbiAqL1xuUGFsZXR0ZS5wcm90b3R5cGUuX3RvZ2dsZUV2ZW50ID0gZnVuY3Rpb24ob25PZmYpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgY29udGFpbmVyID0gdGhpcy5jb250YWluZXIsXG4gICAgICAgIG1ldGhvZCA9IGRvbWV2ZW50WyEhb25PZmYgPyAnb24nIDogJ29mZiddLFxuICAgICAgICBoZXhUZXh0Qm94O1xuXG4gICAgbWV0aG9kKGNvbnRhaW5lciwgJ2NsaWNrJywgdGhpcy5fb25DbGljaywgdGhpcyk7XG5cbiAgICBoZXhUZXh0Qm94ID0gZG9tdXRpbC5maW5kKCcuJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3BhbGV0dGUtaGV4JywgY29udGFpbmVyKTtcblxuICAgIGlmIChoZXhUZXh0Qm94KSB7XG4gICAgICAgIG1ldGhvZChoZXhUZXh0Qm94LCAnY2hhbmdlJywgdGhpcy5fb25DaGFuZ2UsIHRoaXMpO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmVuZGVyIHBhbGV0dGVcbiAqIEBvdmVycmlkZVxuICovXG5QYWxldHRlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbihjb2xvcikge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBodG1sID0gJyc7XG5cbiAgICB0aGlzLl90b2dnbGVFdmVudChmYWxzZSk7XG5cbiAgICBodG1sID0gdG1wbC5sYXlvdXQucmVwbGFjZSgne3tjb2xvckxpc3R9fScsIHV0aWwubWFwKG9wdGlvbnMucHJlc2V0LCBmdW5jdGlvbihfY29sb3IpIHtcbiAgICAgICAgdmFyIGl0ZW1IdG1sID0gdG1wbC5pdGVtLnJlcGxhY2UoL3t7Y29sb3J9fS9nLCBfY29sb3IpO1xuICAgICAgICBpdGVtSHRtbCA9IGl0ZW1IdG1sLnJlcGxhY2UoJ3t7c2VsZWN0ZWR9fScsIF9jb2xvciA9PT0gY29sb3IgPyAgKCcgJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NlbGVjdGVkJykgOiAnJyk7IFxuXG4gICAgICAgIHJldHVybiBpdGVtSHRtbDtcbiAgICB9KS5qb2luKCcnKSk7XG5cbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC97e2Nzc1ByZWZpeH19L2csIG9wdGlvbnMuY3NzUHJlZml4KVxuICAgICAgICAucmVwbGFjZSgne3tkZXRhaWxUeHR9fScsIG9wdGlvbnMuZGV0YWlsVHh0KVxuICAgICAgICAucmVwbGFjZSgve3tjb2xvcn19L2csIGNvbG9yKTtcblxuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICB0aGlzLl90b2dnbGVFdmVudCh0cnVlKTtcbn07XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKFBhbGV0dGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbGV0dGU7XG5cbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBTbGlkZXIgdmlld1xuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG52YXIgZG9tdXRpbCA9IHJlcXVpcmUoJy4vY29yZS9kb211dGlsJyk7XG52YXIgZG9tZXZlbnQgPSByZXF1aXJlKCcuL2NvcmUvZG9tZXZlbnQnKTtcbnZhciBzdmd2bWwgPSByZXF1aXJlKCcuL3N2Z3ZtbCcpO1xudmFyIGNvbG9ydXRpbCA9IHJlcXVpcmUoJy4vY29sb3J1dGlsJyk7XG52YXIgVmlldyA9IHJlcXVpcmUoJy4vY29yZS92aWV3Jyk7XG52YXIgRHJhZyA9IHJlcXVpcmUoJy4vY29yZS9kcmFnJyk7XG52YXIgdG1wbCA9IHJlcXVpcmUoJy4uL3RlbXBsYXRlL3NsaWRlcicpO1xuXG4vLyBMaW1pdGF0aW9uIHBvc2l0aW9uIG9mIHBvaW50IGVsZW1lbnQgaW5zaWRlIG9mIGNvbG9yc2xpZGVyIGFuZCBodWUgYmFyXG4vLyBNaW5pbXVtIHZhbHVlIGNhbiB0byBiZSBuZWdhdGl2ZSBiZWNhdXNlIHRoYXQgdXNpbmcgY29sb3IgcG9pbnQgb2YgaGFuZGxlIGVsZW1lbnQgaXMgY2VudGVyIHBvaW50LiBub3QgbGVmdCwgdG9wIHBvaW50LlxudmFyIENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRSA9IFstNywgMTEyXTtcbnZhciBIVUVCQVJfUE9TX0xJTUlUX1JBTkdFID0gWy0zLCAxMTVdO1xudmFyIEhVRV9XSEVFTF9NQVggPSAzNTkuOTk7XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyB7Vmlld31cbiAqIEBtaXhlcyBDdXN0b21FdmVudHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyBmb3Igdmlld1xuICogIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNzc1ByZWZpeCAtIGRlc2lnbiBjc3MgcHJlZml4XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgLSBjb250YWluZXIgZWxlbWVudFxuICovXG5mdW5jdGlvbiBTbGlkZXIob3B0aW9ucywgY29udGFpbmVyKSB7XG4gICAgY29udGFpbmVyID0gZG9tdXRpbC5hcHBlbmRIVE1MRWxlbWVudCgnZGl2JywgY29udGFpbmVyLCBvcHRpb25zLmNzc1ByZWZpeCArICdzbGlkZXItY29udGFpbmVyJyk7XG4gICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICBWaWV3LmNhbGwodGhpcywgb3B0aW9ucywgY29udGFpbmVyKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gdXRpbC5leHRlbmQoe1xuICAgICAgICBjb2xvcjogJyNmOGY4ZjgnLFxuICAgICAgICBjc3NQcmVmaXg6ICd0dWktY29sb3JwaWNrZXItJ1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQ2FjaGUgaW1tdXRhYmxlIGRhdGEgaW4gY2xpY2ssIGRyYWcgZXZlbnRzLlxuICAgICAqXG4gICAgICogKGkuZS4gaXMgZXZlbnQgcmVsYXRlZCB3aXRoIGNvbG9yc2xpZGVyPyBvciBodWViYXI/KVxuICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtib29sZWFufSBpc0NvbG9yU2xpZGVyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJbXX0gY29udGFpbmVyU2l6ZVxuICAgICAqL1xuICAgIHRoaXMuX2RyYWdEYXRhQ2FjaGUgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIENvbG9yIHNsaWRlciBoYW5kbGUgZWxlbWVudFxuICAgICAqIEB0eXBlIHtTVkd8Vk1MfVxuICAgICAqL1xuICAgIHRoaXMuc2xpZGVySGFuZGxlRWxlbWVudCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBodWUgYmFyIGhhbmRsZSBlbGVtZW50XG4gICAgICogQHR5cGUge1NWR3xWTUx9XG4gICAgICovXG4gICAgdGhpcy5odWViYXJIYW5kbGVFbGVtZW50ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEVsZW1lbnQgdGhhdCByZW5kZXIgYmFzZSBjb2xvciBpbiBjb2xvcnNsaWRlciBwYXJ0XG4gICAgICogQHR5cGUge1NWR3xWTUx9XG4gICAgICovXG4gICAgdGhpcy5iYXNlQ29sb3JFbGVtZW50ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtEcmFnfVxuICAgICAqL1xuICAgIHRoaXMuZHJhZyA9IG5ldyBEcmFnKHtcbiAgICAgICAgZGlzdGFuY2U6IDBcbiAgICB9LCBjb250YWluZXIpO1xuICAgIFxuICAgIC8vIGJpbmQgZHJhZyBldmVudHNcbiAgICB0aGlzLmRyYWcub24oe1xuICAgICAgICAnZHJhZ1N0YXJ0JzogdGhpcy5fb25EcmFnU3RhcnQsXG4gICAgICAgICdkcmFnJzogdGhpcy5fb25EcmFnLFxuICAgICAgICAnZHJhZ0VuZCc6IHRoaXMuX29uRHJhZ0VuZCxcbiAgICAgICAgJ2NsaWNrJzogdGhpcy5fb25DbGlja1xuICAgIH0sIHRoaXMpO1xufVxuXG51dGlsLmluaGVyaXQoU2xpZGVyLCBWaWV3KTtcblxuLyoqXG4gKiBAb3ZlcnJpZGVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fYmVmb3JlRGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZHJhZy5vZmYoKTtcblxuICAgIHRoaXMuZHJhZyA9IHRoaXMub3B0aW9ucyA9IHRoaXMuX2RyYWdEYXRhQ2FjaGUgPVxuICAgICAgICB0aGlzLnNsaWRlckhhbmRsZUVsZW1lbnQgPSB0aGlzLmh1ZWJhckhhbmRsZUVsZW1lbnQgPVxuICAgICAgICB0aGlzLmJhc2VDb2xvckVsZW1lbnQgPSBudWxsO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgc2xpZGVyIHZpZXdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gb25PZmYgLSBzZXQgdHJ1ZSB0aGVuIHJldmVhbCBzbGlkZXIgdmlld1xuICovXG5TbGlkZXIucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKG9uT2ZmKSB7XG4gICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICEhb25PZmYgPyAnYmxvY2snIDogJ25vbmUnO1xufTtcblxuLyoqXG4gKiBHZXQgc2xpZGVyIGRpc3BsYXkgc3RhdHVzXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gcmV0dXJuIHRydWUgd2hlbiBzbGlkZXIgaXMgdmlzaWJsZVxuICovXG5TbGlkZXIucHJvdG90eXBlLmlzVmlzaWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID09PSAnYmxvY2snO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgc2xpZGVyIHZpZXdcbiAqIEBvdmVycmlkZVxuICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yU3RyIC0gaGV4IHN0cmluZyBjb2xvciBmcm9tIHBhcmVudCB2aWV3IChMYXlvdXQpXG4gKi9cblNsaWRlci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oY29sb3JTdHIpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgIGNvbnRhaW5lciA9IHRoYXQuY29udGFpbmVyLFxuICAgICAgICBvcHRpb25zID0gdGhhdC5vcHRpb25zLFxuICAgICAgICBodG1sID0gdG1wbC5sYXlvdXQsXG4gICAgICAgIHJnYixcbiAgICAgICAgaHN2O1xuXG4gICAgaHRtbCA9IGh0bWwucmVwbGFjZSgve3tzbGlkZXJ9fS8sIHRtcGwuc2xpZGVyKTtcbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC97e2h1ZWJhcn19LywgdG1wbC5odWViYXIpO1xuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL3t7Y3NzUHJlZml4fX0vZywgb3B0aW9ucy5jc3NQcmVmaXgpO1xuXG4gICAgdGhhdC5jb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcblxuICAgIHRoYXQuc2xpZGVySGFuZGxlRWxlbWVudCA9IGRvbXV0aWwuZmluZCgnLicgKyBvcHRpb25zLmNzc1ByZWZpeCArICdzbGlkZXItaGFuZGxlJywgY29udGFpbmVyKTtcbiAgICB0aGF0Lmh1ZWJhckhhbmRsZUVsZW1lbnQgPSBkb211dGlsLmZpbmQoJy4nICsgb3B0aW9ucy5jc3NQcmVmaXggKyAnaHVlYmFyLWhhbmRsZScsIGNvbnRhaW5lcik7XG4gICAgdGhhdC5iYXNlQ29sb3JFbGVtZW50ID0gZG9tdXRpbC5maW5kKCcuJyArIG9wdGlvbnMuY3NzUHJlZml4ICsgJ3NsaWRlci1iYXNlY29sb3InLCBjb250YWluZXIpO1xuXG4gICAgcmdiID0gY29sb3J1dGlsLmhleFRvUkdCKGNvbG9yU3RyKTtcbiAgICBoc3YgPSBjb2xvcnV0aWwucmdiVG9IU1YuYXBwbHkobnVsbCwgcmdiKTtcblxuICAgIHRoaXMubW92ZUh1ZShoc3ZbMF0sIHRydWUpXG4gICAgdGhpcy5tb3ZlU2F0dXJhdGlvbkFuZFZhbHVlKGhzdlsxXSwgaHN2WzJdLCB0cnVlKTtcbn07XG5cbi8qKlxuICogTW92ZSBjb2xvcnNsaWRlciBieSBuZXdMZWZ0KFgpLCBuZXdUb3AoWSkgdmFsdWVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbmV3TGVmdCAtIGxlZnQgcGl4ZWwgdmFsdWUgdG8gbW92ZSBoYW5kbGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZXdUb3AgLSB0b3AgcGl4ZWwgdmFsdWUgdG8gbW92ZSBoYW5kbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbGVudD1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIG5vdCBmaXJlIGN1c3RvbSBldmVudFxuICovXG5TbGlkZXIucHJvdG90eXBlLl9tb3ZlQ29sb3JTbGlkZXJIYW5kbGUgPSBmdW5jdGlvbihuZXdMZWZ0LCBuZXdUb3AsIHNpbGVudCkge1xuICAgIHZhciBoYW5kbGUgPSB0aGlzLnNsaWRlckhhbmRsZUVsZW1lbnQsXG4gICAgICAgIGhhbmRsZUNvbG9yO1xuXG4gICAgLy8gQ2hlY2sgcG9zaXRpb24gbGltaXRhdGlvbi5cbiAgICBuZXdUb3AgPSBNYXRoLm1heChDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMF0sIG5ld1RvcCk7XG4gICAgbmV3VG9wID0gTWF0aC5taW4oQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzFdLCBuZXdUb3ApO1xuICAgIG5ld0xlZnQgPSBNYXRoLm1heChDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMF0sIG5ld0xlZnQpO1xuICAgIG5ld0xlZnQgPSBNYXRoLm1pbihDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMV0sIG5ld0xlZnQpO1xuXG4gICAgc3Zndm1sLnNldFRyYW5zbGF0ZVhZKGhhbmRsZSwgbmV3TGVmdCwgbmV3VG9wKTtcblxuICAgIGhhbmRsZUNvbG9yID0gbmV3VG9wID4gNTAgPyAnd2hpdGUnIDogJ2JsYWNrJztcbiAgICBzdmd2bWwuc2V0U3Ryb2tlQ29sb3IoaGFuZGxlLCBoYW5kbGVDb2xvcik7XG5cbiAgICBpZiAoIXNpbGVudCkge1xuICAgICAgICB0aGlzLmZpcmUoJ19zZWxlY3RDb2xvcicsIHtcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcnV0aWwucmdiVG9IRVguYXBwbHkobnVsbCwgdGhpcy5nZXRSR0IoKSlcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBNb3ZlIGNvbG9yc2xpZGVyIGJ5IHN1cHBsaWVkIHNhdHVyYXRpb24gYW5kIHZhbHVlcy5cbiAqXG4gKiBUaGUgbW92ZW1lbnQgb2YgY29sb3Igc2xpZGVyIGhhbmRsZSBmb2xsb3cgSFNWIGN5bGluZGVyIG1vZGVsLiB7QGxpbmsgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSFNMX2FuZF9IU1Z9XG4gKiBAcGFyYW0ge251bWJlcn0gc2F0dXJhdGlvbiAtIHRoZSBwZXJjZW50IG9mIHNhdHVyYXRpb24gKDAlIH4gMTAwJSlcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSBwZXJjZW50IG9mIHNhdHVyYXRpb24gKDAlIH4gMTAwJSlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbGVudD1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIG5vdCBmaXJlIGN1c3RvbSBldmVudFxuICovXG5TbGlkZXIucHJvdG90eXBlLm1vdmVTYXR1cmF0aW9uQW5kVmFsdWUgPSBmdW5jdGlvbihzYXR1cmF0aW9uLCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgdmFyIGFic01pbiwgbWF4VmFsdWUsXG4gICAgICAgIG5ld0xlZnQsIG5ld1RvcDtcblxuICAgIHNhdHVyYXRpb24gPSBzYXR1cmF0aW9uIHx8IDA7XG4gICAgdmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG4gICAgYWJzTWluID0gTWF0aC5hYnMoQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzBdKTtcbiAgICBtYXhWYWx1ZSA9IENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVsxXTtcblxuICAgIC8vIHN1YnRyYWN0IGFic01pbiB2YWx1ZSBiZWNhdXNlIGN1cnJlbnQgY29sb3IgcG9zaXRpb24gaXMgbm90IGxlZnQsIHRvcCBvZiBoYW5kbGUgZWxlbWVudC5cbiAgICAvLyBUaGUgc2F0dXJhdGlvbi4gZnJvbSBsZWZ0IDAgdG8gcmlnaHQgMTAwXG4gICAgbmV3TGVmdCA9ICgoc2F0dXJhdGlvbiAqIG1heFZhbHVlKSAvIDEwMCkgLSBhYnNNaW47XG4gICAgLy8gVGhlIFZhbHVlLiBmcm9tIHRvcCAxMDAgdG8gYm90dG9tIDAuIHRoYXQgd2h5IG5ld1RvcCBzdWJ0cmFjdCBieSBtYXhWYWx1ZS5cbiAgICBuZXdUb3AgPSAobWF4VmFsdWUgLSAoKHZhbHVlICogbWF4VmFsdWUpIC8gMTAwKSkgLSBhYnNNaW47XG5cbiAgICB0aGlzLl9tb3ZlQ29sb3JTbGlkZXJIYW5kbGUobmV3TGVmdCwgbmV3VG9wLCBzaWxlbnQpO1xufTtcblxuLyoqXG4gKiBNb3ZlIGNvbG9yIHNsaWRlciBoYW5kbGUgdG8gc3VwcGxpZWQgcG9zaXRpb25cbiAqXG4gKiBUaGUgbnVtYmVyIG9mIFgsIFkgbXVzdCBiZSByZWxhdGVkIHZhbHVlIGZyb20gY29sb3Igc2xpZGVyIGNvbnRhaW5lclxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gdGhlIHBpeGVsIHZhbHVlIHRvIG1vdmUgaGFuZGxlIFxuICogQHBhcmFtIHtudW1iZXJ9IHkgLSB0aGUgcGl4ZWwgdmFsdWUgdG8gbW92ZSBoYW5kbGVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fbW92ZUNvbG9yU2xpZGVyQnlQb3NpdGlvbiA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB2YXIgb2Zmc2V0ID0gQ09MT1JTTElERVJfUE9TX0xJTUlUX1JBTkdFWzBdO1xuICAgIHRoaXMuX21vdmVDb2xvclNsaWRlckhhbmRsZSh4ICsgb2Zmc2V0LCB5ICsgb2Zmc2V0KTtcbn07XG5cbi8qKlxuICogR2V0IHNhdHVyYXRpb24gYW5kIHZhbHVlIHZhbHVlLlxuICogQHJldHVybnMge251bWJlcltdfSBzYXR1cmF0aW9uIGFuZCB2YWx1ZVxuICovXG5TbGlkZXIucHJvdG90eXBlLmdldFNhdHVyYXRpb25BbmRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhYnNNaW4gPSBNYXRoLmFicyhDT0xPUlNMSURFUl9QT1NfTElNSVRfUkFOR0VbMF0pLFxuICAgICAgICBtYXhWYWx1ZSA9IGFic01pbiArIENPTE9SU0xJREVSX1BPU19MSU1JVF9SQU5HRVsxXSxcbiAgICAgICAgcG9zaXRpb24gPSBzdmd2bWwuZ2V0VHJhbnNsYXRlWFkodGhpcy5zbGlkZXJIYW5kbGVFbGVtZW50KSwgXG4gICAgICAgIHNhdHVyYXRpb24sIHZhbHVlO1xuXG4gICAgc2F0dXJhdGlvbiA9ICgocG9zaXRpb25bMV0gKyBhYnNNaW4pIC8gbWF4VmFsdWUpICogMTAwO1xuICAgIC8vIFRoZSB2YWx1ZSBvZiBIU1YgY29sb3IgbW9kZWwgaXMgaW52ZXJ0ZWQuIHRvcCAxMDAgfiBib3R0b20gMC4gc28gc3VidHJhY3QgYnkgMTAwXG4gICAgdmFsdWUgPSAxMDAgLSAoKChwb3NpdGlvblswXSArIGFic01pbikgLyBtYXhWYWx1ZSkgKiAxMDApO1xuXG4gICAgcmV0dXJuIFtzYXR1cmF0aW9uLCB2YWx1ZV07XG59O1xuXG4vKipcbiAqIE1vdmUgaHVlIGhhbmRsZSBzdXBwbGllZCBwaXhlbCB2YWx1ZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuZXdUb3AgLSBwaXhlbCB0byBtb3ZlIGh1ZSBoYW5kbGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3NpbGVudD1mYWxzZV0gLSBzZXQgdHJ1ZSB0aGVuIG5vdCBmaXJlIGN1c3RvbSBldmVudFxuICovXG5TbGlkZXIucHJvdG90eXBlLl9tb3ZlSHVlSGFuZGxlID0gZnVuY3Rpb24obmV3VG9wLCBzaWxlbnQpIHtcbiAgICB2YXIgaHVlSGFuZGxlRWxlbWVudCA9IHRoaXMuaHVlYmFySGFuZGxlRWxlbWVudCxcbiAgICAgICAgYmFzZUNvbG9yRWxlbWVudCA9IHRoaXMuYmFzZUNvbG9yRWxlbWVudCxcbiAgICAgICAgbmV3R3JhZGllbnRDb2xvcixcbiAgICAgICAgaGV4U3RyO1xuXG4gICAgbmV3VG9wID0gTWF0aC5tYXgoSFVFQkFSX1BPU19MSU1JVF9SQU5HRVswXSwgbmV3VG9wKTtcbiAgICBuZXdUb3AgPSBNYXRoLm1pbihIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzFdLCBuZXdUb3ApO1xuXG4gICAgc3Zndm1sLnNldFRyYW5zbGF0ZVkoaHVlSGFuZGxlRWxlbWVudCwgbmV3VG9wKTtcblxuICAgIG5ld0dyYWRpZW50Q29sb3IgPSBjb2xvcnV0aWwuaHN2VG9SR0IodGhpcy5nZXRIdWUoKSwgMTAwLCAxMDApO1xuICAgIGhleFN0ciA9IGNvbG9ydXRpbC5yZ2JUb0hFWC5hcHBseShudWxsLCBuZXdHcmFkaWVudENvbG9yKTtcblxuICAgIHN2Z3ZtbC5zZXRHcmFkaWVudENvbG9yU3RvcChiYXNlQ29sb3JFbGVtZW50LCBoZXhTdHIpO1xuXG4gICAgaWYgKCFzaWxlbnQpIHtcbiAgICAgICAgdGhpcy5maXJlKCdfc2VsZWN0Q29sb3InLCB7XG4gICAgICAgICAgICBjb2xvcjogY29sb3J1dGlsLnJnYlRvSEVYLmFwcGx5KG51bGwsIHRoaXMuZ2V0UkdCKCkpIFxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG4vKipcbiAqIE1vdmUgaHVlIGJhciBoYW5kbGUgYnkgc3VwcGxpZWQgZGVncmVlXG4gKiBAcGFyYW0ge251bWJlcn0gZGVncmVlIC0gKDAgfiAzNTkuOSBkZWdyZWUpXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtzaWxlbnQ9ZmFsc2VdIC0gc2V0IHRydWUgdGhlbiBub3QgZmlyZSBjdXN0b20gZXZlbnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5tb3ZlSHVlID0gZnVuY3Rpb24oZGVncmVlLCBzaWxlbnQpIHtcbiAgICB2YXIgbmV3VG9wID0gMCxcbiAgICAgICAgYWJzTWluLCBtYXhWYWx1ZTtcblxuICAgIGFic01pbiA9IE1hdGguYWJzKEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMF0pO1xuICAgIG1heFZhbHVlID0gYWJzTWluICsgSFVFQkFSX1BPU19MSU1JVF9SQU5HRVsxXTtcblxuICAgIGRlZ3JlZSA9IGRlZ3JlZSB8fCAwO1xuICAgIG5ld1RvcCA9ICgobWF4VmFsdWUgKiBkZWdyZWUpIC8gSFVFX1dIRUVMX01BWCkgLSBhYnNNaW47XG5cbiAgICB0aGlzLl9tb3ZlSHVlSGFuZGxlKG5ld1RvcCwgc2lsZW50KTtcbn07XG5cbi8qKlxuICogTW92ZSBodWUgYmFyIGhhbmRsZSBieSBzdXBwbGllZCBwZXJjZW50XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHkgLSBwaXhlbCB2YWx1ZSB0byBtb3ZlIGh1ZSBoYW5kbGVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fbW92ZUh1ZUJ5UG9zaXRpb24gPSBmdW5jdGlvbih5KSB7XG4gICAgdmFyIG9mZnNldCA9IEhVRUJBUl9QT1NfTElNSVRfUkFOR0VbMF07XG5cbiAgICB0aGlzLl9tb3ZlSHVlSGFuZGxlKHkgKyBvZmZzZXQpO1xufTtcblxuLyoqXG4gKiBHZXQgaHVlYmFyIGhhbmRsZSBwb3NpdGlvbiBieSBjb2xvciBkZWdyZWVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IGRlZ3JlZSAoMCB+IDM1OS45IGRlZ3JlZSlcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nZXRIdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGFuZGxlID0gdGhpcy5odWViYXJIYW5kbGVFbGVtZW50LFxuICAgICAgICBwb3NpdGlvbiA9IHN2Z3ZtbC5nZXRUcmFuc2xhdGVYWShoYW5kbGUpLFxuICAgICAgICBhYnNNaW4sIG1heFZhbHVlO1xuXG4gICAgYWJzTWluID0gTWF0aC5hYnMoSFVFQkFSX1BPU19MSU1JVF9SQU5HRVswXSk7XG4gICAgbWF4VmFsdWUgPSBhYnNNaW4gKyBIVUVCQVJfUE9TX0xJTUlUX1JBTkdFWzFdO1xuXG4gICAgLy8gbWF4VmFsdWUgOiAzNTkuOTkgPSBwb3MueSA6IHhcbiAgICByZXR1cm4gKChwb3NpdGlvblswXSArIGFic01pbikgKiBIVUVfV0hFRUxfTUFYKSAvIG1heFZhbHVlO1xufTtcblxuLyoqXG4gKiBHZXQgSFNWIHZhbHVlIGZyb20gc2xpZGVyXG4gKiBAcmV0dXJucyB7bnVtYmVyW119IGhzdiB2YWx1ZXNcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nZXRIU1YgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3YgPSB0aGlzLmdldFNhdHVyYXRpb25BbmRWYWx1ZSgpLFxuICAgICAgICBoID0gdGhpcy5nZXRIdWUoKTtcblxuICAgIHJldHVybiBbaF0uY29uY2F0KHN2KTtcbn07XG5cbi8qKlxuICogR2V0IFJHQiB2YWx1ZSBmcm9tIHNsaWRlclxuICogQHJldHVybnMge251bWJlcltdfSBSR0IgdmFsdWVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nZXRSR0IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29sb3J1dGlsLmhzdlRvUkdCLmFwcGx5KG51bGwsIHRoaXMuZ2V0SFNWKCkpO1xufTtcblxuLyoqKioqKioqKipcbiAqIERyYWcgZXZlbnQgaGFuZGxlclxuICoqKioqKioqKiovXG5cbi8qKlxuICogQ2FjaGUgaW1tdXRhYmxlIGRhdGEgd2hlbiBkcmFnZ2luZyBvciBjbGljayB2aWV3XG4gKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBDbGljaywgRHJhZ1N0YXJ0IGV2ZW50LlxuICogQHJldHVybnMge29iamVjdH0gY2FjaGVkIGRhdGEuXG4gKi9cblNsaWRlci5wcm90b3R5cGUuX3ByZXBhcmVDb2xvclNsaWRlckZvck1vdXNlRXZlbnQgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBzbGlkZXJQYXJ0ID0gZG9tdXRpbC5jbG9zZXN0KGV2ZW50LnRhcmdldCwgJy4nICsgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2xpZGVyLXBhcnQnKSxcbiAgICAgICAgY2FjaGU7XG5cbiAgICBjYWNoZSA9IHRoaXMuX2RyYWdEYXRhQ2FjaGUgPSB7XG4gICAgICAgIGlzQ29sb3JTbGlkZXI6IGRvbXV0aWwuaGFzQ2xhc3Moc2xpZGVyUGFydCwgb3B0aW9ucy5jc3NQcmVmaXggKyAnc2xpZGVyLWxlZnQnKSxcbiAgICAgICAgcGFyZW50RWxlbWVudDogc2xpZGVyUGFydFxuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIGNhY2hlO1xufTtcblxuLyoqXG4gKiBDbGljayBldmVudCBoYW5kbGVyXG4gKiBAcGFyYW0ge29iamVjdH0gY2xpY2tFdmVudCAtIENsaWNrIGV2ZW50IGZyb20gRHJhZyBtb2R1bGVcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5fb25DbGljayA9IGZ1bmN0aW9uKGNsaWNrRXZlbnQpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLl9wcmVwYXJlQ29sb3JTbGlkZXJGb3JNb3VzZUV2ZW50KGNsaWNrRXZlbnQpLFxuICAgICAgICBtb3VzZVBvcyA9IGRvbWV2ZW50LmdldE1vdXNlUG9zaXRpb24oY2xpY2tFdmVudC5vcmlnaW5FdmVudCwgY2FjaGUucGFyZW50RWxlbWVudCk7XG5cbiAgICBpZiAoY2FjaGUuaXNDb2xvclNsaWRlcikge1xuICAgICAgICB0aGlzLl9tb3ZlQ29sb3JTbGlkZXJCeVBvc2l0aW9uKG1vdXNlUG9zWzBdLCBtb3VzZVBvc1sxXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbW92ZUh1ZUJ5UG9zaXRpb24obW91c2VQb3NbMV0pO1xuICAgIH1cblxuICAgIHRoaXMuX2RyYWdEYXRhQ2FjaGUgPSBudWxsO1xufTtcblxuLyoqXG4gKiBEcmFnU3RhcnQgZXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtvYmplY3R9IGRyYWdTdGFydEV2ZW50IC0gZHJhZ1N0YXJ0IGV2ZW50IGRhdGEgZnJvbSBEcmFnI2RyYWdTdGFydFxuICovXG5TbGlkZXIucHJvdG90eXBlLl9vbkRyYWdTdGFydCA9IGZ1bmN0aW9uKGRyYWdTdGFydEV2ZW50KSB7XG4gICAgdGhpcy5fcHJlcGFyZUNvbG9yU2xpZGVyRm9yTW91c2VFdmVudChkcmFnU3RhcnRFdmVudCk7XG59O1xuXG4vKipcbiAqIERyYWcgZXZlbnQgaGFuZGxlclxuICogQHBhcmFtIHtEcmFnI2RyYWd9IGRyYWdFdmVudCAtIGRyYWcgZXZlbnQgZGF0YVxuICovXG5TbGlkZXIucHJvdG90eXBlLl9vbkRyYWcgPSBmdW5jdGlvbihkcmFnRXZlbnQpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLl9kcmFnRGF0YUNhY2hlLFxuICAgICAgICBtb3VzZVBvcyA9IGRvbWV2ZW50LmdldE1vdXNlUG9zaXRpb24oZHJhZ0V2ZW50Lm9yaWdpbkV2ZW50LCBjYWNoZS5wYXJlbnRFbGVtZW50KTtcblxuICAgIGlmIChjYWNoZS5pc0NvbG9yU2xpZGVyKSB7XG4gICAgICAgIHRoaXMuX21vdmVDb2xvclNsaWRlckJ5UG9zaXRpb24obW91c2VQb3NbMF0sIG1vdXNlUG9zWzFdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tb3ZlSHVlQnlQb3NpdGlvbihtb3VzZVBvc1sxXSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBEcmFnI2RyYWdFbmQgZXZlbnQgaGFuZGxlclxuICovXG5TbGlkZXIucHJvdG90eXBlLl9vbkRyYWdFbmQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kcmFnRGF0YUNhY2hlID0gbnVsbDtcbn07XG5cbnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKFNsaWRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gU2xpZGVyO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgbW9kdWxlIGZvciBtYW5pcHVsYXRlIFNWRyBvciBWTUwgb2JqZWN0XG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IGdsb2JhbC50dWkudXRpbDtcbnZhciBQQVJTRV9UUkFOU0xBVEVfTlVNX1JFR0VYID0gL1tcXC5cXC0wLTldKy9nO1xudmFyIFNWR19IVUVfSEFORExFX1JJR0hUX1BPUyA9IC02O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xudmFyIHN2Z3ZtbCA9IHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdHJ1ZSB3aGVuIGJyb3dzZXIgaXMgYmVsb3cgSUU4LlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBpcyBvbGQgYnJvd3Nlcj9cbiAgICAgKi9cbiAgICBpc09sZEJyb3dzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX2lzT2xkQnJvd3NlciA9IHN2Z3ZtbC5faXNPbGRCcm93c2VyO1xuXG4gICAgICAgIGlmICghdXRpbC5pc0V4aXN0eShfaXNPbGRCcm93c2VyKSkge1xuICAgICAgICAgICAgc3Zndm1sLl9pc09sZEJyb3dzZXIgPSBfaXNPbGRCcm93c2VyID0gdXRpbC5icm93c2VyLm1zaWUgJiYgdXRpbC5icm93c2VyLnZlcnNpb24gPCA5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9pc09sZEJyb3dzZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB0cmFuc2xhdGUgdHJhbnNmb3JtIHZhbHVlXG4gICAgICogQHBhcmFtIHtTVkd8Vk1MfSBvYmogLSBzdmcgb3Igdm1sIG9iamVjdCB0aGF0IHdhbnQgdG8ga25vdyB0cmFuc2xhdGUgeCwgeVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gdHJhbnNsYXRlZCBjb29yZGluYXRlcyBbeCwgeV1cbiAgICAgKi9cbiAgICBnZXRUcmFuc2xhdGVYWTogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgIHZhciB0ZW1wO1xuXG4gICAgICAgIGlmIChzdmd2bWwuaXNPbGRCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIHRlbXAgPSBvYmouc3R5bGU7XG4gICAgICAgICAgICByZXR1cm4gW3BhcnNlRmxvYXQodGVtcC50b3ApLCBwYXJzZUZsb2F0KHRlbXAubGVmdCldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGVtcCA9IG9iai5nZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScpO1xuXG4gICAgICAgIGlmICghdGVtcCkge1xuICAgICAgICAgICAgcmV0dXJuIFswLCAwXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGVtcCA9IHRlbXAubWF0Y2goUEFSU0VfVFJBTlNMQVRFX05VTV9SRUdFWCk7XG5cbiAgICAgICAgLy8gbmVlZCBjYXV0aW9uIGZvciBkaWZmZXJlbmNlIG9mIFZNTCwgU1ZHIGNvb3JkaW5hdGVzIHN5c3RlbS5cbiAgICAgICAgLy8gdHJhbnNsYXRlIGNvbW1hbmQgbmVlZCBYIGNvb3JkcyBpbiBmaXJzdCBwYXJhbWV0ZXIuIGJ1dCBWTUwgaXMgdXNlIENTUyBjb29yZGluYXRlIHN5c3RlbSh0b3AsIGxlZnQpXG4gICAgICAgIHJldHVybiBbcGFyc2VGbG9hdCh0ZW1wWzFdKSwgcGFyc2VGbG9hdCh0ZW1wWzBdKV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCB0cmFuc2xhdGUgdHJhbnNmb3JtIHZhbHVlXG4gICAgICogQHBhcmFtIHtTVkd8Vk1MfSBvYmogLSBTVkcgb3IgVk1MIG9iamVjdCB0byBzZXR0aW5nIHRyYW5zbGF0ZSB0cmFuc2Zvcm0uXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSB0cmFuc2xhdGUgWCB2YWx1ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gdHJhbnNsYXRlIFkgdmFsdWVcbiAgICAgKi9cbiAgICBzZXRUcmFuc2xhdGVYWTogZnVuY3Rpb24ob2JqLCB4LCB5KSB7XG4gICAgICAgIGlmIChzdmd2bWwuaXNPbGRCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIG9iai5zdHlsZS5sZWZ0ID0geCArICdweCc7XG4gICAgICAgICAgICBvYmouc3R5bGUudG9wID0geSArICdweCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4ICsgJywnICsgeSArICcpJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHRyYW5zbGF0ZSBvbmx5IFkgdmFsdWVcbiAgICAgKiBAcGFyYW0ge1NWR3xWTUx9IG9iaiAtIFNWRyBvciBWTUwgb2JqZWN0IHRvIHNldHRpbmcgdHJhbnNsYXRlIHRyYW5zZm9ybS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIHRyYW5zbGF0ZSBZIHZhbHVlXG4gICAgICovXG4gICAgc2V0VHJhbnNsYXRlWTogZnVuY3Rpb24ob2JqLCB5KSB7XG4gICAgICAgIGlmIChzdmd2bWwuaXNPbGRCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIG9iai5zdHlsZS50b3AgPSB5ICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIFNWR19IVUVfSEFORExFX1JJR0hUX1BPUyArICcsJyArIHkgKyAnKScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBzdHJva2UgY29sb3IgdG8gU1ZHIG9yIFZNTCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge1NWR3xWTUx9IG9iaiAtIFNWRyBvciBWTUwgb2JqZWN0IHRvIHNldHRpbmcgc3Ryb2tlIGNvbG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yU3RyIC0gY29sb3Igc3RyaW5nXG4gICAgICovXG4gICAgc2V0U3Ryb2tlQ29sb3I6IGZ1bmN0aW9uKG9iaiwgY29sb3JTdHIpIHtcbiAgICAgICAgaWYgKHN2Z3ZtbC5pc09sZEJyb3dzZXIoKSkge1xuICAgICAgICAgICAgb2JqLnN0cm9rZWNvbG9yID0gY29sb3JTdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouc2V0QXR0cmlidXRlKCdzdHJva2UnLCBjb2xvclN0cik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGdyYWRpZW50IHN0b3AgY29sb3IgdG8gU1ZHLCBWTUwgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U1ZHfFZNTH0gb2JqIC0gU1ZHLCBWTUwgb2JqZWN0IHRvIGFwcGx5aW5nIGdyYWRpZW50IHN0b3AgY29sb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29sb3JTdHIgLSBjb2xvciBzdHJpbmdcbiAgICAgKi9cbiAgICBzZXRHcmFkaWVudENvbG9yU3RvcDogZnVuY3Rpb24ob2JqLCBjb2xvclN0cikge1xuICAgICAgICBpZiAoc3Zndm1sLmlzT2xkQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBvYmouY29sb3IgPSBjb2xvclN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9iai5zZXRBdHRyaWJ1dGUoJ3N0b3AtY29sb3InLCBjb2xvclN0cik7XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3Zndm1sO1xuXG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUGFsZXR0ZSB2aWV3IHRlbXBsYXRlXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIERldmVsb3BtZW50IFRlYW0gPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbGF5b3V0ID0gW1xuJzx1bCBjbGFzcz1cInt7Y3NzUHJlZml4fX1jbGVhcmZpeFwiPnt7Y29sb3JMaXN0fX08L3VsPicsXG4nPGRpdiBjbGFzcz1cInt7Y3NzUHJlZml4fX1jbGVhcmZpeFwiIHN0eWxlPVwib3ZlcmZsb3c6aGlkZGVuXCI+JyxcbiAgICAnPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInt7Y3NzUHJlZml4fX1wYWxldHRlLXRvZ2dsZS1zbGlkZXJcIiB2YWx1ZT1cInt7ZGV0YWlsVHh0fX1cIiAvPicsXG4gICAgJzxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXBhbGV0dGUtaGV4XCIgdmFsdWU9XCJ7e2NvbG9yfX1cIiBtYXhsZW5ndGg9XCI3XCIgLz4nLFxuICAgICc8c3BhbiBjbGFzcz1cInt7Y3NzUHJlZml4fX1wYWxldHRlLXByZXZpZXdcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6e3tjb2xvcn19O2NvbG9yOnt7Y29sb3J9fVwiPnt7Y29sb3J9fTwvc3Bhbj4nLFxuJzwvZGl2PiddLmpvaW4oJ1xcbicpO1xuXG52YXIgaXRlbSA9ICc8bGk+PGlucHV0IGNsYXNzPVwie3tjc3NQcmVmaXh9fXBhbGV0dGUtYnV0dG9ue3tzZWxlY3RlZH19XCIgdHlwZT1cImJ1dHRvblwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjp7e2NvbG9yfX07Y29sb3I6e3tjb2xvcn19XCIgdGl0bGU9XCJ7e2NvbG9yfX1cIiB2YWx1ZT1cInt7Y29sb3J9fVwiIC8+PC9saT4nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBsYXlvdXQ6IGxheW91dCxcbiAgICBpdGVtOiBpdGVtXG59O1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFNsaWRlciB0ZW1wbGF0ZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBEZXZlbG9wbWVudCBUZWFtIDxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWwgPSBnbG9iYWwudHVpLnV0aWw7XG5cbnZhciBsYXlvdXQgPSBbXG4nPGRpdiBjbGFzcz1cInt7Y3NzUHJlZml4fX1zbGlkZXItbGVmdCB7e2Nzc1ByZWZpeH19c2xpZGVyLXBhcnRcIj57e3NsaWRlcn19PC9kaXY+Jyxcbic8ZGl2IGNsYXNzPVwie3tjc3NQcmVmaXh9fXNsaWRlci1yaWdodCB7e2Nzc1ByZWZpeH19c2xpZGVyLXBhcnRcIj57e2h1ZWJhcn19PC9kaXY+J1xuXS5qb2luKCdcXG4nKTtcblxudmFyIFNWR1NsaWRlciA9IFsnPHN2ZyBjbGFzcz1cInt7Y3NzUHJlZml4fX1zdmcge3tjc3NQcmVmaXh9fXN2Zy1zbGlkZXJcIj4nLFxuICAgICc8ZGVmcz4nLFxuICAgICAgICAnPGxpbmVhckdyYWRpZW50IGlkPVwie3tjc3NQcmVmaXh9fXN2Zy1maWxsLWNvbG9yXCIgeDE9XCIwJVwiIHkxPVwiMCVcIiB4Mj1cIjEwMCVcIiB5Mj1cIjAlXCI+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDI1NSwyNTUpXCIgLz4nLFxuICAgICAgICAgICAgJzxzdG9wIGNsYXNzPVwie3tjc3NQcmVmaXh9fXNsaWRlci1iYXNlY29sb3JcIiBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMCwwKVwiIC8+JyxcbiAgICAgICAgJzwvbGluZWFyR3JhZGllbnQ+JyxcbiAgICAgICAgJzxsaW5lYXJHcmFkaWVudCBpZD1cInt7Y3NzUHJlZml4fX1zdm4tZmlsbC1ibGFja1wiIHgxPVwiMCVcIiB5MT1cIjAlXCIgeDI9XCIwJVwiIHkyPVwiMTAwJVwiPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMCVcIiBzdHlsZT1cInN0b3AtY29sb3I6cmdiKDAsMCwwKTtzdG9wLW9wYWNpdHk6MFwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3R5bGU9XCJzdG9wLWNvbG9yOnJnYigwLDAsMCk7c3RvcC1vcGFjaXR5OjFcIiAvPicsXG4gICAgICAgICc8L2xpbmVhckdyYWRpZW50PicsXG4gICAgJzwvZGVmcz4nLFxuICAgICc8cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cInVybCgje3tjc3NQcmVmaXh9fXN2Zy1maWxsLWNvbG9yKVwiPjwvcmVjdD4nLFxuICAgICc8cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cInVybCgje3tjc3NQcmVmaXh9fXN2bi1maWxsLWJsYWNrKVwiPjwvcmVjdD4nLFxuICAgICc8cGF0aCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMCwwKVwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXNsaWRlci1oYW5kbGVcIiBkPVwiTTAgNy41IEwxNSA3LjUgTTcuNSAxNSBMNy41IDAgTTIgNyBhNS41IDUuNSAwIDEgMSAwIDEgWlwiIHN0cm9rZT1cImJsYWNrXCIgc3Ryb2tlLXdpZHRoPVwiMC43NVwiIGZpbGw9XCJub25lXCIgLz4nLFxuJzwvc3ZnPiddLmpvaW4oJ1xcbicpO1xuXG52YXIgVk1MU2xpZGVyID0gWyc8ZGl2IGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbC1zbGlkZXJcIj4nLFxuICAgICc8djpyZWN0IHN0cm9rZWNvbG9yPVwibm9uZVwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19dm1sLXNsaWRlci1iZ1wiPicsXG4gICAgICAnPHY6ZmlsbCBjbGFzcz1cInt7Y3NzUHJlZml4fX12bWwge3tjc3NQcmVmaXh9fXNsaWRlci1iYXNlY29sb3JcIiB0eXBlPVwiZ3JhZGllbnRcIiBtZXRob2Q9XCJub25lXCIgY29sb3I9XCIjZmYwMDAwXCIgY29sb3IyPVwiI2ZmZlwiIGFuZ2xlPVwiOTBcIiAvPicsXG4gICAgJzwvdjpyZWN0PicsXG4gICAgJzx2OnJlY3Qgc3Ryb2tlY29sb3I9XCIjY2NjXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX12bWwtc2xpZGVyLWJnXCI+JyxcbiAgICAgICAgJzx2OmZpbGwgdHlwZT1cImdyYWRpZW50XCIgbWV0aG9kPVwibm9uZVwiIGNvbG9yPVwiYmxhY2tcIiBjb2xvcjI9XCJ3aGl0ZVwiIG86b3BhY2l0eTI9XCIwJVwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbFwiIC8+JyxcbiAgICAnPC92OnJlY3Q+JyxcbiAgICAnPHY6c2hhcGUgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX1zbGlkZXItaGFuZGxlXCIgY29vcmRzaXplPVwiMSAxXCIgc3R5bGU9XCJ3aWR0aDoxcHg7aGVpZ2h0OjFweDtcIicgK1xuICAgICAgICAncGF0aD1cIm0gMCw3IGwgMTQsNyBtIDcsMTQgbCA3LDAgYXIgMTIsMTIgMiwyIHpcIiBmaWxsZWQ9XCJmYWxzZVwiIHN0cm9rZWQ9XCJ0cnVlXCIgLz4nLFxuJzwvZGl2PiddLmpvaW4oJ1xcbicpO1xuXG52YXIgU1ZHSHVlYmFyID0gWyc8c3ZnIGNsYXNzPVwie3tjc3NQcmVmaXh9fXN2ZyB7e2Nzc1ByZWZpeH19c3ZnLWh1ZWJhclwiPicsXG4gICAgJzxkZWZzPicsXG4gICAgICAgICc8bGluZWFyR3JhZGllbnQgaWQ9XCJnXCIgeDE9XCIwJVwiIHkxPVwiMCVcIiB4Mj1cIjAlXCIgeTI9XCIxMDAlXCI+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDAsMClcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiMTYuNjY2JVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDI1NSwwKVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIzMy4zMzMlXCIgc3RvcC1jb2xvcj1cInJnYigwLDI1NSwwKVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCI1MCVcIiBzdG9wLWNvbG9yPVwicmdiKDAsMjU1LDI1NSlcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiNjYuNjY2JVwiIHN0b3AtY29sb3I9XCJyZ2IoMCwwLDI1NSlcIiAvPicsXG4gICAgICAgICAgICAnPHN0b3Agb2Zmc2V0PVwiODMuMzMzJVwiIHN0b3AtY29sb3I9XCJyZ2IoMjU1LDAsMjU1KVwiIC8+JyxcbiAgICAgICAgICAgICc8c3RvcCBvZmZzZXQ9XCIxMDAlXCIgc3RvcC1jb2xvcj1cInJnYigyNTUsMCwwKVwiIC8+JyxcbiAgICAgICAgJzwvbGluZWFyR3JhZGllbnQ+JyxcbiAgICAnPC9kZWZzPicsXG4gICAgJzxyZWN0IHdpZHRoPVwiMThweFwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwidXJsKCNnKVwiPjwvcmVjdD4nLFxuICAgICc8cGF0aCB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoLTYsLTMpXCIgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19aHVlYmFyLWhhbmRsZVwiIGQ9XCJNMCAwIEw0IDQgTDAgOCBMMCAwIFpcIiBmaWxsPVwiYmxhY2tcIiBzdHJva2U9XCJub25lXCIgLz4nLFxuJzwvc3ZnPiddLmpvaW4oJ1xcbicpO1xuXG52YXIgVk1MSHVlYmFyID0gWyc8ZGl2IGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbC1odWViYXJcIj4nLFxuICAgICc8djpyZWN0IHN0cm9rZWNvbG9yPVwiI2NjY1wiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbCB7e2Nzc1ByZWZpeH19dm1sLWh1ZWJhci1iZ1wiPicsXG4gICAgICAgICc8djpmaWxsIHR5cGU9XCJncmFkaWVudFwiIG1ldGhvZD1cIm5vbmVcIiBjb2xvcnM9XCInICtcbiAgICAgICAgJzAlIHJnYigyNTUsMCwwKSwgMTYuNjY2JSByZ2IoMjU1LDI1NSwwKSwgMzMuMzMzJSByZ2IoMCwyNTUsMCksIDUwJSByZ2IoMCwyNTUsMjU1KSwgNjYuNjY2JSByZ2IoMCwwLDI1NSksIDgzLjMzMyUgcmdiKDI1NSwwLDI1NSksIDEwMCUgcmdiKDI1NSwwLDApJyArXG4gICAgICAgICdcIiBhbmdsZT1cIjE4MFwiIGNsYXNzPVwie3tjc3NQcmVmaXh9fXZtbFwiIC8+JyxcbiAgICAnPC92OnJlY3Q+JyxcbiAgICAnPHY6c2hhcGUgY2xhc3M9XCJ7e2Nzc1ByZWZpeH19dm1sIHt7Y3NzUHJlZml4fX1odWViYXItaGFuZGxlXCIgY29vcmRzaXplPVwiMSAxXCIgc3R5bGU9XCJ3aWR0aDoxcHg7aGVpZ2h0OjFweDtwb3NpdGlvbjphYnNvbHV0ZTt6LWluZGV4OjE7cmlnaHQ6MjJweDt0b3A6LTNweDtcIicgKyBcbiAgICAgICAgJ3BhdGg9XCJtIDAsMCBsIDQsNCBsIDAsOCBsIDAsMCB6XCIgZmlsbGVkPVwidHJ1ZVwiIGZpbGxjb2xvcj1cImJsYWNrXCIgc3Ryb2tlZD1cImZhbHNlXCIgLz4nLFxuJzwvZGl2PiddLmpvaW4oJ1xcbicpO1xuXG52YXIgaXNPbGRCcm93c2VyID0gdXRpbC5icm93c2VyLm1zaWUgJiYgKHV0aWwuYnJvd3Nlci52ZXJzaW9uIDwgOSk7XG5cbmlmIChpc09sZEJyb3dzZXIpIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQubmFtZXNwYWNlcy5hZGQoJ3YnLCAndXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp2bWwnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbGF5b3V0OiBsYXlvdXQsXG4gICAgc2xpZGVyOiBpc09sZEJyb3dzZXIgPyBWTUxTbGlkZXIgOiBTVkdTbGlkZXIsXG4gICAgaHVlYmFyOiBpc09sZEJyb3dzZXIgPyBWTUxIdWViYXIgOiBTVkdIdWViYXJcbn07XG4iXX0=
