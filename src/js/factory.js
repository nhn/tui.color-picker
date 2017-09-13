/**
 * @fileoverview Colorpicker factory module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */

'use strict';

var util = require('tui-code-snippet');
var colorutil = require('./colorutil');
var Layout = require('./layout');
var Palette = require('./palette');
var Slider = require('./slider');

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
        throw new Error('Colorpicker(): need container option.');
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
        throw new Error('Colorpicker#setColor(): need valid hex string color value');
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
