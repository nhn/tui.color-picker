/*eslint-disable*/
var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: [
            'browserify',
            'jasmine'
        ],
        files: [
            'bower_components/jquery/jquery.js',
            'bower_components/tui-code-snippet/code-snippet.js',
            'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
            'index.js',
            'src/**/*.js',
            'test/prepare.js',
            'test/**/*.spec.js',
            'test/fixtures/**/*'
        ],
        exclude: [],
        preprocessors: {
            'index.js': ['browserify'],
            'src/**/*.js': ['browserify'],
            'src/js/view/template/helper.js': ['browserify']
        },
        browserify: {
            debug: true,
            bundleDelay: 1000,
            transform:[istanbul({
                ignore: [
                    'index.js',
                    '**/test/**',
                    '**/template/**'
                ]
            })]
        },
        reporters: [
            'dots',
            'coverage',
            'junit'
        ],
        coverageReporter: {
            type: 'html',
            dir: 'report/coverage'
        },
        junitReporter: {
            outputDir: 'report/junit',
            suite: ''
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        browserNoActivityTimeout: 30000,
        browserStack: {
            username: process.env.BROWSER_STACK_USERNAME,
            accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
            project: 'tui-component-colorpicker'
        },
        browsers: [
            //'bs_ie7',
            'bs_ie8',
            'bs_ie9',
            'bs_ie10',
            'bs_ie11',
            'bs_edge',
            'bs_chrome_mac',
            'bs_firefox_mac'
        ],
        customLaunchers: {
            bs_ie7: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: 'XP',
                browser_version: '7.0',
                browser: 'ie'
            },
            bs_ie8: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: 'XP',
                browser_version: '8.0',
                browser: 'ie'
            },
            bs_ie9: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: '7',
                browser_version: '9.0',
                browser: 'ie'
            },
            bs_ie10: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: '7',
                browser_version: '10.0',
                browser: 'ie'
            },
            bs_ie11: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: '7',
                browser_version: '11.0',
                browser: 'ie'
            },
            bs_edge: {
                base: 'BrowserStack',
                os: 'Windows',
                os_version: '10',
                browser: 'edge',
                browser_version: '12.0'
            },
            bs_chrome_mac: {
                base: 'BrowserStack',
                os: 'OS X',
                os_version: 'El Capitan',
                browser: 'chrome',
                browser_version: '47.0'
            },
            bs_firefox_mac: {
                base: 'BrowserStack',
                os: 'OS X',
                os_version: 'El Capitan',
                browser: 'firefox',
                browser_version: '43.0'
            }
        }
    });
};
