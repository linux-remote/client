export function minMax(min, max, v){
  if(v < min){
    return min;
  }else if(v > max){
    return max;
  }else{
    return v;
  }
}

export function resizeMousemoveListener(e){
  const initial = this.resizeStartData;
  const moveX = initial.x - e.clientX;
  const moveY = initial.y - e.clientY;
  const data = this.$parent;
  const maxW = 800;

  const direction = initial.direction;
  let height, width;
  if(direction.indexOf('t') !== -1){
    height = this.minMax(data.minH, this.winH, initial.height + moveY)
    data.y += (data.h - height);
    data.h = height;

  }else if(direction.indexOf('b') !== -1){
    height = this.minMax(data.minH, this.winH, initial.height - moveY)
    data.h = height;
  }

  if(direction.indexOf('l') !== -1){
    width = this.minMax(data.minW, maxW, initial.width + moveX)
    data.x += (data.w - width);
    data.w = width;
  }else if(direction.indexOf('r') !== -1){
    width = this.minMax(data.minW, maxW, initial.width - moveX)
    data.w = width;
  }

}
