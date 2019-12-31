/**
 * @fileoverview The base class of views.
 * @author NHN. FE Development Team <dl_javascript@nhn.com>
 */

'use strict';

var addClass = require('tui-code-snippet/domUtil/addClass');
var isFunction = require('tui-code-snippet/type/isFunction');
var isNumber = require('tui-code-snippet/type/isNumber');
var isUndefined = require('tui-code-snippet/type/isUndefined');
var domUtil = require('./domUtil');
var Collection = require('./collection');
var util = require('../util');

/**
 * Base class of views.
 *
 * All views create own container element inside supplied container element.
 * @constructor
 * @param {options} options The object for describe view's specs.
 * @param {HTMLElement} container Default container element for view. you can use this element for this.container syntax.
 * @ignore
 */
function View(options, container) {
  var id = util.generateId();

  options = options || {};

  if (isUndefined(container)) {
    container = domUtil.appendHTMLElement('div');
  }

  addClass(container, 'tui-view-' + id);

  /**
   * unique id
   * @type {number}
   */
  this.id = id;

  /**
   * base element of view.
   * @type {HTMLDIVElement}
   */
  this.container = container;

  /**
   * child views.
   * @type {Collection}
   */
  this.childs = new Collection(function(view) {
    return view.id;
  });

  /**
   * parent view instance.
   * @type {View}
   */
  this.parent = null;
}

/**
 * Add child views.
 * @param {View} view The view instance to add.
 * @param {function} [fn] Function for invoke before add. parent view class is supplied first arguments.
 */
View.prototype.addChild = function(view, fn) {
  if (fn) {
    fn.call(view, this);
  }
  // add parent view
  view.parent = this;

  this.childs.add(view);
};

/**
 * Remove added child view.
 * @param {(number|View)} id View id or instance itself to remove.
 * @param {function} [fn] Function for invoke before remove. parent view class is supplied first arguments.
 */
View.prototype.removeChild = function(id, fn) {
  var view = isNumber(id) ? this.childs.items[id] : id;

  if (fn) {
    fn.call(view, this);
  }

  this.childs.remove(view.id);
};

/**
 * Render view recursively.
 */
View.prototype.render = function() {
  this.childs.each(function(childView) {
    childView.render();
  });
};

/**
 * Invoke function recursively.
 * @param {function} fn - function to invoke child view recursively
 * @param {boolean} [skipThis=false] - set true then skip invoke with this(root) view.
 */
View.prototype.recursive = function(fn, skipThis) {
  if (!isFunction(fn)) {
    return;
  }

  if (!skipThis) {
    fn(this);
  }

  this.childs.each(function(childView) {
    childView.recursive(fn);
  });
};

/**
 * Resize view recursively to parent.
 */
View.prototype.resize = function() {
  var args = Array.prototype.slice.call(arguments),
    parent = this.parent;

  while (parent) {
    if (isFunction(parent._onResize)) {
      parent._onResize.apply(parent, args);
    }

    parent = parent.parent;
  }
};

/**
 * Invoking method before destroying.
 */
View.prototype._beforeDestroy = function() {};

/**
 * Clear properties
 */
View.prototype._destroy = function() {
  this._beforeDestroy();
  this.container.innerHTML = '';

  this.id = this.parent = this.childs = this.container = null;
};

/**
 * Destroy child view recursively.
 * @param {boolean} isChildView - Whether it is the child view or not
 */
View.prototype.destroy = function(isChildView) {
  if (this.childs) {
    this.childs.each(function(childView) {
      childView.destroy(true);
      childView._destroy();
    });
    this.childs.clear();
  }

  if (isChildView) {
    return;
  }

  this._destroy();
};

/**
 * Calculate view's container element bound.
 * @returns {object} The bound of container element.
 */
View.prototype.getViewBound = function() {
  var bound = this.container.getBoundingClientRect();

  return {
    x: bound.left,
    y: bound.top,
    width: bound.right - bound.left,
    height: bound.bottom - bound.top
  };
};

module.exports = View;
