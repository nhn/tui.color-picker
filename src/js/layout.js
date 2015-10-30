/**
 * @fileoverview Colorpicker layout module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var View = require('./core/view');

/**
 * @constructor
 * @extends {View}
 * @param {object} options - option object
 *  @param {string} options.cssPrefix - css prefix for each child elements
 * @param {HTMLDivElement} container - container
 */
function Layout(options, container) {
    View.call(this, options, container);

    /**
     * option object
     * @type {object}
     */
    this.options = util.extend({
        cssPrefix: 'tui-colorpicker-'
    }, options);
}

util.inherit(Layout, View);

module.exports = Layout;

