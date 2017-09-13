module.exports = {
    "extends": "tui",
    "env": {
        "browser": true,
        "amd": true,
        "node": true,
        "jasmine": true
    },
    "globals": {
        "tui": true,
        "loadFixtures": true
    },
    "rules": {
        // [temporarily] turn to warning after eslint v4
        "no-shadow": [1],
        "no-implicit-coercion": [1],
        "consistent-this": [1],
        "consistent-return": [1],
        "no-useless-escape": [1],
        "no-mixed-operators": [1],
        "max-nested-callbacks": [1],
        "no-extra-boolean-cast": [1],
        "indent": [1],
        "max-statements-per-line": [1]
    }
}
