const Vue = window.Vue;
import request, {wrapUrl} from './request';

function vRequest(opts){
  opts.context = this;
  return request(opts);
}
vRequest.wrapUrl = wrapUrl;
Vue.prototype.request = vRequest;


Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}