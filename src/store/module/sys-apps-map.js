export default {
    sys_app_fs: {
      name: "FS Manager",
      iconUrl: 'tango/user-home.png',
      // unique: false,
      // window: {
      //   width: ,
      //   height: ,
      // }
    },
    sys_app_recycle_bin : {
      name: "Recycle Bin",
      iconUrl: 'tango/user-trash.png',
      unique: true,
      isEmpty: true,
      ctx: ['empty']
    },
    sys_app_editor: {
      name: "Notepad",
      iconUrl: 'nuvola/accessories-text-editor-6.png'
    },
    sys_app_terminal: {
      name: "Terminal",
      iconUrl: 'nuvola/utilities-terminal-6.png',
      width: 742,
      height: 440
    }
}