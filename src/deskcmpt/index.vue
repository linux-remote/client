<style>
.demo{
  position: absolute;
  width: 200px;height: 200px;
  /*min-width: 150vw;*/
  background-color: blue;
}
</style>
<template lang='jade'>
  .demo(:style='{width:resize.w + "px", height: resize.h  + "px",  top: resize.y + "px", left: resize.x  + "px"}')
    Resizeble(:data='resize')
</template>

<script>
import Resizeble from './resizable.vue';
export default {
  data(){
    return {
      resize: {
        x: 30,
        y: 30,
        w: 300,
        h: 300,
        minH: 200,
        minW: 200
      }
    }
  },
  components: {
    Resizeble
  }
}
</script>
