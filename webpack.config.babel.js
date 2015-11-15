'use strict';

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const env = process.env;
const version = env.npm_package_version;
const buildPath = env.npm_package_config_appWebpackBuildPath;
const baseUrl = env.npm_package_config_appWebpackBaseUrl;

const node_modules_dir = __dirname + '/node_modules'

let config = {
  
  // Custom method to add vendors.
  addVendor: function (name, path) {
    this.resolve.alias[name] = path;
    this.module.noParse.push(new RegExp('^' + name + '$'));
  },
  resolve: { alias: {} },
  entry: {
    app: path.resolve('app/client.js')
  },
  output: {
    path: path.resolve(`${buildPath}/${version}`),
    filename: '[name].js',
    publicPath: `${baseUrl}/${version}/`
  },
  module: {
    noParse: [],
    loaders: [
      {test: /\.js(x)?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
      {test: /\.json$/, loaders: ['json']},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!sass")}
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(env)),
    new ExtractTextPlugin('[name].css', {allChunks: true})
  ]
};

config.addVendor('jquery', node_modules_dir + '/jquery/dist/jquery.min.js');
config.addVendor('bootstrap', node_modules_dir +'/bootstrap/dist/js/bootstrap.min.js');

export default config;
