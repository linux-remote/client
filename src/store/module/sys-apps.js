
import request from '../../lib/request';
export default   {
  namespaced: true,
  state: {
    sysMap: {
      sys_app_fs: {
        iconUrl: 'tango/user-home.png',
        // name: {
        //   'zh-CN': '文件管理器',
        //   'en-US': 'FS Manager'
        // }
      },
      sys_app_recycle_bin : {
        iconUrl: 'tango/user-trash.png',
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
        iconUrl: 'oxygen/kdf.png',
        // name: {
        //   'zh-CN': '存储管理器',
        //   'en-US': 'Storage Manager'
        // }
      },
      sys_app_computer: {
        unique: true,
        iconUrl: 'virt-manager.png',
        // name: {
        //   'zh-CN': '系统信息',
        //   'en-US': 'System Info'
        // }
      },
      sys_app_editor: {
        iconUrl: 'nuvola/accessories-text-editor-6.png',
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notepad'
        // }
      },
      sys_app_terminal: {
        iconUrl: 'nuvola/utilities-terminal-6.png',
        width: 742,
        height: 440
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notepad'
        // }
      },
      sys_app_task_manager: {
        iconUrl: '/public/my-img/top.png',
        // iconClassName: 'lr-text-icon lr-tm-icon',
        unique: true,
        
        height: 800
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notepad'
        // }
      },
      sys_app_settings: {
        iconClassName: 'iconfont icon-logo_LR',
        unique: true,
        hidden: true,
        width: 500,
        height: 300
        // title: null,
        // name: {
        //   'zh-CN': '笔记本',
        //   'en-US': 'Notepad'
        // }
      },
      sys_app_account: {
        iconClassName: 'iconfont icon-accountbox',
        unique: true,
        hidden: true,
        width: 300,
        height: 200
      }
    },
    thirdPartyMap: null,
    unknownApp: {
      iconUrl: 'oxygen/image-missing-3.png',
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
        return  state.unknownApp;
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
      state.sysMap.sys_app_recycle_bin.iconUrl = 'tango/' + name;
    }
  },
  actions: {
    sys_app_recycle_bin_empty({ state }){
      const self = this;
      self.commit('confirm', {
        text: 'Are you sure to permanently delete All ?',
        ok: () => {

          request({
            context: state.sysMap.sys_app_recycle_bin,
            url: '~/recycleBin',
            type: 'delete',
            success() {
              self.commit('recycleBinTrigger', true);
            }
          })

        }
      })

      
    }
  }
}
