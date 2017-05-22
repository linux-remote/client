var child_process = require('child_process');
var path = require('path');
var del = require('fuckwinfsdel');
var NAME = process.env.NODE_BUILD_CONF_NAME;
var conf = require('../config/' + NAME);
var clearDir = path.join(__dirname,'../', conf.indexDir, 'build');

module.exports = function(){
  var build_sh = 'webpack --colors';
  console.log('开始清空:',clearDir, '...');
  del(clearDir, function(err){
    if(err){
      console.error(err);
    }
    console.log('开始build...');
    child_process.exec(build_sh, function(err, result){
      if(err){
        return console.log('build 失败', err);
      }
      console.log(result);
    });
  })
}
