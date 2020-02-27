// https://developer.mozilla.org/en-US/docs/Web/API/Document/hasFocus
// Chrome > 45;

import './css/style-new.scss';
// import './ui/css/style.scss';
// import './css/login.scss';
import './lib/vue-prototype';
import './lib/vue-filter';

import store from './store/index.js';
import router from './router';
import Root from './root.vue';

const dom = document.getElementById('lr-root');
let preLoadHtml = `<div id="lr-pre-load" class="lr-pre-load"></div>`;
dom.innerHTML = preLoadHtml;

const preLoad = document.getElementById('lr-pre-load');
var app = new window.Vue({
  store,
  router,
  render: h => h(Root)
});

router.onReady(() => {

  app.request({
    url: '/loggedInList',
    success(){
      preLoad.remove(); // Fixed: store 未知数据。o k #/issues/194
      app.$mount(dom);
    },
    error(xhr){
      preLoad.innerHTML = `<span class="lr-err-color">Error# ${xhr.status}: ${xhr.responseText}</span>`;
    }
  })
  
})
