<style module>
.title{font-size: 50px}
.title :global [.test] {color:red}
</style>


<template lang="jade">
div
  .title layout
  router-view
</template>

<script>
export default {
  data(){
    return {
      isRequest: false,
      msg: 'hello Vue!'
    }
  },
  created(){
    this.request({
      url: '',
      success(data){
        this.msg += data;
      }
    })
  }
}
</script>