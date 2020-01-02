// eslint-disable-next-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer');

// eslint-disable-next-line import/no-extraneous-dependencies
const cssnano = require('cssnano');

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    plugins: [
      // eslint-disable-next-line global-require
      autoprefixer,
      // eslint-disable-next-line global-require
      cssnano,
      // More postCSS modules here if needed
    ],
  };
}
