<template lang='jade'>
div(@mousedown='start', style='position:absolute;top: 0;bottom:0;right:0;left:0;z-index: 2;')
</template>

<script>
export default {
  inheritAttrs: false,
  // props: {
  //   startX: {
  //     type: Number,
  //     required: true
  //   },
  //   startY: {
  //     type: Number,
  //     required: true
  //   }
  // },

  // computed: {
  //   maxHeight(){
  //     return this.$store.state.deskTopH
  //   }
  // },
  methods:{
    start(e){
      this.$emit('moveStart');
      //console.log('this.$props', this.$props);
      this.$options._startData = {
        x: e.clientX,
        y: e.clientY
      };

      window.addEventListener('mousemove', this.mousemoveListener);
      window.addEventListener('mouseup', this.mouseupListener, {
        once: true
      });
    },
    mousemoveListener(e){
      const { x, y } = this.$options._startData;
  
      // const moveX = x - e.clientX;
      // const moveY = y - e.clientY;
      // this.$options._startData.newX = _startX - moveX;
      // this.$options._startData.newY = _startY - moveY;
      // e._movableData = this.$options._startData;

      this.$emit('moving', 
      {moveX: x - e.clientX, 
      moveY: y - e.clientY});

    },
    mouseupListener(){
      this.$options._startData = null;
      window.removeEventListener('mousemove', this.mousemoveListener);
      this.$emit('moved');
    }
  }
}
</script>
