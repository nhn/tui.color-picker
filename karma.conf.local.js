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
            'node_modules/karma-jasmine-jquery/lib/jasmine-jquery.js',
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
            dir: 'report/',
            reporters: [{
                type: 'text-summary'
            }, {
                type: 'html'
            }]
        },
        junitReporter: {
            outputDir: 'report/junit',
            suite: ''
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        autoWatchBatchDelay: 1000,
        browsers: ['Chrome'],
        singleRun: false,
        browserNoActivityTimeout: 30000
    });
};
