import request from './request';
import data from './data';
export default function(to, from, next){
  request({
    url: '/touch',
    success(data2){
      Object.assign(data, data2);
      if(!data.user){
        next('./login');
      }else{
        next();
      }
    },
    onError(){
      next();
    }
  });
}