<template lang="jade">
</template>
<script>
import ContextMenu from './contextmenu.vue';
export default {
  components: {
    ContextMenu
  },
  data(){
    return {
      contextmenuIsShow: false
    }
  },
  methods:{
    handleContextmenu(e){
      window.APP.contextMenuTransferData = {
        x: e.clientX,
        y: e.clientY
      }
      this.contextmenuIsShow = true;
      e.stopPropagation();
      e.preventDefault();
    },
    contextmenuClose(){
      window.APP.contextMenuTransferData = null;
      this.contextmenuIsShow = false;
    }
  }
}
</script>
