<style>
.lr-upload-box{
  position: absolute;
  right: 0;
  bottom: 36px;
  width: 400px;
  height: 400px;
  z-index: 20;
  background-color: gray;
  border: 1px solid red;
}
.lr-upload-item{
  height: 30px;
  border-bottom: 1px solid #eee;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
</style>
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
  },
  methods: {
    removeItem(){

    }
  }
}
</script>
