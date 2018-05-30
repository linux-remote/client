import Vue from 'vue';
import 'vue-use-vuex';
console.log('Vue.version', Vue.version)
Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}

import './css/style.scss';
import './lib/request';

import store from './store/index.js';
import router from './router';
import Root from './page/root.vue';

var app = new Vue({
  store,
  router,
  render: h => h(Root)
});

router.onReady(() => {
  app.$mount('#lr-app')
})
