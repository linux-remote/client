<style>
html, body{
  height: 100%;
}
.demo-body{
  position: absolute; 
  height: 150px;
  bottom:0; 
  left:0; 
  width: 100%; 
  z-index: 2;
  user-select: text;
}

.lr-window-test .lr-drag{
  height: 10%;background-color: #eee;
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
div(style="height: 100%; width: 100%;position: relative;")
  Item(class='lr-window-test', 
  :resizable='true', draggable='true', selectable='true')
    div(slot='drag') Drag
    div UnDrag
    Item(:beSelectable='true', class='lr-be-select-warp', 
    :__init='{w: 30, h: 30, y: 300, x: 300}')
</template>

<script>
import Item from './item.vue';
export default {
  data(){
    return {
    }
  },
  components: {
    Item
  }
}
</script>
