/**
 * @fileoverview Utility modules for manipulate DOM elements.
 */

'use strict';

var domUtil = {
  /**
   * Create DOM element and return it.
   * @param {string} tagName Tag name to append.
   * @param {HTMLElement} [container] HTML element will be parent to created element.
   * if not supplied, will use **document.body**
   * @param {string} [className] Design class names to appling created element.
   * @returns {HTMLElement} HTML element created.
   */
  appendHTMLElement: function(tagName, container, className) {
    var el = document.createElement(tagName);
    el.className = className || '';

    if (container) {
      container.appendChild(el);
    } else {
      document.body.appendChild(el);
    }

    return el;
  }
};

module.exports = domUtil;
