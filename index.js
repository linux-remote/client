const { getUrlAndDir } = require('./node-module-static');
const map = Object.create(null);
const path = require('path');
const publicPath = require('lr-public');

map['jquery'] = getUrlAndDir('jquery');
// map['@hezedu/winstrap'] = getUrlAndDir('@hezedu/winstrap');
// map['@hezedu/winstrap'].files = ['css/winstrap.min.css', 
// 'js/vendor/bootstrap.min.js'];

map['vue.runtime'] = getUrlAndDir('vue');
map['vuex'] = getUrlAndDir('vuex');
map['vue-router'] = getUrlAndDir('vue-router');

exports.publicPath = publicPath;
exports.faviconPath = path.join(__dirname,  'logo_def.png');
exports.dir = __dirname;
exports.nodeModuleStaticMap = map;
