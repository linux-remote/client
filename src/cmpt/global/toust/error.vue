
<template lang="jade">
.lr-error(v-if="message.length")
  .lr-error-item(v-for='(v, i) in message', :class="{lr_error_latest: i === (message.length - 1)}") {{v}}

</template>

<script>
export default {
  computed: {
    message(){
      return this.$store.state.error.message
    }
  },
  watch: {
    // message(){
    //   this.$nextTick(() => {
    //     if(this.$refs.body){
    //       this.$refs.body.scrollTop = 9999999;
    //     }
    //   })
    // },
    // $route(){
    //   if(this.message.length){
    //     this.close();
    //   }
    // }
  },
  methods: {
    // close(){
    //   this.$store.commit('error/close');
    // }
  }
}
</script>
