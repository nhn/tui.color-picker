/**
 * @fileoverview General drag handler
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var disableTextSelection = require('tui-code-snippet/domUtil/disableTextSelection');
var enableTextSelection = require('tui-code-snippet/domUtil/enableTextSelection');
var getMouseButton = require('tui-code-snippet/domEvent/getMouseButton');
var getTarget = require('tui-code-snippet/domEvent/getTarget');
var off = require('tui-code-snippet/domEvent/off');
var on = require('tui-code-snippet/domEvent/on');
var preventDefault = require('tui-code-snippet/domEvent/preventDefault');
var extend = require('tui-code-snippet/object/extend');

/**
 * @constructor
 * @mixes CustomEvents
 * @param {object} options - options for drag handler
 * @param {number} [options.distance=10] - distance in pixels after mouse must move before dragging should start
 * @param {HTMLElement} container - container element to bind drag events
 * @ignore
 */
function Drag(options, container) {
  on(container, 'mousedown', this._onMouseDown, this);

  this.options = extend(
    {
      distance: 10
    },
    options
  );

  /**
   * @type {HTMLElement}
   */
  this.container = container;

  /**
   * @type {boolean}
   */
  this._isMoved = false;

  /**
   * dragging distance in pixel between mousedown and firing dragStart events
   * @type {number}
   */
  this._distance = 0;

  /**
   * @type {boolean}
   */
  this._dragStartFired = false;

  /**
   * @type {object}
   */
  this._dragStartEventData = null;
}

/**
 * Destroy method.
 */
Drag.prototype.destroy = function() {
  off(this.container, 'mousedown', this._onMouseDown);

  this.options
    = this.container
    = this._isMoved
    = this._distance
    = this._dragStartFired
    = this._dragStartEventData
    = null;
};

/**
 * Toggle events for mouse dragging.
 * @param {boolean} toBind - bind events related with dragging when supplied "true"
 */
Drag.prototype._toggleDragEvent = function(toBind) {
  var container = this.container;

  if (toBind) {
    disableTextSelection(container);
    on(window, 'dragstart', preventDefault);
    on(
      global.document,
      {
        mousemove: this._onMouseMove,
        mouseup: this._onMouseUp
      },
      this
    );
  } else {
    enableTextSelection(container);
    off(window, 'dragstart', preventDefault);
    off(
      global.document,
      {
        mousemove: this._onMouseMove,
        mouseup: this._onMouseUp
      }
    );
  }
};

/**
 * Normalize mouse event object.
 * @param {MouseEvent} mouseEvent - mouse event object.
 * @returns {object} normalized mouse event data.
 */
Drag.prototype._getEventData = function(mouseEvent) {
  return {
    target: getTarget(mouseEvent),
    originEvent: mouseEvent
  };
};

/**
 * MouseDown DOM event handler.
 * @param {MouseEvent} mouseDownEvent MouseDown event object.
 */
Drag.prototype._onMouseDown = function(mouseDownEvent) {
  // only primary button can start drag.
  if (getMouseButton(mouseDownEvent) !== 0) {
    return;
  }

  this._distance = 0;
  this._dragStartFired = false;
  this._dragStartEventData = this._getEventData(mouseDownEvent);

  this._toggleDragEvent(true);
};

/**
 * MouseMove DOM event handler.
 * @emits Drag#drag
 * @emits Drag#dragStart
 * @param {MouseEvent} mouseMoveEvent MouseMove event object.
 */
Drag.prototype._onMouseMove = function(mouseMoveEvent) {
  var distance = this.options.distance;
  // prevent automatic scrolling.
  preventDefault(mouseMoveEvent);

  this._isMoved = true;

  if (this._distance < distance) {
    this._distance += 1;

    return;
  }

  if (!this._dragStartFired) {
    this._dragStartFired = true;

    /**
     * Drag starts events. cancelable.
     * @event Drag#dragStart
     * @type {object}
     * @property {HTMLElement} target - target element in this event.
     * @property {MouseEvent} originEvent - original mouse event object.
     */
    if (!this.invoke('dragStart', this._dragStartEventData)) {
      this._toggleDragEvent(false);

      return;
    }
  }

  /**
   * Events while dragging.
   * @event Drag#drag
   * @type {object}
   * @property {HTMLElement} target - target element in this event.
   * @property {MouseEvent} originEvent - original mouse event object.
   */
  this.fire('drag', this._getEventData(mouseMoveEvent));
};

/**
 * MouseUp DOM event handler.
 * @param {MouseEvent} mouseUpEvent MouseUp event object.
 * @emits Drag#dragEnd
 * @emits Drag#click
 */
Drag.prototype._onMouseUp = function(mouseUpEvent) {
  this._toggleDragEvent(false);

  // emit "click" event when not emitted drag event between mousedown and mouseup.
  if (this._isMoved) {
    this._isMoved = false;

    /**
     * Drag end events.
     * @event Drag#dragEnd
     * @type {MouseEvent}
     * @property {HTMLElement} target - target element in this event.
     * @property {MouseEvent} originEvent - original mouse event object.
     */
    this.fire('dragEnd', this._getEventData(mouseUpEvent));

    return;
  }

  /**
   * Click events.
   * @event Drag#click
   * @type {MouseEvent}
   * @property {HTMLElement} target - target element in this event.
   * @property {MouseEvent} originEvent - original mouse event object.
   */
  this.fire('click', this._getEventData(mouseUpEvent));
};

CustomEvents.mixin(Drag);

module.exports = Drag;
