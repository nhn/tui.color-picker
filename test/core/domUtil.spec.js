'use strict';

var domUtil = require('../../src/js/core/domUtil');

describe('domutil', function() {
  describe('appendHTMLElement()', function() {
    it('should append a newly created element to document.body', function() {
      var div = domUtil.appendHTMLElement('div');
      var image = domUtil.appendHTMLElement('img');

      div.id = 'freshDiv';

      expect(div.nodeName).toBe('DIV');
      expect(image.nodeName).toBe('IMG');
      expect(document.getElementById('freshDiv')).toBe(div);
    });

    it('should append a newly created element to the particular element', function() {
      var wrap = domUtil.appendHTMLElement('div');
      var img = domUtil.appendHTMLElement('img', wrap);

      wrap.id = 'freshWrapDiv';

      expect(document.getElementById('freshWrapDiv').childNodes[0]).toBe(img);
    });

    it('should create a new element with its classNames', function() {
      var el = domUtil.appendHTMLElement('div', null, 'my-wrap');

      expect(el.className).toBe('my-wrap');
    });
  });
});
