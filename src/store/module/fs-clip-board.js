
const defState = () => {
  return {
    address: null,
    files: [],
    cutMap: null
  }
}
export default {
  namespaced: true,
  state: defState(),
  mutations: {
    clear(state){
      Object.assign(state, defState());
    },
    setCut(state, data){
      if(state.cutMap !== data.cutMap){
        _clearCutMap(state.cutMap);
      }
      state.files = data.files;
      state.address = data.address;
      state.cutMap = data.cutMap;
    },
    setCopy(state, data){
      _clearCutMap(state.cutMap);
      state.files = data.files;
      state.address = data.address;
      state.cutMap = null;
    }
  }
}

function _clearCutMap(map){
  if(map){
    for(let i in map){
      window.Vue.delete(map, i);
    }
  }
}
