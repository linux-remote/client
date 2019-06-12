import alwaysLeftTop from '__ROOT__/lib/always-left-top';
import {getDirAndBase} from '__ROOT__/cmpt/sys-app/util';
export default  {
  namespaced: true,
  state: {
    icons: [],
    saveEvent: null
  },
  mutations: {
    setIcons(state, list){
      list.forEach(v => {
        _wrapItem(v);
      })
      state.icons = list;
    },
    addIcon(state, data){
      if(state.icons.find(v => v.id === data.id)) {
        this.commit('error/show', 'The icon already exists on the desktop.');
        return;
      }
      if(data.x === undefined){
        const $dom = window.$('#lr-desktop');
        const xy = alwaysLeftTop({
          data: state.icons,
          unit: 80,
          container: {
            w: $dom.width(),
            h: $dom.height(),
          },
          input: {
            w: 80,
            h: 80
          }
        });
  
        if(xy){
          data.x = xy.x;
          data.y = xy.y;
          this.commit('desktop/_save', data);
  
        } else {
          let msg;
          if(xy === 0){
            msg = 'Desktop is full.'
          } else {
            msg = 'Desktop have not enough space, Please clear.';
          }
          this.commit('error/show', msg);
        }
      } else {
        this.commit('desktop/_save', data);
      }

    },
    removeIcon(state, index){
      state.icons.splice(index, 1);
      state.saveEvent = Date.now();
    },
    _save(state, data){
      _wrapItem(data);
      state.icons.push(data);
      state.saveEvent = Date.now();
    }
  }
}

function _wrapItem(item){
  switch(item.type){
    case 'folder':
    case 'file':
      if(!item.name) {
        item.name = getDirAndBase(item.id).base;
      }
      if(item.type === 'folder'){
        item.openWith = {
          appId: 'sys_app_fs',
          address: item.id
        }
      } else {
        item.openWith = {
          appId: 'sys_app_editor',
          filePath: item.id
        }
      }
      break;
    default:
      item.openWith = {
        appId: item.id
      }
  }
}