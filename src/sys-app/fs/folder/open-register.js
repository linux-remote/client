import { handleFileAppMap, getApp } from '../../../store/module/sys-apps-map.js';


let categoryMap = {
  'image': ['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif','bmp', 'ico'],
  'text': ['js', 'txt', 'sh', 'vue', 'css', 'html', 'ejs', 'json', 'scss', 'conf', 'c', 'cpp', 'h', 'log']
}

const defOpenAppMap = {
  text: 'sys_app_editor'
}

const suffixMap = Object.create(null);

Object.keys(categoryMap).forEach(k => {
  let arr = categoryMap[k];
  arr.forEach(suffix => {
    suffixMap[suffix] = k;
  })
});

// unused
categoryMap = null;

export function getCategory(suffix){
  return suffixMap[suffix];
}

export function getDefOpenApp(category){
  const appId = defOpenAppMap[category];
  return getApp(appId);
}

export function getOpenInfo(suffix){
  const category = suffixMap[suffix];
  const openApp = getDefOpenApp(category);
  const openWithApps = handleFileAppMap[suffix];
  return {
    category,
    openApp,
    openWithApps
  }
}