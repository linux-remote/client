// https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus
// Chrome > 45;

import './css/style.scss';
// import './ui/css/style.scss';
// import './css/login.scss';
import './lib/vue-prototype';
import './lib/vue-filter';

import store from './store/index.js';
import router from './router';

import Root from './root.vue';

const dom = document.getElementById('lr-root');
let preLoadHtml = `<div id="lr-pre-load" class="lr-pre-load">Loading...</div>`;
dom.innerHTML = preLoadHtml;
const Vue = window.Vue;
const preLoad = document.getElementById('lr-pre-load');
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
