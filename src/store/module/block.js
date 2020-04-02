let id = 0;
export default  {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    add(state, opt) {
      id = id + 1;
      // 同一容器里, 会跟 task 搞乱, 加个前缀.
      let blockId = 'block' + id;
      opt.close = () => {
        this.commit('block/remove', blockId);
      }
      state.list.push({
        id: blockId,
        opt
      });
    },
    remove(state, blockId){
      const index = state.list.findIndex(item => item.id === blockId);
      state.list.splice(index, 1);
    }
  }
}
