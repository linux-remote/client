import store from '../store-global';
const DOC_TITLE = document.title;

var ws, wsOrigin,
  isSSL = location.protocol.indexOf('https') !== -1 ||
  window.SERVER_CONFIG.API_ROOT.indexOf('https') !== -1
if(isSSL){
  wsOrigin = 'wss:'
}else{
  wsOrigin = 'ws:'
}
if(window.SERVER_CONFIG.API_ROOT === '/api'){
  wsOrigin = wsOrigin + '//' + location.host;
}else{
  wsOrigin = wsOrigin + '//' + window.SERVER_CONFIG.API_ROOT.split('/')[2]
}
console.log('wsOrigin', wsOrigin);
export function createWs(username){
  ws = new WebSocket(`${wsOrigin}?user=${username}`);
  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    store.commit('set', data.data);
  };
}

export function logout(){
  this.request({
    url: '/logout',
    type: 'post',
    data: {
      username: store.state.username
    },
    success(){
      ws.close();
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
      store.commit('set', storeData);
      document.title = DOC_TITLE;
    }
  })
}
