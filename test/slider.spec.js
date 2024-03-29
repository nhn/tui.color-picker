'use strict';

var Slider = require('@/slider');
var svgvml = require('@/svgvml');
var colorUtil = require('@/colorUtil');

var undef = (function() {})();
describe('Slider', function() {
  var inst;
  var colorslider = { name: 'colorslider' };
  var huehandle = { name: 'huehandle' };
  var gradient = { name: 'gradient' };
  var sliderSvg = {
    getClientRects: function() {
      return { height: 122 };
    }
  };
  var huebarSvg = {
    getClientRects: function() {
      return { height: 122 };
    }
  };

  beforeEach(function() {
    var el = document.createElement('div');
    inst = new Slider({}, el);
    inst.sliderHandleElement = colorslider;
    inst.huebarHandleElement = huehandle;
    inst.baseColorElement = gradient;
    inst.sliderSvgElement = sliderSvg;
    inst.huebarSvgElement = huebarSvg;

    svgvml.setTranslateXY = jest.fn();
    svgvml.setStrokeColor = jest.fn();
    svgvml.getTranslateXY = jest.fn();
    inst.fire = jest.fn();
  });

  describe('_moveColorSliderHandle()', function() {
    beforeEach(function() {
      svgvml.getTranslateXY.mockReturnValue([0, 0]);
    });

    it('should move the selected point of the slider by supplied position', function() {
      inst._moveColorSliderHandle(10, 10);

      expect(svgvml.setTranslateXY).toHaveBeenCalledWith(colorslider, 10, 10);
    });

    it('should change stroke color of the slider for the visibility', function() {
      // The value exceeded 50% then set strokecolor white
      inst._moveColorSliderHandle(10, 60);

      expect(svgvml.setStrokeColor).toHaveBeenCalledWith(colorslider, 'white');
    });

    it('should silence firing custom events', function() {
      inst._moveColorSliderHandle(10, 10, true);

      expect(inst.fire).not.toHaveBeenCalled();
    });
  });

  describe('moveSaturationAndValue()', function() {
    beforeEach(function() {
      inst._moveColorSliderHandle = jest.fn();
    });

    it('should move the selected point of the slider by supplied s, v values', function() {
      // saturation 0%, value 0%
      inst.moveSaturationAndValue(0, 0);

      // value is 100% because the value in HSV color model is invert coordinates.
      // because of handle center point caculation. min, max is not 0, 100
      expect(inst._moveColorSliderHandle).toHaveBeenCalledWith(-7, 105, undef);
    });
  });

  describe('_moveHueHandle()', function() {
    beforeEach(function() {
      svgvml.setTranslateY = jest.fn();
      svgvml.setGradientColorStop = jest.fn();

      svgvml.getTranslateXY.mockReturnValue([0, 0]);
    });

    it('should move the selected point of the hue slider by supplied pixel value', function() {
      inst._moveHueHandle(10);

      expect(svgvml.setTranslateY).toHaveBeenCalledWith(huehandle, 10);
    });

    it('should change the base gradient color of the slider', function() {
      colorUtil.rgbToHEX = jest.fn().mockReturnValue('good');
      inst._moveHueHandle(30);

      expect(svgvml.setGradientColorStop).toHaveBeenCalledWith(gradient, 'good');
    });

    it('should silence firing custom events', function() {
      inst._moveHueHandle(30, true);

      expect(inst.fire).not.toHaveBeenCalled();
    });
  });

  describe('moveHue()', function() {
    beforeEach(function() {
      inst._moveHueHandle = jest.fn();
    });

    it('should move the selected point of the hue slider by supplied degree', function() {
      // hue 30 degree -> 9.58px
      // 118(huebar height + handler height half) * 30(hue degree) / 359.99(max hue degree) = 9.833
      // 9.83 - 3 (handler height half)
      inst.moveHue(30);

      expect(inst._moveHueHandle.mock.calls[0][0]).toBeCloseTo(6.83);
    });
  });
});
