import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Login from './page/login.vue';
import Desk from './page/desk.vue';
import NotFound from './page/not-found.vue';
import DeskCmpt from './deskcmpt/index.vue';
import Friend from './deskcmpt/friend.vue';
//import data from './lib/data';

// const rootBeforeEnter = function(to, from, next){
//   if(!data.user){
//     console.log('next', next);
//     next('/login');
//   }else{
//     next();
//   }
// }

const router = new Router({
  routes: [
    { path: '/deskcmpt', component: DeskCmpt },
    { path: '/Friend', component: Friend },
    { path: '/', component: Login },
    { path: '/user/:username', component: Desk,
      // child: [
      //   {path: 'agdf', component: Root}
      // ]

      //beforeEnter: rootBeforeEnter
    },
    { path: '*', component: NotFound}
  ]
})

export default router;
