var webpack = require('webpack');
var _ = require('underscore');
var devServerPort = '8080';
var config = require('./main.config.js');

config = _.extend(config, {
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
//  devtool: 'sourcemap',
  devtool: 'cheap-module-eval-source-map',
  output: {
    publicPath: '//localhost:' + devServerPort + '/webpack/'
  },
  devServer: {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
});

//config.plugins.push(
//  new webpack.optimize.CommonsChunkPlugin('common', 'common-bundle.js')
//);

module.exports = config;
