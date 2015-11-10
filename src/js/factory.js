/**
 * @fileoverview Colorpicker factory module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var colorutil = require('./colorutil');
var Drag = require('./core/drag');
var Layout = require('./layout');
var Palette = require('./palette');
var Slider = require('./slider');

function throwError(msg) {
    /* @if ENV='DEBUG' */
    throw new Error(msg);
    /* @endif */
    /* @if ENV='RELEASE' */
    alert(msg);
    /* @endif */
}

/**
 * @constructor
 * @mixes CustomEvents
 * @param {object} options - options for colorpicker component
 *  @param {HTMLDivElement} options.container - container element
 *  @param {string} [options.color='#ffffff'] - default selected color
 *  @param {string[]} [options.preset] - color preset for palette (use base16 palette if not supplied)
 *  @param {string} [options.cssPrefix='tui-colorpicker-'] - css prefix text for each child elements
 * @example
 * var colorpicker = tui.component.colorpicker({
 *   container: document.getElementById('colorpicker')
 * });
 *
 * colorpicker.getColor();    // '#ffffff'
 */
function Colorpicker(options) {
    var that = this,
        layout, palette, drag, slider;

    if (!(that instanceof Colorpicker)) {
        return new Colorpicker(options);
    }
    /**
     * Option object
     * @type {object}
     */
    options = that.options = util.extend({
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
        cssPrefix: 'tui-colorpicker-'
    }, options);

    if (!options.container) {
        throwError('Colorpicker(): need container option.');
        return;
    }

    /**********
     * Create layout view
     **********/

    /**
     * @type {Layout}
     */
    layout = that.layout = new Layout(options, options.container);

    /**********
     * Add palette view
     **********/
    palette = new Palette(options, layout.container);
    palette.on({
        '_selectColor': function(e) {
            var color = e.color,
                opt = that.options;

            if (!colorutil.isValidRGB(color)) {
                that.render();
                return;
            }

            if (opt.color === color) {
                return;
            }

            opt.color = color;
            that.render(color);
        },
        '_toggleSlider': function() {
            slider.toggle(!slider.isVisible());
        }
    });
    layout.addChild(palette);

    /**********
     * Add slider view
     **********/
    slider = new Slider(options, layout.container);
    slider.on({
        '_selectColor': function(e) {
            var color = e.color,
                opt = that.options;

            if (opt.color === color) {
                return;
            }

            opt.color = color;
            palette.render(color);
        }
    });
    layout.addChild(slider);

    that.render(options.color);

    /**********
     * Drag handler
     **********/
    util.debounce(function() {
        drag = that.drag = new Drag({
            distance: 0
        }, slider.container);

        drag.on({
            'dragStart': slider._onDragStart,
            'drag': slider._onDrag,
            'dragEnd': slider._onDragEnd,
            'click': slider._onClick
        }, slider);
    }, 0)();
}

/**
 * Set colorpicker current color
 * @param {string} hexStr - hex formatted color string
 */
Colorpicker.prototype.setColor = function(hexStr) {
    if (!colorutil.isValidRGB(hexStr)) {
        throwError('Colorpicker#setColor(): need valid hex string color value');
    }

    this.options.color = hexStr;
    this.render(hexStr);
};

/**
 * Get colorpicker current color
 * @returns {string} hex string formatted color
 */
Colorpicker.prototype.getColor = function() {
    return this.options.color;
};

/**
 * Toggle colorpicker container element
 * @param {boolean} [isShow=true] - true when reveal colorpicker
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
 * Destroy colorpicker component
 */
Colorpicker.prototype.destroy = function() {
    this.drag.off();
    this.layout.destroy();
    this.options.container.innerHTML = '';

    this.layout = this.options = this.drag = null;
};

util.CustomEvents.mixin(Colorpicker);

module.exports = Colorpicker;

