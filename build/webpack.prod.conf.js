var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
let rootPwd = `${__dirname}/../`

var webpackConfig = merge(baseWebpackConfig, {
  entry: {
    'vue2-tree': './src/index.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  // output: {
  //   path: config.build.assetsRoot,
  //   filename: utils.assetsPath('js/[name].[chunkhash].js'),
  //   chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  // },
  output: {
    path: config.bundle.assetsRoot,
    publicPath: config.bundle.assetsPublicPath,
    filename: '[name].min.js',
    library: 'ZTree',
    libraryTarget: 'umd'
  },
  externals: ['vue', 'chinese-to-pinyin', 'babel-polyfill'],
  plugins: [
    // clean dist folder
    new CleanWebpackPlugin(['dist'], {
            "root": rootPwd,
            "verbose": true
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': config.bundle.env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // filename: utils.assetsPath('css/[name].[contenthash].css')
      filename: 'vue2-tree.min.css'
    }),
    new OptimizeCSSPlugin()
  ]
})
module.exports = webpackConfig
