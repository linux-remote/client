const Vuex = require('vuex');
import Vue from 'vue';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loginedList: []
  },
  mutations: {
    set (state, newList) {
      state.loginedList = newList;
    }
  }
})

export default store;
