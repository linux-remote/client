import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    time: 0,
    timeZoneName: '',
    timeZoneOffset: 0,
    timeDiff: 0,
    now: 0,
    dateTime: null
  },

  mutations: {
    getTimeDiff(){

    },
    start(state, data) {
      Object.assign(state, data);
    },
    stop(){

    }
  }
});

export default store;
