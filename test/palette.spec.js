'use strict';

var $ = require('jquery');

var Palette = require('../src/js/palette');
describe('view:Palette', function() {
  var inst;

  beforeEach(function() {
    jasmine.getFixtures('test.html');

    inst = new Palette({
      preset: ['#000000', '#111111', '']
    });
    inst.render();
  });

  it('render() makes button for each palette colors.', function() {
    expect($('li').length).toBe(3);
  });

  it('must attach the tranparent class to an empty color.', function() {
    expect($('li:last-child input').hasClass('tui-colorpicker-color-transparent')).toBe(true);
  });

  it('customevent should also work for the empty color for transparent.', function() {
    var target = $('li:last-child input')[0];
    var callbackFunction = jasmine.createSpy('callbackFunction');

    inst.on('_selectColor', callbackFunction);

    inst._onClick({
      target: target
    });

    expect(callbackFunction.calls.argsFor(0)[0].color).toBe('');
  });
});
