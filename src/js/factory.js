/**
 * @fileoverview ColorPicker factory module
 */

'use strict';

var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var extend = require('tui-code-snippet/object/extend');
var util = require('./util');
var colorUtil = require('./colorUtil');

var Layout = require('./layout');
var Palette = require('./palette');
var Slider = require('./slider');

/**
 * Create an unique id for a color-picker instance.
 * @private
 */
var currentId = 0;
function generateId() {
  currentId += 1;

  return currentId;
}

/**
 * @constructor
 * @param {object} options - options for colorpicker component
 *  @param {HTMLDivElement} options.container - container element
 *  @param {string} [options.color='#ffffff'] - default selected color
 *  @param {string[]} [options.preset] - color preset for palette (use base16 palette if not supplied)
 *  @param {string} [options.cssPrefix='tui-colorpicker-'] - css prefix text for each child elements
 *  @param {string} [options.detailTxt='Detail'] - text for detail button.
 *  @param {boolean} [options.usageStatistics=true] - Let us know the hostname. If you don't want to send the hostname, please set to false.
 * @example
 * // ES6
 * import colorPicker from 'tui-color-picker';
 *
 * // CommonJS
 * const colorPicker = require('tui-color-picker');
 *
 * // Browser
 * const colorPicker = tui.colorPicker;
 *
 * const instance = colorPicker.create({
 *   container: document.getElementById('color-picker')
 * });
 */
function ColorPicker(options) {
  var layout;

  if (!(this instanceof ColorPicker)) {
    return new ColorPicker(options);
  }
  /**
   * Option object
   * @type {object}
   * @private
   */
  options = this.options = extend(
    {
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
      detailTxt: 'Detail',
      id: generateId(),
      usageStatistics: true
    },
    options
  );

  if (!options.container) {
    throw new Error('ColorPicker(): need container option.');
  }

  /**********
   * Create layout view
   **********/

  /**
   * @type {Layout}
   * @private
   */
  layout = this.layout = new Layout(options, options.container);

  /**********
   * Create palette view
   **********/
  this.palette = new Palette(options, layout.container);
  this.palette.on(
    {
      _selectColor: this._onSelectColorInPalette,
      _toggleSlider: this._onToggleSlider
    },
    this
  );

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

  if (options.usageStatistics) {
    util.sendHostName();
  }
}

/**
 * Handler method for Palette#_selectColor event
 * @private
 * @fires ColorPicker#selectColor
 * @param {object} selectColorEventData - event data
 */
ColorPicker.prototype._onSelectColorInPalette = function(selectColorEventData) {
  var color = selectColorEventData.color;
  var opt = this.options;

  if (!colorUtil.isValidRGB(color) && color !== '') {
    this.render();

    return;
  }

  /**
   * @event ColorPicker#selectColor
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
ColorPicker.prototype._onToggleSlider = function() {
  this.slider.toggle(!this.slider.isVisible());
};

/**
 * Handler method for Slider#_selectColor event
 * @private
 * @fires ColorPicker#selectColor
 * @param {object} selectColorEventData - event data
 */
ColorPicker.prototype._onSelectColorInSlider = function(selectColorEventData) {
  var color = selectColorEventData.color;
  var opt = this.options;

  /**
   * @event ColorPicker#selectColor
   * @type {object}
   * @property {string} color - selected color (hex string)
   * @property {string} origin - flags for represent the source of event fires.
   * @ignore
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
 * @param {string} hexStr - hex formatted color string
 * @example
 * instance.setColor('#ffff00');
 */
ColorPicker.prototype.setColor = function(hexStr) {
  if (!colorUtil.isValidRGB(hexStr)) {
    throw new Error('ColorPicker#setColor(): need valid hex string color value');
  }

  this.options.color = hexStr;
  this.render(hexStr);
};

/**
 * Get hex color string of current selected color in colorpicker instance.
 * @returns {string} hex string formatted color
 * @example
 * instance.setColor('#ffff00');
 * instance.getColor(); // '#ffff00';
 */
ColorPicker.prototype.getColor = function() {
  return this.options.color;
};

/**
 * Toggle colorpicker element. set true then reveal colorpicker view.
 * @param {boolean} [isShow=false] - A flag to show
 * @example
 * instance.toggle(false); // hide
 * instance.toggle(); // hide
 * instance.toggle(true); // show
 */
ColorPicker.prototype.toggle = function(isShow) {
  this.layout.container.style.display = !!isShow ? 'block' : 'none';
};

/**
 * Render colorpicker
 * @param {string} [color] - selected color
 * @ignore
 */
ColorPicker.prototype.render = function(color) {
  this.layout.render(color || this.options.color);
};

/**
 * Destroy colorpicker instance.
 * @example
 * instance.destroy(); // DOM-element is removed
 */
ColorPicker.prototype.destroy = function() {
  this.layout.destroy();
  this.options.container.innerHTML = '';

  this.layout = this.slider = this.palette = this.options = null;
};

CustomEvents.mixin(ColorPicker);

module.exports = ColorPicker;
