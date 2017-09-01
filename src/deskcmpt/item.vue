<style>
.demo{
  position: absolute;
  width: 200px;height: 200px;
  /*min-width: 150vw;*/
  background-color: green;
}
.lr-un-drag{
  position: relative;background-color: red;
  z-index: 2;
  /*user-select: text;*/
}

</style>
<template lang='jade'>
  .demo(:style='{width:w + "px", height: h  + "px",  top: y + "px", left: x  + "px"}')
    Resizable
    slot
    Draggable
    .lr-un-drag
      slot(name='unDragg')
</template>

<script>
import Resizable from './resizable.vue';
import Draggable from './draggable.vue';
export default {
  data(){
    return {
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
