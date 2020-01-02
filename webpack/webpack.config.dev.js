const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  output: {
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].chunk.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../', 'dist'),
    inline: true,
    historyApiFallback: true,
    compress: true,
    watchContentBase: true,
    // port: 8080,
    // open: 'Google Chrome',
  },
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        // Apply rule for .sass, .scss or .css files
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            // This loader add style to link=href
            loader: 'style-loader',
          },
          {
            // This loader resolves url() and @imports inside CSS
            loader: 'css-loader?sourceMap=true',
          },
          {
            // First we transform SASS to standard CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};
