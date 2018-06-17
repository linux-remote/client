<template lang="jade">
ContextMenu(v-if='isShow')
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
      isShow: false
    }
  },
  methods:{
    hidden(){
      window.APP.contextMenuTransferData = null;
      this.isShow = false;
    },
    handleContextmenu(e){
      // if(e.target !== this.$parent.$el){
      //   return;
      // }
      window.APP.contextMenuTransferData = {
        x: e.clientX,
        y: e.clientY
      }
      this.isShow = true;
      e.stopPropagation();
      e.preventDefault();
    }
  },
  mounted(){
    this.$parent.$el.addEventListener('contextmenu', this.handleContextmenu)
  },
  destoryed(){
    this.$parent.$el.removeEventListener('contextmenu', this.handleContextmenu);
  }

}
</script>
