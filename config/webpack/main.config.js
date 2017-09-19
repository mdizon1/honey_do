var path = require('path');
var webpack = require('webpack');

var config = module.exports = {
   // the base path which will be used to resolve entry points
   context: path.join(__dirname, '../', '../'),

   // the main entry point for our application's frontend JS
   //entry: './app/frontend/javascripts/entry.js'
};

config.entry = {
  'public': './app/frontend/javascripts/entry.js'
};

config.output = {
  // this is our app/assets/javascripts directory, which is part of the Sprockets pipeline
  path: path.join(__dirname, 'app', 'assets', 'javascripts'),

  // the filename of the compiled bundle, e.g. app/assets/javascripts/bundle.js
  filename: 'bundle.js',

  // if the webpack code-splitting feature is enabled, this is the path it'll use to download bundles
  publicPath: '/assets',

  // show source files in chrome from a nicer directory rather than webpack://
  devtoolModuleFilenameTemplate: '[resourcePath]',
  devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]',
};

config.resolve = {
  // tell webpack which extensions to auto search when it resolves modules. With this,
  // you'll be able to do `require('./utils')` instead of `require('./utils.js')`
  extensions: ['', '.js'],

  // by default, webpack will search in `web_modules` and `node_modules`. Because we're using
  // Bower, we want it to look in there too
  // modulesDirectories: [ 'node_modules', 'bower_components' ], // not using Bower
};

config.module = {
  rules: [
    {
      test: /\.js$/, 
      exclude: /node_modules/, 
      loader: "babel-loader"
    },
    {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: { presets: ['react', 'es2015'] }
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/font-woff'
      }
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader"
    }
  ]
};

config.sassLoader = {
  includePaths: [path.resolve(__dirname, "../", "../", "./app", "./assets", "./stylesheets")]
};

config.plugins = [
  // we need this plugin to teach webpack how to find module entry points for bower files,
  // as these may not have a package.json file
  //new webpack.ResolverPlugin([
  //  new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
  //]);
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    "window.jQuery": "jquery",
    Tether: "tether",
    "window.Tether": "tether",
    Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
    Button: "exports-loader?Button!bootstrap/js/dist/button",
    Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
    Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
    Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
    Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
    Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
    Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
    Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
    Util: "exports-loader?Util!bootstrap/js/dist/util"
  })
];
