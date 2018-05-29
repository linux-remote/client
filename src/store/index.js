import Vuex from 'vuex';
import $ from 'jquery';
import {findLast, sortBy, cloneDeep} from 'lodash';

const $win = $(window);
$win.on('resize', function(){
  store.commit('set', {
    winW: $win.width(),
    winH: $win.height()
  })
});

window.APP = {
  $win,
  $elMain: null
}

import upload from './module/upload';

const store = new Vuex.Store({
  modules: {

    upload
  },
  state: {
    dragTransferData: null,

    appMap: {
      sys_recycle_bin : {
        type: 'system',
        iconUrl: '/public/img/tango-style/user-trash.png',
        unique: true,
        title: '回收站'
      },
      sys_app_return_desk: {
        type: 'system',
        iconUrl: '/public/img/tango-style/user-desktop.png',
        title: '返回桌面',
        handleClick(){
          store.commit('taskMinAll');
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
    // desk
    deskInited: false,
    username:'',
    groups: [],
    homedir: '',
    hostname: '',

    //arch: '',

    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0,

    // tasks
    tasks: [], // tasks stack
    _tmpMinAllTasks: [],
    _tmpMinAllCurrTasksFocus: false,
    latestTask: {}, // last created task
    currTask: {}, // focused task
    taskMaxZindex: 0,
    uniqueTaskMap: {
      // computerInfo: null,
      // dustbin: null
    },
    computerInfoUniqueFocus: false,
    dustbinUniqueFocus: false,
    userInfoUniqueFocus: false,
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
    errorMessagesShow(state, message) {
      document.addEventListener('mousedown', () => {
        store.commit('close');
      },{
        once: true,
        capture: true
      });
      state.errorMessages.push(message);
    },
    errorMessagesClearAll(state){
      state.errorMessages = [];
    },

    onFsDel(state){
      state.onFsDel = Date.now();
    },
    // onDustbinRecycle(state){
    //   onDustbinRecycle = Date.now();
    // },
    needRelogin(state){
      state.sessError = true;
    },
    addTask(state, data){
      data.unique = data.unique || false;

      if(data.unique){
        let o = state.uniqueTaskMap, k = data.type
        if(o[k]){
          return store.commit('showTask', o[k]);
        }else{
          state[k + 'UniqueFocus'] = true;
          o[k] = data;
        }
      }
      const isMax = state.currTask.isMax;
      data.width = (isMax ? data.width : state.currTask.width) || 800;

      //console.log('data.width', data.width, state.currTask.width);
      data.height = (isMax ? data.height : state.currTask.height) || 600;
      // if(data.notFollow){
      //
      // }
      data.type = data.type || null;

      data.draggable = false;
      data.isMin = false;
      data.isMax = false;
      data.bakBeforeMax = null;
      data.resizeStartData = null;

      if(state.tasks.length){
        store.commit('taskGetPosition', data);
      }else{ // Appear in center
        data.positionTop = (state.winH - data.height) / 2;
        data.positionLeft = (state.winW - data.width) / 2;
      }

      store.commit('taskWindowFocus', data);
      data.id = state.taskMaxZindex;
      state.latestTask = data;
      state.tasks.push(data);
    },
    taskGetPosition(state, data){
      let currTask = state.currTask;
      if(data.isMax){
        currTask = data.bakBeforeMax;
      }
      const top = currTask.positionTop + 50;
      const left = currTask.positionLeft + 50;

      if(top + data.height >= state.winH){
        data.positionTop = 0;
      }else{
        data.positionTop = top;
      }

      if(left + data.width >= state.winW){
        data.positionLeft = 0;
      }else{
        data.positionLeft = left;
      }
    },
    hiddenTask(state, task){
      task.isMin = true;
      task.focus = false;
      store.commit('focusNextTask');
    },
    taskMinAll(state){
      if(state._tmpMinAllTasks.length){
        state._tmpMinAllTasks.forEach(function(v){
          v.isMin = false;
        });
        state.currTask.focus = state._tmpMinAllCurrTasksFocus;
        return state._tmpMinAllTasks = [];
      }

      state._tmpMinAllCurrTasksFocus = state.currTask.focus;
      state.tasks.forEach(v => {
        if(!v.isMin){
          state._tmpMinAllTasks.push(v);
          v.isMin = true;
        }
      });
      state.currTask.focus = false;
    },
    showTask(state, task){
      task.isMin = false;
      if(task !== state.currTask && !state.currTask.isMax && task.positionLeft === state.currTask.positionLeft && task.positionTop === state.currTask.positionTop){
        store.commit('taskGetPosition', task);
      }
      store.commit('taskWindowFocus', task);
    },
    copyTask(state, task){
      const cloneTask = cloneDeep(task);
      cloneTask.focus = false;
      store.commit('addTask', cloneTask);
    },
    focusNextTask(state){
      const test = sortBy(state.tasks, 'zIndex');
      const preTask = findLast(test,
        {isMin: false});
      if(preTask){
        store.commit('taskWindowFocus', preTask);
      }
      // else{
      //   console.log('preTask is hidden')
      // }
    },
    removeTask(state, index){
      const item = state.tasks[index];
      if(item.unique){
        state.uniqueTaskMap[item.type] = null;
      }
      state.tasks.splice(index, 1);
      state[item.type + 'UniqueFocus'] = false;
      store.commit('focusNextTask');
    },
    currTaskWindowUnFocus(state){
      state.currTask.focus = false;
    },
    taskWindowFocus(state, task){
      if(task.focus === true) return;
      if(state._tmpMinAllTasks.length){
        state._tmpMinAllTasks = [];
      }
      if(state.currTask === task){
        task.focus = true;
        return;
      }
      state.taskMaxZindex = state.taskMaxZindex + 1;
      state.currTask.focus = false;
      task.focus = true;
      task.zIndex = state.taskMaxZindex;
      state.currTask = task;
    },
    set (state, data) {
      Object.assign(state, data);
      //sync(data);
    },
  }
});

function sync(data){
  Object.keys(data).forEach(k => {
    let v = data[k];
    if(v !== null && typeof v === 'object'){
      v = JSON.stringify(v);
    }
    localStorage.setItem(k, v);
  })
}
//console.log('store', store)
export default store;
