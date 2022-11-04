const { mergeWithRules } = require('webpack-merge');
const portfinder = require('portfinder');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseConfig = require('./webpack.base');

const DEVELOPMENT_MODE = 'development';

process.env.BABEL_ENV = DEVELOPMENT_MODE;
process.env.NODE_ENV = DEVELOPMENT_MODE;

const HOST = process.env.HOST || 'localhost';

portfinder.basePort = 8001;
async function startDevServer() {
  // Find a suitable port
  const port = await portfinder.getPortPromise();

  // Override some configuration for development environment
  const devConfig = {
    mode: DEVELOPMENT_MODE,
    devtool: 'eval-source-map',
    devServer: {
      client: {
        overlay: {
          errors: true
        },
        logging: 'warn'
      },
      compress: true,
      devMiddleware: {
        writeToDisk: true,
        publicPath: '/'
      },
      allowedHosts: 'all',
      historyApiFallback: true,
      host: HOST,
      hot: true,
      port
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ReactRefreshPlugin()
    ]
  };

  // This is so the react-refresh rule overrides the default in webpack.base.js
  const merged = mergeWithRules({
    module: {
      rules: {
        test: 'match',
        use: {
          loader: 'match',
          options: 'replace',
        },
      },
    },
  })(baseConfig, devConfig);

  return merged;
}

module.exports = startDevServer();
