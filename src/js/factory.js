/**
 * @fileoverview ColorPicker factory module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */

'use strict';

var util = require('tui-code-snippet');
var colorutil = require('./colorutil');
var Layout = require('./layout');
var Palette = require('./palette');
var Slider = require('./slider');

var hostnameSent = false;

/**
 * send hostname
 * @ignore
 */
function sendHostname() {
    var hostname = location.hostname;

    if (hostnameSent) {
        return;
    }

    util.imagePing('https://www.google-analytics.com/collect', {
        v: 1,
        t: 'event',
        tid: 'UA-115377265-9',
        cid: hostname,
        dp: hostname,
        dh: 'color-picker'
    });
    hostnameSent = true;
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
 *  @param {boolean} [options.usageStatistics=true] - Let us know the hostname. If you don't want to send the hostname, please set to false.
 * @example
 * var colorPicker = tui.colorPicker; // or require('tui-color-picker')
 *
 * colorPicker.create({
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
        detailTxt: 'Detail',
        usageStatistics: true
    }, options);

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

    if (options.usageStatistics) {
        sendHostname();
    }
}

/**
 * Handler method for Palette#_selectColor event
 * @private
 * @fires ColorPicker#selectColor
 * @param {object} selectColorEventData - event data
 */
ColorPicker.prototype._onSelectColorInPalette = function(selectColorEventData) {
    var color = selectColorEventData.color,
        opt = this.options;

    if (!colorutil.isValidRGB(color)) {
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
    var color = selectColorEventData.color,
        opt = this.options;

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
 * colorPicker.setColor('#ffff00');
 */
ColorPicker.prototype.setColor = function(hexStr) {
    if (!colorutil.isValidRGB(hexStr)) {
        throw new Error('ColorPicker#setColor(): need valid hex string color value');
    }

    this.options.color = hexStr;
    this.render(hexStr);
};

/**
 * Get hex color string of current selected color in colorpicker instance.
 * @returns {string} hex string formatted color
 * @example
 * colorPicker.setColor('#ffff00');
 * colorPicker.getColor(); // '#ffff00';
 */
ColorPicker.prototype.getColor = function() {
    return this.options.color;
};

/**
 * Toggle colorpicker element. set true then reveal colorpicker view.
 * @param {boolean} [isShow=false] - A flag to show
 * @example
 * colorPicker.toggle(false); // hide
 * colorPicker.toggle(); // hide
 * colorPicker.toggle(true); // show
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
 * colorPicker.destroy(); // DOM-element is removed
 */
ColorPicker.prototype.destroy = function() {
    this.layout.destroy();
    this.options.container.innerHTML = '';

    this.layout = this.slider = this.palette =
        this.options = null;
};

util.CustomEvents.mixin(ColorPicker);

module.exports = ColorPicker;
