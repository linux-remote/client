
<template lang='jade'>
.lr-upload-box(v-if="selectedFiles.length")
  Item(v-for='(item,i) in selectedFiles', :key='item.fullPath', :index='i', :item='item') 

</template>

<script>
import Item from './item.vue';
export default {
  components: {
    Item
  },
  computed: {
    selectedFiles(){
      return this.$store.state.upload.selectedFiles
    }
  }
}
</script>
