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

export const wellSize = (size) => {
  let m = 'B';
  if(size > 1024){
    size = (size / 1024);
    m = 'K';
  }

  if(size > 1024){
    size = (size / 1024);
    m = 'M';
  }
  if(size > 1024){
    size = (size / 1024);
    m = 'G';
  }
  return size.toFixed(2) + m;
}
