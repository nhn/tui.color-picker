/**
 * @fileoverview Slider template
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;

var layout = [
'<div class="{{cssPrefix}}slider-canvas">{{canvas}}</div>'
].join('\n');

var svg = [
'<svg id="{{cssPrefix}}canvas" class="{{cssPrefix}}canvas" width="100%">',
'<defs>',
    '<linearGradient id="w" x1="0%" y1="0%" x2="100%" y2="0%">',
        '<stop offset="0%" style="stop-color:rgb(255,255,255);stop-opacity:1" />',
        '<stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:0" />',
    '</linearGradient>',
    '<linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%">',
        '<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />',
        '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',
    '</linearGradient>',
    '<linearGradient id="c" x1="100%" y1="0%" x2="0%" y2="0%">',
        '<stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />',
        '<stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:0" />',
    '</linearGradient>',
'</defs>',
'<rect id="color" width="100%" height="100%" fill="url(#c)">',
'</rect>',
'<rect id="white" width="100%" height="100%" fill="url(#w)">',
'</rect>',
'<rect id="black" width="100%" height="100%" fill="url(#b)">',
'</rect>',
'</svg>'].join('\n');

var vml = [
'<div class="{{cssPrefix}}vml-wrap">',
'<v:rect fillcolor="red" strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
    '<v:fill type="gradient" colors="100% white" opacity="0%" angle="-90" class="{{cssPrefix}}vml" />',
'</v:rect>',
'<v:rect fillcolor="white" strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
    '<v:fill type="gradient" colors="100% white" o:opacity2="0%" angle="90" class="{{cssPrefix}}vml" />',
'</v:rect>',
'<v:rect fillcolor="black" strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
    '<v:fill type="gradient" colors="100% white" opacity="0%" class="{{cssPrefix}}vml" />',
'</v:rect>',
'</div>'].join('\n');

var isOldBrowser = util.browser.msie && (util.browser.version < 9);

if (isOldBrowser) {
    global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
}

module.exports = {
    layout: layout,
    canvas: isOldBrowser ? vml : svg
};
