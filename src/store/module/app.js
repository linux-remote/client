export default  {
  namespaced: true,
  state: {
    map:{
        sys_file: {
        iconUrl: '/public/img/tango-style/user-home.png',
        title: '文件管理器'
      },
      sys_recycle_bin : {
        iconUrl: '/public/img/tango-style/user-trash.png',
        unique: true,
        title: '回收站'
      },
      sys_disk : {
        iconUrl: '/public/img/tango-style/network-server.png',
        unique: true,
        title: '资源管理器'
      }
    }
  }
}