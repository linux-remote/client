<style>
.lr-drag-warp{
  position:absolute; top:0; bottom:0;
  width:100%;
  height:100%;
  /*user-select: none;*/
}
</style>
<template lang='jade'>
.lr-drag-warp(draggable="true",  @dragstart.stop='handleDragStart',
 @dragend.stop='handleDragEnd')
  slot
</template>

<script>
export default {
  methods:{
    handleDragStart(e){
      e.dataTransfer._startClient = {
        x: e.clientX,
        y: e.clientY
      }
    },
    handleDragEnd(e){
      const startClient = e.dataTransfer._startClient;
      const $p = this.$parent;
      if(!startClient) return;
      const positionTop = $p.y  + (e.clientY - startClient.y);

      if(positionTop < 0) {
        $p.y = 0;
      }else{
        $p.y = positionTop;
      }
      $p.x += (e.clientX - startClient.x);

    }
  }
}
</script>
