/**
 * @fileoverview Slider template
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var util = require('tui-code-snippet');

var layout = [
  '<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>',
  '<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'
].join('\n');

var SVGSlider = [
  '<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',
  '<defs>',
  '<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">',
  '<stop offset="0%" stop-color="rgb(255,255,255)" />',
  '<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />',
  '</linearGradient>',
  '<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">',
  '<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />',
  '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',
  '</linearGradient>',
  '</defs>',
  '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>',
  '<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>',
  '<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',
  '</svg>'
].join('\n');

var VMLSlider = [
  '<div class="{{cssPrefix}}vml-slider">',
  '<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
  '<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />',
  '</v:rect>',
  '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">',
  '<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />',
  '</v:rect>',
  '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"' +
    'path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />',
  '</div>'
].join('\n');

var SVGHuebar = [
  '<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',
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
  '<rect width="18px" height="100%" fill="url(#g)"></rect>',
  '<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />',
  '</svg>'
].join('\n');

var VMLHuebar = [
  '<div class="{{cssPrefix}}vml-huebar">',
  '<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">',
  '<v:fill type="gradient" method="none" colors="' +
    '0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)' +
    '" angle="180" class="{{cssPrefix}}vml" />',
  '</v:rect>',
  '<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"' +
    'path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />',
  '</div>'
].join('\n');

var isOldBrowser = util.browser.msie && util.browser.version < 9;

if (isOldBrowser) {
  global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
}

module.exports = {
  layout: layout,
  slider: isOldBrowser ? VMLSlider : SVGSlider,
  huebar: isOldBrowser ? VMLHuebar : SVGHuebar
};
