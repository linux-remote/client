const $ = require('jquery');
import Vue from 'vue';
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

function requestPreOpts(opts){
  const self = opts.context;
  if(self.$get('isRequest')){ 
    return;
  }
  self.$set('isRequest', true);

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
      return;
    }
  }
  
  opts.url = API_ROOT + opts.url;
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
      success.call(self, data.data);
    }else{
      codeError.call(self, data);
    }
  }

  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){
    if(opts.poolKey){
      const pool = self.$options._requestPool;
      const key = opts.poolKey;
      delete(pool[key]);
      const currKey = self.$options._requestCurrPoolKey;
      if(key !== currKey){
        return;
      }
    }
    self.$set('isRequest', false);

    complete.call(self, xhr, status);
    if(status !== 'success'){
      error.call(self, xhr, status);
    }else{
      success2.call(self, xhr.responseJSON, status);
    }
  }
  opts.success = null;
  opts.error = null;

  return opts;
}

function request(opts){
  opts.context = this;
  $.ajax(requestPreOpts(opts))
}

Vue.prototype.request = request;
