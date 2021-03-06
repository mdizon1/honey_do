// Note: You must restart bin/webpack-dev-server for changes to take effect

const merge = require('webpack-merge')
const sharedConfig = require('./shared.js')
const { settings, output } = require('./configuration.js')

//const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(sharedConfig, {
  devtool: 'cheap-eval-source-map',

  stats: {
    errorDetails: true
  },

  output: {
    pathinfo: true
  },

  devServer: {
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    contentBase: output.path,
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    lazy: false,
    //    inline: true,
    //    hot: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }
  },

  // For testing prod like environment with css extracted
//  plugins:[
//    new ExtractTextPlugin('[name].css'),
//  ]
})
