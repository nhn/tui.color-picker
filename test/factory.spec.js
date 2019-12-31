'use strict';

var util = require('../src/js/util');
var ColorPicker = require('../src/js/factory');

describe('ColorPicker', function() {
  describe('usageStatistics', function() {
    // eslint-disable-next-line no-unused-vars
    var colorPicker, el;

    beforeEach(function() {
      spyOn(util, 'sendHostName');
      el = document.createElement('div');
    });

    it('should send a hostname by default', function() {
      colorPicker = new ColorPicker({
        container: el
      });

      expect(util.sendHostName).toHaveBeenCalled();
    });

    it('should not send a hostname if usageStatistics option is false', function() {
      colorPicker = new ColorPicker({
        container: el,
        usageStatistics: false
      });

      expect(util.sendHostName).not.toHaveBeenCalled();
    });
  });
});
