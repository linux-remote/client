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


function trimEnd0(str) { //去掉未尾多余的0.
  str = str.replace(/0+$/, '');
  var lastIndex = str.length - 1;
  return str[lastIndex] !== '.' ? str : str.substr(0, lastIndex);
}
export const wellSize = (size, fix) => {
  let m = 'B';
  fix = fix || 2;
  if(size > 1024){
    size = (size / 1024);
    m = 'KB';
  }

  if(size > 1024){
    size = (size / 1024);
    m = 'MB';
  }
  if(size > 1024){
    size = (size / 1024);
    m = 'GB';
  }
  if(size > 1024){
    size = (size / 1024);
    m = 'TB';
  }
  size = size.toFixed(fix);

  return trimEnd0(size) + ' ' + m;
}

export const TypeOf = function(v){
  return Object.prototype.toString.call(v).slice(8, -1);
}