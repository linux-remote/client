<template lang="jade">
.lr-contextmenuable(@contextmenu.prevent="handleContextmenu")
  slot
  Contextmenu(v-if="isShow", :clientX="clientX", :clientY="clientY", :close="close")
    slot(name="contextmenu")
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
  }
}
</script>
