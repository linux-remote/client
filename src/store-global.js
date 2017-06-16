import _Vue from 'vue';
import Vuex from 'vuex';
const $ = window.$;
const $win = $(window);
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

    tasks: [],
    taskMaxZindex: 2,
    currTasksPositionTop: 0,
    currTasksPositionLeft: 0
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
      state.taskMaxZindex = state.taskMaxZindex + 1;
      // state.currTasksPositionTop = state.currTasksPositionTop + 25;
      // state.currTasksPositionLeft = state.currTasksPositionLeft + 25;
      state.tasks.push(data);
    },
    removeTask(state, index){
      //state.taskMaxZindex = state.taskMaxZindex - 1;
      state.tasks.splice(index, 1);
    },
    reportTaskPosition(state, offset){
      state.currTasksPositionTop = offset.top;
      state.currTasksPositionLeft = offset.left;
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

export const Vue = _Vue;
export default store;
