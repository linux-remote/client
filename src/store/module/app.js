export default  {
  namespaced: true,
  state: {
    list: [],
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
      }
    },
    thirdPartyMap: {

    }
  },
  mutations: {
    setThirdPartyMap(state, data){
      state.thirdPartyMap = data;
    }
  },
  getters: {
    getById(state){
      return (id) => {
        console.log('id', id)
        let key = id.indexOf('sys_app') === 0 ? 'sysMap' : 'thirdPartyMap';
        return state[key][id]
      }
    }
  }
}