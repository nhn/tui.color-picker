/**
 * Configs file for bundling
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env, argv) {
  var isProduction = argv.mode === 'production';
  var FILENAME = pkg.name + (isProduction ? '.min.js' : '.js');
  var CSS_FILENAME = pkg.name + (isProduction ? '.min.css' : '.css');
  var BANNER = [
    'TOAST UI Color Picker',
    '@version ' + pkg.version,
    '@author ' + pkg.author,
    '@license ' + pkg.license
  ].join('\n');

  return {
    mode: 'development',
    entry: ['./src/styl/' + pkg.name + '.styl', './src/js/index.js'],
    output: {
      library: ['tui', 'colorPicker'],
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist',
      filename: FILENAME
    },
    externals: {
      'tui-code-snippet': {
        commonjs: 'tui-code-snippet',
        commonjs2: 'tui-code-snippet',
        amd: 'tui-code-snippet',
        root: ['tui', 'util']
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            failOnError: isProduction
          }
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader'
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'stylus-loader'
          ],
          include: path.join(__dirname, 'src/styl')
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({filename: CSS_FILENAME}),
      new webpack.BannerPlugin(BANNER)
    ],
    devServer: {
      historyApiFallback: false,
      progress: true,
      inline: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};
