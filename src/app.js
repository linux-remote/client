import Vue from 'vue';
import 'vue-use-vuex';

Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}

import './store-global';
import './css/style.scss';
import './lib/request';
import router from './router';
import Root from './page/root.vue';

var app = new Vue({
  router,
  render: h => h(Root)
});

router.onReady(() => {
  app.$mount('#lr-app')
})
