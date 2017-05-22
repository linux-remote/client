import Vue from 'vue'

require('./css/style.scss');
require('./lib/request');
import router from './router';
import Layout from './cmpt/layout.vue';

var app = new Vue({
  router,
  render: h => h(Layout)
});

router.onReady(() => {
  app.$mount('#app')
})