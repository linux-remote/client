<style>
.lr-dragg-warp{
  position:absolute; top:0; bottom:0;
  width:100%;
  height:100%;
  user-select: none;
}
</style>
<template lang='jade'>
.lr-dragg-warp(:draggable='draggable',  @dragstart.stop='handleDragStart',
 @dragend.stop='handleDragEnd')
  slot
</template>

<script>
export default {
  data(){
    return {
      draggable: true
    }
  },
  methods:{
    handleDragStart(e){
      console.log('handleDragStart')
      // if(!this.draggable){
      //   e.preventDefault();
      //   return false;
      // }
      e.dataTransfer._startClient = {
        x: e.clientX,
        y: e.clientY
      }
    },
    handleDragEnd(e){
      console.log('handleDragEnd')
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

      //this.draggable = false;
    },


    // handleTitleMousedown(){
    //   this.draggable = true;
    // },
    // disableDraggable(){
    //   this.draggable = false;
    // },
  }
}
</script>
