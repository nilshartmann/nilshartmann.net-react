const path = require('path');

const mainJs = path.resolve(__dirname, 'client/src/main.jsx');
const outputPath = path.resolve(__dirname, 'client/public/_dist');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  devtool: 'source-map',
  entry:   [
    mainJs
  ],
  output:  {
    path:       outputPath,
    filename:   'main.js',
    publicPath: '/_dist'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module:  {
     loaders: [
      {
        test:    /\.jsx?/,
        loader:  'babel',
        include: path.join(__dirname, 'client/src')
      },
      {
        test:   /\.css$/,
        loader: 'style!css'
      },
      {
        test:   /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap')
      },
      // {
      //   test:   /\.(png|jpg|woff|ttf|woff2|svg|eot)$/,
      //   loader: 'url?limit=25000'
      // }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ]
};
