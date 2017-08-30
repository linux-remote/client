<style>
.demo{
  position: absolute;
  width: 200px;height: 200px;
  /*min-width: 150vw;*/
  background-color: dodgerblue;
}
.demo-body{
  position: absolute; height: 150px; background-color: blue;
  bottom:0; left:0; width: 100%;
}
</style>
<template lang='jade'>
  .demo(:style='{width:w + "px", height: h  + "px",  top: y + "px", left: x  + "px"}')
    Resizable
    Draggable
    .demo-body
</template>

<script>
import Resizable from './resizable.vue';
import Draggable from './draggable.vue';
export default {
  data(){
    return {
      dragging: false,
      x: 600,
      y: 300,
      w: 300,
      h: 300,
      minH: 200,
      minW: 200
    }
  },
  components: {
    Draggable,
    Resizable
  }
}
</script>
