import Vuex from 'vuex';
const empty = [];
const store = new Vuex.Store({
  state: {
    data: empty,
    top: 0,
    left: 0
  },
  mutations: {
    open (state, data) {
      Object.assign(state, data);

      window.APP.$elMain
      .addEventListener('mousedown', function(){
        console.log('contextmenu out mousedown');
        store.commit('close');
      }, {
        once: true,
        capture: true
      });

    },
    close(state){
      state.data = empty;
    }
  }
});


export default store;
