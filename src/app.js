import Vue from 'vue';
import 'vue-use-vuex';

import './css/style.scss';
import request from './lib/request';

Vue.prototype.request = function(opts){
  opts.context = this;
  request(opts);
};

Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}

import {wellSize} from './lib/util';
Vue.filter('wellSize', wellSize);

import store from './store/index.js';
import router from './router';
import Root from './page/root.vue';

var app = new Vue({
  store,
  router,
  render: h => h(Root)
});

router.onReady(() => {
  app.$mount('#lr-app')
})
