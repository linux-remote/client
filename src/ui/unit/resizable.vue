<style>
.lr-resize{
  width: 0;
  height: 0;
}
.lr-resize_t , .lr-resize_b, .lr-resize_l, .lr-resize_r{
  position: absolute;
  /* background: mediumvioletred; */
}

/* .lr-resize_t, .lr-resize_b{
  left: 5px;
  right: 5px;
  height: 5px;
} */
.lr-resize_t{
  top: 0;
  cursor: n-resize;
}
.lr-resize_b{
  bottom: 0;
  cursor: s-resize;
}

.lr-resize_r{
  right: 0;
  cursor: e-resize;
}
.lr-resize_l{
  left: 0;
  cursor: w-resize;
}
.lr-resize_rb, .lr-resize_tl, .lr-resize_tr, .lr-resize_lb{
  width: 5px; 
  height: 5px;
  /* background: green; */
  position: absolute;
  z-index: 2;
}
.lr-resize_rb{
  right: 0; bottom: 0; cursor: se-resize;
}
.lr-resize_tl{
  top: 0; left: 0; cursor: nw-resize;
}
.lr-resize_tr{
  top: 0; right: 0; cursor: ne-resize;
}
.lr-resize_lb{
  bottom: 0; left: 0; cursor: sw-resize;
}
</style>
<template lang='jade'>
.lr-resize
  .lr-resize_t(@mousedown='resizeStart("t", $event)', v-if="dMap.t", :style="tbStyle")
  .lr-resize_b(@mousedown='resizeStart("b", $event)', v-if="dMap.b", :style="tbStyle")
  .lr-resize_l(@mousedown='resizeStart("l", $event)', v-if="dMap.l", :style="lrStyle")
  .lr-resize_r(@mousedown='resizeStart("r", $event)', v-if="dMap.r", :style="lrStyle")
  .lr-resize_rb(@mousedown='resizeStart("rb", $event)', v-if="dMap.rb", :style="cornerStyle")
  .lr-resize_tl(@mousedown='resizeStart("tl", $event)', v-if="dMap.tl", :style="cornerStyle")
  .lr-resize_tr(@mousedown='resizeStart("tr", $event)', v-if="dMap.tr", :style="cornerStyle")
  .lr-resize_lb(@mousedown='resizeStart("lb", $event)', v-if="dMap.lb", :style="cornerStyle")
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 4
    },
    direction: {
      type: String,
      default: 'all'
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

  computed: {
    tbStyle(){
      return `left:${this.size}px; right: ${this.size}px; height: ${this.size}px`;
    },
    lrStyle(){
      return `top:${this.size}px; bottom: ${this.size}px; width: ${this.size}px`;
    },
    cornerStyle(){
      return `width:${this.size}px; height:${this.size}px`;
    },
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
      const virtual = Object.create(null);
      this.$emit('resizeStart', virtual);
      this.$options._startData = {
        x: e.clientX,
        y: e.clientY,
        height: virtual.height,
        width: virtual.width,
        direction: type
      };
      this.$options._virtual = virtual;

      window.addEventListener('mousemove', this.resizeMousemoveListener);
      window.addEventListener('mouseup', this.resizeMouseupListener, {
        once: true
      });
    },
    resizeMousemoveListener(e){
      const initial = this.$options._startData;
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

      const virtual = this.$options._virtual;
      const direction = initial.direction;
      let height, width;
      if(direction.indexOf('t') !== -1){
        height = this.minMax(this.minHeight, this.maxHeight, initial.height + moveY);

        virtual.top = virtual.top + (virtual.height - height);
        virtual.height = height;

      }else if(direction.indexOf('b') !== -1){
        height = this.minMax(this.minHeight, this.maxHeight, initial.height - moveY)
        virtual.height = height;
      }

      if(direction.indexOf('l') !== -1){

        width = this.minMax(this.minWidth, this.maxWidth, initial.width + moveX);
        virtual.left = virtual.left + (virtual.width - width);
        virtual.width = width;
      }else if(direction.indexOf('r') !== -1){
        width = this.minMax(this.minWidth, this.maxWidth, initial.width - moveX)
        virtual.width = width;
      }
      this.$emit('resizing', virtual);
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
      let startData = this.$options._startData;
      const virtual = this.$options._virtual;

      if(virtual.height !== startData.height || virtual.width !== startData.width) {
        this.$emit('resized', virtual);
      }

      window.removeEventListener('mousemove', this.resizeMousemoveListener);
      this.$options._startData = null;
      this.$options._virtual = null;
    }
  }
}
</script>
