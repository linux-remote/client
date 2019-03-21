const nodeModuleStatic = require('./node-module-static');
const map = Object.create(null);
const path = require('path');
const publicPath = require('lr-public');

map['jquery'] = nodeModuleStatic('jquery');
map['vue.runtime'] = nodeModuleStatic('vue', 'vue.runtime');
map['vuex'] = nodeModuleStatic('vuex');
map['vue-router'] = nodeModuleStatic('vue-router');


exports.publicPath = publicPath;
exports.faviconPath = path.join(__dirname,  'logo_def.png');
exports.dir = __dirname;
exports.nodeModuleStaticMap = map;
