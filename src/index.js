'use strict';

var domutil = require('./js/core/domutil');
var domevent = require('./js/core/domevent');
var Collection = require('./js/core/collection');
var View = require('./js/core/view');
var Drag = require('./js/core/drag');
var create = require('./js/factory');
var Palette = require('./js/palette');
var Slider = require('./js/slider');
var colorutil = require('./js/colorutil');
var svgvml = require('./js/svgvml');

var colorPicker = {
    domutil: domutil,
    domevent: domevent,
    Collection: Collection,
    View: View,
    Drag: Drag,

    create: create,
    Palette: Palette,
    Slider: Slider,
    colorutil: colorutil,
    svgvml: svgvml
};

module.exports = colorPicker;
