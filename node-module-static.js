var path = require('path');

const ROOT_URL = '/nodeMouduleStatic';

function getDir(moduleName){
  var rPath = require.resolve(moduleName);
  var splitStr = 'node_modules' + path.sep;
  var i = rPath.indexOf(splitStr)  + splitStr.length;
  var name = rPath.substr(i);
  name = name.substr(0, name.indexOf(path.sep));
  var dir = rPath.substr(0, i);
  return dir + name;
}

function getVersion(dir){
  return require(dir + '/package.json').version;
}

module.exports = function(name){
  var dir = getDir(name);
  var v = getVersion(dir);
  return {
    url: ROOT_URL + '/' + name + v,
    fsDir: path.join(dir + '/dist')
  }
}
