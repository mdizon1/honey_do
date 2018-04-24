var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')


var use;
if(env.NODE_ENV === 'production') {
  use = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader', options: { minimize: env.NODE_ENV === 'production', importLoaders: 1, sourceMap: true } },
      { loader: 'postcss-loader', options: { sourceMap: true } },
      'resolve-url-loader',
      { loader: 'sass-loader', options: { sourceMap: true } },
      { loader: 'sass-resources-loader', 
        options: {
          resources: path.join(__dirname, "../", "../", "../", "app", "javascript", "styles", "common.scss")
        }
      }
    ]
  })
}else{
  use = [
    { loader: 'style-loader', options: { sourceMap: true } },
    { loader: 'css-loader', options: { minimize: false, importLoaders: 1, sourceMap: true } },
    { loader: 'postcss-loader', options: { sourceMap: true } },
    'resolve-url-loader',
    { loader: 'sass-loader', options: { sourceMap: true } },
    { loader: 'sass-resources-loader', 
      options: {
        resources: path.join(__dirname, "../", "../", "../", "app", "javascript", "styles", "common.scss")
      }
    }
  ]
}

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: use
}
