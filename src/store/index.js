
const $ = window.$;

const $win = $(window);
$win.on('resize', function(){
  store.commit('set', {
    winW: $win.width(),
    winH: $win.height()
  })
  store.commit('setDeskTopWH');
});

window.APP = {
  $elMain: null,
  contextMenuTransferData: null
}

import language from './module/language';

import upload from './module/upload';
import error from './module/error';
import task from './module/task';
import widget from './module/widget';
import app from './module/app';

const store = new window.Vuex.Store({
  modules: {
    language,
    upload,
    error,
    task,
    widget,
    app
  },
  state: {
    dragTransferData: null,
    // global
    winH: $win.height(),
    winW: $win.width(),
    //loginedMap: null,
    // sess
    
    // desktop
    deskTopW: 0,
    deskTopH: 0,
    isLogin: false,
    deskInited: false,
    
    username:'',
    groups: [],
    homedir: '',
    hostname: '',

    quickBarItems: [],

    // lr_sys_unknown_app : {
    //   iconUrl : '/public/img/image-missing-3.png',
    //   title: 'lr_sys_unknown_app'
    // },

    onFsDel: null,
    onDustbinRecycle: null,
    sessError: false
  },
  mutations: {
    setDeskTopWH(state){
      var dom = document.getElementById('lr-desktop');
      if(dom){
        state.deskTopW = dom.offsetWidth;
        state.deskTopH = dom.offsetHeight;
      }
    },
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
    clearDesktop(state){
      state.quickBarItems = [];
      store.commit('task/closeAll');
    }
  }
});

export default store;