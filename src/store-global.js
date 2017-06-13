import _Vue from 'vue';
import Vuex from 'vuex';
_Vue.use(Vuex);

import request from './lib/request';

const store = new Vuex.Store({
  state: {
    loginedList: [],
    CADownloadedCount: -1,
    CACertPath: '',
    username:'',
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0
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
    set (state, data) {
      Object.assign(state, data);
    }
  }
});

request({
  url: '/touch',
  success(data){
    store.commit('set', data);
  }
});

export const Vue = _Vue;
export default store;
