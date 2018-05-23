const favicon = require('serve-favicon');
const path = require('path');
var eStatic = require('express').static;

//const nodeModuleStatic = require('./node-module-static');

// const DAY_TIME = 1000 * 60 * 60 * 24 //一天
// const MONTH_TIME  = DAY_TIME * 30 //一月
// const HALF_YEAR_TIME  = MONTH_TIME * 6; //半年
// const winstrap = nodeModuleStatic('winstrap');

function setup(app){
  app.use(favicon(path.join(__dirname,  'logo_def.png')));
  //app.use(winstrap.url, eStatic(winstrap.fsDir, {maxAge:HALF_YEAR_TIME}));
};

// setup.nodeModuleStatic = {
//   winstrap: winstrap.url
// }

module.exports = setup;