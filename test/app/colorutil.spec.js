var colorutil = tui.component.colorpicker.colorutil;
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
});
