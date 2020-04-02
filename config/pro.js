var base = require('./dev');

const conf = {
  // bundleName: '[name]_bundle_[chunkhash].js',   //打包文件的名字
  // chunkName: '[name]_chunk_[chunkhash].js', 
  indexDir: './',
  baseUrl: '',
  // indexData: { //这里数据将会传给index.ejs。
  //   API_ROOT: '/api'
  // }
};

module.exports =  Object.assign(base, conf);
