export default  {
  namespaced: true,
  state: {
    selectedFiles: [],
    address: null
  },
  mutations: {
    start(state, address){
      //console.log(address);
      state.address = address;
      document.getElementById('lr-upload-input').click();
    },
    removeItem(state, index){
      state.selectedFiles.splice(index, 1);
    },
    addSelectedFile(state, arr){
      arr.forEach(v => {
        //console.log('v', v);
        state.selectedFiles.push({
          address: state.address,
          fullPath: state.address + '/' + v.rawFile.name,
          ...v
        });
      })

    }
  }
}