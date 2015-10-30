/**
 * @fileoverview Colorpicker layout module
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';
var util = global.tui.util;
var View = require('./core/view');
var tmpl = require('../template/layout');

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

    this.render();
}

util.inherit(Layout, View);

/**
 * @override
 */
Layout.prototype.render = function() {
    var html = tmpl.replace(/{{cssPrefix}}/g, this.options.cssPrefix);
    this.container.innerHTML = html;
};

module.exports = Layout;

