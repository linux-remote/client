<template lang="jade">
ContextMenu(v-if='isShow')
  slot
</template>
<script>
import ContextMenu from './contextmenu.vue';
export default {
  props: {
    // isStop: {
    //   type: Boolean,
    //   default: true
    // }
  },
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
    show(e) {
      this.$emit('beforeShow');
      window.APP.contextMenuTransferData = {
        x: e.clientX,
        y: e.clientY
      }
      this.isShow = true;
    },
    handleContextmenu(e){
      // if(this.isStop) {
        this.show(e);
        e.stopPropagation();
      // }
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
