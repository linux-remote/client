import { API_PATH } from '../lib/constant';
export function getWsOrigin() {
  
  const CORS = window.CLIENT_CONFIG.CORS;
  let isHttps;
  if(CORS){
    isHttps = CORS.indexOf('https') !== -1;
  } else {
    isHttps = location.protocol.indexOf('https') !== -1;
  }
  
  let wsOrigin;
  if(isHttps){
    wsOrigin = 'wss:'
  }else{
    wsOrigin = 'ws:'
  }
  let apiHost = CORS ? CORS.split('/')[2] : location.host;
  return wsOrigin + '//' + apiHost;
}

export const wsOrigin = getWsOrigin();

export function composeUserWsUrl(username, subPath) {
  return `${wsOrigin}${API_PATH}/user/${username}${subPath ? '/' + subPath : ''}`;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
export function sortByNumberKey(list, key, isAsc) {
  if(isAsc) {
    list.sort((a, b) => {
      return a[key] - b[key];
    });
  } else {
    list.sort((a, b) => {
      return b[key] - a[key];
    });
  }

}
export function sortByStrKey(list, key, isAsc) {
  // sort by name
  let les = isAsc ? -1 : 1;
  let big = isAsc ? 1 : -1;
  list.sort(function(a, b) {
    var nameA = a[key].toUpperCase(); // ignore upper and lowercase
    var nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return les;
    }
    if (nameA > nameB) {
      return big;
    }
    // names must be equal
    return 0;
  });
}

export function basename(str){
  const i = str.lastIndexOf('/');
  if(i === -1){
    return str;
  }
  return str.substr(i + 1);
}
export function getDirAndBase(_path){
  const i = _path.lastIndexOf('/');
  let dir = '', base = '';
  if(i === -1){
    base = _path;
  } else {
    dir = _path.substr(0 ,i);
    base = _path.substr(i + 1);
  }
  return {
    dir,
    base
  }
}
export function encodePath(path){
  return encodeURIComponent(path.substr(1));
}
export function pathJoin(dir, name){
  var a = dir === '/' ? dir : dir + '/';
  return a + name;
}

export function dateFormat(date, fmt) { //来自互联网
  date = date ? new Date(date) : new Date();
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
// export function checkMouseType(e){
//   switch(e.button){
//     case 0:
//       return 'left';
//     case 1:
//       return 'middle';
//     case 2:
//       return 'right'
//   }
// }