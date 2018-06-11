const Vue = window.Vue;
import request from './request';

Vue.prototype.request = function(opts){
  opts.context = this;
  request(opts);
};

Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}