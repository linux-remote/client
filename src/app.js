

import './css/style.scss';

import './lib/vue-prototype';
import './lib/vue-filter';

import store from './store/index.js';
import router from './router';
import Root from './page/root.vue';

var app = new window.Vue({
  store,
  router,
  render: h => h(Root)
});

router.onReady(() => {
  app.$mount('#lr-app')
})
