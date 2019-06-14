
const defState = () => {
  return {
    type: null,
    address: null,
    files: [],
    filenames: []
  }
}
export default {
  namespaced: true,
  state: defState(),
  mutations: {
    set (state, data) {
      _controlCutStatus(state, data);

      Object.assign(state, data);
    },
    clear(state){
      Object.assign(state, defState());
    }
  }
}

function _controlCutStatus(state, data){
  const files = state.files;
  const newFiles = data.files;
  const type = data.type;
  if(files.length && files[0].isCut){
    files.forEach(v => v.isCut = false);
  }
  if(type === 'cut') {
    newFiles.forEach(v => v.isCut = true);
  }
}
