const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const CleanWebpackPlugin = require('clean-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const CopyWebpackPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/js/index.js'),
    vendor: path.resolve(__dirname, '../src/js/vendor.js'),
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/public'),
        to: 'public',
        ignore: ['index.html'],
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/public/index.html'),
    }),
  ],
  resolve: {
    extensions: ['*', '.js'],
    alias: {
      '~': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jp(e*)g|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'img',
            },
          },
        ],
      },
      {
        test: /\.(eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'fonts',
          },
        },
      },
    ],
  },
};
