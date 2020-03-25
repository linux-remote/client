function _defState(){
  return {
    map: Object.create(null),
    publicEvent: Object.create(null)
  }
}
const queue = [];
let isProcess = false;
function loop(args){
  queue.push(args);
  if(isProcess){
    return;
  }
  isProcess = true;
  _loop();
}
function _loop(){
  const task = queue.shift();
  task[2].$nextTick(() => {
    task[0].publicEvent = task[1];
    if(queue.length){
      _loop();
    } else {
      isProcess = false;
    }
  })
}

export default  {
  namespaced: true,
  state: _defState(),
  mutations: {
    publicEmit(state, data) {
      loop([state, data, this._vm]);
    },
    readdir(state, address){
      let dirInfo = state.map[address];
      if(!dirInfo){
        dirInfo = state.map[address] = {
          isRequest: false,
          error: null,
          list: []
        }
      }
      dirInfo.isRequest = true;
      // this.commit('wsRequest', {
      //   method: 'readdir',
      //   data: address,
      //   success: (result) => {
      //     dirInfo.error = null;
      //     dirInfo.list = _parseFiles(result);
      //   },
      //   complete: () => {
      //     dirInfo.isRequest = false;
      //   },
      //   error: (err) => {
      //     dirInfo.error = err;
      //   }
      // });
    }
  },
  actions: {
  }
}