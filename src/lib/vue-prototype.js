const Vue = window.Vue;
import request, {wrapUrl, defWrapErr} from './request';
import { getOpenIconUrl } from './util';
function vRequest(opts){
  opts.context = this;
  return request(opts);
}
Vue.directive('open-icon', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    // 聚焦元素
    el.style.backgroundImage = `url("${getOpenIconUrl(binding.value)}")`;
  }
});

vRequest.wrapUrl = wrapUrl;
vRequest.defWrapErr = defWrapErr;
Vue.prototype.request = vRequest;
window.Vuex.Store.prototype.request = vRequest;
