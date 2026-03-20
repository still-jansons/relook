const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
