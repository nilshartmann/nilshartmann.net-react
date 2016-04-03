const webpack = require('webpack');
const common = require('./webpack.config.common');

// copy module config from dev config but add 'react-hmre' preset
// to babel-loader config
const moduleCfg = Object.assign({}, common.module, {
  loaders: common.module.loaders.map(loader => {
    if (loader.loader !== 'babel') {
      return loader;
    }

    return Object.assign({}, loader, {
      query: {
        "presets": ["react-hmre"]
      }
    });
  })
});

module.exports = Object.assign({}, common, {
  entry: [
    'webpack-hot-middleware/client'
  ].concat(common.entry),
  module: moduleCfg,
  plugins: common.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ])
});
