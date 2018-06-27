const favicon = require('serve-favicon');
const path = require('path');
var eStatic = require('express').static;

const nodeModuleStatic = require('./node-module-static');

const DAY_TIME = 1000 * 60 * 60 * 24 //一天
const MONTH_TIME  = DAY_TIME * 30 //一月
const HALF_YEAR_TIME  = MONTH_TIME * 6; //半年
const IS_PRO = process.env.NODE_ENV === 'production';
const map = Object.create(null);
var distJsPathArr = [];

function _staticByName(name){
  const m = nodeModuleStatic(name);
  map[name] = m;
  var distName = IS_PRO ? name + '.min' : name;
  var jsPath = m.url + '/' + name + '.js';
  //console.log('jsPath', jsPath, m)
  distJsPathArr.push(jsPath);
}

['jquery', 'vue', 'vuex', 'vue-router'].forEach(v => {
  _staticByName(v);
})

function setup(app){
  app.use(favicon(path.join(__dirname,  'logo_def.png')));
  for(let i in map){
    let v = map[i];
    app.use(v.url, eStatic(v.fsDir, {maxAge:HALF_YEAR_TIME}));
  }
};


setup.nodeModuleStatic = distJsPathArr;

module.exports = setup;