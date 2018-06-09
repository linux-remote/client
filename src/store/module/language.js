export default  {
  namespaced: true,
  state: {
    list: [
      {
        id: 'en-US',
        name: 'English(US)',
        data: {
          loginPage: {
            langTitle: 'language',
            title: 'login',
            username: 'username',
            password: 'password',
            submitBtn: 'ok'
          }
        }
      },
      {
        id: 'zh-CN',
        name: '中文(简体)',
        data: {
          loginPage: {
            langTitle: '语言',
            title: '登录',
            username: '用户名',
            password: '密码',
            submitBtn: 'ok'
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
    }
  }
}