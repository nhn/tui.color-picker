'use strict';

var Drag = require('@/core/drag');

describe('Drag', function() {
  var mockTarget, mockMouseEvent;
  beforeEach(function() {
    mockTarget = document.createElement('div');
    mockMouseEvent = {
      target: mockTarget,
      button: 0
    };
  });

  describe('_onMouseUp()', function() {
    it('should emit "click" when not emitting drag event between mousedown and mousedown', function() {
      var mock = {
        options: {
          distance: 10
        },
        _distance: 0,
        _isMoved: false,
        _toggleDragEvent: function() {},
        fire: jest.fn(),
        _getEventData: Drag.prototype._getEventData
      };

      Drag.prototype._onMouseUp.call(mock, mockMouseEvent);
      expect(mock.fire).toHaveBeenCalledWith('click', {
        target: mockTarget,
        originEvent: mockMouseEvent
      });

      // alternative to mock._isMoved = true;
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);

      Drag.prototype._onMouseUp.call(mock, mockMouseEvent);
      expect(mock.fire).toHaveBeenCalledWith('dragEnd', {
        target: mockTarget,
        originEvent: mockMouseEvent
      });
    });
  });

  describe('dragging', function() {
    it('_dragStart should fire only once every drag sessions', function() {
      var mock = {
        options: {
          distance: 10
        },
        _distance: 9,
        _dragStartFired: false,
        invoke: jest.fn(),
        fire: jest.fn(),
        _toggleDragEvent: function() {},
        _getEventData: Drag.prototype._getEventData
      };

      Drag.prototype._onMouseDown.call(mock, mockMouseEvent);
      mock._distance = 9;
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);

      expect(mock.invoke).toHaveBeenCalledTimes(1);
    });

    it('should make custom event data from mousedown events', function() {
      var mock = {
        options: {
          distance: 10
        },
        _distance: 10,
        _dragStartFired: false,
        invoke: jest.fn(),
        fire: jest.fn(),
        _toggleDragEvent: function() {},
        _getEventData: Drag.prototype._getEventData
      };

      mock.invoke.mockReturnValue(true);
      Drag.prototype._onMouseDown.call(mock, mockMouseEvent);
      mock._distance = 10;
      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);

      expect(mock.invoke).toHaveBeenCalledWith('dragStart', {
        target: mockTarget,
        originEvent: mockMouseEvent
      });
    });

    it('should stop drag when dragStart event returns false', function() {
      var mock = {
        options: {
          distance: 10
        },
        _distance: 10,
        invoke: jest.fn(),
        _toggleDragEvent: jest.fn(),
        _getEventData: Drag.prototype._getEventData
      };

      mock.invoke.mockReturnValue(false);

      Drag.prototype._onMouseMove.call(mock, mockMouseEvent);

      expect(mock._toggleDragEvent).toHaveBeenCalled();
    });

    it('should start when using a primary mouse button', function() {
      var mock = {
        options: {
          distance: 10
        },
        _distance: 0,
        invoke: jest.fn(),
        _toggleDragEvent: jest.fn(),
        _getEventData: Drag.prototype._getEventData
      };

      mockMouseEvent.button = 2; // primary mouse button is 0.
      Drag.prototype._onMouseDown.call(mock, mockMouseEvent);

      expect(mock._toggleDragEvent).not.toHaveBeenCalled();
    });
  });
});
