/**
 * @fileoverview Utils for ColorPicker component
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */

'use strict';

var browser = require('tui-code-snippet/browser/browser');
var forEach = require('tui-code-snippet/collection/forEach');
var forEachArray = require('tui-code-snippet/collection/forEachArray');
var forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties');
var sendHostname = require('tui-code-snippet/request/sendHostname');

var currentId = 0;

/**
 * Utils
 * @namespace util
 * @ignore
 */
var utils = {
  /**
   * Get the number of properties in the object.
   * @param {Object} obj - object
   * @returns {number}
   */
  getLength: function(obj) {
    var length = 0;

    forEachOwnProperties(obj, function() {
      length += 1;
    });

    return length;
  },

  /**
   * Constructs a new array by executing the provided callback function.
   * @param {Object|Array} obj - object or array to be traversed
   * @param {function} iteratee - callback function
   * @param {Object} context - context of callback function
   * @returns {Array}
   */
  map: function(obj, iteratee, context) {
    var result = [];

    forEach(obj, function() {
      result.push(iteratee.apply(context || null, arguments));
    });

    return result;
  },

  /**
   * Construct a new array with elements that pass the test by the provided callback function.
   * @param {Array|NodeList|Arguments} arr - array to be traversed
   * @param {function} iteratee - callback function
   * @param {Object} context - context of callback function
   * @returns {Array}
   */
  filter: function(arr, iteratee, context) {
    var result = [];

    forEachArray(arr, function(elem) {
      if (iteratee.apply(context || null, arguments)) {
        result.push(elem);
      }
    });

    return result;
  },

  /**
   * Create an unique id for a color-picker instance.
   * @returns {number}
   */
  generateId: function() {
    currentId += 1;

    return currentId;
  },

  /**
   * True when browser is below IE8.
   */
  isOldBrowser: (function() {
    return browser.msie && browser.version < 9;
  })(),

  /**
   * send host name
   * @ignore
   */
  sendHostName: function() {
    sendHostname('color-picker', 'UA-129987462-1');
  }
};

module.exports = utils;
