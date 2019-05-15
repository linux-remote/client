<style>
.lr-resize-warp{
  position:absolute; 
  top:0; 
  bottom:0;
  width:100%; 
  height:100%;
  z-index: -9;
}
.lr-resize-top , .lr-resize-bottom, .lr-resize-left, .lr-resize-right{
  position: absolute;
  /* background: mediumvioletred; */
}
.lr-resize-top, .lr-resize-bottom{
  width: 100%;height: 5px;
}
.lr-resize-top{
  bottom:100%;cursor: n-resize;
}
.lr-resize-bottom{
  top: 100%; cursor: s-resize;
}
.lr-resize-right, .lr-resize-left{
  top: 0;
  width: 5px;
  height: 100%;
}
.lr-resize-right{
  left: 100%;cursor: e-resize;
}
.lr-resize-left{
  right: 100%; cursor: w-resize;
}
.lr-resize-rb, .lr-resize-tl, .lr-resize-tr, .lr-resize-lb{
  width: 5px; height: 5px;
  /* background: green; */
  position: absolute;
  z-index: 2;
}
.lr-resize-rb{
  right: -5px; bottom: -5px; cursor: se-resize;
}
.lr-resize-tl{
  top: -5px; left: -5px; cursor: nw-resize;
}
.lr-resize-tr{
  top: -5px; right: -5px; cursor: ne-resize;
}
.lr-resize-lb{
  bottom: -5px; left: -5px; cursor: sw-resize;
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
  props: ['onResized'],
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
  computed: {
    maxWidth(){
      return this.$store.state.deskTopW
    },
    maxHeight(){
      return this.$store.state.deskTopH
    },
    minWidth(){
      return this.$parent.minWidth || 200
    },
    minHeight(){
      return this.$parent.minHeight || 200
    }
  },
  methods:{
    resizeStart(type, e){
      this.resizeStartData = {
        x: e.clientX,
        y: e.clientY,
        height: this.$parent.height,
        width: this.$parent.width,
        direction: type
      };

      window.addEventListener('mousemove', this.resizeMousemoveListener);
      window.addEventListener('mouseup', this.resizeMouseupListener, {
        once: true
      });
    },
    resizeMousemoveListener(e){
      const initial = this.resizeStartData;
      var clientX = e.clientX;
      var clientY = e.clientY;

      if( clientX < 0){
        clientX = 0;
      }
      if( clientY < 0){
        clientY = 0;
      }

      const moveX = initial.x - clientX;
      const moveY = initial.y - clientY;

      const data = this.$parent;
      const direction = initial.direction;
      let height, width;
      if(direction.indexOf('t') !== -1){
        height = this.minMax(this.minHeight, this.maxHeight, initial.height + moveY);

        data.positionTop += (data.height - height);
        data.height = height;

      }else if(direction.indexOf('b') !== -1){
        height = this.minMax(this.minHeight, this.maxHeight, initial.height - moveY)
        data.height = height;
      }

      if(direction.indexOf('l') !== -1){

        width = this.minMax(this.minWidth, this.maxWidth, initial.width + moveX);
        data.positionLeft += (data.width - width);
        data.width = width;
      }else if(direction.indexOf('r') !== -1){
        width = this.minMax(this.minWidth, this.maxWidth, initial.width - moveX)
        data.width = width;
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
      if(this.onResized){
        let startData = this.resizeStartData;
        let height = this.$parent.height;
        let width = this.$parent.width;
        if(height !== startData.height || width !== startData.width) {
          this.onResized({
            height,
            width
          })
        }
      }

      window.removeEventListener('mousemove', this.resizeMousemoveListener);
    }
  }
}
</script>
