const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Require  html-webpack-plugin plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin') //
const CleanWebpackPlugin = require('clean-webpack-plugin') // to remove/clean your build folder(s) before building
const CopyWebpackPlugin = require('copy-webpack-plugin')  //Copies individual files or entire directories to the build directory
const ImageminPlugin = require('imagemin-webpack-plugin').default //uses Imagemin to compress all images in your project.
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const webpack = require('webpack')

const isProduction = process.argv.indexOf('-p') !== -1
// Use this outside because this will be referenced in loader too
const extractPlugin = new ExtractTextPlugin({
  filename: 'css/main.css'
})

const plugins = [
  extractPlugin,
  new CleanWebpackPlugin(['dist'], {}),
  new CleanWebpackPlugin(['images'], {}),
  new CopyWebpackPlugin([{
    from: __dirname + '/src/public/images',
    to: 'images'
  }]),
  new ImageminPlugin({
    disable: !isProduction, // Disable during development
    test: /\.(jpe?g|png|gif|svg)$/i,
    pngquant: {
      quality: '50-80'
    }
  }),
  new BrowserSyncPlugin({
    host: 'localhost',
    port: 7700
  }),
  new HtmlWebpackPlugin({
    template: __dirname + "/src/public/index.html",
    inject: 'body'
  })
]

module.exports = {
  mode: "development",
  entry: __dirname + '/src/app/index.js', // webpack entry point. Module to start building dependency graph
  output: {
    path: path.resolve(__dirname, 'dist'),  // Folder to store generated bundle
    filename: 'bundle.js',  // Name of generated bundle after build
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },
  module: {  // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: extractPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader" // compiles Sass to CSS
          }]
        })
      }
    ]
  },
  plugins,
  devServer: {  // configuration for webpack-dev-server
    contentBase: './src/public',  //source of static assets
    port: 7700, // port to run dev-server
  }
};
