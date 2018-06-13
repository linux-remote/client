export default  {
  namespaced: true,
  state: {
    message: []
  },
  mutations: {
    show(state, message) {
      if(state.message.length > 30){
        state.message.shift();
      }
      state.message.push(message);
    },
    close(state){
      state.message = [];
    }
  }
}
