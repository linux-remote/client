const Vue = window.Vue;
import request, {wrapUrl, defWrapErr} from './request';

function vRequest(opts){
  opts.context = this;
  return request(opts);
}
vRequest.wrapUrl = wrapUrl;
vRequest.defWrapErr = defWrapErr;
Vue.prototype.request = vRequest;


Vue.prototype.noopStop = function(e){
  e.stopPropagation();
}