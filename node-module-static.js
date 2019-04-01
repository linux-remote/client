var path = require('path');
const ROOT_URL = '/nodeMouduleStatic';


function getDir(moduleName){
  var rPath = require.resolve(moduleName);
  // console.log('rPath', rPath);
  var splitStr = 'node_modules' + path.sep;
  var i = rPath.indexOf(splitStr)  + splitStr.length;
  // var name = rPath.substr(i);
  // name = name.substr(0, name.indexOf(path.sep));
  var dir = rPath.substr(0, i);
  return dir + moduleName;
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
