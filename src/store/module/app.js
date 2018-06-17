export default  {
  namespaced: true,
  state: {
    sysMap: {
      sys_app_file: {
        iconUrl: '/public/img/tango-style/user-home.png',
        title: '文件管理器'
      },
      sys_app_recycle_bin : {
        iconUrl: '/public/img/tango-style/user-trash.png',
        unique: true,
        title: '回收站'
      },
      sys_app_disk : {
        iconUrl: '/public/img/system-file-manager-6.png',
        title: '资源管理器'
      },
      sys_app_computer: {
        iconUrl: '/public/img/tango-style/network-server.png',
        title: '我的电脑'
      },
      sys_app_editor: {
        iconUrl: '/public/img/accessories-text-editor-6.png',
        title: '笔记本'
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
        return state[key][id] ||state._unknownApp
      }
    }
  },
  mutations: {
    setThirdPartyMap(state, data){
      state.thirdPartyMap = data;
    },
    changeRecycleBinIcon(state, bool){
      let name = bool ? 'user-trash.png' : 'user-trash-full-2.png';
      state.sysMap.sys_app_recycle_bin.iconUrl = '/public/img/tango-style/' + name;
    }
  },
}