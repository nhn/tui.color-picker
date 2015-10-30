/**
 * @fileoverview Colorpicker factory module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var Layout = require('./layout');

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
 *  @param {object} [options.preset] - color preset for palette
 *  @param {string} [options.cssPrefix='tui-colorpicker-'] - css prefix text for each child elements
 * @example
 * var colorpicker = tui.component.colorpicker({
 *   container: document.getElementById('colorpicker')
 * });
 *
 * colorpicker.getColor();    // '#ffffff'
 */
function Colorpicker(options) {
    if (!(this instanceof Colorpicker)) {
        return new Colorpicker(options);
    }
    /**
     * Option object
     * @type {object}
     */
    options = this.options = util.extend({
        container: null,
        color: '#ffffff',
        preset: {},
        cssPrefix: 'tui-colorpicker-'
    }, options);

    if (!options.container) {
        return throwError('Colorpicker(): need container option.');
    }

    this.layout = new Layout({
        cssPrefix: options.cssPrefix
    }, options.container);
}

Colorpicker.prototype.setColor = function() {};
Colorpicker.prototype.getColor = function() {};
Colorpicker.prototype.toggle = function() {};
Colorpicker.prototype.destroy = function() {};

util.CustomEvents.mixin(Colorpicker);

module.exports = Colorpicker;

