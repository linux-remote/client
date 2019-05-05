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
