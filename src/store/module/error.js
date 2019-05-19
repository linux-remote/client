export default  {
  namespaced: true,
  state: {
    message: []
  },
  mutations: {
    show(state, message) {
      // if(state.message.length > 2){
      //   state.message.shift();
      // }
      state.message.push(message);
      setTimeout(() => {
        state.message.shift();
      }, 3000);
    },
    // close(state){
    //   state.message = [];
    // }
  }
}
