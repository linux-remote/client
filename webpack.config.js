var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var confName = process.env.NODE_BUILD_CONF_NAME || 'dev';
var conf = require('./config/' + confName);
var package = require('./package.json');
var setup = require('./setup');
var isPro = process.env.NODE_ENV === 'production';
var bundleName = conf.bundleName;
var chunkName = conf.chunkName;

var outputPath, publicPath, cssRule;
if(confName === 'dev' && !isPro){ //使用 命令weblack
  outputPath = path.join(__dirname, conf.indexDir, '/dist/dev/build');
  publicPath = conf.baseUrl + '/dist/dev/build/';
  cssRule = {
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.join(__dirname, './src')
  }

}else{
  outputPath = path.join(__dirname, conf.indexDir, '/build');
  publicPath = conf.baseUrl + '/build/';
  cssRule = {
    test: /\.scss$/,
    //use: ["css-loader", "postcss-loader", "sass-loader"]
    use: ExtractTextPlugin.extract({
      use: ["css-loader",  "sass-loader"],
      fallback: "style-loader"
    })
  }

}

var indexData = conf.indexData || {};
indexData.BASE_URL = conf.baseUrl;
indexData.VERSION = package.version;

// ***************************** plugins *****************************
var plugins = [

  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  }),

  // create index.html
  new HtmlWebpackPlugin({
    chunksSortMode: 'dependency',
    filename: path.join(__dirname, conf.indexDir + '/index.html'),
    template: path.join(__dirname, '/src/index.ejs'),
    nodeModuleStatic : setup.nodeModuleStatic,
    indexData
  })
]
var rules = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader'
  },
  cssRule
]
// ***************************** 环境适配 *****************************
if (isPro) {
  plugins = plugins.concat([//正式环境下压缩
    new ExtractTextPlugin("styles_[contenthash].css"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      sourceMap: false,
      output: {
        comments: false,
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }) 
  ]);

  rules.unshift({
    enforce: "pre",
    test: /(\.js|\.vue)$/,
    include: [path.resolve(__dirname, "src")],
    loader: "eslint-loader"
  })
};

// ***************************** conf *****************************
module.exports = {
  context: path.join(__dirname, './src'),
  entry: {
    z_app: "./app.js"
  },
  output: {
    path: outputPath,
    publicPath,
    filename: bundleName,
    chunkFilename: chunkName
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
    setup,
    contentBase: path.join(__dirname, conf.indexDir),
    hot: true,
    noInfo: true
  },
  performance: {
    hints: false
  }
};
