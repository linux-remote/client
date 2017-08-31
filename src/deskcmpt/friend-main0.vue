<template lang='jade'>
div
  slot
</template>

<script>
const friendMap = {};
export default {
  props: ['name'],
  data(){
    return {}
  },
  created(){
    if(this.name){
      friendMap[this.name] = this.$data;
    }
  },
  destroyed(){
    delete(friendMap[this.name]);
  }
}
</script>
