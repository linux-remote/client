
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
import fsClipBoard from './module/fs-clip-board';
import flyTextarea from './module/fly-textarea';
import sysApps from './module/sys-apps';
import users from './module/users';
import fs from './module/fs';
import desktop from './module/desktop';
// let _tmp = null;
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
    desktop
  },
  state: {
    dragTransferData: null,
    // global
    winH: $win.height(),
    winW: $win.width(),
    // sess
    
    // desktop
    deskTopW: 0,
    deskTopH: 0,
    isLogin: false,
    
    username:'',
    groups: [],
    homedir: '',
    hostname: '',

    // quickBarItems: [],

    recycleBinEvent: null,


    onDustbinRecycle: null,
    sessError: false,
    openWidthData: null,
    isQuickLaunch: false
  },
  mutations: {

    setDeskTopWH(state){
      var dom = document.getElementById('lr-desktop');
      if(dom){
        state.deskTopW = dom.offsetWidth;
        state.deskTopH = dom.offsetHeight;
      }
    },



    recycleBinTrigger(state, bool){
      state.recycleBinEvent = Date.now();
      this.commit('sysApps/changeRecycleBinIcon', bool)
    },


    needRelogin(state){
      state.sessError = true;
    },
    set (state, data) {
      Object.assign(state, data);
    },
    clearDesktop(){
      // state.quickBarItems = [];
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
    toggleQuickLaunch(state){
      state.isQuickLaunch = !state.isQuickLaunch;
      // if(state.task.isMinAll) {

      // }
      /*
      if(state.isQuickLaunch){
        _tmp = [(e) => {
          e._capture_by_doc = true;
          _tmp = null;
          setTimeout(() => {
            state.isQuickLaunch = false;
            console.log('mousedown');
          }, 200)

        }, {
          capture: true,
          once: true
        }]
        document.addEventListener('mousedown', _tmp[0], _tmp[1]);
      } else {
        if(_tmp){
          document.removeEventListener('mousedown', _tmp[0], _tmp[1]);
        }
      }*/

    }
  }
});

export default store;