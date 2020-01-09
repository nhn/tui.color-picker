/**
 * Configs file for bundling
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function getOptimization(isMinified) {
  if (isMinified) {
    return {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          extractComments: false
        }),
        new OptimizeCSSAssetsPlugin()
      ]
    };
  }

  return {
    minimize: false
  };
}

module.exports = function(env, argv) {
  var isProduction = argv.mode === 'production';
  var isMinified = !!argv.minify;
  var FILENAME = pkg.name + (isMinified ? '.min' : '');
  var BANNER = [
    'TOAST UI Color Picker',
    '@version ' + pkg.version,
    '@author ' + pkg.author,
    '@license ' + pkg.license
  ].join('\n');

  return {
    mode: isProduction ? 'production' : 'development',
    entry: ['./src/styl/' + pkg.name + '.styl', './src/js/index.js'],
    output: {
      library: ['tui', 'colorPicker'],
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist',
      filename: FILENAME + '.js'
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
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
          include: path.join(__dirname, 'src/styl')
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: FILENAME + '.css' }),
      new webpack.BannerPlugin(BANNER)
    ],
    optimization: getOptimization(isMinified),
    devServer: {
      historyApiFallback: false,
      progress: true,
      inline: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};
