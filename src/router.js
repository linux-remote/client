import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Login from './page/login.vue';
import Desktop from './page/desktop.vue';
import NotFound from './page/not-found.vue';

const router = new Router({
  routes: [
    { path: '/', component: Login },
    { path: '/user/:username', component: Desktop},
    { path: '*', component: NotFound}
  ]
})

export default router;
