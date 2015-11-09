/**
 * @fileoverview Slider view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./core/domutil');
var domevent = require('./core/domevent');
var View = require('./core/view');
var tmpl = require('../template/slider');

// Limitation position of point element inside of color slider
var SVG_POS_LIMIT_RANGE = [-7.5, 112];

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for view
 *  @param {string} options.cssPrefix - design css prefix
 * @param {HTMLElement} container - container element
 */
function Slider(options, container) {
    container = domutil.appendHTMLElement('div', container, options.cssPrefix + 'slider-container');
    container.style.display = 'none';

    View.call(this, options, container);

    /**
     * @type {object}
     */
    this.options = util.extend({
        cssPrefix: 'tui-colorpicker-'
    }, options);

    /**
     * @type {boolean}
     */
    this.isOldBrowser = (util.browser.msie && util.browser.version < 9);

    /**
     * Cache immutable data in click, drag events.
     *
     * (i.e. is event related with colorslider? or huebar?)
     * @type {object}
     * @property {boolean} isColorSlider
     * @property {number[]} containerSize
     */
    this._dragDataCache = {};

    /**
     * @type {HTMLDivElement}
     */
    this.colorsliderContainer = null;

    /**
     * @type {HTMLDivElement}
     */
    this.huebarContainer = null;

    /**
     * Color slider point element (i.e. Path, v:path)
     */
    this.sliderPointElement = null;
}

util.inherit(Slider, View);

/**
 * Toggle slider view
 * @param {boolean} onOff - set true then reveal slider view
 */
Slider.prototype.toggle = function(onOff) {
    this.container.style.display = !!onOff ? 'block' : 'none';
};

/**
 * Get slider display status
 * @returns {boolean} return true when slider is visible
 */
Slider.prototype.isVisible = function() {
    return this.container.style.display === 'block';
};

/**
 * @override
 */
Slider.prototype.render = function() {
    var that = this,
        container = that.container,
        options = that.options,
        html = tmpl.layout;

    html = html.replace(/{{slider}}/, tmpl.slider);
    html = html.replace(/{{huebar}}/, tmpl.huebar);
    html = html.replace(/{{cssPrefix}}/g, options.cssPrefix);

    that.container.innerHTML = html;

    that.sliderPointElement = domutil.find('.' + options.cssPrefix + 'slider-handle', container);
    that.colorsliderContainer = domutil.find('.' + options.cssPrefix + 'slider-left', container);
    that.huebarContainer = domutil.find('.' + options.cssPrefix + 'slider-right', container);

    // TODO: apply rgb string
    that.moveSliderPercent(0, 0);
};

/**
 * Move slider point to supplied top, left percent
 * @param {number} topPercent - percent value of pointer top position
 * @param {number} leftPercent - percent value of point left position
 */
Slider.prototype.moveSliderPercent = function(topPercent, leftPercent) {
    var pointElement = this.sliderPointElement,
        absMin, maxValue, top, left,
        pointerColor;

    topPercent = topPercent || 0;
    leftPercent = leftPercent || 0;

    absMin = Math.abs(SVG_POS_LIMIT_RANGE[0]);
    maxValue = absMin + SVG_POS_LIMIT_RANGE[1];

    // 100 : maxValue = x : topPercent
    top = ((topPercent / 100) * maxValue) - absMin;
    left = ((leftPercent / 100) * maxValue) - absMin;

    // Check position limitation.
    top = Math.max(SVG_POS_LIMIT_RANGE[0], top);
    top = Math.min(SVG_POS_LIMIT_RANGE[1], top);
    left = Math.max(SVG_POS_LIMIT_RANGE[0], left);
    left = Math.min(SVG_POS_LIMIT_RANGE[1], left);

    pointerColor = top > 50 ? 'white' : 'black';

    if (this.isOldBrowser) {
        pointElement.strokecolor = pointerColor;
        pointElement.style.top = top + 'px';
        pointElement.style.left = left + 'px';
        return;
    }

    // need caution for difference of VML, SVG coordinates system.
    pointElement.setAttribute('transform', 'translate(' + left + ',' + top + ')');
    pointElement.setAttribute('stroke', pointerColor);
};

/**
 * Get colorslider point position (percent value)
 * @return {number[]} percent position of colorslider point
 */
Slider.prototype.getSliderPercent = function() {
    var pointElement = this.sliderPointElement,
        parseTransformRX = /[\.\-0-9]+/g,
        style, position,
        absMin = Math.abs(SVG_POS_LIMIT_RANGE[0]),
        maxValue = absMin + SVG_POS_LIMIT_RANGE[1],
        topPercent, leftPercent;

    if (this.isOldBrowser) {
        style = pointElement.style;
        position = [parseFloat(style.top), parseFloat(style.left)];
    } else {
        style = pointElement.getAttribute('transform').match(parseTransformRX);

        // need caution for difference of VML, SVG coordinates system.
        position = [parseFloat(style[1]), parseFloat(style[0])];
    }

    position[0] += absMin;
    position[1] += absMin;

    topPercent = (position[0] / maxValue) * 100;
    leftPercent = (position[1] / maxValue) * 100;

    //TODO: need get h valur from hue bar
    return [topPercent, leftPercent, NaN];
};

Slider.prototype.getHSV = function() {
    var percent = this.getSliderPercent(),
        v = percent[0];

    // return [
    //     NaN,
    //     percent[1],
    //     percent[0]
    // ];
    //
    v = Math.round((v * 255) / 100);

    v = 255 - v;


    domutil.find('.tui-colorpicker-palette-preview').style.backgroundColor = 'rgb(' + v + ',' + v + ',' + v + ')';
    //
    // // console.log(topPercent);
};

/**********
 * Drag event handler
 **********/

Slider.prototype._prepareColorSliderForMouseEvent = function(event) {
    var options = this.options,
        sliderPart = domutil.closest(event.target, '.' + options.cssPrefix + 'slider-part'),
        size = domutil.getSize(sliderPart),
        cache;

    cache = this._dragDataCache = {
        isColorSlider: sliderPart === this.colorsliderContainer,
        parentElement: sliderPart,
        parentElementSize: size
    };
    
    return cache;
};

Slider.prototype._onClick = function(clickEvent) {
    var cache = this._prepareColorSliderForMouseEvent(clickEvent),
        mousePos, topPercent, leftPercent;

    if (cache.isColorSlider) {
        mousePos = domevent.getMousePosition(clickEvent.originEvent, cache.parentElement);
        leftPercent = (mousePos[0] / cache.parentElementSize[0]) * 100;
        topPercent = (mousePos[1] / cache.parentElementSize[1]) * 100;

        this.moveSliderPercent(topPercent, leftPercent);
        this._dragDataCache = null;
        return;
    }
};

Slider.prototype._onDragStart = function(dragStartEvent) {
    this._prepareColorSliderForMouseEvent(dragStartEvent);
};

Slider.prototype._onDrag = function(dragEvent) {
    var cache = this._dragDataCache,
        mousePos, topPercent, leftPercent;

    if (cache.isColorSlider) {
        mousePos = domevent.getMousePosition(dragEvent.originEvent, cache.parentElement);
        leftPercent = (mousePos[0] / cache.parentElementSize[0]) * 100;
        topPercent = (mousePos[1] / cache.parentElementSize[1]) * 100;

        this.moveSliderPercent(topPercent, leftPercent);
        return;
    }
};

Slider.prototype._onDragEnd = function() {
    this._dragDataCache = null;
};

util.CustomEvents.mixin(Slider);

module.exports = Slider;

