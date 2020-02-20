<template lang='jade'>
div(@mousedown='start', style='position:absolute;top: 0;bottom:0;right:0;left:0;z-index: 2;')
</template>

<script>
export default {
  inheritAttrs: false,
  methods:{
    start(e){
      const virtual = Object.create(null);
      this.$emit('moveStart',virtual);
      
      // if(typeof virtual.top !== 'number' || 
      // typeof virtual.left !== 'number'){
      //   throw new Error('left top is required.')
      // }

      this.$options._startData = {
        x: e.clientX,
        y: e.clientY,
        top: virtual.top,
        left: virtual.left
      };
      this.$options._virtual = virtual;
      
      window.addEventListener('mousemove', this.mousemoveListener);
      window.addEventListener('mouseup', this.mouseupListener, {
        once: true
      });
    },
    mousemoveListener(e){
      const { x, y, top, left } = this.$options._startData;

      this.$options._virtual.top = top - (y - e.clientY);
      this.$options._virtual.left = left - (x - e.clientX);
      
      this.$emit('moving', this.$options._virtual);

    },
    mouseupListener(){
      this.$options._startData = null;
      window.removeEventListener('mousemove', this.mousemoveListener);
      this.$emit('moveEnd', this.$options._virtual);
      this.$options._virtual = null;
    }
  }
}
</script>
