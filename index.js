const { getUrlAndDir } = require('./node-module-static');
const map = Object.create(null);
const path = require('path');
let publicPath = require('lr-public');
if(process.env.NODE_ENV !== 'production') {
  publicPath = path.join(__dirname, '../lr-public/public');
  
} else {

}

map['jquery'] = getUrlAndDir('jquery');



map['vue.runtime'] = getUrlAndDir('vue');
map['vuex'] = getUrlAndDir('vuex');
map['vue-router'] = getUrlAndDir('vue-router');

exports.publicPath = publicPath;
exports.faviconPath = path.join(__dirname,  'logo_def.png');
exports.dir = __dirname;
exports.nodeModuleStaticMap = map;
