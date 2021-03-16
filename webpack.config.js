const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  name: 'test',
  mode: 'development',
  devtool: 'eval-source-map',
  entry: path.resolve('./src/index.js'),
  output: {
    path: path.resolve('./dist'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./public/index.html'),
      hash: true,
      inject: 'body',
    }),
  ],
  devServer: {
    // // configure any static assets in the component's ./sandbox directory to be served
    // //  under the /static path in the browser
    // static: {
    //   directory: path.resolve('./public'),
    //   watch: true,
    // },
    host: 'localhost',
    port: '8080',
    open: 'Google Chrome Canary',
    historyApiFallback: true,
  },
};
