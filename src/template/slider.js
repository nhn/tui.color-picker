/**
 * @fileoverview Slider template
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var util = global.tui.util;

var layout = [
'<div class="{{cssPrefix}}slider-left">{{slider}}</div>',
'<div class="{{cssPrefix}}slider-right">',
    '<div class="{{cssPrefix}}hue-rail"><span class="{{cssPrefix}}hue-handle">&#9656;</span></div>',
    '{{huebar}}',
'</div>'
].join('\n');

var SVGSlider = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',
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
    '<path class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',
'</svg>'].join('\n');

var VMLSlider = ['<div class="{{cssPrefix}}vml-slider">',
    '<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
        '<v:fill type="gradient" method="sigma" colors="0% rgb(255,0,0), 100% rgb(255,255,255)" angle="90" class="{{cssPrefix}}vml" />',
    '</v:rect>',
    '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
        '<v:fill type="gradient" method="sigma" colors="0% rgb(0,0,0)" opacity="0%" class="{{cssPrefix}}vml" />',
    '</v:rect>',
    '<v:group coordsize="1 1" style="width:1px;height:1px" class="{{cssPrefix}}vml {{cssPrefix}}slider-handle">',
        '<v:shape class="{{cssPrefix}}vml" style="width:1px;height:1px;" path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" />',
    '</v:group>',
'</div>'].join('\n');

var SVGHuebar = ['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',
    '<defs>',
        '<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">',
            '<stop offset="0%" stop-color="rgb(255,0,0)" />',
            '<stop offset="16.666%" stop-color="rgb(255,255,0)" />',
            '<stop offset="33.333%" stop-color="rgb(0,255,0)" />',
            '<stop offset="50%" stop-color="rgb(0,255,255)" />',
            '<stop offset="66.666%" stop-color="rgb(0,0,255)" />',
            '<stop offset="83.333%" stop-color="rgb(255,0,255)" />',
            '<stop offset="100%" stop-color="rgb(255,0,0)" />',
        '</linearGradient>',
    '</defs>',
    '<rect width="100%" height="100%" fill="url(#g)"></rect>',
'</svg>'].join('\n');

var VMLHuebar = ['<div class="{{cssPrefix}}vml-huebar">',
    '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">',
        '<v:fill type="gradient" method="sigma" colors="' +
        '0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)' +
        '" angle="180" class="{{cssPrefix}}vml" />',
    '</v:rect>',
'</div>'].join('\n');

var isOldBrowser = util.browser.msie && (util.browser.version < 9);

if (isOldBrowser) {
    global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
}

module.exports = {
    layout: layout,
    slider: isOldBrowser ? VMLSlider : SVGSlider,
    huebar: isOldBrowser ? VMLHuebar : SVGHuebar
};
