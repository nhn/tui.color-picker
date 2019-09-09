/**
 * @fileoverview Utility methods to manipulate colors
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
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

    for (; i < length - 1; i += 1) {
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
   * @returns {number[]} rgb numbers
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
    var hexStr =
      '#' +
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
   * @returns {number[]} hsv value
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
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        // no default
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
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
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      default:
        r = v;
        g = p;
        b = q;
        break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
};

module.exports = colorutil;
