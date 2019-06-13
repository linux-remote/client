const { getUrlAndDir } = require('./node-module-static');
const map = Object.create(null);
const path = require('path');
let publicPath = require('lr-public');
if(process.env.NODE_ENV !== 'production') {
  publicPath = path.join(__dirname, '../lr-public/public');
  // map['local_winstrap'] = getUrlAndDir('local_winstrap', path.join(__dirname, '../../winstrap'));
  // map['local_winstrap'].files = ['css/winstrap-optional.min.css'];
  
} else {

  // map['@hezedu/winstrap'] = getUrlAndDir('@hezedu/winstrap');
  // map['@hezedu/winstrap'].files = ['css/winstrap-optional.min.css'];
}

map['jquery'] = getUrlAndDir('jquery');



map['vue.runtime'] = getUrlAndDir('vue');
map['vuex'] = getUrlAndDir('vuex');
map['vue-router'] = getUrlAndDir('vue-router');

exports.publicPath = publicPath;
exports.faviconPath = path.join(__dirname,  'logo_def.png');
exports.dir = __dirname;
exports.nodeModuleStaticMap = map;
