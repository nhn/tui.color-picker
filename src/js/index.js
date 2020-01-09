'use strict';

var Collection = require('./core/collection');
var View = require('./core/view');
var Drag = require('./core/drag');
var create = require('./factory');
var Palette = require('./palette');
var Slider = require('./slider');
var colorUtil = require('./colorUtil');
var svgvml = require('./svgvml');

var colorPicker = {
  Collection: Collection,
  View: View,
  Drag: Drag,

  create: create,
  Palette: Palette,
  Slider: Slider,
  colorutil: colorUtil,
  svgvml: svgvml
};

module.exports = colorPicker;
