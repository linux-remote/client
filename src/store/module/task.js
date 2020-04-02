//let _id = 3; 
import { getApp } from './sys-apps-map';

let id = 1;
const uniqueTaskMap = Object.create(null);

const P_OFFSET = 22;

function _initPosition(appWindow){
  const dom = document.getElementById('lr-desktop');
  const desktopH = dom.clientHeight;
  const desktopW = dom.clientWidth;
  let top, left;
  if(appWindow.top === undefined){
    top = (desktopH - appWindow.height) / 2;
  } else if(appWindow.top > 0 && appWindow.top < 1){
    top = Math.ceil((desktopH - appWindow.height) * appWindow.top);
  } else {
    top = appWindow.top + P_OFFSET;
  }
  if(appWindow.left === undefined){
    left = (desktopW - appWindow.width) / 2;
  } else if(appWindow.left > 0 && appWindow.left < 1){
    left = Math.ceil((desktopW - appWindow.width) * appWindow.left);
  } else {
    left = appWindow.left + P_OFFSET;
  }

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
          uniqueTaskMap[appId].window.show();
          // this.commit('task/show', uniqueTaskMap[appId]);
          return;
        }else{
          uniqueTaskMap[appId] = task;
        }
      }
      
      _initPosition(app.window);

      task.id = id;
      id = id + 1;

      task.window = Object.create(null);
      state.list.push(task);
    },

    remove(state, id){
      let index = state.list.findIndex(function(v){
        return v.id === id;
      });
      const item = state.list[index];
      if(item.app.unique){
        delete(uniqueTaskMap[item.app.id]);
      }
      if(!item.window.isMax){
        const aw = item.app.window;
        aw.top = aw.top - P_OFFSET;
        aw.left = aw.left - P_OFFSET;
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
        ptw.focusenter();
      }
    }
  }
}
