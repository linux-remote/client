import Vuex from 'vuex';
const $ = window.$;

const $win = $(window);
$win.on('resize', function(){
  store.commit('set', {
    winW: $win.width(),
    winH: $win.height()
  })
});

window.APP = {
  $win,
  $elMain: null,
  contextMenuTransferData: null
}

import upload from './module/upload';
import error from './module/error';
import task from './module/task';
const store = new Vuex.Store({
  modules: {
    upload,
    error,
    task
  },
  state: {
    dragTransferData: null,
    appMap: {
      sys_file: {
        type: 'system',
        iconUrl: '/public/img/tango-style/user-home.png',
        handleClick(){
          store.commit('task/add', {
            name: 'file system',
            type: 'fs'
          });
        },
        unique: true,
        title: '文件管理器'
      },
      sys_recycle_bin : {
        type: 'system',
        iconUrl: '/public/img/tango-style/user-trash.png',
        handleClick(){
          store.commit('task/add', {
            name: 'recycle bin',
            type: 'recycle_bin'
          });
        },
        unique: true,
        title: '回收站'
      },
      sys_app_return_desk: {
        type: 'system',
        iconUrl: '/public/img/tango-style/user-desktop.png',
        title: '返回桌面',
        handleClick(){
          store.commit('task/minAll');
        }
      }
    },
    // global
    winH: $win.height(),
    winW: $win.width(),
    

    // Error
    errorMessages: [],

    // sess
    isLogin: false,
    isSelfSigned: false,
    CADownloadedCount: -1,
    CACertPath: '',
    loginedList: [],
    indexNotice: '',
    // desktop
    deskInited: false,
    username:'',
    groups: [],
    homedir: '',
    hostname: '',

    //arch: '',

    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0,

    onFsDel: null,
    onDustbinRecycle: null,
    sessError: false
  },
  mutations: {
    transferDragData(state, data){
      state.dragTransferData = data;
      document.addEventListener('dragend', function(){
        state.dragTransferData = null;
      }, {
        once: true
      })
    },

    onFsDel(state){
      state.onFsDel = Date.now();
    },
    needRelogin(state){
      state.sessError = true;
    },
    set (state, data) {
      Object.assign(state, data);
    },
  }
});


export default store;

// function sync(data){
//   Object.keys(data).forEach(k => {
//     let v = data[k];
//     if(v !== null && typeof v === 'object'){
//       v = JSON.stringify(v);
//     }
//     localStorage.setItem(k, v);
//   })
// }