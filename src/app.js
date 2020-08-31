
const dom = document.getElementById('lr-root');
let preLoadHtml = `<div id="lr-pre-load" class="lr-pre-load">Loading...</div>`;
dom.innerHTML = preLoadHtml;
const preLoad = document.getElementById('lr-pre-load');
if(window.CLIENT_CONFIG.IS_PRO && 
  window.CLIENT_CONFIG.CORS && 
  window.CLIENT_CONFIG.CORS.indexOf('https') !== 0){
    const msg = 'CORS mode required https';
    preLoad.innerHTML = `<span style="color:red">${msg}</span>`;
    throw new Error(msg);
}

import './css/style.scss';
// import './ui/css/style.scss';
// import './css/login.scss';
import './lib/vue-prototype';
import './lib/vue-filter';

import store from './store/index.js';
import router from './router';




import Root from './root.vue';

const Vue = window.Vue;

var app = new Vue({
  store,
  router,
  render: h => h(Root)
});

router.onReady(() => {

  app.request({
    url: '/loggedInList',
    success(data){
      data = JSON.parse(data);
      if(data.v !== window.CLIENT_CONFIG.VERSION){
        preLoad.innerHTML = `<span class="lr-err-color">Error#<br>Client version: "${window.CLIENT_CONFIG.VERSION}"<br>unmatch server required version: "${data.v}" <br>update please.</span>`;
        return;
      }
      preLoad.remove(); // Fixed: store 未知数据。o k #/issues/194
      app.$mount(dom);
    },
    error(xhr){
      preLoad.innerHTML = `<span class="lr-err-color">Error# ${xhr.status}: ${xhr.responseText}</span>`;
    }
  })
  
})
