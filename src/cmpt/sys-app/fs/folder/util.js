import store from '__ROOT__/store/index.js';

// export function getItemPath(item){

// }
export const getNameSuffix = (name) => {
  const index = name.lastIndexOf('.');
  if(index !== 0 && index !== -1){
    return name.substr(index + 1).toLowerCase();
  }
}
export const pathJoin = (dir, name) => {
  var a = dir === '/' ? dir : dir + '/';
  console.log('a', a)
  return a + name;
}
var _map = {
  'image': ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif','bmp', 'ico'],
  'text': ['js', 'txt', 'sh', 'vue', 'css', 'html', 'ejs', 'json', 'scss', 'conf']
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
      app: store.getters['sysApps/getById'](appId)
    }
  }
}
export function initIconAttr(v){
  v.openType = getOpenType(v.suffix);
  const openApp = getOpenAppIcon(v.openType);
  if(openApp){
    v.openApp = openApp.app;
    v.openAppId = openApp.id;
  }
}

export function encodePath(path){
  return encodeURIComponent(path.substr(1));
}

export function parseName(name){
  const i = name.lastIndexOf('.');
  const result = {
    basename: '',
    suffix: ''
  }
  if(i > 0){
    result.basename = name.substr(0, i);
    result.suffix = name.substr(i + 1);
  } else {
    result.basename = name;
  }
  return result;
}

function _getParsedName(item){
  if(item.isFolder){
    return {
      basename: item.name,
      suffix: ''
    }
  }
  return item;
}

export function getNewName(list, item){
  let num = 1, indexMap = Object.create(null), maxIndex = 1;
  const {basename, suffix} = _getParsedName(item);
  
  
  list.forEach(_v => {
    const v = _getParsedName(_v);
    if((v.suffix === suffix || !suffix) && v.basename.indexOf(basename) !== -1){
      let bb = v;
      if(suffix){
        bb = parseName(v.basename);
      }
      const aiNum = Number(bb.suffix);
      if(bb.basename === basename && aiNum){
        console.log('aiNum', aiNum);
        indexMap[aiNum] = true;
        if(aiNum > maxIndex) {
          maxIndex = aiNum;
        }
      }
    }
  });
  maxIndex = maxIndex + 1;
  for(; num < maxIndex; num++)  {
    if(!indexMap[num]){
      break;
    }
  }
  // console.log('basename', basename);
  // console.log('suffix', suffix);
  // console.log('num', num);
  return `${basename}.${num}${item.suffix ? '.' + item.suffix : ''}`;
}
