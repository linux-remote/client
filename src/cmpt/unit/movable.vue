<template lang='jade'>
div(@mousedown='start', v-on="$listeners", style='user-select: none', v-bind='$props.$event')
  slot
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    onMove: {
      type: Function
    },
    startX: {
      type: Number,
      required: true
    },
    startY: {
      type: Number,
      required: true
    }
  },

  // computed: {
  //   maxHeight(){
  //     return this.$store.state.deskTopH
  //   }
  // },
  methods:{
    start(e){
      //console.log('this.$props', this.$props);
      this.StartData = {
        x: e.clientX,
        y: e.clientY,
        _startX : this.startX,
        _startY: this.startY
      };

      window.addEventListener('mousemove', this.mousemoveListener);
      window.addEventListener('mouseup', this.mouseupListener, {
        once: true
      });
    },
    mousemoveListener(e){
      const {_startX, _startY, x, y} = this.StartData;
  
      const moveX = x - e.clientX;
      const moveY = y - e.clientY;
      this.StartData.newX = _startX - moveX;
      this.StartData.newY = _startY - moveY;
      e._movableData = this.StartData;

      this.onMove(e);

    },
    mouseupListener(){
      this.StartData = null;
      window.removeEventListener('mousemove', this.mousemoveListener);
    }
  }
}
</script>
