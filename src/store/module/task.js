//let _id = 3; 
const uniqueMap = Object.create(null);
const TASK_WIDTH = 800;
const TASK_HEIGHT = 600;
function _defState(){
  return {
    list: [],
    latest: {}, // last created task
    current: {}, // focused task
    id: 3,  //zIndex

    _tmpMinAll: [],
    _tmpMinAllIsCurrFocus: false
  }
}
export default  {
  namespaced: true,
  state: _defState(),
  mutations: {
    add(state, appId){
      var APP;
      if(typeof appId === 'object'){
        APP = appId;
        appId = APP.id;
      }else{
        APP = this.state.app.map[appId];
      }
      //console.log(appId, APP)
      const data = {
        appId,
        ...APP
      }
      data.isSys = appId.indexOf('sys') === 0;
      data.unique = APP.unique || false;

      if(data.unique){
        if(uniqueMap[appId]){
          return this.commit('task/show', uniqueMap[appId]);
        }else{
          uniqueMap[appId] = data;
        }
      }
      
      var preSameTask = {zIndex: -1};
      state.list.forEach(v => {
        if(v.appId === appId){
          if(preSameTask.zIndex < v.zIndex){
            preSameTask = v;
          }
        }
      })

      const isMax = preSameTask.isMax;

      data.width = (isMax ? APP.width : preSameTask.width) || TASK_WIDTH;
      data.height = (isMax ? APP.height : preSameTask.height) || TASK_HEIGHT;
      data.draggable = false;
      data.isMin = false;
      data.isMax = false;
      data.resizeStartData = null;

      this.commit('task/_initPosition', data); // init: positionTop, positionLeft
      this.commit('task/focus', data); // init: isFocus, id.

      data.id = state.id;
      state.latest = data;
      state.list.push(data);
    },
    focus(state, task){
      if(task.isFocus === true){
        return;
      } 
      if(state._tmpMinAll.length){
        state._tmpMinAll = [];
      }
      if(state.current === task){
        task.isFocus = true;
        return;
      }
      state.current.isFocus = false;
      task.isFocus = true;
      state.id = state.id + 1; //z-index 最前.
      task.zIndex = state.id;
      state.current = task;
    },

    show(state, task){
      task.isMin = false;
      if(task !== state.current && !state.current.isMax && task.positionLeft === state.current.positionLeft && task.positionTop === state.current.positionTop){
        this.commit('task/_initPosition', task);
      }
      this.commit('task/focus', task);
    },

    hidden(state, task){
      task.isMin = true;
      task.isFocus = false;
      this.commit('task/_focusNext');
    },

    remove(state, index){
      const item = state.list[index];
      if(item.unique){
        delete(uniqueMap[item.appId]);
      }
      state.list.splice(index, 1);
      this.commit('task/_focusNext');
    },

    currentUnFocus(state){
      state.current.isFocus = false;
    },
    
    // copy(state, task){
    //   const cloneTask = cloneDeep(task);
    //   cloneTask.isFocus = false;
    //   this.commit('task/add', cloneTask);
    // },

    minAll(state){
      if(state._tmpMinAll.length){
        state._tmpMinAll.forEach(function(v){
          v.isMin = false;
        });
        state.current.isFocus = state._tmpMinAllIsCurrFocus;
        return state._tmpMinAll = [];
      }

      state._tmpMinAllIsCurrFocus = state.current.isFocus;
      state.list.forEach(v => {
        if(!v.isMin){
          state._tmpMinAll.push(v);
          v.isMin = true;
        }
      });
      state.current.isFocus = false;
    },
    closeAll(state){
      Object.assign(state, _defState());
    },
    _focusNext(state){
      var preTask = {zIndex : -1};
      state.list.forEach(v => {
        if(v.isMin === false){
          if(preTask.zIndex < v.zIndex){
            preTask = v;
          }
        }
      })
      if(preTask.zIndex !== -1){
        this.commit('task/focus', preTask);
      }
    },
    _initPosition(state, data){
      let parentH = this.state.winH;
      let parentW = this.state.winW;
      if(!state.list.length){ // Appear on center
        data.positionTop = (parentH - data.height) / 2;
        data.positionLeft = (parentW - data.width) / 2;
      }else{
        let current = state.current;

        const top = current.positionTop + 50;
        const left = current.positionLeft + 50;
  
        if(top + data.height >= parentH){
          data.positionTop = 0;
        }else{
          data.positionTop = top;
        }
  
        if(left + data.width >= parentW){
          data.positionLeft = 0;
        }else{
          data.positionLeft = left;
        }
      }
    }
  }
}