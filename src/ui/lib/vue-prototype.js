const Vue = window.Vue;
import request, {defWrapErr} from './request';

function vRequest(opts){
  opts.context = this;
  return request(opts);
}

vRequest.defWrapErr = defWrapErr;
Vue.prototype.request = vRequest;