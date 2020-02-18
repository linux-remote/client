<style>
.lr-resize-warp{
  position:absolute; 
  top:0; 
  bottom:0;
  width:100%; 
  height:100%;
  z-index: -9;
}
.lr-resize-t , .lr-resize-b, .lr-resize-l, .lr-resize-r{
  position: absolute;
  /* background: mediumvioletred; */
}

.lr-resize-t, .lr-resize-b{
  left: 5px;
  right: 5px;
  height: 5px;
}
.lr-resize-t{
  top: 0;
  cursor: n-resize;
}
.lr-resize-b{
  bottom: 0;
  cursor: s-resize;
}
.lr-resize-r, .lr-resize-l{
  top: 5px;
  bottom: 5px;
  width: 5px;
}
.lr-resize-r{
  right: 0;
  cursor: e-resize;
}
.lr-resize-l{
  left: 0;
  cursor: w-resize;
}
.lr-resize-rb, .lr-resize-tl, .lr-resize-tr, .lr-resize-lb{
  width: 5px; 
  height: 5px;
  /* background: green; */
  position: absolute;
  z-index: 2;
}
.lr-resize-rb{
  right: 0; bottom: 0; cursor: se-resize;
}
.lr-resize-tl{
  top: 0; left: 0; cursor: nw-resize;
}
.lr-resize-tr{
  top: 0; right: 0; cursor: ne-resize;
}
.lr-resize-lb{
  bottom: 0; left: 0; cursor: sw-resize;
}
</style>
<template lang='jade'>
.lr-resize-wrap
  .lr-resize-t(@mousedown='resizeStart("t", $event)', v-if="dMap.t")
  .lr-resize-b(@mousedown='resizeStart("b", $event)', v-if="dMap.b")
  .lr-resize-l(@mousedown='resizeStart("l", $event)', v-if="dMap.l")
  .lr-resize-r(@mousedown='resizeStart("r", $event)', v-if="dMap.r")
  .lr-resize-rb(@mousedown='resizeStart("rb", $event)', v-if="dMap.rb")
  .lr-resize-tl(@mousedown='resizeStart("tl", $event)', v-if="dMap.tl")
  .lr-resize-tr(@mousedown='resizeStart("tr", $event)', v-if="dMap.tr")
  .lr-resize-lb(@mousedown='resizeStart("lb", $event)', v-if="dMap.lb")
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'all'
    },
    proxy: {
      type: Object,
      required: true
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    maxHeight: {
      type: Number,
      default: Infinity
    },
    minWidth: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    }
  },
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
    dMap(){
      const map = Object.create(null);
      let arr = ['t', 'b', 'l', 'r', 'rb', 'tl', 'tr', 'lb'];
      if(this.direction !== 'all'){
        arr = this.direction.split(',');
      }
      for(let i = 0, len = arr.length; i < len; i++){
        map[arr[i]] = true;
      }
      return map;
    }
  },
  methods:{
    resizeStart(type, e){
      this.resizeStartData = {
        x: e.clientX,
        y: e.clientY,
        height: this.proxy.height,
        width: this.proxy.width,
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

      const data = this.proxy;
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
        let startData = this.resizeStartData;
        let height = this.proxy.height;
        let width = this.proxy.width;
        if(height !== startData.height || width !== startData.width) {
          this.$emit('resized', {
            height,
            width
          });
        }
      window.removeEventListener('mousemove', this.resizeMousemoveListener);
    }
  }
}
</script>
