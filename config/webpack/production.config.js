var webpack = require('webpack');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var _ = require('lodash');
var path = require('path');

var config = module.exports = require('./main.config.js');

config.output = _.merge(config.output, {
  path: path.join(config.context, 'public', 'assets'),
  filename: '[name]-bundle-[hash].js',
  chunkFilename: '[id]-bundle-[hash].js',
});

config.plugins.push(
  new webpack.optimize.CommonsChunkPlugin('public', 'common-[hash].js', Infinity),
  new ChunkManifestPlugin({
    filename: 'webpack-common-manifest.json',
    manfiestVariable: 'webpackBundleManifest',
  }),
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.optimize.OccurenceOrderPlugin()
);
