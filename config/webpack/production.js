// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const sharedConfig = require('./shared.js')

module.exports = merge(sharedConfig, {
  output: { filename: '[name]-[chunkhash].js' },
  stats: 'normal',

  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: false,

      compress: {
        warnings: true
      },

      output: {
        comments: false
      }
    }),

    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|json|ico|svg|eot|otf|ttf)$/
    })
  ]
})
