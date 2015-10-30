/* eslint vars-on-top:0, strict:0 */
require('tui-code-snippet');

/** @namespace tui.component */
tui.util.defineNamespace('tui.component');

tui.component.colorpicker = require('./src/js/factory');
tui.component.colorpicker.env = '{{env}}';

