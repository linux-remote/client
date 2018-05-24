<template lang='jade'>
div(draggable="true",
    style="position:absolute;cursor: default;",
    :style='{left: x  + "px", top: y + "px"}',
    @dragstart.stop='handleDragStart')
  slot
</template>

<script>
export default {
  props: {
    _startX: {
      type: Number,
      default: null
    },
    _startY: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      x: this.$props._startX,
      y: this.$props._startY
    }
  },
  methods:{
    handleDragStart(e){

      this.$store.commit('onDragStart', e.target.id);

      e.dataTransfer._startClient = {
        x: e.clientX,
        y: e.clientY,
        _vueEl: this
      }
    },
    // handleDragEnd(e){
    //   console.log('handleDragEnd')
    //   const startClient = e.dataTransfer._startClient;
    //   if(!startClient) return;

    //   let positionTop = this.y  + (e.clientY - startClient.y);
    //   if(positionTop < 0) {
    //     positionTop = 0;
    //   }else{
    //     let deskH = this.$store.state.deskH;
    //     let elH = this.$el.offsetHeight;
    //     if(positionTop + elH > deskH){
    //       positionTop = deskH - elH;
    //     }
    //   }
    //   let positionLeft =  this.x + (e.clientX - startClient.x);
    //   if(positionLeft < 0) {
    //     positionLeft = 0;
    //   }else{
    //     let deskW = this.$store.state.deskW;
    //     let elW = this.$el.offsetWidth;

    //     if(positionLeft + elW > deskW){
    //       positionLeft = deskW - elW;
    //     }
    //   }

    //   this.x = positionLeft;
    //   this.y = positionTop;

    // }
  }

}
</script>
