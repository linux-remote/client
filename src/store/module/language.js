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
    currId: 'zh-CN'
  },
  getters: {
    currLanguage(state){
      return state.list.find((v) => {
        return v.id === state.currId
      }).data
    }
  },
  mutations: {
    set(state, id){
      state.currId = id;
    }
  }
}