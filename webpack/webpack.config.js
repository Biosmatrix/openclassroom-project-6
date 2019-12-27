const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = ({ env }) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const envConfig = require(`./webpack.config.${env}.js`);

  return webpackMerge(commonConfig, envConfig);
};
