const webpack = require('webpack');
const common = require('./webpack.config.common');

const prodConfig = Object.assign({}, common, {
  plugins: common.plugins.concat([
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ])
});

delete prodConfig.devtool;

module.exports = prodConfig;
