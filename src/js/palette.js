/**
 * @fileoverview Color palette view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */

'use strict';

var util = require('tui-code-snippet');
var domutil = require('./core/domutil');
var colorutil = require('./colorutil');
var domevent = require('./core/domevent');
var View = require('./core/view');
var tmpl = require('../template/palette');

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for color palette view
 *  @param {string[]} options.preset - color list
 * @param {HTMLDivElement} container - container element
 * @ignore
 */
function Palette(options, container) {
    /**
     * option object
     * @type {object}
     */
    this.options = util.extend({
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
    }, options);

    container = domutil.appendHTMLElement(
        'div',
        container,
        this.options.cssPrefix + 'palette-container'
    );

    View.call(this, options, container);
}

util.inherit(Palette, View);

/**
 * Mouse click event handler
 * @fires Palette#_selectColor
 * @fires Palette#_toggleSlider
 * @param {MouseEvent} clickEvent - mouse event object
 */
Palette.prototype._onClick = function(clickEvent) {
    var options = this.options,
        target = clickEvent.srcElement || clickEvent.target,
        eventData = {};

    if (domutil.hasClass(target, options.cssPrefix + 'palette-button')) {
        eventData.color = target.value;

        /**
         * @event Palette#_selectColor
         * @type {object}
         * @property {string} color - selected color value
         */
        this.fire('_selectColor', eventData);

        return;
    }

    if (domutil.hasClass(target, options.cssPrefix + 'palette-toggle-slider')) {
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
    var options = this.options,
        target = changeEvent.srcElement || changeEvent.target,
        eventData = {};

    if (domutil.hasClass(target, options.cssPrefix + 'palette-hex')) {
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
 * @param {boolean} [onOff=false] - true to bind event.
 */
Palette.prototype._toggleEvent = function(onOff) {
    var options = this.options,
        container = this.container,
        method = domevent[!!onOff ? 'on' : 'off'],
        hexTextBox;

    method(container, 'click', this._onClick, this);

    hexTextBox = domutil.find('.' + options.cssPrefix + 'palette-hex', container);

    if (hexTextBox) {
        method(hexTextBox, 'change', this._onChange, this);
    }
};

/**
 * Render palette
 * @override
 */
Palette.prototype.render = function(color) {
    var options = this.options,
        html = '';

    this._toggleEvent(false);

    html = tmpl.layout.replace('{{colorList}}', util.map(options.preset, function(itemColor) {
        var itemHtml = '';
        var style = '';

        if (colorutil.isValidRGB(itemColor)) {
            style = domutil.applyTemplate(tmpl.itemStyle, {color: itemColor});
        }

        itemHtml = domutil.applyTemplate(tmpl.item, {
            itemStyle: style,
            itemClass: (!itemColor) ? 'color-transparent' : '',
            color: itemColor,
            cssPrefix: options.cssPrefix,
            selected: itemColor === color ? (' ' + options.cssPrefix + 'selected') : ''
        });

        return itemHtml;
    }).join(''));

    html = domutil.applyTemplate(html, {
        cssPrefix: options.cssPrefix,
        detailTxt: options.detailTxt,
        color: color
    });

    this.container.innerHTML = html;

    this._toggleEvent(true);
};

util.CustomEvents.mixin(Palette);

module.exports = Palette;
