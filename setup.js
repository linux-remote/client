const favicon = require('serve-favicon');
const path = require('path');
var eStatic = require('express').static;

const DAY_TIME = 1000 * 60 * 60 * 24 //一天
const MONTH_TIME  = DAY_TIME * 30 //一月
const HALF_YEAR_TIME  = MONTH_TIME * 6; //半年
const IS_PRO = process.env.NODE_ENV === 'production';
const map = require('./index').moduleMap;
var distJsPathArr = [];

for(let name in map){
  var distName = IS_PRO ? name + '.min' : name;
  var v = map[name];
  var jsPath = v.url + '/' + distName + '.js';
  distJsPathArr.push(jsPath);
}

function setup(app){
  app.use(favicon(path.join(__dirname,  'logo_def.png')));
  for(let i in map){
    let v = map[i];
    app.use(v.url, eStatic(v.fsDir, {maxAge:HALF_YEAR_TIME}));
  }
};

setup.nodeModuleStatic = distJsPathArr;

module.exports = setup;