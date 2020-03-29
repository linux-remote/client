<template lang="jade">
.lr-contextmenuable(@contextmenu.prevent.stop="handleContextmenu", v-on="$listeners")
  slot
  Contextmenu(v-if="isShow", :clientX="clientX", :clientY="clientY", :close="close")
    slot(name="contextmenu", :close="close")
</template>

<script>
import Contextmenu from './contextmenu.vue';
export default {
  components: {
    Contextmenu
  },
  data(){
    return {
      isShow: false,
      clientX: 0,
      clientY: 0
    }
  },
  methods: {
    handleContextmenu(e){
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      this.isShow = true;
    },
    close(){
      this.isShow = false;
    }
  },
  created(){
    this.$options._tmp_slot_props = {
      close: () => {
        this.close();
      }
    }
  }
}
</script>
