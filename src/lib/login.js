import store from '__ROOT__/store/index.js';
const DOC_TITLE = document.title;

var wsOrigin,
  ws,
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
/*
var loopMax = 60, loopCount = 0;
export function createWs(username){ // webSocket 开始
  ws = new WebSocket(`${wsOrigin}?user=${username}`);
  ws.onopen = function(){
    console.log('ws ok!');
    loopCount = 0;
  }
  ws.onmessage = function (event) {
    // console.log('ws', event.data);
    const data = JSON.parse(event.data);
    if(data.type === 'say'){
      store.commit('users/addMessage', data);
    }else{
      delete(data.type);
      store.commit('users/set', data);
    }
  };
  ws.onclose = function(){
    if(store.state.isLogin){
      setTimeout(function(){
        console.log('re create ws', loopCount);
        loopCount = loopCount + 1;
        if(loopCount < loopMax){
          createWs(username);
        }
      }, 500);
    }
  }
  window.APP.user_ws = ws;
}
*/
export function logout(){
  this.request({
    url: '/logout',
    type: 'post',
    data: {
      username: this.$route.params.username
    },
    success(data){
      // {loginedList: []}
      this.$store.commit('set', data);
      
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
      

      document.title = DOC_TITLE;

      store.commit('set', storeData);
      store.commit('clearDesktop');

      // ws.close(); // webSocket 退出
      this.$router.push(route);
    }
  })
}
