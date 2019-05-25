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
    
    isMinAll: false,
    _tmpMinAll: [],
    _tmpMinAllIsCurrFocus: false
  }
}
export default  {
  namespaced: true,
  state: _defState(),
  mutations: {
    add(state, opts){
      var appId;
      if(typeof opts === 'string'){
        appId = opts;
        opts = {appId}
      } else {
         // opts 是一个对象.
        appId = opts.appId;
      }
      const APP = this.getters['sysApps/getById'](appId);

      if(APP.IS_UNKNOWN_APP){
        return alert('Unknown App!');
      }

      const data = {
        ...opts,
        APP
      }
      data.title = data.title || null;
      data.unique = APP.unique || false;
      data.width = APP.width || TASK_WIDTH;
      data.height = APP.height || TASK_HEIGHT;

      if(data.unique){
        if(uniqueMap[appId]){
          return this.commit('task/show', uniqueMap[appId]);
        }else{

          uniqueMap[appId] = data;
        }
      } else {
        let preSameTask = {zIndex: -1, width: data.width, height: data.height};
        state.list.forEach(v => {
          if(v.appId === appId){
            if(preSameTask.zIndex < v.zIndex){
              preSameTask = v;
            }
          }
        });
  
        const isMax = preSameTask.isMax;
        data.width = isMax ? data.width : preSameTask.width;
        data.height = isMax ? data.height : preSameTask.height;
        
      }
      const rootState = this._modules.root.state;
      if(data.width > rootState.deskTopW){
        data.width = rootState.deskTopW;
      }
      if(data.height > rootState.deskTopH){
        data.height = rootState.deskTopH;
      }
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
        state.isMinAll = false;
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

    toggleMinAll(state){
      if(state._tmpMinAll.length){
        state._tmpMinAll.forEach(function(v){
          v.isMin = false;
        });
        state.current.isFocus = state._tmpMinAllIsCurrFocus;
        state._tmpMinAll = [];

      } else {
        state._tmpMinAllIsCurrFocus = state.current.isFocus;
        state.list.forEach(v => {
          if(!v.isMin){
            state._tmpMinAll.push(v);
            v.isMin = true;
          }
        });
        state.current.isFocus = false;
      }
      state.isMinAll = state._tmpMinAll.length !== 0;
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