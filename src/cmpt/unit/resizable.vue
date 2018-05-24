<style>
.lr-resize-warp{
  position:absolute; top:0; bottom:0;width:100%; height:100%;  z-index: -9;
}
.lr-resize-top , .lr-resize-bottom, .lr-resize-left, .lr-resize-right{
  position: absolute;
  background: mediumvioletred;
}
.lr-resize-top, .lr-resize-bottom{
  width: 100%;height: 7px;
}
.lr-resize-top{
  bottom:100%;cursor: n-resize;
}
.lr-resize-bottom{
  top: 100%; cursor: s-resize;
}
.lr-resize-right, .lr-resize-left{
   width: 7px; height: 100%;
}
.lr-resize-right{
  left: 100%;cursor: e-resize;
}
.lr-resize-left{
  right: 100%; cursor: w-resize;
}
.lr-resize-rb, .lr-resize-tl, .lr-resize-tr, .lr-resize-lb{
  width: 7px; height: 7px;
  background: green;
  position: absolute;
  z-index: 2;
}
.lr-resize-rb{
  right: -7px; bottom: -7px; cursor: se-resize;
}
.lr-resize-tl{
  top: -7px; left: -7px; cursor: nw-resize;
}
.lr-resize-tr{
  top: -7px; right: -7px; cursor: ne-resize;
}
.lr-resize-lb{
  bottom: -7px; left: -7px; cursor: sw-resize;
}
</style>
<template lang='jade'>
.lr-resize-wrap
  .lr-resize-top(@mousedown.stop.prevent='resizeStart("t", $event)')
  .lr-resize-bottom(@mousedown.stop.prevent='resizeStart("b", $event)')
  .lr-resize-left(@mousedown.stop.prevent='resizeStart("l", $event)')
  .lr-resize-right(@mousedown.stop.prevent='resizeStart("r", $event)')
  .lr-resize-rb(@mousedown.stop.prevent='resizeStart("rb", $event)')
  .lr-resize-tl(@mousedown.stop.prevent='resizeStart("tl", $event)')
  .lr-resize-tr(@mousedown.stop.prevent='resizeStart("tr", $event)')
  .lr-resize-lb(@mousedown.stop.prevent='resizeStart("lb", $event)')
</template>

<script>
export default {
  // props: {
  //   data: {
  //     type: Object,
  //     default(){
  //       return {
  //         x: 30,
  //         y: 30,
  //         h: 0,
  //         w: 0
  //       }
  //     }
  //   }
  // },
  methods:{
    resizeStart(type, e){
      this.resizeStartData = {
        x: e.clientX,
        y: e.clientY,
        height: this.$parent.h,
        width: this.$parent.w,
        direction: type
      };

      window.addEventListener('mousemove', this.resizeMousemoveListener);
      window.addEventListener('mouseup', this.resizeMouseupListener, {
        once: true
      });
    },
    resizeMousemoveListener(e){
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

    },
    minMax(min, max, v){
      if(v < min){
        return min;
      }else if(v > max){
        return max;
      }else{
        return v;
      }
    },
    resizeMouseupListener(){
      window.removeEventListener('mousemove', this.resizeMousemoveListener);
    }
  },
  created(){
    this.$parent.minH = this.$parent.minH || 0;
    this.$parent.minW = this.$parent.minW || 0;
  }
}
</script>
