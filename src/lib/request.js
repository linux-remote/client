//修改自: https://github.com/hezedu/dwlib/blob/master/request.js
// 增加了codeError, 去掉 omitEmpty, 修改了:opts.url
import {noop} from './util';
import store from '__ROOT__/store/index.js';
const $ = window.$;

const API_ROOT = window.SERVER_CONFIG.API_ROOT;
const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
//const POOL = {};
//跨站ajax请求初始化.
if(API_ROOT.indexOf('http') === 0){
  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    }
  });
}


const POOL = {};
var poolIndex = 0;

// 默认的http处理程序
function httpErrorHandler(xhr){

  if(xhr.status === 403 || xhr.responseText === 'LINUX_REMOTE_USER_SERVER_ERROR'){
    console.log('转向登录页');
    request.abortAll();
    return store.commit('needRelogin');
  }
  store.commit('error/show', `http#${xhr.status}: ${xhr.responseText}`);
}

function codeErrorHandler(data){
  store.commit('error/show', `code#${data.code}: ${data.msg}`);
}

//过滤掉空的参数
const omitKeyMap = {
  stateKey: true,
  repeatSubmitMode: true,
  complete: true,
  success: true,
  error: true,
  codeError: true,
  rootUrl: true
};

const globalConfig = {
  repeatSubmitMode: undefined,
  rootUrl: API_ROOT
}

function request(opts){
  var {
    stateKey,
    success = noop,
    complete = noop,
    error = httpErrorHandler,
    codeError = codeErrorHandler,
    //isOmitEmptyData = true,
    repeatSubmitMode = globalConfig.repeatSubmitMode,
    rootUrl = globalConfig.rootUrl,
    url
  } = opts;


  // const stateKey = opts.stateKey;
  // const success = opts.success || noop;
  // const complete = opts.complete || noop;
  // const error = opts.error || httpErrorHandler;

  // var repeatSubmitMode = 
  //   opts.repeatSubmitMode === undefined 
  //   ? globalConfig.repeatSubmitMode 
  //   : opts.repeatSubmitMode;

  Object.keys(opts).forEach(k => {
    if(omitKeyMap[k]){
      delete(opts[k]);
    }
  });
  const self = opts.context;
  opts.type = opts.type || 'get';
  if(opts.type === 'post' || opts.type === 'put'){
    opts.contentType = opts.contentType || JSON_CONTENT_TYPE;
    if(opts.contentType === JSON_CONTENT_TYPE){
      opts.data = JSON.stringify(opts.data);
    }
  }


  if(url[0] === '~'){
    url = '/user/' + self.$route.params.username + url.substr(1);
  }
  opts.url =  rootUrl + url;
  // if(isOmitEmptyData){
  //   if(TypeOf(opts.data) === 'Object'){
  //     opts.data = omitEmpty(opts.data);
  //   }
  // }

  var _pIndex = poolIndex;
  
  var selfPoolIndex;
  
  if(stateKey){
    selfPoolIndex = '_request_pool_index_' + stateKey;
    if(repeatSubmitMode === undefined){
      if(opts.type === 'get'){
        repeatSubmitMode = 'abort';
      }else{
        repeatSubmitMode = 'block';
      }
    }

    if(repeatSubmitMode === 'abort'){
      const index = self[selfPoolIndex];
      if(POOL[index]){
        POOL[index].abort(); //波浪模式
      }
    }

    if(self[stateKey]){
      //if(repeatSubmitMode === 'abort'){
      //
      //}else 
      if(repeatSubmitMode === 'block'){
        return; //阻塞模式
      }
    }else {
      self[stateKey] = true;
    }
  }

  
  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){

    delete(POOL[_pIndex]); //销毁 POOL 的数据
    
    if(stateKey){
      self[stateKey] = false;
      // if(_pIndex !== self[selfPoolIndex]){
      //   console.log('=============重载阻止=============');
      //   return;
      // }
    }

    if(status === 'abort'){ //取消不进行操作
      //console.log('=============abort 成功!=============');
      return;
    }
    complete.call(self, xhr, status);

    if(status !== 'success'){
      error.call(self,  xhr);
    }else{
      if(xhr.responseJSON){
        if(xhr.responseJSON.code){
          codeError.call(self, xhr.responseJSON);
        }else{
          success.call(self, xhr.responseJSON.data);
        }
      }else{
        success.call(self, xhr.responseText);
      }
    }
  }


  var xhr = $.ajax(opts);
  POOL[_pIndex] = xhr;
  poolIndex = poolIndex + 1;

  if(selfPoolIndex) {
    self[selfPoolIndex] = _pIndex;
  }
  return xhr;
}

request.abortAll = function(){
  Object.keys(POOL).forEach(k => {
    POOL[k].abort();
  })
}

request.globalConfig = globalConfig


export default  request;
