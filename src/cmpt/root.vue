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
      msg: ''
    }
  },
  created(){
    this.request({
      url: '/',
      success(data){
        console.log('root', data);
        //this.msg += data;
      }
    })
  }
}
</script>