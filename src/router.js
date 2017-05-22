import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Home from './cmpt/home.vue';

const router = new Router({
  routes: [
    { path: '/test', component: Home }
  ]
})

export default router;
