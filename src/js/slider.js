/**
 * @fileoverview Slider view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./core/domutil');
var domevent = require('./core/domevent');
var colorutil = require('./colorutil');
var View = require('./core/view');
var tmpl = require('../template/slider');

// Limitation position of point element inside of colorslider and hue bar
var COLORSLIDER_POS_LIMIT_RANGE = [-7.5, 112];
var HUEBAR_POS_LIMIT_RANGE = [-3, 115];
var HUEBAR_HANDLE_RIGHT_POS = -6;
var VML_BASECOLOR_TEMPLATE = '0% {{color}}, 100% rgb(255,255,255)';

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
     * Color slider handle element
     * @type {SVG|VML}
     */
    this.sliderHandleElement = null;

    /**
     * hue bar handle element
     * @type {SVG|VML}
     */
    this.huebarHandleElement = null;

    /**
     * Element that render base color in colorslider part
     * @type {SVG|VML}
     */
    this.baseColorElement = null;
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
 * Get handle element's position
 * @param {SVG|VML} handle - handle element
 * @returns {number[]} position of handle element
 */
Slider.prototype._getHandlePosition = function(handle) {
    var parseTransformRX = /[\.\-0-9]+/g,
        temp;

    if (this.isOldBrowser) {
        temp = handle.style;
        return [parseFloat(temp.top), parseFloat(temp.left)];
    }

    temp = handle.getAttribute('transform').match(parseTransformRX);

    // need caution for difference of VML, SVG coordinates system.
    // translate command need X coords in first parameter. but VML is use CSS coordinate system(top, left)
    return [parseFloat(temp[1]), parseFloat(temp[0])];
};

/**
 * @override
 */
Slider.prototype.render = function(colorStr) {
    var that = this,
        container = that.container,
        options = that.options,
        html = tmpl.layout,
        rgb,
        hsv;

    html = html.replace(/{{slider}}/, tmpl.slider);
    html = html.replace(/{{huebar}}/, tmpl.huebar);
    html = html.replace(/{{cssPrefix}}/g, options.cssPrefix);

    that.container.innerHTML = html;

    that.sliderHandleElement = domutil.find('.' + options.cssPrefix + 'slider-handle', container);
    that.huebarHandleElement = domutil.find('.' + options.cssPrefix + 'huebar-handle', container);
    that.baseColorElement = domutil.find('.' + options.cssPrefix + 'slider-basecolor', container);

    that.colorsliderContainer = domutil.find('.' + options.cssPrefix + 'slider-left', container);
    that.huebarContainer = domutil.find('.' + options.cssPrefix + 'slider-right', container);

    rgb = colorutil.hexToRGB(colorStr);
    hsv = colorutil.rgbToHSV.apply(null, rgb);

    this.moveHueByDegree(hsv[0])
    this.moveSliderPercent(100 - hsv[2], hsv[1]);
};

/**
 * Move slider point to supplied top, left percent
 * @param {number} topPercent - percent value of pointer top position
 * @param {number} leftPercent - percent value of point left position
 */
Slider.prototype.moveSliderPercent = function(topPercent, leftPercent) {
    var pointElement = this.sliderHandleElement,
        absMin, maxValue, top, left,
        pointerColor;

    topPercent = topPercent || 0;
    leftPercent = leftPercent || 0;

    absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]);
    maxValue = absMin + COLORSLIDER_POS_LIMIT_RANGE[1];

    // 100 : maxValue = x : topPercent
    top = ((topPercent / 100) * maxValue) - absMin;
    left = ((leftPercent / 100) * maxValue) - absMin;

    // Check position limitation.
    top = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], top);
    top = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], top);
    left = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], left);
    left = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], left);

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
    var absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]),
        maxValue = absMin + COLORSLIDER_POS_LIMIT_RANGE[1],
        topPercent, leftPercent, position; 

    position = this._getHandlePosition(this.sliderHandleElement);

    // Add absMin because handle position use center coordinate of element not lefttop.
    topPercent = ((position[0] + absMin) / maxValue) * 100;
    leftPercent = ((position[1] + absMin) / maxValue) * 100;

    return [topPercent, leftPercent];
};

/**
 * Move hue handle supplied pixel value
 * @param {number} newTop - pixel to move hue handle
 */
Slider.prototype._moveHueHandle = function(newTop) {
    var handleElement = this.huebarHandleElement,
        baseColorElement = this.baseColorElement,
        newBaseColor, colorStr, vmlColor;

    newTop = Math.max(HUEBAR_POS_LIMIT_RANGE[0], newTop);
    newTop = Math.min(HUEBAR_POS_LIMIT_RANGE[1], newTop);

    if (this.isOldBrowser) {
        handleElement.style.top = newTop + 'px';
    } else {
        handleElement.setAttribute('transform', 
           'translate(' + HUEBAR_HANDLE_RIGHT_POS + ',' + newTop + ')');
    }

    newBaseColor = colorutil.hsvToRGB(this.getHueDegree(), 100, 100);
    colorStr = 'rgb(' + newBaseColor[0] + ',' + newBaseColor[1] + ',' + newBaseColor[2] + ')';

    if (this.isOldBrowser) {
        baseColorElement.color = colorStr;
    } else {
        baseColorElement.setAttribute('stop-color', colorStr);
    }
};

/**
 * Move hue bar handle by supplied degree
 * @param {number} degree - 0 ~ 359 degree
 */
Slider.prototype.moveHueByDegree = function(degree) {
    var newTop = 0,
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    degree = degree || 0;
    newTop = ((maxValue * degree) / 359) - absMin;
    this._moveHueHandle(newTop);
};

/**
 * Move hue bar handle by supplied percent
 * @param {number} percent - 0 ~ 100 percent
 */
Slider.prototype.moveHueByPercent = function(percent) {
    var newTop = 0,
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    percent = percent || 0;
    newTop = ((maxValue * percent) / 100) - absMin;
    this._moveHueHandle(newTop);
};

/**
 * Get huebar handle position by color degree
 * @returns {number} degree
 */
Slider.prototype.getHueDegree = function() {
    var handle = this.huebarHandleElement,
        position = this._getHandlePosition(handle),
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    // maxValue : 359 = pos.y : x
    return ((position[0] + absMin) * 359) / maxValue;
};

/**
 * Get HSV value from slider
 * @returns {number[]} hsv values
 */
Slider.prototype.getHSV = function() {
    var sv = this.getSliderPercent(),
        h = this.getHueDegree();

    return [h].concat(sv);
};

/**
 * Get RGB value from slider
 * @returns {number[]} RGB value
 */
Slider.prototype.getRGB = function() {
    return colorutil.hsvToRGB.apply(null, this.getHSV());
};

/**********
 * Drag event handler
 **********/

/**
 * Cache immutable data when dragging or click view
 * @param {object} event - Click, DragStart event.
 * @returns {object} cached data.
 */
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

/**
 * Click event handler
 * @param {object} clickEvent - Click event from Drag module
 */
Slider.prototype._onClick = function(clickEvent) {
    var cache = this._prepareColorSliderForMouseEvent(clickEvent),
        mousePos = domevent.getMousePosition(clickEvent.originEvent, cache.parentElement),
        topPercent, leftPercent;

    topPercent = (mousePos[1] / cache.parentElementSize[1]) * 100;

    if (cache.isColorSlider) {
        leftPercent = (mousePos[0] / cache.parentElementSize[0]) * 100;

        this.moveSliderPercent(topPercent, leftPercent);
        this._dragDataCache = null;
    } else {
        this.moveHueByPercent(topPercent);
    }
};

/**
 * DragStart event handler
 * @param {object} dragStartEvent - dragStart event data from Drag#dragStart
 */
Slider.prototype._onDragStart = function(dragStartEvent) {
    this._prepareColorSliderForMouseEvent(dragStartEvent);
};

/**
 * Drag event handler
 * @param {Drag#drag} dragEvent - drag event data
 */
Slider.prototype._onDrag = function(dragEvent) {
    var cache = this._dragDataCache,
        mousePos = domevent.getMousePosition(dragEvent.originEvent, cache.parentElement),
        topPercent, leftPercent;

    topPercent = (mousePos[1] / cache.parentElementSize[1]) * 100;

    if (cache.isColorSlider) {
        leftPercent = (mousePos[0] / cache.parentElementSize[0]) * 100;
        this.moveSliderPercent(topPercent, leftPercent);
        return;
    } else {
        this.moveHueByPercent(topPercent);
    }
};

/**
 * Drag#dragEnd event handler
 */
Slider.prototype._onDragEnd = function() {
    this._dragDataCache = null;
};

util.CustomEvents.mixin(Slider);

module.exports = Slider;

