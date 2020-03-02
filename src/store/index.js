import { composeUserWsUrl } from '../cmpt/sys-app/util';

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

import upload from './module/upload';
import error from './module/error';
import task from './module/task';
import fsClipBoard from './module/fs-clip-board';
import flyTextarea from './module/fly-textarea';
import sysApps from './module/sys-apps';
import users from './module/users';
import fs from './module/fs';
import desktop from './module/desktop';
import windows from './module/windows.js';
const SocketRequest = require('../../../socket-request/index.js');
// let _tmp = null;
const AFRTimeout = 15 * 60 * 1000;
let ws, sr, _pako;
let wsCloseTime = 0;
const store = new window.Vuex.Store({
  modules: {
    language,
    upload,
    error,
    task,
    users,
    flyTextarea,
    sysApps,
    fsClipBoard,
    fs,
    desktop,
    windows
  },
  state: {
    // global
    winH: $win.height(),
    winW: $win.width(),
    // sess
    
    // desktop
    deskTopW: 0,
    deskTopH: 0,

    hostname: '',
    isLogin: false,
    isOnLine: true,

    username:'',
    homedir: '',
    wsIsConnected: false,
    // wsCloseCode: -1,
    // wsCloseReason: '',

    groups: [],
    
    

    quickLaunchItems: [],

    recycleBinEvent: null,


    onDustbinRecycle: null,
    sessError: false,
    openWidthData: null,
    confirmData: null
  },
  mutations: {
    setUsername(state, username){
      state.username = username;
    },
    chOnline(state, bool){
      console.log('chOnline', bool)
      state.isOnLine = bool;
    },
    wsConnect(state, callback){
      if(state.wsIsConnected){
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
      getPako((pako) => {
        const url = composeUserWsUrl(state.username);
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
          state.wsIsConnected = true;
          callback && callback();
        }

        const handleClose =  (e) => {
          state.wsIsConnected = false;
          
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
      sr.request({method: opts.method, data: opts.data}, (resData) => {
        if(resData.status === 200){
          opts.success && opts.success(resData.data);
        } else {
          resData.method = opts.method;
          opts.error(resData);
        }
      });
    },

    recycleBinTrigger(state, bool){
      state.recycleBinEvent = Date.now();
      this.commit('sysApps/changeRecycleBinIcon', bool)
    },

    logout(state){
      state.isLogin = false;
    },
    needRelogin(state){
      state.sessError = true;
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

function getPako(cb){
  if(_pako){
    cb(_pako);
    return;
  }
  window.require(['pako'], function(pako){
    _pako = pako;
    cb(_pako)
  });
}

function globalWsErrorHandle({status, method, message}){
  console.error(method, status, message);
}
export default store;
