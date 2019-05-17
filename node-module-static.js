var path = require('path');
const ROOT_URL = '/nodeMouduleStatic';


function getDir(moduleName){
  var rPath = require.resolve(moduleName);
  // cnpm: 
  // C:\common\git\linux-remote\lr-public\node_modules\_xterm@3.12.2@xterm\lib\public\Terminal.js
  // scope: C:\common\git\linux-remote\lr-public\node_modules\_@hezedu_winstrap@0.5.14@@hezedu\winstrap\index.js

  var splitStr = 'node_modules' + path.sep;
  var i = rPath.indexOf(splitStr)  + splitStr.length;
  // var name = rPath.substr(i);
  // name = name.substr(0, name.indexOf(path.sep));
  var dir = rPath.substr(0, i);

  
  var _subName = rPath.substr(i);
  let subArr = _subName.split(path.sep);
  if(moduleName.indexOf('/') !== -1){ // @hezedu/winstarp
    _subName = subArr[0] + path.sep + subArr[1];
  } else {
    _subName = subArr[0];
  }
  return path.join(dir,  _subName);
}

function getVersion(dir){
  var pkg = require(dir + '/package.json');
  var version = pkg.version;
  pkg = null;
  return version;
}
function wrapUrl(name, version) {
  return ROOT_URL + '/' + name + version;
}
exports.wrapUrl = wrapUrl;

exports.getUrlAndDir = function(name){
  var dir = getDir(name);
  var v = getVersion(dir);
  return {
    url: wrapUrl(name, v),
    fsDir: path.join(dir + '/dist')
  }
}
