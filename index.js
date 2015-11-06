/* eslint vars-on-top:0, strict:0 */
require('tui-code-snippet');

/** @namespace tui.component */
tui.util.defineNamespace('tui.component.colorpicker', {
    domutil: require('./src/js/core/domutil'),
    domevent: require('./src/js/core/domevent'),
    Collection: require('./src/js/core/collection'),
    View: require('./src/js/core/view'),
    Drag: require('./src/js/core/drag'),

    create: require('./src/js/factory'),
    Palette: require('./src/js/palette'),
    colorutil: require('./src/js/colorutil')
});

