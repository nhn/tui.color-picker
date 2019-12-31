'use strict';

var Palette = require('../src/js/palette');

describe('Palette', function() {
  var inst;

  beforeEach(function() {
    jasmine.getFixtures('test.html');

    inst = new Palette({
      preset: ['#000000', '#111111', '']
    });
    inst.render();
  });

  afterEach(function() {
    inst.destroy();
  });

  it('render() should make buttons for each palette colors', function() {
    expect(document.getElementsByTagName('li').length).toBe(3);
  });

  it('should attach the tranparent class to an empty color', function() {
    var li = document.getElementsByTagName('li');
    var lastLi = li[li.length - 1];
    var input = lastLi.getElementsByTagName('input')[0];
    expect(input.className).toContain('tui-colorpicker-color-transparent');
  });

  it('customEvent should also work for the empty color(transparent)', function() {
    var li = document.getElementsByTagName('li');
    var lastLi = li[li.length - 1];
    var input = lastLi.getElementsByTagName('input')[0];
    var callbackFunction = jasmine.createSpy('callbackFunction');

    inst.on('_selectColor', callbackFunction);

    inst._onClick({
      target: input
    });

    expect(callbackFunction.calls.argsFor(0)[0].color).toBe('');
  });
});
