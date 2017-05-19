var path = require('path');
var rucksack = require('rucksack-css');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var confName = process.env.NODE_BUILD_CONF_NAME || 'dev';
var conf = require('./config/' + confName);
var pageage = require('./package.json');
var isPro = process.env.NODE_ENV === 'production';
var bundleName = conf.bundleName;
var chunkName = conf.chunkName;

var outputPath, publicPath;
if(confName === 'dev' && !isPro){ //使用 命令weblack
  outputPath = path.join(__dirname, conf.indexDir, '/dist/dev/build');
  publicPath = conf.baseUrl + '/dist/dev/build/';
}else{
  outputPath = path.join(__dirname, conf.indexDir, '/build');
  publicPath = conf.baseUrl + '/build/';
}

var indexData = conf.indexData || {};
indexData.BASE_URL = conf.baseUrl;
indexData.VERSION = pageage.version;

// ***************************** plugins *****************************
var plugins = [
  new webpack.optimize.DedupePlugin(),
  new webpack.ProvidePlugin({//不用在每个文件里import React from 'react'了
    React : 'react'
  }),
  //提取公共模块
  new webpack.optimize.CommonsChunkPlugin({
    names: [
          //当前版本webpackBUG: 它会对Object key 排序。所以这里用字母排序fixed.
          //顺序不要变，名字也不要变
          'b_react_vendor',
          'a_out_lib',
          'a_1_mainifest' //a_1_mainifest 必须在最后面
          ],
    filename: bundleName}),


  new webpack.DefinePlugin({
    'process.env': {//React 要用的变量。
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),
  // create index.html
  new HtmlWebpackPlugin({
    chunksSortMode: 'dependency',
    filename: path.join(__dirname, conf.indexDir + '/index.html'),
    template: path.join(__dirname, '/src/index.ejs'),
    //tpl option
    indexData
  })
]
// ***************************** 环境适配 *****************************
var jsxLoader = [
  'react-hot',
  'babel-loader'
];
if (isPro) {
  jsxLoader.shift(); //正式环境不加载 react-hot-loader, 可以节省文件大小。

  plugins.push(//正式环境下压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: false,
      output: {
        comments: false,
      },
    }));
};

// ***************************** conf *****************************
module.exports = {
  context: path.join(__dirname, './src'),
  entry: { //使用开头字母排序，防止vendor随着app代玛改变而改变。hack this bug https://github.com/webpack/webpack/pull/2998
    a_out_lib: ['lodash'],
    b_react_vendor: [
      'vue',
      'vue-router'
      // 'react',
      // 'react-dom',
      // 'react-router',
      // 'redux',
      // 'react-redux',
      // 'react-router-redux'
    ],
    z_app: "./app.js"
  },
  output: {
    path: outputPath,
    publicPath,
    filename: bundleName,
    chunkFilename: chunkName
  },
  module: {
    preLoaders: [ //代码检查
        {
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          include: [path.resolve(__dirname, "src")],
          exclude: [/(node_modules|bower_components)/]
        }
    ],
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: jsxLoader
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader'
    },
    {test: /\.css$/, loaders: ['style', 'css']},
    {
      test: /\.scss$/,
      loaders: [
        "style",
        "css?modules&importLoaders=1&localIdentName=[local]_[hash:base64:5]",
        "postcss",
        "sass"
      ]
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.vue'],
    alias: {
      '__ROOT__' : path.join(__dirname, './src')
    }
  },
  postcss: [
    rucksack({
      autoprefixer: true
    })
  ],
  plugins: plugins,
  devServer: {
    contentBase: path.join(__dirname, conf.indexDir),
    hot: true
  }
};
