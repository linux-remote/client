import Login from './page/login.vue';
import Desktop from './page/desktop.vue';
import NotFound from './page/not-found.vue';

const router = new window.VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/user/:username', component: Desktop},
    { path: '*', component: NotFound}
  ]
});

export default router;
