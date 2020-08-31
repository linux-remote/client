
function _getPort(){
  let cors = window.CLIENT_CONFIG.CORS;
  if(!cors){
    return location.port;
  }
  const i = cors.lastIndexOf(':');
  return cors.substr(i + 1);
}

export const API_PATH = '/_LRPCA_' + _getPort();
export const AFR_TIMEOUT = 15 * 60 * 1000;
export const WS_RECONNECT_TIME = 15 * 60 * 1000;
export const SR_KEY_TERM_WRITE = 2;

export const pako = window.pako;
delete(window.pako);