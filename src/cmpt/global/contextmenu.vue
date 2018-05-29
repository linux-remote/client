<template lang="jade">
.lr-contextmenu(:style='{top: y + "px", left: x + "px"}')
  slot
</template>

<script>
export default {
  props: {  
    close: {
      type: Function,
      required: true
    }
  },
  data(){
    return {
      x: -999999,
      y: -999999
    }
  },
  methods:{
    handleClick(){
      store.commit('close');
    }
  },

  mounted(){
    console.log('contextMenu mounted')
    const data = window.APP.contextMenuTransferData;
    if(data){

      document.getElementById('lr-app').appendChild(this.$el);

      const height = this.$el.offsetHeight;
      const width = this.$el.offsetWidth;
      let x = data.x;
      let y = data.y;
      console.log('x', x, 'y', y, 'height', height, 'width', width);
      if(x + width > this.$store.state.winW){
        x = this.$store.state.winW - width;
      }
      if(y + height > this.$store.state.winH){
        y = this.$store.state.winH - height;
      }
      console.log('this.x', x, 'this.y', y);
      this.x = x;
      this.y = y;

      const self = this;
      window.APP.$elMain
      .addEventListener('mousedown', this.close, {
        once: true,
        capture: true
      });
    }

  }
}
</script>
