const $ = require('jquery');
import Vue from 'vue';
import {noop} from 'lodash';
// ************************* requset *************************

const API_ROOT = window.SERVER_CONFIG.API_ROOT;
//const POOL = {};

//const isIE = navigator.userAgent.indexOf('MSIE') !== -1;

function httpErrorHandler(xhr, status, msg){
  console.log(`http#${status}错误:${msg}`);
}

function codeErrorHandler(code, message){
  console.log('code#' + code + '错误:' + message);
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

  opts.url = API_ROOT + opts.url;
  opts.onError = opts.onError || noop;
  opts.data = opts.data ?  omitEmpty(opts.data) : {};
  opts.dataType = 'json';
  opts.contentType = 'application/json;charset=UTF-8';
  opts.processData = false;
  opts.data  = JSON.stringify(opts.data);

  const codeError = opts.codeError || codeErrorHandler;
  const success = opts.success;
  const complete = opts.complete;
  const error = opts.error || httpErrorHandler;
  const success2 = function(data){
    if(data.code === 0) {
      success && success.call(self, data.data);
    }else{
      opts.onError();
      codeError.call(self, data);
    }
  }

  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){

    if(afterStop(self, opts)){
      return;
    }

    complete && complete.call(self, xhr, status);
    if(status !== 'success'){
      opts.onError();
      error && error.call(self, xhr, status);
    }else{
      success2.call(self, xhr.responseJSON, status);
    }
  }

  opts.success = null;
  opts.error = null;

  $.ajax(opts)
}

function _vueBefore(opts){
  const self = opts.context;
  const $data = self.$data;
  if($data.isRequest){
    return true;
  }

  self.$set($data, 'isRequest', true);

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
  const $data = self.$data;
  if(opts.poolKey){
    const pool = self.$options._requestPool;
    const key = opts.poolKey;
    delete(pool[key]);
    const currKey = self.$options._requestCurrPoolKey;
    if(key !== currKey){
      return;
    }
  }
  self.$set($data, 'isRequest', false);
}

Vue.prototype.request = function(opts){
  opts.context = this;
  request(opts, _vueBefore, _vueAfterStop);
}

export default request;