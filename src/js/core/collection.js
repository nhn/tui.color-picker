/**
 * @fileoverview Common collections.
 */

'use strict';

var forEachArray = require('tui-code-snippet/collection/forEachArray');
var forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties');
var extend = require('tui-code-snippet/object/extend');
var isArray = require('tui-code-snippet/type/isArray');
var isExisty = require('tui-code-snippet/type/isExisty');
var isFunction = require('tui-code-snippet/type/isFunction');
var isObject = require('tui-code-snippet/type/isObject');
var util = require('../util');

var slice = Array.prototype.slice;

/**
 * Common collection.
 *
 * It need function for get model's unique id.
 *
 * if the function is not supplied then it use default function {@link Collection#getItemID}
 * @constructor
 * @param {function} [getItemIDFn] function for get model's id.
 * @ignore
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

  if (isFunction(getItemIDFn)) {
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

  filters = slice.call(arguments);
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

  filters = slice.call(arguments);
  cnt = filters.length;

  return function(item) {
    var i = 1;
    var result = filters[0].call(null, item);

    for (; i < cnt; i += 1) {
      result = result || filters[i].call(null, item);
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
Collection.merge = function(firstCollection) {
  var newItems = {};
  var merged = new Collection(firstCollection.getItemID);

  forEachArray(arguments, function(col) {
    extend(newItems, col.items);
  });

  merged.items = newItems;
  merged.length = util.getLength(merged.items);

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
  var id, ownItems;

  if (arguments.length > 1) {
    forEachArray(
      slice.call(arguments),
      function(o) {
        this.add(o);
      },
      this
    );

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
  var removed = [];
  var ownItems, itemToRemove;

  if (!this.length) {
    return removed;
  }

  if (arguments.length > 1) {
    removed = util.map(
      slice.call(arguments),
      function(id) {
        return this.remove(id);
      },
      this
    );

    return removed;
  }

  ownItems = this.items;

  if (isObject(id)) {
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
  var isFilter, has;

  if (!this.length) {
    return false;
  }

  isFilter = isFunction(id);
  has = false;

  if (isFilter) {
    this.each(function(item) {
      if (id(item) === true) {
        has = true;

        return false;
      }

      return true;
    });
  } else {
    id = isObject(id) ? this.getItemID(id) : id;
    has = isExisty(this.items[id]);
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

  if (!isExisty(item)) {
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
  var result = {};
  var keyIsFunc = isFunction(key);
  var getItemIDFn = this.getItemID;
  var collection, baseValue;

  if (isArray(key)) {
    forEachArray(key, function(k) {
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

      if (isFunction(baseValue)) {
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

  if (isFunction(compareFunction)) {
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
  forEachOwnProperties(this.items, iteratee, context || this);
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
