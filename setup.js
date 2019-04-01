const favicon = require('serve-favicon');
const eStatic = require('express').static;


const DAY_TIME = 1000 * 60 * 60 * 24 //一天
const MONTH_TIME  = DAY_TIME * 30 //一月
const HALF_YEAR_TIME  = MONTH_TIME * 6; //半年
const IS_PRO = process.env.NODE_ENV === 'production';
const  {nodeModuleStaticMap, faviconPath, publicPath} = require('./index');
const map = nodeModuleStaticMap;

var indexJsPathArr = [];
var indexCssPathArr = [];
function pushIndexPath(_path) {
  if(/\.css$/.test(_path)){
    indexCssPathArr.push(_path);
  }else {
    indexJsPathArr.push(_path);
  }
}
for(let name in map){
  var v = map[name];
  if(v.files) {
    v.files.forEach(_name => {
      pushIndexPath(v.url + '/' + _name);
    });
  } else {
    var distName = IS_PRO ? name + '.min' : name;
    distName = distName + '.js';
    v.distName = distName;
    var jsPath = v.url + '/' + distName;
    // v.jsPath = jsPath;
    indexJsPathArr.push(jsPath);
  }

}

function setup(app){
  app.use('/public', eStatic(publicPath));
  app.use(favicon(faviconPath));
  const maxAge = IS_PRO ? HALF_YEAR_TIME : 0;
  for(let i in map){
    let v = map[i];
    // const filePath = path.join(v.fsDir, v.distName);
    app.use(v.url, eStatic(v.fsDir, {maxAge}));
  }
};

setup.nodeModuleStatic = {
  cssArr: indexCssPathArr,
  jsArr: indexJsPathArr
};

module.exports = setup;