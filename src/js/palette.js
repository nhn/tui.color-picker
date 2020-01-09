/**
 * @fileoverview Color palette view
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var getTarget = require('tui-code-snippet/domEvent/getTarget');
var off = require('tui-code-snippet/domEvent/off');
var on = require('tui-code-snippet/domEvent/on');
var hasClass = require('tui-code-snippet/domUtil/hasClass');
var extend = require('tui-code-snippet/object/extend');
var inherit = require('tui-code-snippet/inheritance/inherit');

var domUtil = require('./core/domUtil');
var colorUtil = require('./colorUtil');
var View = require('./core/view');
var tmpl = require('../template/palette');

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for color palette view
 * @param {string[]} options.preset - color list
 * @param {HTMLDivElement} container - container element
 * @ignore
 */
function Palette(options, container) {
  /**
   * option object
   * @type {object}
   */
  this.options = extend(
    {
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
    },
    options
  );

  container = domUtil.appendHTMLElement(
    'div',
    container,
    this.options.cssPrefix + 'palette-container'
  );

  View.call(this, options, container);
}

inherit(Palette, View);

/**
 * Mouse click event handler
 * @fires Palette#_selectColor
 * @fires Palette#_toggleSlider
 * @param {MouseEvent} clickEvent - mouse event object
 */
Palette.prototype._onClick = function(clickEvent) {
  var options = this.options;
  var target = getTarget(clickEvent);
  var eventData = {};

  if (hasClass(target, options.cssPrefix + 'palette-button')) {
    eventData.color = target.value;

    /**
     * @event Palette#_selectColor
     * @type {object}
     * @property {string} color - selected color value
     */
    this.fire('_selectColor', eventData);

    return;
  }

  if (hasClass(target, options.cssPrefix + 'palette-toggle-slider')) {
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
  var options = this.options;
  var target = getTarget(changeEvent);
  var eventData = {};

  if (hasClass(target, options.cssPrefix + 'palette-hex')) {
    eventData.color = target.value;

    /**
     * @event Palette#_selectColor
     * @type {object}
     * @property {string} color - selected color value
     */
    this.fire('_selectColor', eventData);
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
 * @param {boolean} [toBind=false] - true to bind event.
 */
Palette.prototype._toggleEvent = function(toBind) {
  var options = this.options;
  var container = this.container;
  var handleEvent = toBind ? on : off;
  var hexTextBox;

  handleEvent(container, 'click', this._onClick, this);

  hexTextBox = container.querySelector('.' + options.cssPrefix + 'palette-hex', container);

  if (hexTextBox) {
    handleEvent(hexTextBox, 'change', this._onChange, this);
  }
};

/**
 * Render palette
 * @override
 */
Palette.prototype.render = function(color) {
  var options = this.options;
  var html = '';

  this._toggleEvent(false);

  html = tmpl({
    cssPrefix: options.cssPrefix,
    preset: options.preset,
    detailTxt: options.detailTxt,
    color: color,
    isValidRGB: colorUtil.isValidRGB,
    getItemClass: function(itemColor) {
      return !itemColor ? ' ' + options.cssPrefix + 'color-transparent' : '';
    },
    isSelected: function(itemColor) {
      return itemColor === color ? ' ' + options.cssPrefix + 'selected' : '';
    }
  });
  this.container.innerHTML = html;

  this._toggleEvent(true);
};

CustomEvents.mixin(Palette);

module.exports = Palette;
