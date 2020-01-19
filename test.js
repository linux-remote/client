const fs = require('fs');
const data = Object.create(null);
const prex = 'https://cdnjs.cloudflare.com/ajax/libs/';
const VERSION = '{{VERSION}}';

_sameKey('require');
_sameKey('jquery');
data['vueRuntime'] = `${prex}vue/${VERSION}/vue.runtime.js`;
_sameKey('vuex');
data['vueRouter'] = _sameKey('vue-router');
delete(data['vue-router']);
_sameKey('pako');
_sameKey('xterm');

const xtermPrefix = `${prex}xterm/${VERSION}/`;
data['xtermCss'] = `${xtermPrefix}/xterm.min.css`;

const xtermAddonPrefix = xtermPrefix + '/addons/';
data['xtermAttach'] = `${xtermAddonPrefix}attach/attach.min.js`;
data['xtermFit'] = `${xtermAddonPrefix}fit/fit.min.js`;
data['xtermWebLinks'] = `${xtermAddonPrefix}webLinks/webLinks.min.js`;

data['LRClientUrl'] = `https://linux-remote.github.io/tmp_cdn/libs/${VERSION}/`;
data['LRIconUrl'] = 'https://linux-remote.github.io/lr-icon/icons/'; // noVersion static.

function _sameKey(k){
  return data[k] = `${prex}${k}/${VERSION}/${k}.min.js`
}

fs.writeFileSync('./cdn.json', JSON.stringify(data, null, ' '));