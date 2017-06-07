import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Login from './cmpt/login.vue';
import Desk from './cmpt/desk.vue';
import NotFound from './cmpt/not-found.vue';
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
