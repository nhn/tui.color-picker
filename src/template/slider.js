/* eslint strict:0 */
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
'<v:rect fillcolor="#000000" style="width:100px;height:100px;"></v:rect>',
'<v:shape fillcolor="red" style="position:relative;top:1;left:1;width:100px;height:100px" path="m 1, 1 1 1,200, 200,200, 200,1 x e"></v:shape>',
'</div>'].join('\n');

var isOldBrowser = util.browser.msie && (util.browser.version < 9);

if (isOldBrowser) {
    global.document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
}

module.exports = {
    layout: layout,
    canvas: isOldBrowser ? vml : svg
};
