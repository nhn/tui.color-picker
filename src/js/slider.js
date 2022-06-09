/**
 * @fileoverview Slider view
 */

'use strict';

var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var getMousePosition = require('tui-code-snippet/domEvent/getMousePosition');
var closest = require('tui-code-snippet/domUtil/closest');
var hasClass = require('tui-code-snippet/domUtil/hasClass');
var extend = require('tui-code-snippet/object/extend');
var inherit = require('tui-code-snippet/inheritance/inherit');

var domUtil = require('./core/domUtil');
var svgvml = require('./svgvml');
var colorUtil = require('./colorUtil');
var View = require('./core/view');
var Drag = require('./core/drag');
var tmpl = require('../template/slider');

// Limitation position of point element inside of colorslider and hue bar
// Minimum value can to be negative because that using color point of handle element is center point. not left, top point.
var COLORSLIDER_POS_LIMIT_RANGE = [-7, 112];
var HUEBAR_POS_LIMIT_RANGE = [-3, 115];
var HUE_WHEEL_MAX = 359.99;

/**
 * @constructor
 * @extends {View}
 * @mixes CustomEvents
 * @param {object} options - options for view
 *  @param {string} options.cssPrefix - design css prefix
 * @param {HTMLElement} container - container element
 * @ignore
 */
function Slider(options, container) {
  container = domUtil.appendHTMLElement('div', container, options.cssPrefix + 'slider-container');
  container.style.display = 'none';

  View.call(this, options, container);

  /**
   * @type {object}
   */
  this.options = extend(
    {
      color: '#f8f8f8',
      cssPrefix: 'tui-colorpicker-'
    },
    options
  );

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

  /**
   * @type {Drag}
   */
  this.drag = new Drag(
    {
      distance: 0
    },
    container
  );

  // bind drag events
  this.drag.on(
    {
      dragStart: this._onDragStart,
      drag: this._onDrag,
      dragEnd: this._onDragEnd,
      click: this._onClick
    },
    this
  );
}

inherit(Slider, View);

/**
 * @override
 */
Slider.prototype._beforeDestroy = function() {
  this.drag.off();

  this.drag = this.options = this._dragDataCache = this.sliderHandleElement = this.huebarHandleElement = this.baseColorElement = null;
};

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
 * Render slider view
 * @override
 * @param {string} colorStr - hex string color from parent view (Layout)
 */
Slider.prototype.render = function(colorStr) {
  var container = this.container;
  var options = this.options;
  var html = tmpl.layout;
  var rgb, hsv;

  if (!colorUtil.isValidRGB(colorStr)) {
    return;
  }

  html = html.replace(/{{slider}}/, tmpl.slider);
  html = html.replace(/{{huebar}}/, tmpl.huebar);
  html = html.replace(/{{cssPrefix}}/g, options.cssPrefix);
  html = html.replace(/{{id}}/g, options.id);

  this.container.innerHTML = html;

  this.sliderSvgElement = container.querySelector('.' + options.cssPrefix + 'svg-slider');
  this.huebarSvgElement = container.querySelector('.' + options.cssPrefix + 'svg-huebar');
  this.sliderHandleElement = container.querySelector('.' + options.cssPrefix + 'slider-handle');
  this.huebarHandleElement = container.querySelector('.' + options.cssPrefix + 'huebar-handle');
  this.baseColorElement = container.querySelector('.' + options.cssPrefix + 'slider-basecolor');

  rgb = colorUtil.hexToRGB(colorStr);
  hsv = colorUtil.rgbToHSV.apply(null, rgb);

  this.moveHue(hsv[0], true);
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
  var handle = this.sliderHandleElement;
  var handleColor;
  var sliderRects = this.sliderSvgElement.getClientRects()[0];

  if (sliderRects) {
    COLORSLIDER_POS_LIMIT_RANGE[1] = sliderRects.height - 10;
  }

  // Check position limitation.
  newTop = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newTop);
  newTop = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newTop);
  newLeft = Math.max(COLORSLIDER_POS_LIMIT_RANGE[0], newLeft);
  newLeft = Math.min(COLORSLIDER_POS_LIMIT_RANGE[1], newLeft);

  svgvml.setTranslateXY(handle, newLeft, newTop);

  handleColor = newTop > 50 ? 'white' : 'black';
  svgvml.setStrokeColor(handle, handleColor);

  if (!silent) {
    this.fire('_selectColor', {
      color: colorUtil.rgbToHEX.apply(null, this.getRGB())
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
  var absMin, maxValue, newLeft, newTop;

  saturation = saturation || 0;
  value = value || 0;

  absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]);
  maxValue = COLORSLIDER_POS_LIMIT_RANGE[1];

  // subtract absMin value because current color position is not left, top of handle element.
  // The saturation. from left 0 to right 100
  newLeft = (saturation * maxValue) / 100 - absMin;
  // The Value. from top 100 to bottom 0. that why newTop subtract by maxValue.
  newTop = maxValue - (value * maxValue) / 100 - absMin;

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
  var absMin = Math.abs(COLORSLIDER_POS_LIMIT_RANGE[0]);
  var maxValue = absMin + COLORSLIDER_POS_LIMIT_RANGE[1];
  var position = svgvml.getTranslateXY(this.sliderHandleElement);
  var saturation, value;

  saturation = ((position[1] + absMin) / maxValue) * 100;
  // The value of HSV color model is inverted. top 100 ~ bottom 0. so subtract by 100
  value = 100 - ((position[0] + absMin) / maxValue) * 100;

  return [saturation, value];
};

/**
 * Move hue handle supplied pixel value
 * @private
 * @param {number} newTop - pixel to move hue handle
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype._moveHueHandle = function(newTop, silent) {
  var hueHandleElement = this.huebarHandleElement;
  var baseColorElement = this.baseColorElement;
  var newGradientColor, hexStr;
  var huebarRects = this.huebarSvgElement.getClientRects()[0];

  if (huebarRects) {
    HUEBAR_POS_LIMIT_RANGE[1] = huebarRects.height - 7;
  }

  newTop = Math.max(HUEBAR_POS_LIMIT_RANGE[0], newTop);
  newTop = Math.min(HUEBAR_POS_LIMIT_RANGE[1], newTop);

  svgvml.setTranslateY(hueHandleElement, newTop);

  newGradientColor = colorUtil.hsvToRGB(this.getHue(), 100, 100);
  hexStr = colorUtil.rgbToHEX.apply(null, newGradientColor);

  svgvml.setGradientColorStop(baseColorElement, hexStr);

  if (!silent) {
    this.fire('_selectColor', {
      color: colorUtil.rgbToHEX.apply(null, this.getRGB())
    });
  }
};

/**
 * Move hue bar handle by supplied degree
 * @param {number} degree - (0 ~ 359.9 degree)
 * @param {boolean} [silent=false] - set true then not fire custom event
 */
Slider.prototype.moveHue = function(degree, silent) {
  var newTop = 0;
  var absMin, maxValue;

  absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
  maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

  degree = degree || 0;
  newTop = (maxValue * degree) / HUE_WHEEL_MAX - absMin;

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
  var handle = this.huebarHandleElement;
  var position = svgvml.getTranslateXY(handle);
  var absMin, maxValue;

  absMin = Math.abs(HUEBAR_POS_LIMIT_RANGE[0]);
  maxValue = absMin + HUEBAR_POS_LIMIT_RANGE[1];

  // maxValue : 359.99 = pos.y : x
  return ((position[0] + absMin) * HUE_WHEEL_MAX) / maxValue;
};

/**
 * Get HSV value from slider
 * @returns {number[]} hsv values
 */
Slider.prototype.getHSV = function() {
  var sv = this.getSaturationAndValue();
  var h = this.getHue();

  return [h].concat(sv);
};

/**
 * Get RGB value from slider
 * @returns {number[]} RGB value
 */
Slider.prototype.getRGB = function() {
  return colorUtil.hsvToRGB.apply(null, this.getHSV());
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
  var options = this.options;
  var sliderPart = closest(event.target, '.' + options.cssPrefix + 'slider-part');
  var cache;

  cache = this._dragDataCache = {
    isColorSlider: hasClass(sliderPart, options.cssPrefix + 'slider-left'),
    parentElement: sliderPart
  };

  return cache;
};

/**
 * Click event handler
 * @param {object} clickEvent - Click event from Drag module
 */
Slider.prototype._onClick = function(clickEvent) {
  var cache = this._prepareColorSliderForMouseEvent(clickEvent);
  var mousePos = getMousePosition(clickEvent.originEvent, cache.parentElement);

  if (cache.isColorSlider) {
    this._moveColorSliderByPosition(mousePos[0], mousePos[1]);
  } else {
    this._moveHueByPosition(mousePos[1]);
  }

  this._dragDataCache = null;
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
  var cache = this._dragDataCache;
  var mousePos = getMousePosition(dragEvent.originEvent, cache.parentElement);

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

CustomEvents.mixin(Slider);

module.exports = Slider;
