<style module>
.title{font-size: 50px}
.title :global [.test] {color:red}
</style>


<template lang="jade">
div(:class="$style.title")
  .title {{msg}}

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
        console.log('data', data);
      }
    })
  }
}
</script>