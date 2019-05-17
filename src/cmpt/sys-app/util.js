export function getWsOrigin() {
  var wsOrigin,
  isHttps = location.protocol.indexOf('https') !== -1 || // $DEV
  window.SERVER_CONFIG.API_ROOT.indexOf('https') !== -1;
  if(isHttps){
    wsOrigin = 'wss:'
  }else{
    wsOrigin = 'ws:'
  }
  if(window.SERVER_CONFIG.API_ROOT === '/api'){
    wsOrigin = wsOrigin + '//' + location.host;
  }else{
    wsOrigin = wsOrigin + '//' + window.SERVER_CONFIG.API_ROOT.split('/')[2]
  }
  return wsOrigin;
}

export const wsOrigin = getWsOrigin();

export function composeUserWsUrl(username, subPath) {
  return `${wsOrigin}/user/${username}/${subPath}`;
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
export function sortByStrKey(list, key) {
  // sort by name
  list.sort(function(a, b) {
    var nameA = a[key].toUpperCase(); // ignore upper and lowercase
    var nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });
}
export function checkMouseType(e){
  switch(e.button){
    case 0:
      return 'left';
    case 1:
      return 'middle';
    case 2:
      return 'right'
  }
}