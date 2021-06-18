'use strict';

var Palette = require('@/palette');

describe('Palette', function() {
  var inst;

  beforeEach(function() {
    loadFixtures('test.html');

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
    var colorItem = document.getElementsByTagName('li');
    var lastColorItem = colorItem[colorItem.length - 1];
    var paletteButton = lastColorItem.getElementsByTagName('input')[0];
    expect(paletteButton.className).toContain('tui-colorpicker-color-transparent');
  });

  it('customEvent should also work for the empty color(transparent)', function() {
    var colorItem = document.getElementsByTagName('li');
    var lastColorItem = colorItem[colorItem.length - 1];
    var paletteButton = lastColorItem.getElementsByTagName('input')[0];
    var callbackFunction = jest.fn();

    inst.on('_selectColor', callbackFunction);

    inst._onClick({
      target: paletteButton
    });

    expect(callbackFunction).toHaveBeenCalledWith({ color: '' });
  });
});
