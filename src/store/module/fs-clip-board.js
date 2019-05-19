
const defState = () => {
  return {
    type: null,
    address: null,
    files: []
  }
}
export default {
  namespaced: true,
  state: defState(),
  mutations: {
    set (state, data) {
      _controlCutStatus(state.files, data.files);

      Object.assign(state, data);
    },
    clear(state){
      Object.assign(state, defState());
    }
  }
}

function _controlCutStatus(files, newFiles){
  
  if(files.length && files[0].isCut){
    files.forEach(v => v.isCut = false);
  }
  newFiles.forEach(v => v.isCut = true);
}
