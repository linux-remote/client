
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
//import widget from './module/widget';
import flyTextarea from './module/fly-textarea';
import sysApps from './module/sys-apps';
import users from './module/users';

const store = new window.Vuex.Store({
  modules: {
    language,
    upload,
    error,
    task,
    users,
    flyTextarea,
    sysApps
  },
  state: {
    dragTransferData: null,
    // global
    winH: $win.height(),
    winW: $win.width(),
    loginedList: [],
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
    mask: '',

    // quickBarItems: [],

    deskTopEvent: null,
    recycleBinEvent: null,
    fsEvent: {},


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

    transferDragData(state, data){
      state.dragTransferData = data;
      document.addEventListener('dragend', function(){
        state.dragTransferData = null;
      }, {
        once: true
      })
    },

    recycleBinTrigger(state, bool){
      state.recycleBinEvent = Date.now();
      this.commit('sysApps/changeRecycleBinIcon', bool)
    },

    fsTrigger(state, data){
      state.fsEvent = data
    },
    deskTopTrigger(state, data){
      state.deskTopEvent = data;
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
    }
  }
});

export default store;