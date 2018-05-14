import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    message: []
  },
  mutations: {
    show(state, message) {
      // window.APP.$elMain.addEventListener('mousedown', () => {
      //   store.commit('close');
      // },{
      //   once: true,
      //   capture: true
      // });
      state.message.push(message);
    },
    close(state){
      state.message = [];
    }
  }
});

export default store;
