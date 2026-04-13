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
    // Same idea as nginx try_files $uri $uri.html: clean URLs without .html
    historyApiFallback: {
      rewrites: [
        { from: /^\/privacy\/?$/, to: '/privacy.html' },
        { from: /^\/en\/privacy\/?$/, to: '/en/privacy.html' },
      ],
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
