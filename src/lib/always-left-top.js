// copy right from https://github.com/hezedu/SomethingBoring/blob/master/algorithm/top_left/always-left-top.js
// 2019-6-12 11:23
// add export


function forMat(arr, unit, wLen){
  var obj = Object.create(null);
  arr.forEach(function(v){
    var unitX = v.x ? v.x / unit : 0;
    var unitY = v.y ? v.y / unit : 0;
    var unitH = v.h ? v.h / unit : 1;
    var unitW = v.w ? v.w / unit : 1;
    for(var i = 0; i < unitH; i++){
      for(var j = 0; j < unitW; j++){
        var _num = (unitY + i) * wLen + (unitX + j);
        obj[_num] = true;
      }
    }
  })
  return obj;
}

function alwayLeftTop({data, unit, container, input, isLeftFirst = true}) {

  const wLen = Math.floor(container.w / unit);
  const hLen = Math.floor(container.h / unit);
  const total = wLen * hLen;
  if(total <= data.length){
    return 0;
  }
  var map = forMat(data, unit, wLen);

  var w = input.w / unit;
  var h = input.h / unit;

  function notHavePositon(x, y){
    for(var i = 0; i < h; i++){
      for(var j = 0; j < w; j++){
        if(j + x > wLen || i + y > hLen){
          return true;
        } 
        var _num = (y + i) * wLen + (x + j);
        //console.log(_num)
        if(map[_num]){
          return true;
        } 
      }
    }
    return false;
  }
  
  function topFirst(){
    for(var i = 0; i < total; i++){
      var x = i % hLen;
      var y = (i - x) / hLen;
      if(!notHavePositon(x, y)){
        return {x: x * unit, y: y * unit, i: i};
      }
    }
  }
  function leftFirst(){
    for(var i = 0; i < total; i++){
      var y = i % wLen;
      var x = (i - y) / wLen;
      if(!notHavePositon(x, y)){
        return {x: x * unit, y: y * unit, i: i};
      }
    }
  }
  return isLeftFirst ? leftFirst() : topFirst();
}

export default alwayLeftTop;