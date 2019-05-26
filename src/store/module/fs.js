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

    // thoroughDelItemsDev({commit}, data){
    //   // commit('publicEmit', {
    //   //   type: 'request',
    //   //   stateKey: 'isDeing',
    //   //   stateValue: true,
    //   //   address: data.address
    //   // });
    //   const url = wrapUrl('~/fs/' + encodePath(data.address));
    //   const filenames = data.files;
    //   window.$.ajax({
    //     type: 'post',
    //     url,
    //     contentType: JSON_CONTENT_TYPE,
    //     data: JSON.stringify({
    //       type: 'del',
    //       files: filenames,
    //       thorough: true
    //     }),
    //     success(){
    //       // if(!data.thorough){
    //       //   commit('recycleBinTrigger');
    //       // }
    //       commit('publicEmit', {
    //         type: 'del',
    //         files: filenames,
    //         address: data.address
    //       });
    //     },
    //     complete(){
    //       // commit('publicEmit', {
    //       //   type: 'request',
    //       //   stateKey: 'isDeing',
    //       //   stateValue: false,
    //       //   address: data.address
    //       // });
    //     }
    //   })
    // }
  }
}