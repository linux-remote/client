import {Vue} from './store-global';

require('./css/style.scss');
require('./lib/request');


import router from './router';
import Root from './page/root.vue';

var app = new Vue({
  router,
  render: h => h(Root)
});

router.onReady(() => {
  app.$mount('#app')
})
