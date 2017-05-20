import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Home from './cmpt/home.vue'
require('./css/style.scss');

const router = new Router({
  routes: [
    { path: '/', component: Home }
  ]
})

var app = new Vue({
  router,
  render: h => h(Home)
});

router.onReady(() => {
  app.$mount('#app')
})