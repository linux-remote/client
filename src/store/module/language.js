export default  {
  namespaced: true,
  state: {
    list: [
      {
        id: 'en-US',
        name: 'English(US)',
        data: {
          global: {
            folder: 'folder path',
            fileName: 'file name',
            saveAs: 'Save As',
            openWith: 'Open With',
            ok: 'OK',
            cancel: 'cancel'
          },
          loginPage: {
            langTitle: 'language',
            title: 'login',
            username: 'username',
            password: 'password',
            submitBtn: 'ok'
          },
          start: {
            sysApp: 'System program'
          },
          deskTop: {
            ctx: {
              Refresh: 'Refresh',
              SortOut: 'Sort out',
              remove: 'remove'
            }
          },
          sys_app_disk: {
            ctx: {
              Refresh: 'Refresh'
            },
            freeAndTotal: 'free of'
          },
          sys_app_file: {
            ctx: {
              remove: 'mv into recycle bin',
              download: 'download',
              createSymbolicLink: 'create symbolic link'
            },
            th: {
              name: 'name',
              owner: 'owner',
              group: 'group',
              mtime: 'mtime',
              permission: 'permission',
              size: 'size',
              deviceType: 'device type'
            },
            upload: 'Upload File'
          }
        }
      },
      {
        id: 'zh-CN',
        name: '中文(简体)',
        data: {
          global: {
            folder: '目录',
            fileName: '文件名',
            saveAs: '存储为',
            openWith: '打开方式',
            ok: '确定',
            cancel: '取消'
          },
          loginPage: {
            langTitle: '语言',
            title: '登录',
            username: '用户名',
            password: '密码',
            submitBtn: 'ok'
          },
          start: {
            sysApp: '系统程序'
          },
          deskTop: {
            ctx: {
              Refresh: '刷新',
              SortOut: '整理',
              remove: '移除'
            }
          },
          sys_app_disk: {
            ctx: {
              Refresh: '刷新'
            },
            freeAndTotal: '可用, 共'
          },
          sys_app_file: {
            ctx: {
              remove: '移动到回收站',
              download: '下载',
              createSymbolicLink: '创建软链接'
            },
            th: {
              name: '名称',
              owner: '所有者',
              group: '用户组',
              mtime: '修改时间',
              permission: '权限',
              size: '大小',
              deviceType: '设备类型'
            },
            upload: '上传文件'
          }
        }
      }
    ],
    currId: 'zh-CN',
    currIndex: 0
  },
  getters: {
    currLanguage(state){
      return state.list[state.currIndex].data;
    }
  },
  mutations: {
    set(state, id){
      var i = (typeof id === 'number') ? id : state.list.findIndex((v) => {
        return v.id === id
      });
      i = (i === -1) ? 0 : i;
      state.currIndex = i;
      state.currId = id;
      localStorage.language = state.list[state.currIndex].id;
    }
  }
}