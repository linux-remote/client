//let _id = 3; 
import sysAppsMap from './sys-apps-map';
let id = 1;
let currFocusTask = null;
const uniqueMap = Object.create(null);
const startWindowMap = Object.create(null);

const DEF_TASK_WIDTH = 800;
const DEF_TASK_HEIGHT = 600;

function _initApp(appId, app){
  if(startWindowMap[appId]){
    return;
  }
  app.id = appId;
  app.window = app.window || Object.create(null);
  const appWindow = startWindowMap[appId] = app.window;
  appWindow.title = app.name;
  delete(app.window);
  // init width
  if(typeof appWindow.width !== 'number'){
    appWindow.startWidth = DEF_TASK_WIDTH;
  } else {
    appWindow.startWidth = appWindow.width;
    delete(appWindow.width);
  }

  // init height
  if(typeof appWindow.height !== 'number'){
    appWindow.startHeight = DEF_TASK_HEIGHT;
  } else {
    appWindow.startHeight = appWindow.height;
    delete(appWindow.height);
  }
}

function _initPosition(current, appWindow){
  var dom = document.getElementById('lr-desktop');
  var desktopH = dom.clientHeight;
  const desktopW = dom.clientWidth;
  if(!current){ // Appear on center
    appWindow.startTop = (desktopH - appWindow.startHeight) / 2;
    appWindow.startLeft = (desktopW - appWindow.startWidth) / 2;
  }else{

    const startTop = current.top + 50;
    const startLeft = current.left + 50;

    if(startTop + appWindow.startHeight >= desktopH){
      appWindow.startTop = 0;
    }else{
      appWindow.startTop = startTop;
    }

    if(startLeft + appWindow.startWidth >= desktopW){
      appWindow.startLeft = 0;
    }else{
      appWindow.startLeft = startLeft;
    }
  }
}

function _defState(){
  return {
    list: [],
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
    add(state, appId){
      const app = sysAppsMap[appId];
      if(!app){
        this.commit('error/show', 'Unknown App!');
        return;
      }
      _initApp(appId, app);
      const task = Object.create(null);
      task.app = app;
      const startWindow = startWindowMap[appId];
      if(app.unique){
        if(uniqueMap[appId]){
          this.commit('task/show', uniqueMap[appId]);
          return;
        }else{
          uniqueMap[appId] = task;
        }
      }
      
      _initPosition(null, startWindow);

      task.id = id;
      id = id + 1;

      this.commit('task/focus', startWindow); // init: isFocus, id.


      task.startWindow = startWindow;
      task.window = Object.create(null);
      console.log('berfer create')
      state.list.push(task);
      console.log('berfer after')
    },
    onWindowCreate(state, vm){
      const index = state.list.findIndex(v => v.id === vm.id);
      state.list[index].window = vm;
    },
    onWindowResized(state, index){
      const item = state.list[index];
      item.startWindow.startWidth = item.window.width;
      item.startWindow.startHeight = item.window.height;
    },
    focus(state, taskWindow){
      if(taskWindow.isFocus === true){
        return;
      }
      if(state._tmpMinAll.length){
        state._tmpMinAll = [];
        state.isMinAll = false;
      }
      if(state.current === taskWindow){
        taskWindow.isFocus = true;
        return;
      }
      state.current.isFocus = false;
      taskWindow.isFocus = true;
      state.id = state.id + 1; //z-index 最前.
      taskWindow.zIndex = state.id;
      state.current = taskWindow;
    },

    // show(state, task){
    //   task.isMin = false;
    //   this.commit('task/focus', task);
    // },

    hidden(state, task){
      task.isMin = true;
      task.isFocus = false;
      this.commit('task/_focusNext');
    },

    remove(state, id){
      let index = state.list.findIndex(function(v){
        return v.id === id;
      });
      const item = state.list[index];
      if(item.app.unique){
        delete(uniqueMap[item.app.id]);
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
        data.top = (parentH - data.height) / 2;
        data.left = (parentW - data.width) / 2;
      }else{
        let current = state.current;

        const top = current.top + 50;
        const left = current.left + 50;
  
        if(top + data.height >= parentH){
          data.top = 0;
        }else{
          data.top = top;
        }
  
        if(left + data.width >= parentW){
          data.left = 0;
        }else{
          data.left = left;
        }
      }
    }
  }
}
