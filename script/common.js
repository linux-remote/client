const path = require('path');
const child_process = require('child_process');
const del = require('fuckwinfsdel');
const NAME = process.env.NODE_BUILD_CONF_NAME;
const webpack = require('webpack');
const fs = require('fs');
const webpackConf = require('../webpack.config');
const conf = require('../config/' + NAME);
const clearDir = path.join(__dirname,'../', conf.indexDir, 'build');

module.exports = function(){
  var build_sh = 'webpack --colors';
  console.log('开始清空:',clearDir, '...');
  del(clearDir, function(err){
    if(err){
      console.error(err);
    }
    console.log('开始build...');
    webpack(webpackConf,  function(err, stats){
      if(err || stats.hasErrors()){
        return console.log('build 失败', err, stats.toString('errors-only'));
      }
      // const json = stats.toJson();
      // console.log('json', Object.keys(json));
      console.log(stats.toString({
        // Add console colors
        colors: true,
        chunks: false,
        modules: false,
        children: false
      }));
      console.log('build 成功');

    });
  })
}
