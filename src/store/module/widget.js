export default  {
  namespaced: true,
  state: {
    sys_app_return_desk: {
      type: 'system',
      iconUrl: '/public/img/tango-style/user-desktop.png',
      title: '返回桌面',
      handleClick(){
        store.commit('task/minAll');
      }
    }
  }
}