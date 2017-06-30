import $ from 'jquery';
import Vue from 'vue';
//import FileSaver from 'file-saver';
import {noop} from 'lodash';
import errorStore from '__ROOT__/store/error';
import store from '__ROOT__/store-global';


// ************************* requset *************************

const API_ROOT = window.SERVER_CONFIG.API_ROOT;
//const POOL = {};
//跨站ajax请求初始化.
if(API_ROOT.indexOf('http') === 0){
  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });
}

//const isIE = navigator.userAgent.indexOf('MSIE') !== -1;

function httpErrorHandler(xhr){

  if(xhr.status === 403 || xhr.responseText === 'LINUX_REMOTE_USER_SERVER_ERROR'){
    return store.commit('needRelogin');
  }
  errorStore.commit('show', `http ${xhr.status} ${xhr.responseText}`);
}

function codeErrorHandler(data){
  // if(data.code === 5){
  //   store.commit('needRelogin');
  // }
  errorStore.commit('show', 'code:' + data.code + data.msg);
}

function omitEmpty(obj){ //过滤掉空的参数
  var obj2 = {};
  for(var i in obj){
    if(obj[i] || obj[i] === 0){
      obj2[i] = obj[i];
    }
  }
  return obj2;
}


function request(opts, beforeStop = noop, afterStop = noop){
  if(beforeStop(opts)){
    return;
  }

  const self = opts.context;
  if(opts.url[0] === '~'){
    opts.url = '/user/' + self.$route.params.username + opts.url.substr(1);
  }
  opts.url = API_ROOT + opts.url;
  opts.onError = opts.onError || noop;
  if(opts.data){
    opts.data = omitEmpty(opts.data);
  }
  // opts.dataType = 'json';
  // opts.contentType = 'application/json;charset=UTF-8';
  // opts.processData = false;
  // opts.data = JSON.stringify(opts.data);
  // opts.dataType = 'json';
  const codeError = opts.codeError || codeErrorHandler;
  const success = opts.success;
  const complete = opts.complete;
  const error = opts.error || httpErrorHandler;
  const success2 = function(data){
    if(data.code === 0) {
      if(data.DOWNLOAD_URL) return download(data.DOWNLOAD_URL);
      success && success.call(self, data.data);
    }else{
      opts.onError();
      codeError.call(self, data);
    }
  }

  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){

    if(afterStop(opts)){
      return;
    }

    complete && complete.call(self, xhr, status);
    if(status !== 'success'){
      opts.onError();
      error && error.call(self, xhr);
    }else{
      if(!xhr.responseJSON){
        success && success.call(self, xhr.responseText);
      }else{
        success2.call(self, xhr.responseJSON, status);
      }
    }
  }

  opts.success = null;
  opts.error = null;

  $.ajax(opts)
}

function _vueBefore(opts){
  const self = opts.context;
  const requestKey = opts.requestKey;
  if(requestKey){
    if(self[requestKey]){
      return true;
    }
    self[requestKey] = true;
  }


  if(opts.poolKey){
    if(!self.$options._requestPool){
      self.$options._requestCurrPoolKey = opts.poolKey;
      self.$options._requestPool = {};
    }
    const pool = self.$options._requestPool;
    const key = opts.poolKey;
    if(!pool[key]){
      pool[key] = true;
    }else{
      return true;
    }
  }
}


function _vueAfterStop(opts){
  const self = opts.context;
  const requestKey = opts.requestKey;
  if(opts.poolKey){
    const pool = self.$options._requestPool;
    const key = opts.poolKey;
    delete(pool[key]);
    const currKey = self.$options._requestCurrPoolKey;
    if(key !== currKey){
      return;
    }
  }

  if(requestKey){
    self[requestKey] = false;
  }
}
Vue.prototype.apiGet = function(url, data, success){
  if(typeof data === 'function'){
    success = data;
    data = {};
  }
  this.request({
    url,
    data,
    success
  })
}

function vRequest(opts){
  opts.context = this;
  request(opts, _vueBefore, _vueAfterStop);
}

function download(url){
  $(`<form action="${API_ROOT}${url}" style="display:none"></form>`)
  .appendTo('body').submit().remove();
}

vRequest.download = download;
Vue.prototype.request = vRequest;
export default request;
