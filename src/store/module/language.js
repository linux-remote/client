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
            cancel: 'cancel',
            remove: 'remove',
            close: 'close',
            fileAlreadyExist: 'file already exist',
            cover: 'Cover',
            skip: 'Skip',
            coverAll: 'Cover All',
            skipAll: 'Skip All',
            donate: 'Donate',
            currently: 'Currently',
            peopleUse: 'people using'
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
              SortOut: 'Sort by name',
              remove: 'remove'
            }
          },
          sys_app_recycle_bin: {
            title: 'Recycle Bin'
          },
          sys_app_disk: {
            ctx: {
              Refresh: 'Refresh'
            },
            title: 'Storage Manager',
            freeAndTotal: 'free of'
          },
          sys_app_computer: {
            title: 'System Info'
          },
          sys_app_editor: {
            title: 'Notepad'
          },
          sys_app_terminal: {
            title: 'Terminal'
          },
          sys_app_task_manager: {
            title: 'Task Manager'
          },
          sys_app_settings: {
            title: 'About'
          },
          sys_app_fs: {
            title: 'FS Manager',
            ctx: {
              cut: 'cut',
              copy: 'copy',
              paste: 'paste',
              remove: 'delete',
              rename: 'rename',
              download: 'download',
              createSymbolicLink: 'create symbolic link',
              sendToDesktop: 'send to desktop (symbolic link)'
            },
            th: {
              name: 'name',
              owner: 'owner',
              group: 'group',
              mtime: 'date modified',
              permission: 'permission',
              size: 'size',
              deviceType: 'device type'
            },
            upload: 'Upload File'
          }
        }
      },
      // {
      //   id: 'zh-CN',
      //   name: '中文(简体)',
      //   data: {
      //     global: {
      //       folder: '目录',
      //       fileName: '文件名',
      //       saveAs: '存储为',
      //       openWith: '打开方式',
      //       ok: '确定',
      //       cancel: '取消',
      //       remove: '移除',
      //       close: '关闭',
      //       fileAlreadyExist: '文件已存在',
      //       cover: '覆盖',
      //       skip: '跳过',
      //       coverAll: '一律覆盖',
      //       skipAll: '一律跳过',
      //       donate: '捐赠',
      //       currently: '当前有',
      //       peopleUse: '人在使用'
      //     },
      //     loginPage: {
      //       langTitle: '语言',
      //       title: '登录',
      //       username: '用户名',
      //       password: '密码',
      //       submitBtn: 'ok'
      //     },
      //     start: {
      //       sysApp: '系统程序'
      //     },
      //     deskTop: {
      //       ctx: {
      //         Refresh: '刷新',
      //         SortOut: '整理',
      //         remove: '移除'
      //       }
      //     },
      //     sys_app_editor: {
      //       title: '笔记本'
      //     },
      //     sys_app_recycle_bin: {
      //       title: '回收站'
      //     },
      //     sys_app_computer: {
      //       title: '系统信息'
      //     },
      //     sys_app_disk: {
      //       ctx: {
      //         Refresh: '刷新'
      //       },
      //       title: '存储管理器',
      //       freeAndTotal: '可用, 共'
      //     },
      //     sys_app_fs: {
      //       title: '文件管理器',
      //       ctx: {
      //         remove: '移动到回收站',
      //         download: '下载',
      //         createSymbolicLink: '创建软链接'
      //       },
      //       th: {
      //         name: '名称',
      //         owner: '所有者',
      //         group: '用户组',
      //         mtime: '修改时间',
      //         permission: '权限',
      //         size: '大小',
      //         deviceType: '设备类型'
      //       },
      //       upload: '上传文件'
      //     }
      //   }
      // }
    ],
    currId: 'zh-CN',
    currIndex: 0
  },
  getters: {
    currLanguage(state){
      return state.list[0].data; // 总是 英文
      // return state.list[state.currIndex].data;
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