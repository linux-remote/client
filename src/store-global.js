import _Vue from 'vue';
import Vuex from 'vuex';
const $ = window.$;
const $win = $(window);
const {find} = require('lodash');
_Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // global
    winH: $win.height(),
    winW: $win.width(),

    // sess
    CADownloadedCount: -1,
    CACertPath: '',
    loginedList: [],

    // desk
    username:'',
    hostname: '',
    arch: '',
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0,

    // tasks
    tasks: [], // tasks stack
    latestTask: {}, // last created task
    currTask: {}, // focused task
    taskMaxZindex: 0,
    currTaskPositionTop: 0,
    currTaskPositionLeft: 0
  },
  mutations: {
    addTask(state, data){
      data.width = data.width || 400;
      data.height = data.height || 400;
      data.draggable = false;
      if(state.tasks.length){

        const currTask = state.currTask;
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

      }else{ // Appear in center
        data.positionTop = (state.winH - data.height) / 2;
        data.positionLeft = (state.winW - data.width) / 2;
      }

      store.commit('taskWindowFocus', data);

      data._omitBlur = true;
      state.latestTask._omitBlur = false;
      data.id = state.taskMaxZindex;
      state.latestTask = data;
      state.tasks.push(data);
    },
    removeTask(state, task){
      if(task.zIndex === state.currTask.zIndex){
        const preTask = find(state.tasks, {zIndex: task.zIndex - 1});
        if(preTask){
          preTask.focus = true;
          state.currTask = preTask;
        }
      }
      state.tasks.splice(task.index, 1);
    },
    reportTaskPosition(state, data){
      state.currTaskPositionTop = data.top;
      state.currTaskPositionLeft = data.left;
    },
    eventDocumentClick(state){
      const {latestTask, currTask} = state;
      if(currTask._omitBlur){
        return currTask._omitBlur = false;
      }
      if(latestTask !== currTask || !currTask._omitBlur){
        currTask.focus = false;
      }
    },
    taskWindowFocus(state, task){
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
    }
  }
});
store.commit('addTask', {name: 'test', height: 500, width: 600});

export const Vue = _Vue;
export default store;
