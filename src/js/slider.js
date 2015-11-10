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
        color: '#f8f8f8',
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
 * @private
 * @param {SVG|VML} handle - handle element
 * @returns {number[]} handle element's position [top, left]
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

    this.moveHue(hsv[0], true)
    this.moveSaturationAndValue(hsv[1], hsv[2], true);
};

/**
 * Move colorslider by newLeft(X), newTop(Y) value
 * @private
 * @param {number} newLeft - left pixel value to move handle
 * @param {number} newTop - top pixel value to move handle
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype._moveColorSliderHandle = function(newLeft, newTop, silent) {
    var handle = this.sliderHandleElement,
        handleColor;

    // Check position limitation.
    newTop = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newTop);
    newTop = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newTop);
    newLeft = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newLeft);
    newLeft = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newLeft);

    handleColor = newTop > 50 ? 'white' : 'black';

    if (this.isOldBrowser) {
        handleColor.strokecolor = handleColor;
        handle.style.left = newLeft + 'px';
        handle.style.top = newTop + 'px';
    } else {
        handle.setAttribute('transform', 'translate(' + newLeft + ',' + newTop + ')');
        handle.setAttribute('stroke', handleColor);
    }

    if (!silent) {
        this.fire('_selectColor', {
            color: colorutil.rgbToHEX.apply(null, this.getRGB())
        });
    }
};

/**
 * Move colorslider by supplied saturation and values.
 *
 * The movement of color slider handle follow HSV cylinder model. {@link https://en.wikipedia.org/wiki/HSL_and_HSV}
 * @param {number} saturation - the percent of saturation (0% ~ 100%)
 * @param {number} value - the percent of saturation (0% ~ 100%)
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype.moveSaturationAndValue = function(saturation, value, silent) {
    var absMin, maxValue,
        newLeft, newTop;

    saturation = saturation || 0;
    value = value || 0;

    absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]);
    maxValue = COLORSLIDER_POS_LIMIT_RANGE[1];

    // subtract absMin value because current color position is not left, top of handle element.
    // The saturation. from left 0 to right 100
    newLeft = ((saturation * maxValue) / 100) - absMin;
    // The Value. from top 100 to bottom 0
    newTop = (maxValue - ((value * maxValue) / 100)) - absMin;

    this._moveColorSliderHandle(newLeft, newTop, silent);
};

/**
 * Move color slider handle to supplied position
 *
 * The number of X, Y must be related value from color slider container
 * @private
 * @param {number} x - the pixel value to move handle 
 * @param {number} y - the pixel value to move handle
 */
Slider.prototype._moveColorSliderByPosition = function(x, y) {
    var offset = COLORSLIDER_POS_LIMIT_RANGE[0];
    this._moveColorSliderHandle(x + offset, y + offset);
};

/**
 * Get saturation and value value.
 * @returns {number[]} saturation and value
 */
Slider.prototype.getSaturationAndValue = function() {
    var absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]),
        maxValue = absMin + COLORSLIDER_POS_LIMIT_RANGE[1],
        position, saturation, value;

    position = this._getHandlePosition(this.sliderHandleElement);

    saturation = ((position[1] + absMin) / maxValue) * 100;
    // The value of HSV color model is inverted. top 100 ~ bottom 0. so subtract by 100
    value = 100 - (((position[0] + absMin) / maxValue) * 100);

    return [saturation, value];
};

/**
 * Move hue handle supplied pixel value
 * @private
 * @param {number} newTop - pixel to move hue handle
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype._moveHueHandle = function(newTop, silent) {
    var handleElement = this.huebarHandleElement,
        baseColorElement = this.baseColorElement,
        newBaseColor, colorStr;

    newTop = Math.max(HUEBAR_POS_LIMIT_RANGE[0], newTop);
    newTop = Math.min(HUEBAR_POS_LIMIT_RANGE[1], newTop);

    if (this.isOldBrowser) {
        handleElement.style.top = newTop + 'px';
    } else {
        handleElement.setAttribute('transform', 
           'translate(' + HUEBAR_HANDLE_RIGHT_POS + ',' + newTop + ')');
    }

    newBaseColor = colorutil.hsvToRGB(this.getHue(), 100, 100);
    colorStr = 'rgb(' + newBaseColor[0] + ',' + newBaseColor[1] + ',' + newBaseColor[2] + ')';

    if (this.isOldBrowser) {
        baseColorElement.color = colorStr;
    } else {
        baseColorElement.setAttribute('stop-color', colorStr);
    }

    if (!silent) {
        this.fire('_selectColor', {
            color: colorutil.rgbToHEX.apply(null, this.getRGB())
        });
    }
};

/**
 * Move hue bar handle by supplied degree
 * @param {number} degree - (0 ~ 359.9 degree)
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype.moveHue = function(degree, silent) {
    var newTop = 0,
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    degree = degree || 0;
    newTop = ((maxValue * degree) / 359.9) - absMin;
    this._moveHueHandle(newTop, silent);
};

/**
 * Move hue bar handle by supplied percent
 * @private
 * @param {number} y - pixel value to move hue handle
 */
Slider.prototype._moveHueByPosition = function(y) {
    var offset = HUEBAR_POS_LIMIT_RANGE[0];
    this._moveHueHandle(y + offset);
};

/**
 * Get huebar handle position by color degree
 * @returns {number} degree (0 ~ 359.9 degree)
 */
Slider.prototype.getHue = function() {
    var handle = this.huebarHandleElement,
        position = this._getHandlePosition(handle),
        absMin, maxValue;

    absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
    maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

    // maxValue : 359 = pos.y : x
    return ((position[0] + absMin) * 359.9) / maxValue;
};

/**
 * Get HSV value from slider
 * @returns {number[]} hsv values
 */
Slider.prototype.getHSV = function() {
    var sv = this.getSaturationAndValue(),
        h = this.getHue();

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
        mousePos = domevent.getMousePosition(clickEvent.originEvent, cache.parentElement);

    if (cache.isColorSlider) {
        this._moveColorSliderByPosition(mousePos[0], mousePos[1]);
        this._dragDataCache = null;
    } else {
        this._moveHueByPosition(mousePos[1]);
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
        mousePos = domevent.getMousePosition(dragEvent.originEvent, cache.parentElement);

    if (cache.isColorSlider) {
        this._moveColorSliderByPosition(mousePos[0], mousePos[1]);
    } else {
        this._moveHueByPosition(mousePos[1]);
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

