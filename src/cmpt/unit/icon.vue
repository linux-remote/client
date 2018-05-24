<style>


.lr-window-test .lr-drag{
  height: 100%;
  background-color: #eee;
}
.lr-window-test .lr-un-drag{
  height:90%;
}
.lr-be-select-warp{
  width: 30px;
  height: 30px;
  border: 1px dotted #000;
  background-color: blue;
}
</style>
<template lang='jade'>

Item(class='lr-window-test', 
    :draggable='true',
    :__init='{w: 50, h: 80, y: 300, x: 300}')
  div(slot='drag') Drag

</template>

<script>
import Item from './item.vue';
export default {
  components: {
    Item
  }
}
</script>
