import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Login from './cmpt/login.vue';
import Root from './cmpt/root.vue';
import data from './lib/data';

const rootBeforeEnter = function(to, from, next){
  if(!data.user){
    console.log('next', next);
    next('/login');
  }else{
    next();
  }
}

const router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '', component: Root, 
      //beforeEnter: rootBeforeEnter
    },
  ]
})

export default router;
