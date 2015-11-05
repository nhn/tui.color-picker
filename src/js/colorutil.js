/**
 * @fileoverview Utility methods to manipulate colors
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var RGB_MIN = 0x000000;
var RGB_MAX = 0xffffff;
var hexRX = /^[0-9a-fA-F]{6}$/;

module.exports = {
    /**
     * Check validate of hex string value is RGB
     * @param {string} str - rgb hex string
     * @returns {boolean} return true when supplied str is valid RGB hex string
     */
    isValidRGB: function(str) {
        var hex;

        if (str.length !== 7 || str.charAt(0) !== '#') {
            return false;
        }

        str = str.substring(1);

        if (!hexRX.test(str)) {
            return false;
        }

        hex = parseInt(str, 16);

        if (isNaN(hex)) {
            return false;
        }

        return (hex >= RGB_MIN && hex <= RGB_MAX);
    }
};
