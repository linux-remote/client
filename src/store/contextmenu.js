
const empty = [];
const store = new window.Vuex.Store({
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
