const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const NODE_ENV = process.env.NODE_ENV || 'development';
const isPro = NODE_ENV === 'production';

const confName = process.env.NODE_BUILD_CONF_NAME || 'dev';

const conf = require('./config/' + confName);
const setup = require('./setup');
const sortDistName = 'lr-client';
var bundleName = sortDistName + '.js';
if(isPro){
  bundleName = sortDistName + '.min.js';
}
var optimization;


const  outputPath = path.join(__dirname, conf.indexDir, '/dist/');
const publicPath = conf.baseUrl + '/dist/';

var cssRule;
if(confName === 'dev' && !isPro){ //使用 命令weblack
  cssRule = {
    test: /(\.scss$)|(\.css$)/,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    include: path.join(__dirname, './src')
  }

}else{
  cssRule = {
    test: /(\.scss$)|(\.css$)/,
    //use: ["css-loader", "postcss-loader", "sass-loader"]
    use: [
      { 
        loader: MiniCssExtractPlugin.loader
      },
      
      "css-loader",  'postcss-loader', "sass-loader"
    ]
  }

}

// var indexData = conf.indexData || {};
// indexData.BASE_URL = conf.baseUrl;
// indexData.VERSION = package.version;

// ***************************** plugins *****************************
var plugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV)
    }
  }),

  // create index.html
  // new HtmlWebpackPlugin({
  //   chunksSortMode: 'dependency',
  //   filename: path.join(__dirname, conf.indexDir + '/index.html'),
  //   template: path.join(__dirname, '/src/index.ejs'),
  //   nodeModuleStatic : setup.nodeModuleStatic,
  //   indexData
  // })
]
var rules = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.jade$/,
    loader: 'pug-plain-loader'
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader'
  },
  cssRule
]
// ***************************** 环境适配 *****************************
if (isPro) {
  optimization = {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }

  plugins = plugins.concat([//正式环境下压缩
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: sortDistName + ".min.css",
      // chunkFilename: "chunk_[id]_[contenthash].css"
    }),

    // new webpack.optimize.TerserPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   sourceMap: false,
    //   output: {
    //     comments: false,
    //   }
    // }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })

  ]);

  // -------- pre lint --------
  rules.unshift({
    enforce: "pre",
    test: /(\.js|\.vue)$/,
    include: [path.resolve(__dirname, "src")],
    loader: "eslint-loader"
  })

};

// ***************************** conf *****************************
const webpackConf = {
  mode: NODE_ENV,
  optimization,
  context: path.join(__dirname, './src'),
  entry: {
    z_app: "./app.js"
  },
  output: {
    path: outputPath,
    publicPath,
    filename: bundleName,
    // chunkFilename: chunkName
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '__ROOT__' : path.join(__dirname, './src')
    }
  },
  plugins: plugins,
  devServer: {
    before: setup,
    host: '127.0.0.1',
    onListening: setup.wsProxyHandle,
    contentBase: path.join(__dirname, conf.indexDir),
    hot: true
  },
  performance: {
    hints: false
  }
};

module.exports = webpackConf;