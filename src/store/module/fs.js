function _defState(){
  return {
    publicEvent: Object.create(null)
  }
}
export default  {
  namespaced: true,
  state: _defState(),
  mutations: {
    publicEmit(state, data) {
      state.publicEvent = data;
    }
  },
  actions: {
  }
}