/**
 * @fileoverview module for manipulate SVG or VML object
 */

'use strict';

var isOldBrowser = require('./util').isOldBrowser;

var PARSE_TRANSLATE_NUM_REGEX = /[\.\-0-9]+/g;
var SVG_HUE_HANDLE_RIGHT_POS = -6;

/* istanbul ignore next */
var svgvml = {
  /**
   * Get translate transform value
   * @param {SVG|VML} obj - svg or vml object that want to know translate x, y
   * @returns {number[]} translated coordinates [x, y]
   */
  getTranslateXY: function(obj) {
    var temp;

    if (isOldBrowser) {
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
    if (isOldBrowser) {
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
    if (isOldBrowser) {
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
    if (isOldBrowser) {
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
    if (isOldBrowser) {
      obj.color = colorStr;
    } else {
      obj.setAttribute('stop-color', colorStr);
    }
  }
};

module.exports = svgvml;
