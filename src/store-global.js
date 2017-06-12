import _Vue from 'vue';
import Vuex from 'vuex';
_Vue.use(Vuex);

const ws = new WebSocket('wss://192.168.56.101:3000');

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

const store = new Vuex.Store({
  state: {
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0
  },
  actions: {

  },
  mutations: {
    set (state, data) {
      console.log('data', data);
      Object.assign(state, data);
    }
  }
});
 // Fiexd: must call Vue.use(Vuex) before creating a store instance.
export const Vue = _Vue;
export default store;
