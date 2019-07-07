//修改自: https://github.com/hezedu/dwlib/blob/master/request.js
// 去掉 omitEmpty, 修改了:opts.url
import {noop} from './util';
import store from '__ROOT__/store/index.js';
import router from '../router';
const $ = window.$;

const API_ROOT = window.SERVER_CONFIG.API_ROOT;
export const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
//const POOL = {};
//跨站ajax请求初始化.
if(API_ROOT.indexOf('http') === 0){
  $.ajaxSetup({
    xhrFields: {
      withCredentials: true
    },
    headers: {'X-Requested-With': 'XMLHttpRequest'}
  });
}

const POOL = Object.create(null);
var poolIndex = 0;

export function defWrapErr(xhr){
  return `#${xhr.status}: ${xhr.responseText}`;
}
// 默认的http处理程序
export function httpErrorHandler(xhr){
  store.commit('error/show', defWrapErr(xhr));
}


//过滤掉空的参数
const omitKeyMap = {
  stateKey: true,
  repeatSubmitMode: true,
  complete: true,
  success: true,
  error: true,
  rootUrl: true
};

const globalConfig = {
  repeatSubmitMode: undefined,
  rootUrl: API_ROOT
}

function getUserUrl(url){
  if(url[0] === '~'){
    url = '/user/' + router.currentRoute.params.username + url.substr(1);
  }
  return url;
}
export function wrapUrl(url){
  return globalConfig.rootUrl + getUserUrl(url);
}

function request(opts){
  var {
    stateKey,
    success = noop,
    complete = noop,
    error = httpErrorHandler,
    //isOmitEmptyData = true,
    repeatSubmitMode = globalConfig.repeatSubmitMode,
    rootUrl = globalConfig.rootUrl,
    url
  } = opts;


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
  let state = self;
  const isStore = self instanceof window.Vuex.Store;
  if(isStore){
    state = self.state;
    if(stateKey){
      if(stateKey.indexOf('/') !== -1){
        const _stateArr = stateKey.split('/');
        state = state[_stateArr[0]];
        stateKey = _stateArr[1];
      }
    }
  }
  opts.type = opts.type || 'get';
  if(opts.type === 'post' || opts.type === 'put'){
    opts.contentType = opts.contentType === undefined ? JSON_CONTENT_TYPE : opts.contentType;
    if(opts.contentType === JSON_CONTENT_TYPE){
      opts.data = JSON.stringify(opts.data);
    }
  }


  opts.url =  rootUrl + getUserUrl(url);
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

    if(state[stateKey]){
      //if(repeatSubmitMode === 'abort'){
      //
      //}else 
      if(repeatSubmitMode === 'block'){
        return; //阻塞模式
      }
    }else {
      state[stateKey] = true;
      
    }
  }

  
  //由于juqery的complete会在success之后执行，所以自已写了个让它在之前执行。
  opts.complete = function(xhr, status){

    delete(POOL[_pIndex]); //销毁 POOL 的数据
    
    if(stateKey){
      state[stateKey] = false;
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

      if(xhr.status === 403){
        // || xhr.responseText === 'LINUX_REMOTE_USER_SERVER_ERROR'
        console.log('转向登录页');
        request.abortAll();
        return store.commit('needRelogin');
        // xhr.responseTextInvalid
      } else {
        error.call(self,  xhr);
      }
    }else{
      success.call(self, xhr.responseJSON || xhr.responseText);
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
