var Slider = window.tui.component.colorpicker.Slider;
describe('view:Slider', function() {
    var inst;

    beforeEach(function() {
        var el = document.createElement('div');
        inst = new Slider({}, el);
    });

    xdescribe('moveSliderPercent()', function() {
        beforeEach(function() {
            inst.sliderHandleElement = jasmine.createSpyObj('pointElement', ['setAttribute']);
            inst.sliderHandleElement.style = {};
        });
        
        it('Move colorslider point by supplied top, left, percent.', function() {
            inst.moveSliderPercent(0, 0);

            expect(inst.sliderHandleElement.setAttribute).toHaveBeenCalledWith(
                'transform',
                'translate(-7.5,-7.5)'
            );

            inst.moveSliderPercent(100, 100);

            expect(inst.sliderHandleElement.setAttribute).toHaveBeenCalledWith(
                'transform',
                'translate(112,112)'
            );
        });

        it('Manipluate style left, top when browser is not support SVG.', function() {
            var originValue = inst.isOldBrowser,
                style;

            inst.isOldBrowser = true;

            inst.moveSliderPercent(20, 50);

            style = inst.sliderHandleElement.style;

            expect(parseFloat(style.top)).toBeCloseTo(16.4);
            expect(parseFloat(style.left)).toBeCloseTo(52.25);

            // revert override setting
            inst.isOldBrowser = originValue;
        });
    });
});
