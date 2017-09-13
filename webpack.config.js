/**
 * webpack.config.js created on 2016. 12. 01.
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var SafeUmdPlugin = require('safe-umd-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.argv.indexOf('-p') > -1;

var FILENAME = pkg.name + (isProduction ? '.min.js' : '.js');
var CSS_FILENAME = pkg.name + (isProduction ? '.min.css' : '.css');
var BANNER = [
    'Toast UI Colorpicker',
    '@version ' + pkg.version,
    '@author ' + pkg.author,
    '@license ' + pkg.license
].join('\n');

module.exports = {
    eslint: {
        failOnError: isProduction
    },
    entry: [
        './src/styl/' + pkg.name + '.styl',
        './src/index.js'
    ],
    output: {
        library: ['tui', 'colorPicker'],
        libraryTarget: 'umd',
        path: 'dist',
        publicPath: 'dist',
        filename: FILENAME
    },
    externals: {
        'tui-code-snippet': {
            'commonjs': 'tui-code-snippet',
            'commonjs2': 'tui-code-snippet',
            'amd': 'tui-code-snippet',
            'root': ['tui', 'util']
        }
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader'),
                include: path.join(__dirname, 'src/styl')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(CSS_FILENAME),
        new webpack.BannerPlugin(BANNER),
        new SafeUmdPlugin()
    ],
    devServer: {
        historyApiFallback: false,
        progress: true,
        inline: true,
        host: '0.0.0.0',
        disableHostCheck: true
    }
};
