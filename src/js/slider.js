/**
 * @fileoverview Slider view
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;
var domutil = require('./core/domutil');
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
        options = this.options,
        html = tmpl.layout;

    html = html.replace(/{{slider}}/, tmpl.slider);
    html = html.replace(/{{huebar}}/, tmpl.huebar);
    html = html.replace(/{{cssPrefix}}/g, options.cssPrefix);

    that.container.innerHTML = html;

    that.sliderPointElement = domutil.find('.' + options.cssPrefix + 'slider-handle', that.container);
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
        absMin, maxValue, top, left;

    topPercent = topPercent || 0;
    leftPercent = leftPercent || 0;

    absMin = Math.abs(SVG_POS_LIMIT_RANGE[0]);
    maxValue = absMin + SVG_POS_LIMIT_RANGE[1];

    // 100 : maxValue = x : topPercent
    top = ((topPercent / 100) * maxValue) - absMin;
    left = ((leftPercent / 100) * maxValue) - absMin;

    if (this.isOldBrowser) {
        pointElement.style.top = top + 'px';
        pointElement.style.left = left + 'px';
        return;
    }

    pointElement.setAttribute('transform', 'translate(' + left + ',' + top + ')');
};

util.CustomEvents.mixin(Slider);

module.exports = Slider;

