import store from '__ROOT__/store/index.js';
const DOC_TITLE = document.title;

// var wsOrigin,
//   ws,
//   isSSL = location.protocol.indexOf('https') !== -1 ||
//   window.SERVER_CONFIG.API_ROOT.indexOf('https') !== -1
// if(isSSL){
//   wsOrigin = 'wss:'
// }else{
//   wsOrigin = 'ws:'
// }
// if(window.SERVER_CONFIG.API_ROOT === '/api'){
//   wsOrigin = wsOrigin + '//' + location.host;
// }else{
//   wsOrigin = wsOrigin + '//' + window.SERVER_CONFIG.API_ROOT.split('/')[2]
// }

// export function createWs(username){ // webSocket 开始
//   ws = new WebSocket(`${wsOrigin}?user=${username}`);
//   ws.onmessage = function (event) {
//     console.log('ws', event.data);
//   };
// }

export function logout(){
  this.request({
    url: '/logout',
    type: 'post',
    data: {
      username: this.$route.params.username
    },
    success(){

      //ws.close(); // webSocket 退出

      let route = '/';
      const storeData = {
        deskInited: false,
        isLogin: false,
        tasks: []
      };
      if(store.state.sessError){
        route += ('?user=' + this.$route.params.username);
        storeData.sessError = false;
      }
      this.$router.push(route);

      document.title = DOC_TITLE;

      store.commit('set', storeData);
      store.commit('clearDesktop');
    }
  })
}
