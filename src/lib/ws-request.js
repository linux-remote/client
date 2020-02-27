import { composeUserWsUrl } from '../cmpt/sys-app/util';
const SocketRequest = require('../../../socket-request/index.js');
const AFRTimeout = 15 * 60 * 1000;
let ws, sr, _pako;
let wsCloseTime = 0;
let isConnected = false;
function connect(username){
  if(isConnected){
    return;
  }
  if(ws){
    if(ws.readyState !== WebSocket.CLOSED){
      console.log('ws', ws.readyState);
      return;
    }
  }
  if(wsCloseTime){
    if((Date.now() - wsCloseTime) >= AFRTimeout){
      console.log('ex')
      return;
    }
  }
  _getPako((pako) => {
    const url = composeUserWsUrl(username);
    const ws = new WebSocket(url);
    ws.onopen = () => {
      wsCloseTime = 0;
      sr = new SocketRequest(ws, {
        isWs: true, 
        isCompress: true,
        inflateFn: (data) => {
          return pako.inflate(data, { to: 'string' });
        },
        deflateFn: (data) => {
          return pako.deflate(data);
        }
      });
      isConnected = true;
    }

    const handleClose =  (e) => {
      isConnected = false;
      
      if(e.code === 1000){
        this.commit('logout');
      } else {
        wsCloseTime = Date.now();
        // state.wsCloseCode = e.code;
        // state.wsCloseReason = e.reason;
        
        if(!state.isOnLine){
          window.addEventListener('online', () => {
            store.commit('wsConnect');
          }, {
            once: true
          });
        } else {
          if(e.code === 1006){
            // 1006:
            // Connection closed before receiving a handshake response
            // ECONREFUSED 
            this.request({
              type: 'get',
              url: '~/alive',
              success: () => {
                store.commit('wsConnect');
              },
              error: (xhr) => {
                if(xhr.status !== 403){
                  setTimeout(() => {
                    store.commit('wsConnect');
                  }, 1500);
                }
              }
            })
          } else {
            setTimeout(() => {
              store.commit('wsConnect');
            }, 1500);
          }
        }
      }
    }
    ws.onclose = handleClose;
  });
}


function _getPako(cb){
  if(_pako){
    cb(_pako);
    return;
  }
  window.require(['pako'], function(pako){
    _pako = pako;
    cb(_pako)
  });
}