/**
 * @fileoverview Palette view template
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var template = require('tui-code-snippet/domUtil/template');

module.exports = function(context) {
  var item = [
    '<li><input class="{{cssPrefix}}palette-button{{isSelected @this}}{{getItemClass @this}}" type="button"',
    '{{if isValidRGB @this}}',
    ' style="background-color:{{@this}};color:{{@this}}"',
    '{{/if}}',
    ' title="{{@this}}" value="{{@this}}" /></li>'
  ].join('');

  var layout = [
    '<ul class="{{cssPrefix}}clearfix">',
    '{{each preset}}',
    item,
    '{{/each}}',
    '</ul>',
    '<div class="{{cssPrefix}}clearfix" style="overflow:hidden">',
    '<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />',
    '<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />',
    '<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',
    '</div>'
  ].join('\n');

  return template(layout, context);
};
