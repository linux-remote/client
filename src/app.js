import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

require('./css/style.scss');
require('./lib/request');
import router from './router';
import Wtf from './cmpt/wtf.vue';

var app = new Vue({
  router,
  render: h => h(Wtf)
});

router.onReady(() => {
  app.$mount('#app')
})
