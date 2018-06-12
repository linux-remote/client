export default  {
  namespaced: true,
  state: {
    message: ['出错了!','出错了2!']
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
