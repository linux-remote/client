var path = require('path');

module.exports = function getNodeModuleDir(moduleName){
  var rPath = require.resolve(moduleName);
  var splitStr = 'node_modules' + path.sep;
  var i = rPath.indexOf(splitStr)  + splitStr.length;
  var name = rPath.substr(i);
  name = name.substr(0, name.indexOf(path.sep));
  var dir = rPath.substr(0, i);
  return dir + name;
}