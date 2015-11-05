var colorutil = tui.component.colorpicker.colorutil;
describe('colorutil', function() {
    it('isValidRGB() can validate rgb hex string.', function() {
        expect(colorutil.isValidRGB('werwerwer')).toBe(false);
        expect(colorutil.isValidRGB('a[]2199')).toBe(false);
        expect(colorutil.isValidRGB('#[]2199')).toBe(false);
        expect(colorutil.isValidRGB('#a9a9a9')).toBe(true);
        expect(colorutil.isValidRGB('#1234rr')).toBe(false);
    });
});
