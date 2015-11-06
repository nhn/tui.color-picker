/**
 * @fileoverview Slider template
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;

var layout = [
'<div class="{{cssPrefix}}slider">{{slider}}</div>'
].join('\n');

var SVGSlider = [
'<svg class="{{cssPrefix}}svg-slider" width="100%">',
    '<defs>',
        '<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">',
            '<stop offset="0%" stop-color="rgb(255,255,255)" />',
            '<stop offset="100%" stop-color="rgb(255,0,0)" />',
        '</linearGradient>',
        '<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">',
            '<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />',
            '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',
        '</linearGradient>',
    '</defs>',
    '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>',
    '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>',
'</svg>'].join('\n');

var VMLSlider = [
'<div class="{{cssPrefix}}vml-slider-wrap">',
'<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider">',
    '<v:fill type="gradient" method="sigma" colors="0% rgb(255,0,0), 100% rgb(255,255,255)" angle="90" class="{{cssPrefix}}vml" />',
'</v:rect>',
'<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider">',
    '<v:fill type="gradient" method="sigma" colors="0% rgb(0,0,0)" opacity="0%" class="{{cssPrefix}}vml" />',
'</v:rect>',
'</div>'].join('\n');

var isOldBrowser = util.browser.msie && (util.browser.version < 9);

if (isOldBrowser) {
    global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
}

module.exports = {
    layout: layout,
    slider: isOldBrowser ? VMLSlider : SVGSlider
};
