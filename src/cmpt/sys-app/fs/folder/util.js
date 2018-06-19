import store from '__ROOT__/store/index.js';

export function getItemPath(item){

}
export const getNameSuffix = (name) => {
  const index = name.lastIndexOf('.');
  if(index !== 0 && index !== -1){
    return name.substr(index + 1).toLowerCase();
  }
}

var _map = {
  'image': ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif','bmp', 'ico'],
  'text': ['js', 'txt', 'sh', 'vue', 'css', 'html', 'ejs', 'json', 'scss']
}
const openType = Object.create(null);

Object.keys(_map).forEach(k => {
  let arr = _map[k];
  arr.forEach(type => {
    openType[type] = k
  })
})

_map = null;
export const relationAppMap = {
  text: 'sys_app_editor'
}
export const getOpenType = (suffix) => {
  return openType[suffix] || 'UNKNOWN'
}

export function getOpenAppIcon(openType){
  const appId = relationAppMap[openType];
  if(relationAppMap[openType]){
    return {
      id: appId,
      app: store.getters['app/getById'](appId)
    }
  }
}
export function encodePath(path){
  return encodeURIComponent(path.substr(1));
}