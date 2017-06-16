import store from '../store-global';

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
    //console.log('data', data)
    if(data.type === 'init'){
      document.title = username + '@' + data.data.hostname;
    }
    store.commit('set', data.data);
  };
}

export function login(){
  const {username, password} = this;
  this.request({
    url: '/login',
    type: 'post',
    data: {
      username,
      password
    },
    success(data){
      // data.username = username;
      // createWs(username);
      store.commit('set', data);
      this.routeTo(username);
    }
  })
}

export function logout(){
  this.request({
    url: '/logout',
    type: 'post',
    data: {
      username: this.username
    },
    success(loginedList){
      store.commit('set', {loginedList});

      ws.close();
      this.$router.push('/');
    }
  })
}
