export default  {
  namespaced: true,
  state: {
    selectedFiles: [],
    address: null
  },
  mutations: {
    start(state, address){
      //console.log(address);
      console.log(address);
      return;
      // state.address = address;
      // document.getElementById('lr-upload-input').click();
    },
    removeItemByPath(state, {srcTaskId, path}){
      const index = state.selectedFiles.findIndex(v => v.fullPath === path);
      if(index !== -1){
        const item = state.selectedFiles[index];
        item.srcTaskId = srcTaskId;
        state.selectedFiles.splice(index, 1);
      }
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