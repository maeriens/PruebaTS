const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const baseConfig = require('./webpack.base');

const PRODUCTION_MODE = 'production';

process.env.BABEL_ENV = PRODUCTION_MODE;
process.env.NODE_ENV = PRODUCTION_MODE;

const prodConfig = {
  mode: PRODUCTION_MODE,
  devtool: 'nosources-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin()
    ]
  },
};

module.exports = merge(baseConfig, prodConfig);
