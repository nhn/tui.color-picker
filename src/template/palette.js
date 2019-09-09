/**
 * @fileoverview Palette view template
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var layout = [
  '<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>',
  '<div class="{{cssPrefix}}clearfix" style="overflow:hidden">',
  '<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />',
  '<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />',
  '<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',
  '</div>'
].join('\n');

var item =
  '<li><input class="{{cssPrefix}}palette-button{{selected}}{{itemClass}}" type="button" style="{{itemStyle}}" title="{{color}}" value="{{color}}" /></li>';
var itemStyle = 'background-color:{{color}};color:{{color}}';

module.exports = {
  layout: layout,
  item: item,
  itemStyle: itemStyle
};
