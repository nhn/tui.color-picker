'use strict';

var domutil = require('./core/domutil');
var domevent = require('./core/domevent');
var Collection = require('./core/collection');
var View = require('./core/view');
var Drag = require('./core/drag');
var create = require('./factory');
var Palette = require('./palette');
var Slider = require('./slider');
var colorutil = require('./colorutil');
var svgvml = require('./svgvml');

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
