
import request from '../../lib/request';
export default   {
  namespaced: true,
  state: {
    sysMap: {
      sys_app_fs: {
        iconUrl: '/public/img/tango-style/user-home.png',
        // name: {
        //   'zh-CN': '文件管理器',
        //   'en-US': 'FS Manager'
        // }
      },
      sys_app_recycle_bin : {
        iconUrl: '/public/img/tango-style/user-trash.png',
        isEmpty: true,
        unique: true,
        ctx: ['empty']
        // name: {
        //   'zh-CN': '回收站',
        //   'en-US': 'Recycle Bin'
        // }
      },
      sys_app_disk : {
        unique: true,
        iconUrl: '/public/img/system-file-manager-6.png',
        // name: {
        //   'zh-CN': '存储管理器',
        //   'en-US': 'Storage Manager'
        // }
      },
      sys_app_computer: {
        unique: true,
        iconUrl: '/public/img/virt-manager.png',
        // name: {
        //   'zh-CN': '系统信息',
        //   'en-US': 'System Info'
        // }
      },
      sys_app_editor: {
        iconUrl: '/public/img/accessories-text-editor-6.png',
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notebook'
        // }
      },
      sys_app_terminal: {
        iconUrl: '/public/img/kterm.png',
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notebook'
        // }
      },
      sys_app_task_manager: {
        iconUrl: '/public/img/utilities-system-monitor-6.png',
        unique: true,
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notebook'
        // }
      },
      sys_app_settings: {
        iconUrl: '/public/img/system-settings.png',
        unique: true,
        hidden: true
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notebook'
        // }
      }
    },
    thirdPartyMap: null,
    _unknownApp: {
      iconUrl: '/public/img/image-missing-3.png',
      IS_UNKNOWN_APP: true
    }
  },

  getters: {
    getById(state){

      return (id) => {
        let key = id.indexOf('sys_app') === 0 ? 'sysMap' : 'thirdPartyMap';
        var app = state[key][id];
        if(app){
          // if(app.name){
          //   app.title = rootGetters['language/currLanguage'][id].title
          // }
          
          return app;
        }
        return  state._unknownApp
      }
    }
  },
  mutations: {
    setThirdPartyMap(state, data){
      state.thirdPartyMap = data;
    },
    changeRecycleBinIcon(state, bool){
      let name = bool ? 'user-trash.png' : 'user-trash-full-2.png';
      state.sysMap.sys_app_recycle_bin.isEmpty = bool;
      state.sysMap.sys_app_recycle_bin.iconUrl = '/public/img/tango-style/' + name;
    }
  },
  actions: {
    sys_app_recycle_bin_empty({ commit, state }){
      const self = this;
      request({
        context: state.sysMap.sys_app_recycle_bin,
        url: '~/recycleBin',
        type: 'delete',
        success() {
          self.commit('recycleBinTrigger', true);
        }
      })
      
    }
  }
}
