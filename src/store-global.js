import _Vue from 'vue';
import Vuex from 'vuex';
_Vue.use(Vuex);

import request from './lib/request';

const store = new Vuex.Store({
  state: {
    loginedList: [],
    CADownloadedCount: -1,
    CACertPath: '',
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0
  },
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

    const ws = new WebSocket('wss://192.168.56.101:3000?user=dw');

    ws.onmessage = function (event) {
      // console.log('Message from server', event.data);
      const data = JSON.parse(event.data);
      console.log('data', data);
      switch (data.type) {
        case 'init':
        case 'timeZoneNameChange':
          store.commit('set', data.data);
          break;
      }
    };
  }
})
 // Fiexd: must call Vue.use(Vuex) before creating a store instance.
export const Vue = _Vue;
export default store;
