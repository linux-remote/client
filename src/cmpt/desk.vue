<template lang="jade">
.dw-h100
  div(style="") test
  h1 desk {{info}}
</template>
<script>
export default {
  data(){
    return {
      isRequest: false,
      info: ''
    }
  },
  methods: {
    getData(){

      this.apiGet('~/info', function(data){
        this.info = data;
      })
    }
  },
  created(){
    this.getData();
  }
}
</script>
