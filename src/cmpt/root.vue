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

import data from '../lib/data';

export default {
  data(){
    return data
  },
  created(){
    this.request({
      url: '/touch',
      success(data){
        console.log('to', data);
        this.msg += data;
      }
    })
  }
}
</script>