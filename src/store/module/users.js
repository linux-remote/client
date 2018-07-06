export default  {
  namespaced: true,
  state: {
    total: 0,
    list: [],
    messages: [],
    id: null
  },
  mutations: {
    set(state, data){
      Object.assign(state, data);
    },
    addMessage(state, data){
      data.isMe = data.isMe || false;
      state.messages.push(data);
      if(state.messages.length > 30){
        state.messages.shift();
      }
    }
  }
}