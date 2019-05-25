export function noop(){

}

export const timeFormat = (date, fmt) => {
  date = date ? new Date(date) : new Date();
  fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return fmt;
}
export const ONE_SEC = 1000;
export const ONE_MIN = ONE_SEC * 60;


export function trimEnd0(str) { //去掉未尾多余的0.
  str = str.replace(/0+$/, '');
  var lastIndex = str.length - 1;
  return str[lastIndex] !== '.' ? str : str.substr(0, lastIndex);
}
const SIZE_TYPE = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
const UNIT = 1024;
export const wellSize = (size, startUnit, fix) => {
  
  if(size < UNIT){
    return size + ' ' + SIZE_TYPE[0];
  }
  var  index = startUnit ? SIZE_TYPE.indexOf(startUnit) : 0;

  var len = SIZE_TYPE.length;
  fix = fix || 2;

  function loop(){
    if(size >= UNIT && index < len){
      size = (size / UNIT);
      index = index + 1;
      loop();
    }
  }

  loop();
  
  size = size.toFixed(fix);

  return trimEnd0(size) + ' ' + SIZE_TYPE[index] + 'B';
}

export const TypeOf = function(v){
  return Object.prototype.toString.call(v).slice(8, -1);
}