'use strict';

var ColorPicker = require('../src/js/factory');
var snippet = require('tui-code-snippet');

describe('ColorPicker', function() {
  // hostnameSent module scope variable can not be reset.
  // maintain cases with xit as it always fail, if you want to test these cases, change xit to fit one by one
  describe('usageStatistics', function() {
    // eslint-disable-next-line no-unused-vars
    var colorPicker, el;

    beforeEach(function() {
      spyOn(snippet, 'sendHostname');
      el = document.createElement('div');
    });

    it('should send hostname by default', function() {
      colorPicker = new ColorPicker({
        container: el
      });

      expect(snippet.sendHostname).toHaveBeenCalled();
    });

    it('should not send hostname on usageStatistics option false', function() {
      colorPicker = new ColorPicker({
        container: el,
        usageStatistics: false
      });

      expect(snippet.sendHostname).not.toHaveBeenCalled();
    });
  });
});
