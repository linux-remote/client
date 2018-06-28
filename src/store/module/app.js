export default  {
  namespaced: true,
  state: {
    sysMap: {
      sys_app_file: {
        iconUrl: '/public/img/tango-style/user-home.png',
        name: {
          'zh-CN': '文件管理器',
          'en-US': 'FS Manager'
        }
      },
      sys_app_recycle_bin : {
        iconUrl: '/public/img/tango-style/user-trash.png',
        isEmpty: true,
        unique: true,
        name: {
          'zh-CN': '回收站',
          'en-US': 'Recycle Bin'
        }
      },
      sys_app_disk : {
        iconUrl: '/public/img/system-file-manager-6.png',
        name: {
          'zh-CN': '存储管理器',
          'en-US': 'Storage Manager'
        }
      },
      sys_app_computer: {
        iconUrl: '/public/img/virt-manager.png',
        name: {
          'zh-CN': '系统信息',
          'en-US': 'System Info'
        }
      },
      sys_app_editor: {
        iconUrl: '/public/img/accessories-text-editor-6.png',
        name: {
          'zh-CN': '笔记本',
          'en-US': 'Notebook'
        }
      }
    },
    thirdPartyMap: null,
    _unknownApp: {
      iconUrl: '/public/img/image-missing-3.png',
      IS_UNKNOWN_APP: true
    }
  },

  getters: {
    getById(state, getter, rootState){
      var self = this;
      return (id) => {
        let key = id.indexOf('sys_app') === 0 ? 'sysMap' : 'thirdPartyMap';
        var app = state[key][id];
        if(app){
          if(app.name){
            app.title = app.name[rootState.language.currId]
          }
          
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
}