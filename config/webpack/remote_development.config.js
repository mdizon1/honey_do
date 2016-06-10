// NOTE: Use this file when need to access bundle.js from a remote machine
//   Also need to update the webpack dev server script tag(s) in application layout
//   Also need to launch webpack with --host 0.0.0.0
var webpack = require('webpack');
var _ = require('lodash');
var config = require('./main.config.js');
var devServerPort = '8080';
var outputHost = '<ip-of-server>'; // REPLACE: 

config = _.merge(config, {
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
  devtool: 'cheap-module-eval-source-map',
  output: {
    publicPath: '//' + outputHost + ':' + devServerPort + '/webpack/'
  },
  devServer: {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
});

module.exports = config;
