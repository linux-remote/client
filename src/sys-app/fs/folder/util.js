import store from '__ROOT__/store/index.js';

// export function getItemPath(item){

// }
export const getNameSuffix = (name) => {
  const index = name.lastIndexOf('.');
  if(index !== 0 && index !== -1){
    return name.substr(index + 1).toLowerCase();
  }
}
var _map = {
  'image': ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif','bmp', 'ico'],
  'text': ['js', 'txt', 'sh', 'vue', 'css', 'html', 'ejs', 'json', 'scss', 'conf', 'c', 'cpp', 'h', 'log']
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
export function getOpenType(suffix){
  return openType[suffix] || null;
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
export function handleNameAndIcon(v){
  Object.assign(v, parseName(v.name));
  initIconAttr(v);
}
export function initIconAttr(v){
  v.openType = getOpenType(v.suffix);
  const openApp = getOpenAppIcon(v.openType);
  if(openApp){
    v.openApp = openApp.app;
    v.openAppId = openApp.id;
  } else {
    v.openApp = null;
    v.openAppId = null;
  }
}

export function parseName(name){
  const i = name.lastIndexOf('.');
  const result = {
    basename: '',
    suffix: ''
  }
  if(i > 0){
    result.basename = name.substr(0, i);
    result.suffix = name.substr(i + 1).toLowerCase();
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
        indexMap[aiNum] = true;
        if(aiNum > maxIndex) {
          maxIndex = aiNum;
        }
      }
    }
  });
  // maxIndex = maxIndex + 1;
  for(; num <= maxIndex; num++)  {
    if(!indexMap[num]){
      break;
    }
  }
  // console.log('basename', basename);
  // console.log('suffix', suffix);
  // console.log('num', num);
  return `${basename}.${num}${item.suffix ? '.' + item.suffix : ''}`;
}

export function getNewUnSuffixName(list, tailedName){
  const connector = '_';
  let num = 1, indexMap = Object.create(null), maxIndex = 1;
  list.forEach(v => {
    let index = v.name.indexOf(tailedName);
    if(index !== -1) {
      let tailNum = v.name.substr(index + tailedName.length);
      // console.log('tailNum', tailNum);
      if(tailNum[0] === connector) {
        tailNum = tailNum.substr(1);
      }
      if(tailNum === ''){
        tailNum = 1;
      } else {
        tailNum = Number(tailNum);
      }
      if(tailNum){
        indexMap[tailNum] = true;
        if(tailNum > maxIndex) {
          maxIndex = tailNum;
        }
      }
    }
  })
  for(; num <= maxIndex; num++)  {
    if(!indexMap[num]){
      break;
    }
  }
  return num === 1 ? tailedName : tailedName + connector + num;
}


export function getFileType(permission){
  const t = permission[0];
  //https://en.wikipedia.org/wiki/Unix_file_types
  let type;
  switch(t){
    case '-':
      type = 'regularFile'
      break;
    case 'd':
      type = 'directory'
      break;
    case 'l':
      type = 'symbolicLink'
      break;
    case 'p':
      type = 'namedPipe'
      break;
    case 's':
      type = 'socket'
      break;
    case 'c':
      type = 'characterDevice'
      break;
    case 'b':
      type = 'blockDevice'
      break;
    // case 'D':
    //   type = 'Door'
    //   break;
    default:
      type = 'unknown'
  }
  return type;
}