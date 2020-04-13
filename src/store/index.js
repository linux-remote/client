import { composeUserWsUrl } from '../sys-app/util';

const $ = window.$;
const $win = $(window);
$win.on('resize', function(){
  store.commit('set', {
    winW: $win.width(),
    winH: $win.height()
  })
  store.commit('setDeskTopWH');
});

$win.on('online', function(){
  store.commit('chOnline', true)
});
$win.on('offline', function(){
  store.commit('chOnline', false);
})
// window.addEventListener('focus', function(e){
//   if(e.target === window){

//   }
//   e.preventDefault();
//   e.stopPropagation();
// }, {
//   capture: true
// });


window.APP = {
  contextMenuTransferData: null
}

import { TypeOf } from '../lib/util';
import language from './module/language';
import termMap from '../sys-app/terminal/map';
import block from './module/block';
import upload from './module/upload';
import error from './module/error';
import task from './module/task';
import fsClipBoard from './module/fs-clip-board';
import flyTextarea from './module/fly-textarea';
import sysAppMap from './module/sys-apps-map';
import users from './module/users';
import fs from './module/fs';
import desktop from './module/desktop';
const SocketRequest = require('@hezedu/socket-request');
// let _tmp = null;
const AFRTimeout = 15 * 60 * 1000;
let ws, sr;
let wsCloseTime = 0;
let checkSessionAliveTime = 0;
// let keepAliveTimer;
// const keepAliveInterval = AFRTimeout - 60 * 1000;
const wsReconnectTime = 3000;
const termWriteKey = 2;
const exitKey = 0;
// const aliveKey = 1;

function _isNeedCheckSessionAlive(){
  const now = Date.now();
  if(now - checkSessionAliveTime >= AFRTimeout){
    checkSessionAliveTime = now;
    return true;
  }
  return false;
}

const store = new window.Vuex.Store({
  modules: {
    language,
    upload,
    error,
    task,
    users,
    flyTextarea,
    fsClipBoard,
    fs,
    desktop,
    block
  },
  state: {
    // global
    winH: $win.height(),
    winW: $win.width(),
    // sess
    isExit: false,
    // desktop
    deskTopW: 0,
    deskTopH: 0,

    hostname: '',
    isOnLine: true,
    wsIsConnected: false,

    username:'',
    homedir: '',
    
    // wsCloseCode: -1,
    // wsCloseReason: '',

    groups: [],
    
    

    quickLaunchItems: [],

    recycleBinEvent: null,


    onDustbinRecycle: null,
    sessError: null,
    openWidthData: null,
    confirmData: null,
    sysAppMap
  },
  mutations: {
    setUsername(state, username){
      state.username = username;
    },
    chOnline(state, bool){
      state.isOnLine = bool;
    },
    wsConnect(state, callback){
      if(state.wsIsConnected){
        return;
      }
      if(ws){
        if(ws.readyState !== WebSocket.CLOSED){
          console.log('wsConnect: ws is not close.', ws.readyState);
          return;
        }
      }
      // getPako((pako) => {
        const url = composeUserWsUrl(state.username);
        const ws = new WebSocket(url);
        
        ws.onopen = () => {
          console.log('WS Connected!');

          const pako = window.APP._staticPako;
          wsCloseTime = 0;
          sr = new SocketRequest(ws, {
            isWs: true, 
            isCompress: true,
            inflateFn: (data, cb) => {
              var reader = new FileReader();
              reader.onload = (e) => {
                  var strData = pako.inflate(e.target.result, { to: 'string' });
                  cb(strData);
              }
              reader.readAsArrayBuffer(data);
            },
            deflateFn: (data) => {
              return pako.deflate(data);
            }
          });
          sr.onRequest = (data) => {
            if(Array.isArray(data)){
              const key = data[0];
              if(key === termWriteKey){
                const pid = data[1];
                const strData = data[2];
                const term = termMap[pid];
                if(typeof term === 'object'){
                  term.write(strData);
                } else {
                  if(typeof term !== 'string'){
                    termMap[pid] = '';
                  }
                  termMap[pid] = termMap[pid] + strData;
                }
              } else if(key === exitKey){
                this.commit('onExit', data[1]);
              }
            } else {
              if(data.method === 'termExit'){
                const pid = data.data;
                const term = termMap[pid];
                if(term){
                  delete(termMap[pid]);
                  term.close();
                }
              }
            } 

            // if(data.type === 'term'){
            //   const term = termMap[data.id];
            //   if(data.data){
            //     if(typeof term === 'object'){
            //       term.write(data.data);
            //     } else {
            //       if(typeof termMap[data.id] !== 'string'){
            //         termMap[data.id] = '';
            //       }
            //       termMap[data.id] = term + data.data;
            //     }
            //   } else if(data.method === 'exit'){
            //     delete(termMap[data.id]);
            //     term.close();
            //   }

            // }
          }
          // keepAliveTimer = setInterval(() => {
          //   sr.request([aliveKey]);
          // }, keepAliveInterval);
          this.commit('set', {
            wsIsConnected: true
          });
          callback && callback();
        }

        const handleClose =  (e) => {
          // if(keepAliveTimer){
          //   clearInterval(keepAliveTimer);
          //   keepAliveTimer = null;
          // }
          this.commit('set', {
            wsIsConnected: false
          });
          if(state.isExit){
            return;
          }
          // if(e.code !== 1000){
            
            if(wsCloseTime){
              wsCloseTime = Date.now();
            }
            
            if(wsCloseTime){
              if((Date.now() - wsCloseTime) >= AFRTimeout){
                this.commit('onExit', 'clientTimeout');
                return;
              }
            }

            if(!state.isOnLine){
              window.addEventListener('online', () => {
                store.commit('wsConnect');
              }, {
                once: true
              });
            } else {
              const _reconent = () => {
                setTimeout(() => {
                  store.commit('wsConnect');
                }, wsReconnectTime);
              }

              if(_isNeedCheckSessionAlive()){
                this.request({
                  type: 'get',
                  url: '~/alive',
                  success: () => {
                    _reconent();
                  },
                  error: (xhr) => {
                    if(xhr.status !== 403){
                      checkSessionAliveTime = 0;
                      _reconent();
                    }
                  }
                });
                return;
              }
              _reconent();

              // if(e.code === 1006){
              //   // 1006:
              //   // Connection closed before receiving a handshake response
              //   // ECONREFUSED 


              // } else {
              //   setTimeout(() => {
              //     store.commit('wsConnect');
              //   }, wsReconnectTime);
              // }
            }
          // }
        }
        ws.onclose = handleClose;
      // });
    },
    onExit(state, msg){
      this.commit('set', {
        isExit: true
      });
      
      if(msg){
        // window.alert('exit' + msg);
        // location.href = '/#u=' + state.username;
        this.commit('needRelogin', msg);
      } else {
        // 正常退出.
        location.href = '/';
      }
    },
    setDeskTopWH(state){
      var dom = document.getElementById('lr-desktop');
      if(dom){
        state.deskTopW = dom.offsetWidth;
        state.deskTopH = dom.offsetHeight;
      }
    },

    wsRequest(state, opts){
      if(!opts.error){
        opts.error = globalWsErrorHandle;
      }
      if(!state.wsIsConnected){
        opts.error({
          status: 0,
          method: opts.method,
          message: 'disConnected'
        });
        return;
      }
      if(ws){
        if(ws.readyState !== WebSocket.OPEN){
          opts.error({
            status: 1,
            method: opts.method,
            message: 'readyStateNotOpen'
          });
          return;
        }
      }
      const requestData = opts.isArray ? 
      opts.data : 
      {method: opts.method, data: opts.data};

      if(opts.noReply){
        sr.request(requestData);
        return;
      }
      sr.request(requestData, (resData) => {
        opts.complete && opts.complete(resData);
        if(resData.status === 200){
          opts.success && opts.success(resData.data);
        } else {
          resData.method = opts.method;
          opts.error(resData);
        }
      });
    },

    recycleBinChange(state, len){
      const app = state.sysAppMap['sys_app_recycle_bin'];
      app.iconUrl = len === 0 ? 'nuvola/user-trash.png' : 'nuvola/user-trash-full.png';

    },

    needRelogin(state, msg){
      console.log('needRelogin');
      state.sessError = {
        message: msg || ''
      };
    },
    set (state, data) {
      if(TypeOf(data)  !== 'Object'){
        throw new Error('data must be a object.')
      }
      Object.assign(state, data);
    },
    clearDesktop(){
      state.quickLaunchItems = [];
      store.commit('task/closeAll');
      store.commit('users/clear');
      store.commit('fsClipBoard/clear');
    },
    openWith(state, data){
      state.openWidthData = data;
    },
    hiddenOpenWith(state){
      state.openWidthData = null;
    },
    confirm(state, data){
      if(state.confirmData){
        return;
      }
      state.confirmData = data;
    },
    hiddenConfirm(state){
      state.confirmData = null;
    }
  }
});



function globalWsErrorHandle({status, method, message}){
  console.error(method, status, message);
}
export default store;
