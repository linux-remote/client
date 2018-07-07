function _defState(){
  return {
    total: 0,
    list: [],
    messages: []
  }
}
export default  {
  namespaced: true,
  state: _defState(),
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
    },
    clear(state){
      Object.assign(state, _defState())
    }
  }
}