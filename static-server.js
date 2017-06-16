var eStatic = require('express').static;
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

function _getOpts(name){
  var dir = getDir(name);
  var v = getVersion(dir);
  return {
    url: ROOT_URL + '/' + name + v,
    fsDir: path.join(dir + '/dist')
  }
}

// var bootstrapMainPath = require.resolve('bootstrap');
// var
// var v = path.resolve(bootstrapMainPath, '../../../package.json');
// v = require(v).version;

// const bootstrapPublicPath = '/nodeMouduleStatic/bootstrap' + v
// var distDir = path.resolve(bootstrapMainPath, '../..');

var DAY_TIME = 1000 * 60 * 60 * 24 //一天
var MONTH_TIME  = DAY_TIME * 30 //一月
var HALF_YEAR_TIME  = MONTH_TIME * 6; //半年
var bootstrapOpts = _getOpts('bootstrap');
var jqueryOpts = _getOpts('jquery');
//var jqueryUiOpts = _getOpts('jquery-ui');
function setup(app){
  app.use(jqueryOpts.url , eStatic(jqueryOpts.fsDir, {maxAge:HALF_YEAR_TIME}));
  app.use(bootstrapOpts.url , eStatic(bootstrapOpts.fsDir, {maxAge:HALF_YEAR_TIME}));
  //app.use(jqueryUiOpts.url , eStatic(jqueryUiOpts.fsDir, {maxAge:HALF_YEAR_TIME}));
}


setup.nodeModuleStatic = {
  jquery: jqueryOpts.url,
  bootstrap: bootstrapOpts.url
}

module.exports = setup;
