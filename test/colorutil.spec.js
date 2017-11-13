'use strict';

// var colorutil = require('../src/js/colorutil');
var colorutil = require('../src/js').colorutil;

describe('colorutil', function() {
    it('isValidRGB() can validate rgb hex string.', function() {
        expect(colorutil.isValidRGB('werwerwer')).toBe(false);
        expect(colorutil.isValidRGB('a[]2199')).toBe(false);
        expect(colorutil.isValidRGB('#[]2199')).toBe(false);
        expect(colorutil.isValidRGB('#a9a9a9')).toBe(true);
        expect(colorutil.isValidRGB('#1234rr')).toBe(false);
    });

    it('hexToRgb()', function() {
        expect(colorutil.hexToRGB('#ffffff')).toEqual([255, 255, 255]);
        expect(colorutil.hexToRGB('#f7ca88')).toEqual([247, 202, 136]);
    });

    it('rgbToHSV()', function() {
        var hsv = colorutil.rgbToHSV(247, 202, 136);
        expect(hsv).toEqual([36, 45, 97]);
        expect(colorutil.rgbToHSV(255, 255, 0)).toEqual([60, 100, 100]);
    });

    it('hsvToRGB()', function() {
        // 색상각도 0, 채도 100, 명도 100 => 붉은색
        expect(colorutil.hsvToRGB(0, 100, 100)).toEqual([255, 0, 0]);

        // 색상각도 0, 채도 0, 명도 0 => 검정색
        expect(colorutil.hsvToRGB(0, 0, 0)).toEqual([0, 0, 0]);
    });

    it('rgbToHEX()', function() {
        expect(colorutil.rgbToHEX(255, 0, 0)).toBe('#ff0000');
        expect(colorutil.rgbToHEX(255, 255, 255)).toBe('#ffffff');
        expect(colorutil.rgbToHEX(0, 0, 0)).toBe('#000000');
        expect(colorutil.rgbToHEX(0, 0, 0)).toBe('#000000');
        expect(colorutil.rgbToHEX(255, 153, 51)).toBe('#ff9933');
    });
});
