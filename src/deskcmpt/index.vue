<style>

.demo-body{
  position: absolute; height: 150px; background-color: blue;
  bottom:0; left:0; width: 100%; z-index: 2;
  user-select: text;
}
</style>
<template lang='jade'>
Item
  h1 Drag
  h2(slot='unDragg' style="height:200px") UnDrag
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
