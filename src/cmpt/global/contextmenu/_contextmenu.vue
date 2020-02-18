<template lang="jade">
.lr-contextmenu(:style='{top: y + "px", left: x + "px"}')
  slot
</template>

<script>
export default {

  data(){
    return {
      x: -999999,
      y: -999999
    }
  },


  mounted(){
    //console.log('contextMenu mounted')
    const data = window.APP.contextMenuTransferData;
    if(data){


      this.$root.$el.appendChild(this.$el);
      

      const height = this.$el.offsetHeight;
      const width = this.$el.offsetWidth;
      let x = data.x;
      let y = data.y;
 
      if(x + width > this.$store.state.winW){
        x = this.$store.state.winW - width;
      }
      if(y + height > this.$store.state.winH){
        y = this.$store.state.winH - height;
      }

      this.x = x;
      this.y = y;

      this.$root.$el
      .addEventListener('mousedown', this.$parent.hidden, {
        once: true,
        capture: true
      });
    }
  },
  destroyed(){
    if(this.$parent._isBeingDestroyed){
      this.$root.$el.removeChild(this.$el);
    }
  }
}
</script>
