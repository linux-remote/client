import store from '../store-global';
const DOC_TITLE = document.title;

var ws;
export function createWs(username){
  ws = new WebSocket('wss://192.168.56.101:3000?user=' + username);
  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    // switch (data.type) {
    //   case 'init':
    //   case 'timeZoneNameChange':
    //     store.commit('set', data.data);
    //     break;
    // }
    // console.log('data', data);
    // if(data.type === 'init'){
    //   data.data.deskInited = true;
    //   document.title = username + '@' + data.data.hostname;
    // }
    store.commit('set', data.data);
  };
}

export function logout(){
  this.request({
    url: '/logout',
    type: 'post',
    data: {
      username: this.username
    },
    success(){
      //store.commit('set', {username: null});
      ws.close();
      let route = '/';
      const storeData = {deskInited: false};
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
