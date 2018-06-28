const nodeModuleStatic = require('./node-module-static');
const map = Object.create(null);
['jquery', 'vue', 'vuex', 'vue-router'].forEach(name => {
  map[name] = nodeModuleStatic(name)
})

exports.dir = __dirname;
exports.moduleMap = map;
