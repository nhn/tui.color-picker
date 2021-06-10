'use strict';

var View = require('@/core/view');

function pxToNumber(str) {
  return parseInt(str.replace('px', ''), 10);
}

describe('View', function() {
  var view;

  beforeEach(function() {
    loadFixtures('view.html');
  });

  describe('instance', function() {
    afterEach(function() {
      view.destroy();
    });

    it('should make an container element on body when container is not supplied', function() {
      view = new View();
      expect(document.querySelector('.tui-view-' + view.id)).toEqual(view.container);
    });

    it('should set an container by the second parameter', function() {
      var el = document.getElementById('container');
      view = new View(null, el);
      expect(view.container).toEqual(el);
    });
  });

  describe('addChild()', function() {
    var view2;

    beforeEach(function() {
      view = new View();
      view2 = new View();
    });

    afterEach(function() {
      view.destroy();
    });

    it('should add views as childs', function() {
      view.addChild(view2);
      expect(view.childs.has(view2.id)).toBe(true);
    });

    it('should execute a function before adding view as child', function() {
      var spy = jest.fn();

      view.addChild(view2, spy);

      expect(spy).toHaveBeenCalledWith(view);
      expect(view.childs.has(view2.id));
    });
  });

  describe('recursive()', function() {
    var view2, view3;

    beforeEach(function() {
      view = new View();
      view2 = new View();
      view3 = new View();
    });

    afterEach(function() {
      view.destroy();
    });

    it('should invoke a function for each child views recursivly', function() {
      view.addChild(view2);
      view2.addChild(view3);

      view3.recursive = jest.fn();

      view.recursive(function() {});

      expect(view3.recursive).toHaveBeenCalled();
    });

    it('should not invoke a function for the root view if set skipThis to true', function() {
      var spy,
        spyMock = jest.fn();

      view.addChild(view2);
      view2.addChild(view3);
      spy = function() {
        var args = Array.prototype.slice.call(arguments);

        return spyMock.apply(null, args);
      };

      view.recursive(spy, true);

      expect(spyMock).not.toHaveBeenCalledWith(view);
      expect(spyMock).toHaveBeenCalledWith(view2);
      expect(spyMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('destroy()', function() {
    var view2;

    beforeEach(function() {
      view = new View();
      view2 = new View();
      view.addChild(view2);
    });

    it('should destroy child views recursivly', function() {
      jest.spyOn(View.prototype, '_destroy');

      view.destroy();
      expect(View.prototype._destroy).toHaveBeenCalledTimes(2);
      expect(view2).toMatchObject({
        id: null,
        childs: null,
        container: null
      });
    });
  });

  describe('removeChild()', function() {
    var view2;

    beforeEach(function() {
      view = new View();
      view2 = new View();
      view.addChild(view2);
    });

    afterEach(function() {
      view.destroy();
    });

    it('should remove child view by its id', function() {
      view.removeChild(view2.id);
      expect(view.childs.length).toBe(0);
    });

    it('should remove child view by instance itself', function() {
      view.removeChild(view2);
      expect(view.childs.length).toBe(0);
    });

    it('should execute a function before removing a view', function() {
      var spy = jest.fn();
      view.removeChild(view2, spy);
      expect(spy).toHaveBeenCalledWith(view);
    });
  });

  describe('render()', function() {
    var view2;

    beforeEach(function() {
      view = new View();
      view2 = new View();
      view.addChild(view2);
    });

    afterEach(function() {
      view.destroy();
    });

    it('should invoke render method recursively', function() {
      view2.render = jest.fn();
      view.render();
      expect(view2.render).toHaveBeenCalled();
    });
  });

  describe('getViewBound()', function() {
    it('should calculate the bounding box of an container element', function() {
      view = new View(null, document.getElementById('container2'));

      view.container.getBoundingClientRect = jest.fn().mockImplementation(function() {
        var style = this.style;
        var top = pxToNumber(style.top),
          right = pxToNumber(style.left) + pxToNumber(style.width),
          bottom = pxToNumber(style.top) + pxToNumber(style.height),
          left = pxToNumber(style.left);

        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        };
      });

      expect(view.getViewBound()).toEqual({
        x: 10,
        y: 10,
        width: 250,
        height: 200
      });
      expect(view.getViewBound().x).not.toBe(50);
    });
  });

  describe('resize()', function() {
    beforeEach(function() {
      view = new View();
    });

    afterEach(function() {
      view.destroy();
    });

    it('should resize recursivly to each parent instances', function() {
      var view2,
        spy = jest.fn();

      view._onResize = function() {
        var args = Array.prototype.slice.call(arguments);

        return spy.apply(null, args);
      };
      view2 = new View(null, document.getElementById('container3'));

      view.addChild(view2);
      view2.resize(view2);

      expect(spy).toHaveBeenCalledWith(view2);
    });

    it('should resize from the closest to farthest', function() {
      var view2,
        view3,
        spy = jest.fn();

      view._onResize = function() {
        var args = Array.prototype.slice.call(arguments);

        return spy.apply(null, args);
      };
      view2 = new View(null, document.getElementById('container3'));
      view3 = new View(null, document.getElementById('container4'));

      // view <- view2 <- view3
      view.addChild(view2);
      view2.addChild(view3);

      view3.resize(view3);
      expect(spy).toHaveBeenCalledWith(view3);
    });
  });
});
