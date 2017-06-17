import _Vue from 'vue';
import Vuex from 'vuex';
const $ = window.$;
const $win = $(window);
const {find} = require('lodash');
_Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    winH: $win.height(),
    winW: $win.width(),
    CADownloadedCount: -1,
    CACertPath: '',
    loginedList: [],
    username:'',
    hostname: '',
    arch: '',
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0,

    tasks: [], // tasks stack
    lastTask: {}, // last created task
    currTask: {}, // focused task
    taskMaxZindex: 0,
    currTaskPositionTop: 0,
    currTaskPositionLeft: 0
  },
  // actions: {
  //   login({commit}, data){
  //     console.log('data', data);
  //   },
  //   logout(){
  //
  //   }
  // },
  mutations: {
    addTask(state, data){
      let margin = null;
      if(state.tasks.length){
        data.positionTop = state.currTaskPositionTop +=  50;
        data.positionLeft = state.currTaskPositionLeft += 50;
      }else{
        data.positionTop = 0;
        data.positionLeft = 0;
        margin = 'auto';
      }

      data.margin = margin;

      store.commit('taskWindowFocus', data);

      data._omitBlur = true;
      state.lastTask._omitBlur = false;
      data.id = state.taskMaxZindex;
      //state.currTask = data;
      state.lastTask = data;
      state.tasks.push(data);

    },
    removeTask(state, task){
      if(task.zIndex === state.currTask.zIndex){
        console.log('task === state.currTask')
        const preTask = find(state.tasks, {zIndex: task.zIndex - 1});
        if(preTask){
          preTask.focus = true;
          state.currTask = preTask;
        }
      }
      state.tasks.splice(task.index, 1);
    },
    reportTaskPosition(state, data){
      state.currTaskPositionTop = data.top ;
      state.currTaskPositionLeft = data.left;
    },
    eventDocumentClick(state){
      const {lastTask, currTask} = state;
      if(currTask._omitBlur){
        return currTask._omitBlur = false;
      }
      if(lastTask !== currTask || !currTask._omitBlur){
        currTask.focus = false;
      }
    },
    taskWindowFocus(state, task){
      console.log('taskWindowFocus')
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

// import request from './lib/request';
//
// request({
//   url: '/touch',
//   success(data){
//     store.commit('set', data);
//   }
// });

// $(document).on('click', function(){
//   store.commit('eventDocumentClick')
// })

export const Vue = _Vue;
export default store;
