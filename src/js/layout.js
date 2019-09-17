/**
 * @fileoverview ColorPicker layout module
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var util = require('tui-code-snippet');
var domutil = require('./core/domutil');
var View = require('./core/view');

/**
 * @constructor
 * @extends {View}
 * @param {object} options - option object
 *  @param {string} options.cssPrefix - css prefix for each child elements
 * @param {HTMLDivElement} container - container
 * @ignore
 */
function Layout(options, container) {
  /**
   * option object
   * @type {object}
   */
  this.options = util.extend(
    {
      cssPrefix: 'tui-colorpicker-'
    },
    options
  );

  container = domutil.appendHTMLElement('div', container, this.options.cssPrefix + 'container');

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
