'use strict';

var colorUtil = require('../src/js/colorUtil');

describe('colorutil', function() {
  it('isValidRGB() should check whether it is valid hex codes', function() {
    expect(colorUtil.isValidRGB('werwerwer')).toBe(false);
    expect(colorUtil.isValidRGB('a[]2199')).toBe(false);
    expect(colorUtil.isValidRGB('#[]2199')).toBe(false);
    expect(colorUtil.isValidRGB('#a9a9a9')).toBe(true);
    expect(colorUtil.isValidRGB('#1234rr')).toBe(false);
  });

  it('hexToRgb() should convert hex code to rgb values', function() {
    expect(colorUtil.hexToRGB('#ffffff')).toEqual([255, 255, 255]);
    expect(colorUtil.hexToRGB('#f7ca88')).toEqual([247, 202, 136]);
  });

  it('rgbToHSV() should convert rgb values to hsv values', function() {
    var hsv = colorUtil.rgbToHSV(247, 202, 136);
    expect(hsv).toEqual([36, 45, 97]);
    expect(colorUtil.rgbToHSV(255, 255, 0)).toEqual([60, 100, 100]);
  });

  it('hsvToRGB() should convert hsv values to rgb values', function() {
    expect(colorUtil.hsvToRGB(0, 100, 100)).toEqual([255, 0, 0]);
    expect(colorUtil.hsvToRGB(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it('rgbToHEX() should convert rgb values to hex codes', function() {
    expect(colorUtil.rgbToHEX(255, 0, 0)).toBe('#ff0000');
    expect(colorUtil.rgbToHEX(255, 255, 255)).toBe('#ffffff');
    expect(colorUtil.rgbToHEX(0, 0, 0)).toBe('#000000');
    expect(colorUtil.rgbToHEX(0, 0, 0)).toBe('#000000');
    expect(colorUtil.rgbToHEX(255, 153, 51)).toBe('#ff9933');
  });
});
