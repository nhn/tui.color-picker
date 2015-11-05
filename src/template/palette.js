/* eslint strict:0 */
var layout = [
'<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>',
'<div class="{{cssPrefix}}clearfix" style="overflow:hidden">',
    '<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="자세히" />',
    '<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />',
    '<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',
'</div>'].join('\n');

var item = '<li><input class="{{cssPrefix}}palette-button{{selected}}" type="button" style="background-color:{{color}};color:{{color}}" title="{{color}}" value="{{color}}" /></li>';

module.exports = {
    layout: layout,
    item: item
};
