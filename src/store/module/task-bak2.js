//let _id = 3; 
import { getApp } from './sys-apps-map';

let id = 1;
const uniqueTaskMap = Object.create(null);

const P_OFFSET = 22;

function _initPosition(latest, appWindow){
  var dom = document.getElementById('lr-desktop');
  var desktopH = dom.clientHeight;
  const desktopW = dom.clientWidth;
  if(!latest){ // Appear on center
    appWindow.top = (desktopH - appWindow.height) / 2;
    appWindow.left = (desktopW - appWindow.width) / 2;
  }else{

    const top = latest.top + P_OFFSET;
    const left = latest.left + P_OFFSET;

    if(top + appWindow.height >= desktopH){
      appWindow.top = 0;
    }else{
      appWindow.top = top;
    }

    if(left + appWindow.width >= desktopW){
      appWindow.left = 0;
    }else{
      appWindow.left = left;
    }
  }
}

function _defState(){
  return {
    list: [],
    map: Object.create(null),

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
    add(state, _opt){
      let opt = _opt;
      if(typeof opt === 'string'){
        opt = {
          appId: opt
        };
      }
      const appId = opt.appId;
      const app = getApp(appId);
      if(!app){
        this.commit('error/show', 'Unknown App!');
        return;
      }
      const task = Object.create(null);
      task.app = app;
      task.launchOption = opt;
      if(app.unique){
        if(uniqueTaskMap[appId]){
          this.commit('task/show', uniqueTaskMap[appId]);
          return;
        }else{
          uniqueTaskMap[appId] = task;
        }
      }
      
      _initPosition(null, app.window);

      task.id = id;
      id = id + 1;

      task.window = Object.create(null);
      console.log('task', task);
      state.list.push(task);
      state.map[task.id] = task;
    },
    onWindowCreate(state, vm){
      const index = state.list.findIndex(v => v.id === vm.id);
      state.list[index].window = vm;
    },
    onWindowResized(state, id){
      const index = state.list.findIndex(v => v.id === id);
      const item = state.list[index];
      item.startWindow.width = item.window.width;
      item.startWindow.height = item.window.height;
    },
    remove(state, id){
      let index = state.list.findIndex(function(v){
        return v.id === id;
      });
      const item = state.list[index];
      if(item.app.unique){
        delete(uniqueTaskMap[item.app.id]);
      }
      state.list.splice(index, 1);
      this.commit('task/focusNext');
    },

    // toggleMinAll(state){
    //   if(state._tmpMinAll.length){
    //     state._tmpMinAll.forEach(function(v){
    //       v.isMin = false;
    //     });
    //     state.current.isFocus = state._tmpMinAllIsCurrFocus;
    //     state._tmpMinAll = [];

    //   } else {
    //     state._tmpMinAllIsCurrFocus = state.current.isFocus;
    //     state.list.forEach(v => {
    //       if(!v.isMin){
    //         state._tmpMinAll.push(v);
    //         v.isMin = true;
    //       }
    //     });
    //     state.current.isFocus = false;
    //   }
    //   state.isMinAll = state._tmpMinAll.length !== 0;
    // },
    // closeAll(state){
    //   Object.assign(state, _defState());
    // },
    focusNext(state){
      var ptw = {zIndex : -1};
      state.list.forEach(task => {
        let tw = task.window;
        if(tw.isMin === false){
          if(ptw.zIndex < tw.zIndex){
            ptw = tw;
          }
        }
      });
      if(ptw.zIndex !== -1){
        ptw.focus();
      }
    }
  }
}
