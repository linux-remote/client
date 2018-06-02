import Vuex from 'vuex';

export default  {
  namespaced: true,
  state: {
    message: []
  },
  mutations: {
    show(state, message) {
      // window.APP.$elMain.addEventListener('mousedown', () => {
      //   this.commit('error/close');
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
}
