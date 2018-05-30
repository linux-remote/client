<template lang="jade">
ContextMenu(v-if="isShowContextmenu", :close="closeContextMenu")
  slot
</template>

<script>
import ContextMenu from './contextmenu.vue';
export default {
  components: {
    ContextMenu
  },
  data(){
    return {
      isShowContextmenu: false
    }
  },
  methods:{
    handleContextmenu(e){
      window.APP.contextMenuTransferData = {
        x: e.clientX,
        y: e.clientY
      }
      this.isShowContextmenu = true;
      e.stopPropagation();
      e.preventDefault();
    },
    closeContextMenu(){
      window.APP.contextMenuTransferData = null;
      this.isShowContextmenu = false;
    },
    
  },

  mounted(){
    this.$parent.$el.addEventListener('contextmenu', this.handleContextmenu);
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
